"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Background() {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  // High-performance Framer Motion values for cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for fluid mouse-following effect (Apple's Liquid look)
  const springConfig = { damping: 28, stiffness: 80, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Slower springs for subtle parallax of background shapes
  const parallaxX = useSpring(useMotionValue(0), { damping: 45, stiffness: 40 });
  const parallaxY = useSpring(useMotionValue(0), { damping: 45, stiffness: 40 });

  useEffect(() => {
    setMounted(true);
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Center coordinates relative to viewport
      const cx = e.clientX - window.innerWidth / 2;
      const cy = e.clientY - window.innerHeight / 2;
      
      // Update mouse followers
      mouseX.set(e.clientX - 100); // offset half of orb size
      mouseY.set(e.clientY - 100);

      // Update subtle background parallax (opposing direction)
      parallaxX.set(-cx * 0.08);
      parallaxY.set(-cy * 0.08);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY, parallaxX, parallaxY]);

  // Generate randomized stars/sparkles that drift organically
  const sparks = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${(i * 13) % 98}%`,
      top: `${(i * 17) % 95}%`,
      size: i % 3 === 0 ? "w-1.5 h-1.5" : "w-1 h-1",
      duration: 12 + (i % 4) * 5,
      delay: -(i * 0.8),
    }));
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 z-0 bg-[#030305]" />;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Deep Space Velvet Base Gradient */}
      <div className="absolute inset-0 bg-[#030305]" />
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 95% 75% at 50% 15%, rgba(20, 10, 45, 0.45) 0%, transparent 65%),
          radial-gradient(circle at 10% 90%, rgba(124, 58, 237, 0.03) 0%, transparent 45%),
          radial-gradient(circle at 90% 90%, rgba(236, 72, 153, 0.03) 0%, transparent 45%)
        `
      }} />

      {/* 2. Interactive Kinetic Grid (Subtle Parallax) */}
      <motion.div 
        className="absolute inset-[-5%] opacity-[0.024]" 
        style={{
          x: parallaxX,
          y: parallaxY,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1.5px, transparent 1.5px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* 3. Smooth Breathing Organic Gradients (Ambient Blobs) */}
      <motion.div 
        className="absolute inset-0"
        style={{ x: parallaxX, y: parallaxY }}
      >
        {/* Violet Purple Ambient Aura */}
        <motion.div 
          className="absolute rounded-full w-[55vw] h-[55vw] max-w-[650px] max-h-[650px]"
          style={{
            left: "15%",
            top: "20%",
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(124, 58, 237, 0) 70%)",
            filter: "blur(40px)",
            willChange: "transform",
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 35, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Hot Pink Ambient Aura */}
        <motion.div 
          className="absolute rounded-full w-[45vw] h-[45vw] max-w-[500px] max-h-[500px]"
          style={{
            right: "12%",
            top: "10%",
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, rgba(236, 72, 153, 0) 70%)",
            filter: "blur(50px)",
            willChange: "transform",
          }}
          animate={{
            x: [0, -35, 40, 0],
            y: [0, 45, -20, 0],
            scale: [1, 0.93, 1.07, 1],
          }}
          transition={{
            duration: 38,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Royal Blue Ambient Aura */}
        <motion.div 
          className="absolute rounded-full w-[40vw] h-[45vw] max-w-[450px] max-h-[450px]"
          style={{
            left: "40%",
            bottom: "8%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.09) 0%, rgba(59, 130, 246, 0) 70%)",
            filter: "blur(45px)",
            willChange: "transform",
          }}
          animate={{
            x: [0, 25, -25, 0],
            y: [0, -35, 20, 0],
            scale: [1, 1.05, 0.92, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* 4. Mouse-Responsive Fluid Fluid Glow Orb (Liquid Glass Spotlight) */}
      {/* This spotlight moves dynamically behind the glass panels, lighting up elements as the user moves their cursor */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full hidden sm:block"
        style={{
          x: smoothX,
          y: smoothY,
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.16) 0%, rgba(236, 72, 153, 0.04) 45%, rgba(0, 0, 0, 0) 70%)",
          filter: "blur(20px)",
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />

      {/* 5. Organic Floating Sparks (Micro-interactions) */}
      <div className="absolute inset-0">
        {sparks.map((spark) => (
          <motion.div
            key={spark.id}
            className={`absolute rounded-full bg-white/25 pointer-events-none ${spark.size}`}
            style={{
              left: spark.left,
              top: spark.top,
              boxShadow: "0 0 6px rgba(255,255,255,0.4)",
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, 15, 0],
              opacity: [0.15, 0.6, 0.15],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: spark.duration,
              delay: spark.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
