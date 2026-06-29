"use client";
import { useWorldCup } from "./WorldCupProvider";
import { useMemo } from "react";

export default function WorldCupOverlay() {
  const { isActive } = useWorldCup();
  if (!isActive) return null;

  const footballs = useMemo(() => Array.from({ length: 7 }, (_, i) => ({
    id: i,
    left: 5 + (i * 13.5) % 90,
    delay: i * 1.8,
    duration: 18 + (i % 3) * 4,
    size: i % 3 === 0 ? 24 : 18,
    y: 12 + (i * 11) % 70,
  })), []);

  const confetti = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: (i * 53) % 100,
    delay: (i * 0.7) % 8,
    duration: 9 + (i % 4),
    color: i % 3 === 0 ? "#74acdf" : i % 3 === 1 ? "#ffffff" : "#fcbf49",
    rotate: i * 27,
  })), []);

  return (
    <>
      {/* Stadium vignette + pitch line */}
      <div className="wc-stadium-vignette" aria-hidden="true" />
      <div className="wc-pitch-line" aria-hidden="true" />

      {/* Top World Cup banner – permanent */}
      <div className="wc-top-banner">
        <span>🇦🇷 FIFA WORLD CUP 2026 • USA • CANADA • MÉXICO • VAMOS ARGENTINA ⚽</span>
      </div>

      {/* Floating footballs */}
      {footballs.map(f => (
        <div
          key={f.id}
          className="wc-football"
          style={{
            left: `${f.left}%`,
            top: `${f.y}%`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            fontSize: f.size,
          }}
          aria-hidden="true"
        >⚽</div>
      ))}

      {/* Confetti – Argentina colors */}
      {confetti.map(c => (
        <div
          key={c.id}
          className="wc-confetti"
          style={{
            left: `${c.left}%`,
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            transform: `rotate(${c.rotate}deg)`,
            boxShadow: c.color === "#ffffff" ? "0 0 4px rgba(255,255,255,0.3)" : "none",
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
