"use client";
import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#030305]" />
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 70% 50% at 15% 45%, rgba(88,28,135,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 85% 15%, rgba(15,23,42,0.25) 0%, transparent 50%),
          radial-gradient(ellipse 60% 45% at 55% 85%, rgba(30,10,46,0.15) 0%, transparent 55%)
        `,
      }} />
      {[
        { c:"#7c3aed", s:550, x:"12%", y:"18%", d:28 },
        { c:"#ec4899", s:420, x:"78%", y:"55%", d:34 },
        { c:"#3b82f6", s:380, x:"45%", y:"82%", d:24 },
        { c:"#f97316", s:320, x:"88%", y:"12%", d:30 },
      ].map((o,i)=>(
        <motion.div key={i} className="absolute rounded-full" style={{
          width:o.s, height:o.s, left:o.x, top:o.y,
          background:`radial-gradient(circle,${o.c}0d 0%,transparent 70%)`,
          filter:"blur(50px)",
        }} animate={{
          x:[0,50,-35,45,0], y:[0,-45,35,-25,0], scale:[1,1.12,0.92,1.08,1],
        }} transition={{ duration:o.d, repeat:Infinity, ease:"easeInOut" }} />
      ))}
      <div className="absolute inset-0 opacity-[0.018]" style={{
        backgroundImage:"linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)",
        backgroundSize:"70px 70px",
      }} />
    </div>
  );
}
