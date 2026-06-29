"use client";
import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer className="relative z-10 mt-8 pb-6"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35 }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-[1px] mb-5"
          style={{ background: "linear-gradient(90deg,transparent,rgba(var(--text-purple-rgb),0.18),transparent)" }} />

        {/* Compact creator bar */}
        <div className="liquid-glass rounded-2xl px-4 py-3.5 relative overflow-hidden">
          {/* subtle accent */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
            style={{ background: "radial-gradient(circle at 20% 50%, var(--text-purple, #a855f7), transparent 60%), radial-gradient(circle at 80% 50%, var(--text-pink, #ec4899), transparent 60%)" }} />
          
          <div className="relative z-10 flex items-center gap-3 flex-wrap">
            {/* Logo */}
            <div className="w-11 h-11 rounded-xl relative overflow-hidden flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,var(--accent-1, #833ab4),var(--accent-2, #fd1d1d) 50%,var(--text-orange, #fcb045))",
                boxShadow: "0 0 18px rgba(131,58,180,0.22)",
              }}>
              <div className="absolute inset-[1.5px] rounded-[10px] bg-black/85 flex items-center justify-center">
                <span className="text-lg">🚀</span>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-[160px]">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-white font-bold text-[14px]">@ARVINDJAAT1011</span>
                <span className="text-white/25 text-[10px] hidden sm:inline">• Building next-gen social analytics</span>
              </div>
              <p className="text-white/30 text-[11px] sm:hidden leading-tight">Insta 1011 creator</p>
            </div>

            {/* Follow button – compact */}
            <motion.a
              href="https://www.instagram.com/ARVINDJAAT1011"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-[12px] text-white relative overflow-hidden group flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,var(--accent-1, #7c3aed),var(--accent-2, #db2777))",
                boxShadow: "0 3px 12px rgba(var(--accent-1-rgb),0.28)",
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Follow</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </motion.a>
          </div>
        </div>

        {/* Minimal legal line */}
        <p className="text-center text-white/25 text-[10px] mt-3 leading-relaxed">
          Insta 1011 — Real Instagram Profile Analysis • by @ARVINDJAAT1011 • <span className="text-white/15">Not affiliated with Meta/Instagram</span>
        </p>
      </div>
    </motion.footer>
  );
}
