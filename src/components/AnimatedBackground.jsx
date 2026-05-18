import { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function AnimatedBackground() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const handleMouseMove = (e) => {
      // Normalize values -1 to 1
      x.set((e.clientX / window.innerWidth) * 2 - 1);
      y.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -9999, overflow: "hidden", pointerEvents: "none" }}>
      {/* Base Canvas */}
      <motion.div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "var(--color-canvas)",
          zIndex: -3,
        }}
      />
      {/* Orb 1 (follows mouse directly but smooth) */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: "120vw", height: "120vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(206,255,0,0.04) 0%, transparent 60%)",
          filter: "blur(80px)",
          x: useTransform(x, [-1, 1], ["-60%", "10%"]),
          y: useTransform(y, [-1, 1], ["-60%", "10%"]),
          translateX: "-50%",
          translateY: "-50%",
          zIndex: -2,
        }}
      />
      {/* Orb 2 (moves opposite to mouse) */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: "80vw", height: "80vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 60%)",
          filter: "blur(60px)",
          x: useTransform(x, [-1, 1], ["10%", "-60%"]),
          y: useTransform(y, [-1, 1], ["10%", "-60%"]),
          translateX: "-50%",
          translateY: "-50%",
          zIndex: -2,
        }}
      />
    </div>
  );
}
