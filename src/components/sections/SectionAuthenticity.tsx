"use client";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle2, Users, Bot, Eye } from "lucide-react";
import type { InstagramProfile, ProfileAnalysis } from "@/lib/instagram";

function fmt(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "") + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
}

/* Dual ring */
function DualRing({
  inner,
  outer,
  size = 150,
  innerColor,
  outerColor,
  innerLabel,
  outerLabel,
}: {
  inner: number;
  outer: number;
  size?: number;
  innerColor: string;
  outerColor: string;
  innerLabel: string;
  outerLabel: string;
}) {
  const r1 = (size - 16) / 2;
  const r2 = r1 - 14;
  const c1 = 2 * Math.PI * r1;
  const c2 = 2 * Math.PI * r2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Outer track */}
        <circle cx={size/2} cy={size/2} r={r1} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={8} />
        <motion.circle cx={size/2} cy={size/2} r={r1} fill="none"
          stroke={outerColor} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={c1}
          initial={{ strokeDashoffset: c1 }}
          animate={{ strokeDashoffset: c1 - (outer / 100) * c1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.22,1,0.36,1] }}
          style={{ filter: `drop-shadow(0 0 8px ${outerColor}50)` }} />
        {/* Inner track */}
        <circle cx={size/2} cy={size/2} r={r2} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth={6} />
        <motion.circle cx={size/2} cy={size/2} r={r2} fill="none"
          stroke={innerColor} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={c2}
          initial={{ strokeDashoffset: c2 }}
          animate={{ strokeDashoffset: c2 - (inner / 100) * c2 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.22,1,0.36,1] }}
          style={{ filter: `drop-shadow(0 0 6px ${innerColor}40)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-3xl font-black text-white"
          initial={{ scale:0 }} animate={{ scale:1 }}
          transition={{ delay:1, type:"spring" }}>{outer}%</motion.span>
        <span className="text-[8px] uppercase tracking-wider text-white/20">authentic</span>
      </div>
      {/* Legend */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: outerColor }} />
          <span className="text-[9px] text-white/25">{outerLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: innerColor }} />
          <span className="text-[9px] text-white/25">{innerLabel}</span>
        </div>
      </div>
    </div>
  );
}

/* Horizontal gauge */
function Gauge({ value, max, colors }: { value: number; max: number; colors: [string, string] }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
      <motion.div className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})` }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }} />
    </div>
  );
}

