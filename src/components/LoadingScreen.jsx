import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame;
    let start;
    const duration = 1500; // 1.5 seconds

    const animateProgress = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min((progress / duration) * 100, 100);
      
      setProgress(Math.floor(percentage));
      
      if (percentage < 100) {
        animationFrame = requestAnimationFrame(animateProgress);
      } else {
        setTimeout(onComplete, 500);
      }
    };

    animationFrame = requestAnimationFrame(animateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
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
      }}
    >
      <div style={{ position: "relative", marginBottom: "var(--space-3xl)" }}>
        {/* Nike Swoosh SVG Animation */}
        <motion.svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-volt)"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1, fill: progress === 100 ? "var(--color-volt)" : "transparent" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <motion.path
            d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </motion.svg>
      </div>

      <div style={{ width: "200px", height: "2px", backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden", position: "relative" }}>
        <motion.div
          style={{
            position: "absolute",
            top: 0, left: 0, bottom: 0,
            backgroundColor: "var(--color-volt)",
            width: `${progress}%`
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.2 }}
        />
      </div>

      <div style={{
        marginTop: "var(--space-md)",
        fontFamily: "monospace",
        fontSize: "var(--type-caption)",
        letterSpacing: "0.2em",
        color: "var(--color-ink-soft)",
      }}>
        LOADING_ {progress}%
      </div>
    </motion.div>
  );
}
