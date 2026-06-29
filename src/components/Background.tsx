"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Background() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 z-0 bg-[#040209]" />;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Deepest Luxury Velvet Black Base */}
      <div className="absolute inset-0 bg-[#040209]" />

      {/* 2. Soft Vignette Overlay to enhance readability and depth */}
      <div className="absolute inset-0 z-1" style={{
        background: "radial-gradient(circle at 50% 50%, transparent 20%, rgba(4, 2, 9, 0.8) 100%)"
      }} />

      {/* 3. Silk Aurora Flow – 3 large, slow-moving fluid light fields */}
      <div className="absolute inset-[-10%] z-0 filter blur-[80px] md:blur-[120px] opacity-[0.48] mix-blend-screen">
        
        {/* Neon Purple Aurora Wave */}
        <motion.div
          className="absolute rounded-full w-[80vw] h-[80vw] max-w-[800px] max-h-[700px]"
          style={{
            left: "5%",
            top: "-10%",
            background: "radial-gradient(circle at center, rgba(124, 58, 237, 0.28) 0%, rgba(124, 58, 237, 0.02) 50%, rgba(0,0,0,0) 70%)",
            willChange: "transform",
          }}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -40, 50, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Velvet Pink Aurora Wave */}
        <motion.div
          className="absolute rounded-full w-[75vw] h-[75vw] max-w-[700px] max-h-[600px]"
          style={{
            right: "5%",
            bottom: "-10%",
            background: "radial-gradient(circle at center, rgba(236, 72, 153, 0.18) 0%, rgba(236, 72, 153, 0.01) 50%, rgba(0,0,0,0) 70%)",
            willChange: "transform",
          }}
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 50, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Luminous Royal Blue Aurora Wave */}
        <motion.div
          className="absolute rounded-full w-[70vw] h-[70vw] max-w-[650px] max-h-[650px]"
          style={{
            left: "25%",
            top: "35%",
            background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.01) 50%, rgba(0,0,0,0) 70%)",
            willChange: "transform",
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -50, 25, 0],
            scale: [1, 1.08, 0.92, 1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 4. Elegant, Microscopic Cosmic Dust (Extremely slow and sparse) */}
      {/* Sits far back, creating an ultra-premium, interactive feeling */}
      <div className="absolute inset-0 opacity-[0.15] z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: i % 2 === 0 ? "2px" : "1.2px",
              height: i % 2 === 0 ? "2px" : "1.2px",
              left: `${(i * 19.3) % 98}%`,
              top: `${(i * 14.7) % 95}%`,
              boxShadow: "0 0 8px rgba(255, 255, 255, 0.6)",
              willChange: "transform, opacity",
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.7, 0.1],
            }}
            transition={{
              duration: 15 + (i % 3) * 6,
              delay: -(i * 1.5),
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
