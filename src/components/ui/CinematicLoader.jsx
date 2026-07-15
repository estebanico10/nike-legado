import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import gsap from "gsap";

export default function CinematicLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame;
    let start;
    const duration = 2000; // Un poco más largo para la experiencia inicial

    const animateProgress = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const percentage = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(Math.floor(percentage));
      
      if (percentage < 100) {
        animationFrame = requestAnimationFrame(animateProgress);
      } else if (onComplete) {
        setTimeout(onComplete, 500); // Pequeña pausa antes de revelar el home
      }
    };

    animationFrame = requestAnimationFrame(animateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        y: "-100vh", // Sube como un telón
        filter: "blur(20px)",
        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "var(--color-ink)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-canvas)",
        overflow: "hidden"
      }}
    >
      {/* Background Noise for premium feel */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          pointerEvents: "none",
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"
        }}
      />

      <div style={{ position: "relative", marginBottom: "var(--space-3xl)", zIndex: 2 }}>
        <motion.svg
          width="180"
          height="180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-canvas)"
          strokeWidth="0.3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1, fill: progress === 100 ? "var(--color-volt)" : "transparent", stroke: progress === 100 ? "var(--color-volt)" : "var(--color-canvas)" }}
          transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.path
            d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z"
          />
        </motion.svg>
      </div>

      <div style={{ zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--type-h1)",
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: progress === 100 ? "var(--color-volt)" : "var(--color-canvas)",
            transition: "color 0.5s ease"
          }}
        >
          {progress}
          <span style={{ fontSize: "var(--type-h3)", color: "var(--color-ink-soft)" }}>%</span>
        </motion.div>
        <div style={{
          marginTop: "var(--space-xs)",
          fontFamily: "var(--font-body)",
          fontSize: "var(--type-micro)",
          letterSpacing: "0.4em",
          color: "var(--color-ink-soft)",
          textTransform: "uppercase"
        }}>
          Iniciando Experiencia
        </div>
      </div>
    </motion.div>
  );
}
