"use client";
import { MotionConfig } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

export default function MotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    try {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const hw = (navigator as any).hardwareConcurrency || 8;
      const mem = (navigator as any).deviceMemory || 8;
      const isLowEnd = hw < 4 || mem < 4;
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      // Reduce motion on: user preference, low-end hw, or Android + small screen
      setReduced(prefersReduced || isLowEnd || (isAndroid && isSmallScreen));
    } catch {
      setReduced(false);
    }
  }, []);

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </MotionConfig>
  );
}
