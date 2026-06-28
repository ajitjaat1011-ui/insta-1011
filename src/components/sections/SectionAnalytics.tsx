"use client";
import { motion } from "framer-motion";
import { TrendingUp, Heart, MessageCircle, Users, Activity, Hash, BarChart3, Target, Percent, DollarSign, Eye } from "lucide-react";
import type { InstagramProfile, ProfileAnalysis } from "@/lib/instagram";

function fmt(n: number): string {
  if (!n && n !== 0) return "0";
  if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / (max || 1)) * 100, 100);
  return (
    <div className="h-[4px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
      <motion.div className="h-full rounded-full" style={{ background: color, width: `${pct}%` }}
        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }} />
    </div>
  );
}

function LineChart({ data, color, label }: { data: number[]; color: string; label: string }) {
  if (data.length < 2) return null;
  const w = 300, h = 80;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: h - (v / max) * (h - 12) - 6 }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  const len = pts.reduce((a, p, i) => i === 0 ? 0 : a + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y), 0);
  // sanitize gradient id – spaces / % break in some browsers
  const gid = `g-${label.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  return (
    <div className="min-w-0">
      <p className="text-white/20 text-[10px] uppercase tracking-wider mb-1.5">{label}</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full block" style={{ height: h }} preserveAspectRatio="none">
        <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} /><stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient></defs>
        <motion.path d={area} fill={`url(#${gid})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
        <motion.path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }} />
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={color} stroke="#0a0a0f" strokeWidth={1.5} />)}
      </svg>
    </div>
  );
}

