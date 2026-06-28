"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Sparkles, Loader2, AlertCircle, RefreshCw, Cpu, PenLine, Hash, Lightbulb, Flame } from "lucide-react";
import type { InstagramProfile, ProfileAnalysis } from "@/lib/instagram";

function renderMd(t: string): string {
  return t
    .replace(/```[\s\S]*?```/g, "")
    .replace(/## (.+)/g, '<h3 class="text-[15px] font-bold text-white mt-5 mb-2 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"></span>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white/80">$1</strong>')
    .replace(/^(\d+)\.\s+(.+)$/gm, '<div class="flex gap-2 ml-1 mb-2"><span class="text-purple-400 font-bold text-xs mt-0.5 flex-shrink-0">$1.</span><span class="text-white/50 text-[13px] leading-relaxed">$2</span></div>')
    .replace(/^- (.+)$/gm, '<div class="flex gap-2 ml-2 mb-1"><span class="text-purple-400/60">›</span><span class="text-white/50 text-[13px] leading-relaxed">$1</span></div>')
    .replace(/\n\n/g, '<div class="h-1.5"></div>')
    .replace(/\n/g, "<br/>");
}

function buildPrompt(profile: InstagramProfile, analysis: ProfileAnalysis, feature: string): string {
  const base = `@${profile.username} | ${profile.fullName || ""} | ${profile.followersCount.toLocaleString()} followers | ${profile.followingCount.toLocaleString()} following | ${profile.postsCount.toLocaleString()} posts | Verified: ${profile.isVerified ? "Yes" : "No"} | ${profile.isBusinessAccount ? "Business" : "Personal"} | ${profile.category || "N/A"} | Bio: ${(profile.biography || "").slice(0, 120)} | ER: ${analysis.engagementRate}% | Avg Likes: ${analysis.avgLikes.toLocaleString()} | Avg Comments: ${analysis.avgComments.toLocaleString()} | Ratio: ${analysis.followerToFollowingRatio}:1 | Score: ${analysis.popularityScore}/100 | Tier: ${analysis.influencerTier} | Age: ${analysis.accountAgeLabel} | Bot: ${analysis.botScore}/100 | Auth: ${analysis.authenticityScore}% | Fake: ${analysis.estimatedFakePercent}% | Grade: ${analysis.credibilityGrade} | ${analysis.contentType.photos} photos, ${analysis.contentType.videos} videos | ${analysis.postsPerDay} posts/day | Earnings: $${analysis.estimatedEarningsMin.toLocaleString()}-$${analysis.estimatedEarningsMax.toLocaleString()}/post`;

  const prompts: Record<string, string> = {
    analysis: `You are a concise Instagram analytics expert. Analyze this profile. No fluff, use real numbers.\n\n${base}\n\nWrite in this exact format:\n\n## Overall Assessment\n2 sentences.\n\n## Strengths\n- 3 bullet points\n\n## Weaknesses\n- 2 bullet points\n\n## Engagement Analysis\n2 sentences.\n\n## Authenticity Verdict\n2 sentences.\n\n## Growth Tips\n- 3 actionable tips\n\n## Rating\nOne letter grade (A+ to F) with one sentence.`,
    captions: `You are a viral Instagram caption writer. Generate 5 unique captions for @${profile.username} (${profile.category || "General"}, ${profile.followersCount.toLocaleString()} followers). Each 1-3 lines with emojis and hashtags. Vary: motivational, question, story, promo, trendy.`,
    hashtags: `Generate 3 hashtag sets for @${profile.username} (${profile.category || "General"}):\n\n## High-Reach Set\n30 popular hashtags for discovery\n\n## Niche Set\n20 medium hashtags for targeted reach\n\n## Low-Competition Set\n15 small hashtags for easy ranking\n\nFormat as copyable blocks.`,
    content: `Create a 7-day content calendar for @${profile.username} (${profile.category || "General"}, ${profile.followersCount.toLocaleString()} followers, ER: ${analysis.engagementRate}%). For each day: content type (Reel/Carousel/Story/Photo), topic, posting time, expected engagement. Be specific.`,
    roast: `Give a funny, savage comedy roast of @${profile.username}. Use their real stats: ${profile.followersCount.toLocaleString()} followers, ${profile.followingCount.toLocaleString()} following, ${profile.postsCount.toLocaleString()} posts, ${analysis.engagementRate}% ER, ${analysis.followerToFollowingRatio}:1 ratio, ${analysis.estimatedFakePercent}% est fake. 8-10 lines, end with one genuine compliment. PG-13.`,
  };
  return prompts[feature] || prompts.analysis;
}

const features = [
  { id: "analysis", label: "Deep Analysis", icon: Sparkles },
  { id: "captions", label: "Captions", icon: PenLine },
  { id: "hashtags", label: "Hashtags", icon: Hash },
  { id: "content", label: "Content Ideas", icon: Lightbulb },
  { id: "roast", label: "Roast", icon: Flame },
] as const;

type FId = typeof features[number]["id"];

export default function SectionAI({ profile, analysis }: { profile: InstagramProfile; analysis: ProfileAnalysis }) {
  const [active, setActive] = useState<FId>("analysis");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "streaming" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [puterLoaded, setPuterLoaded] = useState(false);
  const didAuto = useRef(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // Load Puter.js via CDN script tag
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as unknown as Record<string, unknown>).puter) { setPuterLoaded(true); return; }
    if (scriptRef.current) return;
    const s = document.createElement("script");
    s.src = "https://js.puter.com/v2/";
    s.async = true;
    s.onload = () => setPuterLoaded(true);
    s.onerror = () => setErrMsg("Failed to load AI engine");
    document.head.appendChild(s);
    scriptRef.current = s;
  }, []);

  const run = useCallback(async (fid: FId) => {
    setText("");
    setStatus("streaming");
    setErrMsg("");

    const prompt = buildPrompt(profile, analysis, fid);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const puter = (window as any).puter;
      if (!puter?.ai?.chat) {
        setErrMsg("AI engine not ready. Please wait a moment and try again.");
        setStatus("error");
        return;
      }

      const resp = await puter.ai.chat(prompt, { model: "gpt-4o-mini", stream: true });

      for await (const part of resp) {
        const chunk = part?.text || "";
        if (chunk) setText(prev => prev + chunk);
      }
      setStatus("done");
    } catch (e) {
      console.error("AI error:", e);
      setErrMsg("AI request failed. Try again.");
      setStatus("error");
    }
  }, [profile, analysis]);

  useEffect(() => {
    if (puterLoaded && !didAuto.current) {
      didAuto.current = true;
      run("analysis");
    }
  }, [puterLoaded, run]);

  const handleClick = (fid: FId) => { setActive(fid); run(fid); };

  const isStreaming = status === "streaming";
  const hasText = text.length > 0;
  const meta = features.find(f => f.id === active)!;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="liquid-glass-glow rounded-3xl p-5">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.15))" }}>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white">AI Studio</h3>
            <p className="text-white/25 text-[11px] flex items-center gap-1.5">
              <Cpu className="w-3 h-3" />
              Powered by GPT-4o-mini via Puter.js — Free, No Key
              {isStreaming && <span className="text-purple-400 ml-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />streaming</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Feature pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {features.map(f => (
          <button key={f.id} onClick={() => handleClick(f.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium whitespace-nowrap flex-shrink-0 transition-all
              ${active === f.id ? "text-white glass-tab-active" : "text-white/30 glass-tab hover:text-white/50"}`}>
            <f.icon className="w-3.5 h-3.5" />{f.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isStreaming && !hasText && (
        <div className="liquid-glass rounded-2xl p-8 text-center">
          <Loader2 className="w-8 h-8 text-purple-400 mx-auto mb-3 animate-spin" />
          <p className="text-white/60 text-sm font-medium">
            {active === "roast" ? "Cooking the roast..." : `Generating ${meta.label.toLowerCase()}...`}
          </p>
          <p className="text-white/20 text-[11px] mt-1">@{profile.username}</p>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="liquid-glass rounded-2xl p-5 text-center" style={{ borderColor: "rgba(239,68,68,0.1)" }}>
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-white/60 text-sm font-medium mb-1">Failed</p>
          <p className="text-white/25 text-xs mb-3">{errMsg}</p>
          <button onClick={() => run(active)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white/40 text-xs glass-tab">
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* Content */}
      {hasText && (
        <div className="liquid-glass rounded-3xl p-6 relative overflow-hidden">
          {status === "done" && (
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(90deg,transparent,rgba(34,197,94,0.3),transparent)" }} />
          )}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <meta.icon className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-white">{meta.label}</span>
              </div>
              {status === "done" && (
                <button onClick={() => run(active)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] text-white/25 hover:text-white/50 glass-tab">
                  <RefreshCw className="w-2.5 h-2.5" /> Redo
                </button>
              )}
            </div>
            <div className="max-w-none text-white/45 text-[13px] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMd(text) }} />
            {isStreaming && <span className="inline-block w-1.5 h-4 bg-purple-400 ml-0.5 animate-pulse rounded-sm" />}
          </div>
          {status === "done" && (
            <div className="mt-4 pt-3 flex items-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <p className="text-white/10 text-[10px]">GPT-4o-mini via Puter.js — Free AI</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