export default function SectionAuthenticity({
  profile,
  analysis,
}: {
  profile: InstagramProfile;
  analysis: ProfileAnalysis;
}) {
  const realPct = 100 - analysis.estimatedFakePercent;
  const fakePct = analysis.estimatedFakePercent;

  return (
    <div className="space-y-4">
      {/* Main authenticity card */}
      <motion.div className="liquid-glass rounded-3xl p-6 md:p-7 relative overflow-hidden"
        initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
        {/* Shimmer */}
        <motion.div className="absolute top-0 left-0 right-0 h-[1px] z-10"
          style={{ background:"linear-gradient(90deg,transparent,rgba(34,197,94,0.4),transparent)",
            backgroundSize:"200% 100%" }}
          animate={{ backgroundPosition:["-200% 0","200% 0"] }}
          transition={{ duration:4, repeat:Infinity, ease:"linear" }} />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <DualRing
            outer={analysis.authenticityScore}
            inner={100 - analysis.botScore}
            outerColor="#22c55e"
            innerColor="#3b82f6"
            outerLabel="Authenticity"
            innerLabel="Trust Score"
          />
          <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Authenticity Analysis</h3>
            </div>
            <p className="text-2xl font-black mt-1" style={{
              color: analysis.authenticityScore >= 75 ? "#22c55e" : analysis.authenticityScore >= 50 ? "#f59e0b" : "#ef4444",
            }}>{analysis.botLabel}</p>
            <p className="text-white/25 text-sm mt-1">
              Bot suspicion score: {analysis.botScore}/100
            </p>
          </div>
        </div>
      </motion.div>

      {/* Follower breakdown */}
      <motion.div className="liquid-glass rounded-3xl p-6"
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-4 h-4 text-blue-400" />
          <h3 className="text-base font-bold text-white">Follower Breakdown (Estimated)</h3>
        </div>

        {/* Visual bar */}
        <div className="relative h-8 rounded-xl overflow-hidden mb-4" style={{ background:"rgba(255,255,255,0.03)" }}>
          <motion.div className="absolute inset-y-0 left-0 flex items-center justify-center"
            style={{ background:"linear-gradient(90deg,#22c55e,#16a34a)" }}
            initial={{ width:0 }} animate={{ width:`${realPct}%` }}
            transition={{ duration:1.2, delay:0.3, ease:[0.22,1,0.36,1] }}>
            <span className="text-[11px] font-bold text-white px-2">
              {realPct >= 15 ? `${realPct}% Real` : ""}
            </span>
          </motion.div>
          <motion.div className="absolute inset-y-0 right-0 flex items-center justify-center"
            style={{ background:"linear-gradient(90deg,#dc2626,#ef4444)" }}
            initial={{ width:0 }} animate={{ width:`${fakePct}%` }}
            transition={{ duration:1.2, delay:0.5, ease:[0.22,1,0.36,1] }}>
            <span className="text-[11px] font-bold text-white px-2">
              {fakePct >= 10 ? `${fakePct}% Suspicious` : ""}
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div className="liquid-glass-inner rounded-xl p-4 text-center"
            initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.4 }}>
            <p className="text-2xl font-black text-emerald-400">{fmt(analysis.estimatedRealFollowers)}</p>
            <p className="text-white/25 text-[10px] uppercase tracking-wider mt-0.5">Est. Real Followers</p>
          </motion.div>
          <motion.div className="liquid-glass-inner rounded-xl p-4 text-center"
            initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.5 }}>
            <p className="text-2xl font-black text-red-400">
              {fmt(profile.followersCount - analysis.estimatedRealFollowers)}
            </p>
            <p className="text-white/25 text-[10px] uppercase tracking-wider mt-0.5">Est. Suspicious</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Signals */}
      <motion.div className="liquid-glass rounded-3xl p-6"
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}>
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-amber-400" />
          <h3 className="text-base font-bold text-white">Detection Signals</h3>
        </div>
        <div className="space-y-2.5">
          {analysis.suspiciousSignals.map((signal, i) => {
            const isClean = signal.includes("No suspicious");
            return (
              <motion.div key={i}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{
                  background: isClean ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.06)",
                  border: `1px solid ${isClean ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)"}`,
                }}
                initial={{ opacity:0, x:-15 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:0.35+i*0.08 }}>
                {isClean
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  : <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                }
                <span className="text-white/50 text-sm">{signal}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Detailed gauges */}
      <motion.div className="liquid-glass rounded-3xl p-6"
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}>
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-4 h-4 text-purple-400" />
          <h3 className="text-base font-bold text-white">Detailed Metrics</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: "Engagement Health", value: Math.min(analysis.engagementRate * 10, 100), max: 100, colors: ["#22c55e","#16a34a"] as [string,string], display: `${analysis.engagementRate}%` },
            { label: "Follower Quality", value: analysis.authenticityScore, max: 100, colors: ["#3b82f6","#6366f1"] as [string,string], display: `${analysis.authenticityScore}%` },
            { label: "Bot Risk Level", value: analysis.botScore, max: 100, colors: ["#f59e0b","#ef4444"] as [string,string], display: `${analysis.botScore}/100` },
            { label: "Content Consistency", value: profile.postsCount > 0 ? Math.min(analysis.postsPerDay * 50, 100) : 0, max: 100, colors: ["var(--text-purple, #a855f7)","var(--text-pink, #ec4899)"] as [string,string], display: `${analysis.postsPerDay}/day` },
            { label: "Bio Optimization", value: analysis.bioScore, max: 100, colors: ["var(--text-orange, #f97316)","#f59e0b"] as [string,string], display: `${analysis.bioScore}/100` },
          ].map((gauge, i) => (
            <div key={gauge.label}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-white/35 text-xs">{gauge.label}</span>
                <span className="text-white/60 text-xs font-medium">{gauge.display}</span>
              </div>
              <Gauge value={gauge.value} max={gauge.max} colors={gauge.colors} />
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
          <span className="text-white/30 text-xs">Credibility Grade</span>
          <span className="text-xl font-black" style={{ color: analysis.credibilityGrade === "A+" || analysis.credibilityGrade === "A" ? "#22c55e" : analysis.credibilityGrade === "B" ? "#3b82f6" : "#f59e0b" }}>
            {analysis.credibilityGrade}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