function BarChart({ posts, fc }: { posts: { likes: number; comments: number }[]; fc: number }) {
  if (!posts.length) return null;
  const mx = Math.max(...posts.map(p => p.likes + p.comments), 1);
  return (
    <div className="w-full overflow-hidden">
      <p className="text-white/20 text-[10px] uppercase tracking-wider mb-3">Engagement Per Post</p>
      <div className="flex items-end gap-[3px] h-28 w-full overflow-hidden">
        {posts.slice(0, 12).map((p, i) => {
          const h = (((p.likes + p.comments) / mx) * 100);
          const er = fc > 0 ? ((p.likes + p.comments) / fc * 100).toFixed(2) : "0";
          return (
            <div key={i} className="flex-1 h-full flex items-end group relative min-w-0">
              <motion.div className="w-full rounded-t-sm" style={{ height: `${Math.max(h, 2)}%`, background: "linear-gradient(to top, var(--accent-1, #7c3aed), var(--text-pink, #ec4899))" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.015, duration: 0.3 }}
                whileHover={{ opacity: 1 }} />
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 rounded-lg px-2 py-1 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap"
                style={{ background: "rgba(0,0,0,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-white font-semibold">❤ {fmt(p.likes)}</p>
                <p className="text-white/50">💬 {fmt(p.comments)}</p>
                <p className="text-purple-300">{er}% ER</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SectionAnalytics({ profile, analysis: a }: { profile: InstagramProfile; analysis: ProfileAnalysis }) {
  const metrics = [
    { icon: TrendingUp, l: "Engagement Rate", v: `${a.engagementRate}%`, s: a.engagementRate > 3 ? "Excellent" : a.engagementRate > 1 ? "Good" : "Low", c: "var(--text-purple, #a855f7)", bv: a.engagementRate, bm: 10 },
    { icon: Heart, l: "Avg Likes", v: fmt(a.avgLikes), s: `Median: ${fmt(a.medianLikes)}`, c: "var(--text-pink, #ec4899)", bv: Math.min(a.avgLikes, 500000), bm: 500000 },
    { icon: MessageCircle, l: "Avg Comments", v: fmt(a.avgComments), s: `Median: ${fmt(a.medianComments)}`, c: "#3b82f6", bv: Math.min(a.avgComments, 50000), bm: 50000 },
    { icon: Users, l: "Follower Ratio", v: `${fmt(a.followerToFollowingRatio)}:1`, s: a.influencerTier, c: "#22c55e", bv: Math.min(a.followerToFollowingRatio, 1000), bm: 1000 },
    { icon: Activity, l: "Post Frequency", v: `${a.postsPerWeek}/wk`, s: a.postFrequency, c: "#f59e0b", bv: a.postsPerWeek, bm: 14 },
    { icon: Percent, l: "Like/Comment", v: `${a.likesToCommentsRatio}:1`, s: a.engagementConsistency, c: "var(--text-orange, #f97316)", bv: Math.min(a.likesToCommentsRatio, 200), bm: 200 },
    { icon: DollarSign, l: "Est. Earnings", v: `$${fmt(a.estimatedEarningsMin)}-${fmt(a.estimatedEarningsMax)}`, s: "Per sponsored post", c: "#10b981", bv: a.estimatedEarningsMax, bm: 100000 },
    { icon: Eye, l: "Est. Reach", v: fmt(a.estimatedReach), s: `${fmt(a.estimatedImpressions)} impressions`, c: "#6366f1", bv: Math.min(a.estimatedReach, 50000000), bm: 50000000 },
  ];

  return (
    <div className="space-y-4" style={{ isolation: "isolate", transform: "translateZ(0)" }}>
      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {metrics.map((m) => (
          <div key={m.l} className="liquid-glass-inner rounded-xl p-3.5 relative overflow-hidden min-h-[104px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${m.c}12` }}>
                  <m.icon className="w-3.5 h-3.5" style={{ color: m.c }} />
                </div>
                <p className="text-white/25 text-[10px] uppercase tracking-wider leading-tight">{m.l}</p>
              </div>
              <p className="text-white font-bold text-base leading-tight break-all">{m.v}</p>
            </div>
            <div>
              <Bar value={m.bv} max={m.bm} color={m.c} />
              <p className="text-white/30 text-[10px] mt-1.5 truncate">{m.s}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts – use liquid-glass-inner (no backdrop-filter) to avoid nested blur glitch with ResultsView filter:blur */}
      <div className="liquid-glass-inner rounded-3xl p-5 overflow-hidden" style={{ isolation: "isolate" }}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <h3 className="text-sm font-bold text-white">Performance</h3>
          <span className="text-white/15 text-[10px] ml-auto">{a.trendDirection} trend</span>
        </div>
        <BarChart posts={profile.recentPosts} fc={profile.followersCount} />
        {profile.recentPosts.length > 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4 mt-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <LineChart data={a.likesTrend} color="var(--text-pink, #ec4899)" label="Likes" />
            <LineChart data={a.commentsTrend} color="#3b82f6" label="Comments" />
            <LineChart data={a.engagementTrend} color="var(--text-purple, #a855f7)" label="ER %" />
          </div>
        )}
      </div>

      {/* Content + extras – stack on mobile to prevent cramped overflow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="liquid-glass-inner rounded-xl p-4 overflow-hidden">
          <div className="flex items-center gap-1.5 mb-3"><Target className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" /><span className="text-xs font-semibold text-white">Content</span></div>
          <div className="space-y-2.5 text-[11px]">
            <div className="flex justify-between gap-3"><span className="text-white/30">Photos</span><span className="text-white/60 font-medium">{a.contentType.photos}</span></div>
            <div className="flex justify-between gap-3"><span className="text-white/30">Videos/Reels</span><span className="text-white/60 font-medium">{a.contentType.videos} ({a.contentType.videoPercent}%)</span></div>
            <div className="flex justify-between gap-3"><span className="text-white/30">Avg Caption</span><span className="text-white/60 font-medium">{a.captionAvgLength} chars</span></div>
            <div className="flex justify-between gap-3"><span className="text-white/30">Avg Hashtags</span><span className="text-white/60 font-medium">{a.avgHashtagsPerPost}/post</span></div>
            <div className="flex justify-between gap-3"><span className="text-white/30">Emoji Posts</span><span className="text-white/60 font-medium">{a.emojiUsage}/{profile.recentPosts.length}</span></div>
            <div className="flex justify-between gap-3"><span className="text-white/30">Mentions</span><span className="text-white/60 font-medium">{a.mentionUsage}/{profile.recentPosts.length}</span></div>
          </div>
        </div>
        <div className="liquid-glass-inner rounded-xl p-4 overflow-hidden">
          <div className="flex items-center gap-1.5 mb-3"><Activity className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /><span className="text-xs font-semibold text-white">Performance</span></div>
          <div className="space-y-2.5 text-[11px]">
            <div className="flex justify-between gap-3"><span className="text-white/30">Best Post</span><span className="text-white/60 font-medium">{a.bestPost ? fmt(a.bestPost.likes + a.bestPost.comments) : "-"}</span></div>
            <div className="flex justify-between gap-3"><span className="text-white/30">Worst Post</span><span className="text-white/60 font-medium">{a.worstPost ? fmt(a.worstPost.likes + a.worstPost.comments) : "-"}</span></div>
            <div className="flex justify-between gap-3"><span className="text-white/30">Viral Posts</span><span className="text-white/60 font-medium">{a.viralPostCount} (&gt;2x avg)</span></div>
            <div className="flex justify-between gap-3"><span className="text-white/30">Consistency</span><span className="text-white/60 font-medium">{a.engagementConsistency}</span></div>
            <div className="flex justify-between gap-3"><span className="text-white/30">Followers/Post</span><span className="text-white/60 font-medium">{fmt(a.followersPerPost)}</span></div>
            <div className="flex justify-between gap-3"><span className="text-white/30">Follow-back</span><span className="text-white/60 font-medium">{a.followBackRate}%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
