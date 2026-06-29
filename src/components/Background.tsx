"use client";
import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Background() {
  const [mounted, setMounted] = useState(false);

  // High-performance Framer Motion values for cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for cursor glow and parallax shifts
  const springConfig = { damping: 35, stiffness: 60, mass: 1.2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const parallaxX = useSpring(useMotionValue(0), { damping: 45, stiffness: 45 });
  const parallaxY = useSpring(useMotionValue(0), { damping: 45, stiffness: 45 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      const cx = e.clientX - window.innerWidth / 2;
      const cy = e.clientY - window.innerHeight / 2;
      
      // Update mouse followers (offset by half of the orb size)
      mouseX.set(e.clientX - 175);
      mouseY.set(e.clientY - 175);

      // Subtle parallax shifts for deep-field feeling
      parallaxX.set(-cx * 0.05);
      parallaxY.set(-cy * 0.05);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, parallaxX, parallaxY]);

  if (!mounted) {
    return <div className="fixed inset-0 z-0 bg-[#08070d]" />;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Ultra-deep luxurious dark background */}
      <div className="absolute inset-0 bg-[#06050b]" />

      {/* 2. Premium Radial Backdrop to build high contrast */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 90% 75% at 50% 10%, rgba(124, 58, 237, 0.1) 0%, transparent 65%),
          radial-gradient(circle at 0% 100%, rgba(219, 39, 119, 0.04) 0%, transparent 40%),
          radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.04) 0%, transparent 40%)
        `
      }} />

      {/* 3. Smooth Breathing High-End Mesh Aurora Wave (Subtle Parallax) */}
      <motion.div 
        className="absolute inset-0"
        style={{ x: parallaxX, y: parallaxY }}
      >
        {/* Soft, beautiful violet mesh bloom */}
        <motion.div 
          className="absolute rounded-full w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] opacity-[0.45]"
          style={{
            left: "10%",
            top: "15%",
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.16) 0%, rgba(124, 58, 237, 0) 70%)",
            filter: "blur(60px)",
            willChange: "transform",
          }}
          animate={{
            x: [0, 30, -25, 0],
            y: [0, -25, 30, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Vibrant glowing magenta mesh bloom */}
        <motion.div 
          className="absolute rounded-full w-[50vw] h-[50vw] max-w-[600px] max-h-[500px] opacity-[0.4]"
          style={{
            right: "10%",
            top: "25%",
            background: "radial-gradient(circle, rgba(219, 39, 119, 0.1) 0%, rgba(219, 39, 119, 0) 70%)",
            filter: "blur(60px)",
            willChange: "transform",
          }}
          animate={{
            x: [0, -25, 30, 0],
            y: [0, 35, -15, 0],
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Luminous Royal Blue mesh bloom */}
        <motion.div 
          className="absolute rounded-full w-[50vw] h-[50vw] max-w-[550px] max-h-[550px] opacity-[0.4]"
          style={{
            left: "35%",
            bottom: "5%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0) 70%)",
            filter: "blur(55px)",
            willChange: "transform",
          }}
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -30, 15, 0],
            scale: [1, 1.03, 0.97, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* 4. Mouse-Responsive Glowing Spotlight Orb (Liquid Glass Lens) */}
      {/* Moves smoothly behind the cards to bring elements into high-contrast focus */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full hidden sm:block opacity-[0.55]"
        style={{
          x: smoothX,
          y: smoothY,
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.11) 0%, rgba(236, 72, 153, 0.03) 45%, rgba(0,0,0,0) 70%)",
          filter: "blur(40px)",
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />
    </div>
  );
}
