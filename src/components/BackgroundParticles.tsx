"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  symbol: string;
  opacity: number;
}

export default function BackgroundParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const symbols = ["🌸", "✨", "🤍", "🌷", "💫"];
    const generated: Particle[] = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 10,
      duration: Math.random() * 16 + 18,
      delay: Math.random() * 8,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      opacity: Math.random() * 0.3 + 0.2,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">

      {/* ── FLARE BESAR — ambient bokeh ── */}
      {/* Top-left warm rose flare */}
      <div
        className="absolute rounded-full"
        style={{
          top: "-15%", left: "-10%",
          width: "60vw", height: "60vw",
          background: "radial-gradient(circle, rgba(236,72,135,0.18) 0%, rgba(253,208,223,0.10) 45%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Bottom-right cool mint flare */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: "-15%", right: "-10%",
          width: "55vw", height: "55vw",
          background: "radial-gradient(circle, rgba(63,138,87,0.14) 0%, rgba(196,227,203,0.08) 45%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      {/* Center-right soft pink bokeh */}
      <div
        className="absolute rounded-full"
        style={{
          top: "30%", right: "-5%",
          width: "40vw", height: "40vw",
          background: "radial-gradient(circle, rgba(249,168,196,0.20) 0%, rgba(255,232,239,0.10) 50%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      {/* Center-left teal accent flare */}
      <div
        className="absolute rounded-full"
        style={{
          top: "55%", left: "-5%",
          width: "35vw", height: "35vw",
          background: "radial-gradient(circle, rgba(116,181,133,0.12) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── FLARE KECIL — highlight spot (lens flare effect) ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "8%", left: "15%",
          width: "180px", height: "180px",
          background: "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(253,208,223,0.25) 40%, transparent 70%)",
          filter: "blur(22px)",
        }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.12, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          bottom: "18%", left: "30%",
          width: "130px", height: "130px",
          background: "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(196,227,203,0.20) 45%, transparent 70%)",
          filter: "blur(18px)",
        }}
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "45%", right: "12%",
          width: "100px", height: "100px",
          background: "radial-gradient(circle, rgba(255,255,255,0.50) 0%, rgba(249,168,196,0.20) 50%, transparent 70%)",
          filter: "blur(14px)",
        }}
        animate={{ opacity: [0.4, 0.85, 0.4], scale: [1, 1.20, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* ── DIAGONAL SHIMMER STREAK ── */}
      <motion.div
        className="absolute"
        style={{
          top: "0", left: "20%",
          width: "2px", height: "100vh",
          background: "linear-gradient(to bottom, transparent, rgba(236,72,135,0.10) 30%, rgba(255,255,255,0.15) 50%, rgba(63,138,87,0.08) 70%, transparent)",
          transform: "rotate(15deg)",
          transformOrigin: "top center",
          filter: "blur(4px)",
        }}
        animate={{ opacity: [0, 0.6, 0], x: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute"
        style={{
          top: "0", right: "25%",
          width: "1.5px", height: "100vh",
          background: "linear-gradient(to bottom, transparent, rgba(116,181,133,0.10) 35%, rgba(255,255,255,0.12) 55%, transparent)",
          transform: "rotate(-10deg)",
          transformOrigin: "top center",
          filter: "blur(3px)",
        }}
        animate={{ opacity: [0, 0.5, 0], x: [0, -12, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 7 }}
      />

      {/* ── FLOATING PARTICLES ── */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
          }}
          animate={{
            y: ["0vh", "-110vh"],
            x: [0, Math.sin(p.id) * 25, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
}
