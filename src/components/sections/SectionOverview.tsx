"use client";
import { motion } from "framer-motion";
import { BadgeCheck, Lock, Link2, ExternalLink, Calendar, Clock, TrendingUp, Star, Zap, Eye } from "lucide-react";
import type { InstagramProfile, ProfileAnalysis } from "@/lib/instagram";

function fmt(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "") + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
}

function ScoreRing({ score, size = 130 }: { score: number; size?: number }) {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={10} />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="url(#sg)" strokeWidth={10} strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.6, ease: [0.22,1,0.36,1], delay: 0.4 }}
          style={{ filter: "drop-shadow(0 0 12px rgba(168,85,247,0.4))" }} />
        <defs>
          <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-4xl font-black text-white"
          initial={{ scale:0 }} animate={{ scale:1 }}
          transition={{ delay:1, type:"spring", stiffness:200 }}>{score}</motion.span>
        <span className="text-[9px] uppercase tracking-[0.15em]" style={{ color:"rgba(255,255,255,0.25)" }}>score</span>
      </div>
    </div>
  );
}

type TabId = "overview" | "analytics" | "posts" | "authenticity";

export default function SectionOverview({
  profile,
  analysis,
  onNavigate,
}: {
  profile: InstagramProfile;
  analysis: ProfileAnalysis;
  onNavigate: (tab: TabId) => void;
}) {
  const badges = [
    { icon: Star, label: "Quality", value: analysis.accountQuality, color: "#a855f7" },
    { icon: Zap, label: "Growth", value: analysis.growthPotential, color: "#f59e0b" },
    { icon: Eye, label: "Reach", value: analysis.audienceReach, color: "#22c55e" },
    { icon: TrendingUp, label: "Tier", value: analysis.influencerTier, color: "#3b82f6" },
  ];

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <motion.div className="liquid-glass rounded-3xl p-6 md:p-7 relative overflow-hidden"
        initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.6 }}>
        {/* Top shimmer line */}
        <motion.div className="absolute top-0 left-0 right-0 h-[1px] z-10"
          style={{ background:"linear-gradient(90deg,transparent,rgba(168,85,247,0.4),transparent)",
            backgroundSize:"200% 100%" }}
          animate={{ backgroundPosition:["-200% 0","200% 0"] }}
          transition={{ duration:3.5, repeat:Infinity, ease:"linear" }} />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Pic */}
          <motion.div className="relative flex-shrink-0"
            initial={{ scale:0, rotate:-30 }} animate={{ scale:1, rotate:0 }}
            transition={{ type:"spring", stiffness:140, damping:12, delay:0.15 }}>
            <div className="w-28 h-28 rounded-full p-[3px] relative" style={{
              background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
            }}>
              <div className="w-full h-full rounded-full bg-black p-[3px]">
                {profile.profilePicUrl ? (
                  <img src={profile.profilePicUrl} alt={profile.username}
                    className="w-full h-full rounded-full object-cover"
                    onError={e=>{
                      const el=e.target as HTMLImageElement; el.style.display="none";
                      el.parentElement!.innerHTML=`<div class="w-full h-full rounded-full flex items-center justify-center" style="background:linear-gradient(135deg,#7c3aed,#db2777)"><span class="text-3xl font-black text-white">${profile.username[0]?.toUpperCase()||"?"}</span></div>`;
                    }} />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center"
                    style={{ background:"linear-gradient(135deg,#7c3aed,#db2777)" }}>
                    <span className="text-3xl font-black text-white">{profile.username[0]?.toUpperCase()||"?"}</span>
                  </div>
                )}
              </div>
              <motion.div className="absolute inset-0 rounded-full -z-10"
                style={{ background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
                  filter:"blur(14px)", opacity:0.25 }}
                animate={{ opacity:[0.15,0.35,0.15], scale:[1,1.06,1] }}
                transition={{ duration:3, repeat:Infinity }} />
            </div>
            {profile.isVerified && (
              <motion.div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",
                  boxShadow:"0 2px 10px rgba(59,130,246,0.5)" }}
                initial={{ scale:0 }} animate={{ scale:1 }}
                transition={{ type:"spring", delay:0.5 }}>
                <BadgeCheck className="w-4 h-4 text-white" />
              </motion.div>
            )}
            {profile.isPrivate && (
              <motion.div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center"
                initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", delay:0.5 }}>
                <Lock className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.div>

          <div className="flex-1 text-center md:text-left min-w-0">
            <motion.div className="flex items-center gap-2 justify-center md:justify-start flex-wrap"
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
              <h2 className="text-2xl font-black text-white">@{profile.username}</h2>
              {profile.isVerified && <BadgeCheck className="w-5 h-5 text-blue-400" />}
            </motion.div>
            {profile.fullName && <p className="text-white/45 text-base mt-0.5">{profile.fullName}</p>}
            {profile.category && (
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-medium mt-1.5"
                style={{ background:"rgba(168,85,247,0.1)", color:"#c084fc", border:"1px solid rgba(168,85,247,0.15)" }}>
                {profile.category}
              </span>
            )}
            {profile.biography && (
              <p className="text-white/35 text-sm leading-relaxed mt-2 max-w-lg whitespace-pre-line">{profile.biography}</p>
            )}
            <div className="flex items-center gap-4 mt-2 justify-center md:justify-start flex-wrap">
              {profile.externalUrl && (
                <a href={profile.externalUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400/70 text-xs hover:text-blue-300">
                  <Link2 className="w-3 h-3" />
                  {profile.externalUrl.replace(/^https?:\/\//,"").replace(/\/$/,"").slice(0,35)}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
              {analysis.accountCreatedApprox !== "Unknown" && (
                <span className="inline-flex items-center gap-1 text-white/25 text-xs">
                  <Calendar className="w-3 h-3" />
                  Est. {analysis.accountCreatedApprox}
                </span>
              )}
              {analysis.postsPerDay > 0 && (
                <span className="inline-flex items-center gap-1 text-white/25 text-xs">
                  <Clock className="w-3 h-3" />
                  {analysis.postsPerDay} posts/day
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-3 gap-2.5 mt-6">
          {[
            { label:"Posts", value:profile.postsCount, emoji:"📸" },
            { label:"Followers", value:profile.followersCount, emoji:"👥" },
            { label:"Following", value:profile.followingCount, emoji:"➡️" },
          ].map((s,i)=>(
            <motion.div key={s.label}
              className="liquid-glass-inner rounded-2xl p-3.5 text-center cursor-default"
              initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.35+i*0.08, type:"spring" }}>
              <span className="text-sm">{s.emoji}</span>
              <p className="text-xl md:text-2xl font-black text-white mt-0.5">{fmt(s.value)}</p>
              <p className="text-white/25 text-[10px] uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Score + badges */}
      <motion.div className="liquid-glass rounded-3xl p-6 relative overflow-hidden"
        initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-7">
          <ScoreRing score={analysis.popularityScore} />
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-white mb-1">Popularity Score</h3>
            <p className="text-white/25 text-sm mb-4">Based on followers, engagement, verification & content quality</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {badges.map((b,i)=>(
                <motion.span key={b.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium"
                  style={{ background:`${b.color}0d`, color:b.color, border:`1px solid ${b.color}20` }}
                  initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }}
                  transition={{ delay:0.6+i*0.08, type:"spring" }}>
                  <b.icon className="w-3 h-3" />{b.value}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Account age bar */}
        <div className="relative z-10 mt-6 pt-4" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/30 text-xs flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Account Age
            </span>
            <span className="text-white/60 text-xs font-medium">{analysis.accountAgeLabel}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.04)" }}>
            <motion.div className="h-full rounded-full"
              style={{ background:"linear-gradient(90deg,#7c3aed,#ec4899)" }}
              initial={{ width:0 }}
              animate={{ width:`${Math.min((analysis.accountAgeDays / (365*15))*100, 100)}%` }}
              transition={{ duration:1.2, delay:0.5, ease:"easeOut" }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-white/15">New</span>
            <span className="text-[10px] text-white/15">15+ years</span>
          </div>
        </div>
      </motion.div>

      {/* Quick action cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label:"View Analytics", sub:"Engagement, trends & charts", tab:"analytics" as TabId, color:"#a855f7" },
          { label:"View Authenticity", sub:"Bot detection & fake analysis", tab:"authenticity" as TabId, color:"#22c55e" },
        ].map((card,i)=>(
          <motion.button key={card.tab}
            onClick={()=>onNavigate(card.tab)}
            className="liquid-glass-inner rounded-2xl p-4 text-left"
            initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.5+i*0.08 }}
            whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
            <p className="text-white text-sm font-semibold">{card.label}</p>
            <p className="text-white/25 text-[11px] mt-0.5">{card.sub}</p>
            <div className="w-8 h-[3px] rounded-full mt-2" style={{ background:card.color, opacity:0.5 }} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
