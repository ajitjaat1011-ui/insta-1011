"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [p, setP] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const t = [
      setTimeout(() => setP(1), 100),
      setTimeout(() => setP(2), 600),
      setTimeout(() => setP(3), 1400),
      setTimeout(() => setP(4), 2000),
      setTimeout(() => setP(5), 2600),
      setTimeout(() => setExit(true), 3400),
      setTimeout(onComplete, 4000),
    ];
    return () => t.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          style={{ background: "#000" }}
          exit={{ opacity: 0, scale: 1.15, filter: "blur(20px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Deep space gradient */}
          <motion.div className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={{ background: "radial-gradient(circle at 50% 45%, #1a0033 0%, #08000f 45%, #000 100%)" }}
          />

          {/* Orbiting particles ring */}
          {p >= 2 && Array.from({ length: 40 }).map((_, i) => {
            const angle = (i / 40) * Math.PI * 2;
            const r = 120 + (i % 3) * 40;
            const size = i % 4 === 0 ? 3 : 1.5;
            const colors = ["#a855f7", "#ec4899", "#f97316", "#3b82f6", "#22c55e", "#fff"];
            return (
              <motion.div key={`p${i}`} className="absolute rounded-full"
                style={{
                  width: size, height: size,
                  background: colors[i % colors.length],
                  boxShadow: `0 0 ${size * 3}px ${colors[i % colors.length]}`,
                }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{
                  x: Math.cos(angle) * r,
                  y: Math.sin(angle) * r,
                  scale: [0, 1.5, 0.8],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 1.8, delay: (i % 8) * 0.05, ease: "easeOut" }}
              />
            );
          })}

          {/* Expanding rings */}
          {p >= 2 && [0, 1, 2, 3, 4, 5, 6].map(i => (
            <motion.div key={`r${i}`} className="absolute rounded-full"
              style={{
                border: `${1.5 - i * 0.15}px solid`,
                borderColor: i % 2 === 0
                  ? `rgba(168,85,247,${0.3 - i * 0.04})`
                  : `rgba(236,72,153,${0.25 - i * 0.03})`,
              }}
              initial={{ width: 0, height: 0, opacity: 0.6 }}
              animate={{
                width: [0, 200 + i * 100],
                height: [0, 200 + i * 100],
                opacity: [0.6, 0],
              }}
              transition={{ duration: 1.5, delay: i * 0.08, ease: "easeOut" }}
            />
          ))}

          {/* Center content */}
          <div className="relative flex flex-col items-center">
            {/* Outer glow */}
            <motion.div className="absolute w-52 h-52 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(236,72,153,0.2) 40%, transparent 70%)", filter: "blur(40px)" }}
              initial={{ scale: 0, opacity: 0 }}
              animate={p >= 1 ? { scale: [0, 3, 2], opacity: [0, 0.8, 0.3] } : {}}
              transition={{ duration: 1.8 }}
            />

            {/* Logo */}
            <motion.div className="relative z-10"
              initial={{ scale: 0, rotate: -270, opacity: 0 }}
              animate={p >= 1 ? { scale: 1, rotate: 0, opacity: 1 } : {}}
              transition={{ type: "spring", stiffness: 120, damping: 10 }}>
              <div className="w-[110px] h-[110px] rounded-[30px] relative overflow-hidden" style={{
                background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
                boxShadow: "0 0 80px rgba(131,58,180,0.6), 0 0 160px rgba(253,29,29,0.3), 0 20px 60px rgba(0,0,0,0.5)",
              }}>
                <div className="absolute inset-[3px] rounded-[27px] flex items-center justify-center overflow-hidden"
                  style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)" }}>
                  {/* Rotating light */}
                  <motion.div className="absolute w-[200%] h-[200%]"
                    style={{
                      background: "conic-gradient(from 0deg, transparent 0%, rgba(168,85,247,0.08) 25%, transparent 50%, rgba(236,72,153,0.06) 75%, transparent 100%)",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Vertical shine */}
                  <motion.div className="absolute w-[160%] h-[300%] -rotate-45"
                    style={{ background: "linear-gradient(transparent 35%, rgba(255,255,255,0.07) 50%, transparent 65%)" }}
                    animate={{ y: ["-120%", "120%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-[2.6rem] font-black text-white relative z-10 tracking-tight"
                    style={{ textShadow: "0 0 40px rgba(168,85,247,0.7), 0 0 80px rgba(236,72,153,0.3)" }}>
                    1011
                  </span>
                </div>
              </div>

              {/* Orbiting dots */}
              {p >= 3 && [0, 1, 2, 3].map(i => (
                <motion.div key={`d${i}`} className="absolute"
                  style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: ["#a855f7", "#ec4899", "#f97316", "#3b82f6"][i],
                    boxShadow: `0 0 10px ${["#a855f7", "#ec4899", "#f97316", "#3b82f6"][i]}`,
                    top: "50%", left: "50%",
                  }}
                  initial={{ x: -3, y: -3, scale: 0 }}
                  animate={{
                    x: [
                      Math.cos((i / 4) * Math.PI * 2) * 70 - 3,
                      Math.cos((i / 4) * Math.PI * 2 + Math.PI) * 70 - 3,
                      Math.cos((i / 4) * Math.PI * 2) * 70 - 3,
                    ],
                    y: [
                      Math.sin((i / 4) * Math.PI * 2) * 70 - 3,
                      Math.sin((i / 4) * Math.PI * 2 + Math.PI) * 70 - 3,
                      Math.sin((i / 4) * Math.PI * 2) * 70 - 3,
                    ],
                    scale: [0, 1, 1],
                    opacity: [0, 1, 0.6],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                />
              ))}
            </motion.div>

            {/* Title */}
            <motion.div className="mt-8 text-center relative z-10"
              initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
              animate={p >= 3 ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <h1 className="text-[3.5rem] font-black tracking-tight leading-none">
                <span style={{
                  background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 20px rgba(168,85,247,0.4))",
                }}>Insta</span>
                <span className="text-white ml-2" style={{
                  textShadow: "0 0 30px rgba(255,255,255,0.15)",
                }}>1011</span>
              </h1>
            </motion.div>

            {/* Tagline with typing effect */}
            <motion.div className="mt-3 relative z-10 overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={p >= 4 ? { opacity: 1, width: "auto" } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}>
              <p className="text-[11px] tracking-[0.4em] uppercase whitespace-nowrap"
                style={{ color: "rgba(255,255,255,0.25)" }}>
                Profile Intelligence Engine
              </p>
            </motion.div>

            {/* Loading bar */}
            <motion.div className="mt-8 relative z-10 w-48 h-[3px] rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={p >= 5 ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.3 }}>
              <motion.div className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #a855f7, #ec4899, #f97316)" }}
                initial={{ width: "0%" }}
                animate={p >= 5 ? { width: "100%" } : {}}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
