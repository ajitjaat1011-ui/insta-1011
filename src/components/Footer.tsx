"use client";
import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer className="relative z-10 mt-10 pb-8"
      initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-[1px] mb-7" style={{
          background:"linear-gradient(90deg,transparent,rgba(168,85,247,0.2),transparent)" }} />

        <motion.div className="liquid-glass rounded-3xl p-6 md:p-7 relative overflow-hidden"
          whileHover={{ borderColor:"rgba(168,85,247,0.12)" }}>
          {/* Accent */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            background:"radial-gradient(circle at 30% 50%,#a855f7,transparent 60%),radial-gradient(circle at 70% 50%,#ec4899,transparent 60%)" }} />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-5">
            <motion.div className="relative flex-shrink-0"
              whileHover={{ scale:1.06, rotate:3 }}>
              <div className="w-16 h-16 rounded-2xl overflow-hidden" style={{
                background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
                boxShadow:"0 0 25px rgba(131,58,180,0.25)" }}>
                <div className="absolute inset-[2px] rounded-[14px] bg-black/85 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
            </motion.div>
            <div className="text-center md:text-left flex-1">
              <p className="text-[9px] uppercase tracking-[0.3em] mb-0.5" style={{ color:"rgba(255,255,255,0.2)" }}>Created by</p>
              <h3 className="text-xl font-black text-white">@ARVINDJAAT1011</h3>
              <p className="text-white/30 text-xs mt-0.5 mb-3">Building next-gen social analytics 🔮</p>
              <motion.a href="https://www.instagram.com/ARVINDJAAT1011" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[13px] text-white relative overflow-hidden group"
                style={{ background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
                  boxShadow:"0 4px 18px rgba(131,58,180,0.35)" }}
                whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
                <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background:"linear-gradient(135deg,#fcb045,#fd1d1d,#833ab4)" }} />
                <Heart className="w-3.5 h-3.5 relative z-10 fill-white" />
                <span className="relative z-10">Follow on Instagram</span>
                <ExternalLink className="w-3 h-3 relative z-10 opacity-60" />
              </motion.a>
            </div>
            <div className="hidden md:block">
              <motion.span className="text-5xl font-black select-none"
                style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.06),rgba(236,72,153,0.06))",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}
                animate={{ opacity:[0.25,0.5,0.25] }}
                transition={{ duration:4, repeat:Infinity }}>1011</motion.span>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-5 space-y-0.5">
          <p className="text-white/12 text-[11px]">
            Insta 1011 — Real Instagram Profile Analysis •{" "}
            <motion.span className="inline-block" animate={{ scale:[1,1.25,1] }}
              transition={{ duration:1.5, repeat:Infinity }}>💜</motion.span>
            {" "}by @ARVINDJAAT1011
          </p>
          <p className="text-white/6 text-[9px]">
            Analyzes publicly available data only. Not affiliated with Meta/Instagram.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
