"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Background() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 z-0 bg-[#06050d]" />;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Deepest Luxury Velvet Indigo/Black Base (natively painted) */}
      <div className="absolute inset-0 bg-[#06050d]" />

      {/* 2. Soft Vignette Overlay to increase contrast and readability */}
      <div className="absolute inset-0 z-10" style={{
        background: "radial-gradient(circle at 50% 50%, transparent 30%, rgba(6, 5, 13, 0.75) 100%)"
      }} />

      {/* 3. Hardware-Accelerated Mobile-Safe Silk Auroras (NO parent blur filters, NO buggy blend-modes) */}
      {/* By placing the radial gradient directly on the animated divs with transparency, it is guaranteed to paint on 100% of iOS & Android browsers! */}
      <div className="absolute inset-0 z-0">
        
        {/* Glowing Brand Purple Aurora */}
        <motion.div
          className="absolute rounded-full w-[100vw] h-[100vw] max-w-[800px] max-h-[800px]"
          style={{
            left: "5%",
            top: "-15%",
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.18) 0%, rgba(124, 58, 237, 0.05) 30%, rgba(0,0,0,0) 70%)",
            willChange: "transform",
          }}
          animate={{
            x: [0, 45, -30, 0],
            y: [0, -35, 40, 0],
            scale: [1, 1.12, 0.93, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Glowing Brand Pink Aurora */}
        <motion.div
          className="absolute rounded-full w-[90vw] h-[90vw] max-w-[700px] max-h-[700px]"
          style={{
            right: "5%",
            bottom: "-15%",
            background: "radial-gradient(circle, rgba(219, 39, 119, 0.14) 0%, rgba(219, 39, 119, 0.03) 30%, rgba(0,0,0,0) 70%)",
            willChange: "transform",
          }}
          animate={{
            x: [0, -40, 35, 0],
            y: [0, 40, -25, 0],
            scale: [1, 0.94, 1.08, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Glowing Royal Blue Aurora */}
        <motion.div
          className="absolute rounded-full w-[85vw] h-[85vw] max-w-[650px] max-h-[650px]"
          style={{
            left: "20%",
            top: "30%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.04) 30%, rgba(0,0,0,0) 70%)",
            willChange: "transform",
          }}
          animate={{
            x: [0, 25, -25, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.06, 0.94, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 4. Sparse, slow twinkling stars in the far background */}
      <div className="absolute inset-0 opacity-[0.12] z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: "2px",
              height: "2px",
              left: `${(i * 27.3) % 96}%`,
              top: `${(i * 19.7) % 94}%`,
              boxShadow: "0 0 6px rgba(255, 255, 255, 0.8)",
              willChange: "transform, opacity",
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: 18 + (i % 2) * 5,
              delay: -(i * 2),
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
