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
          zIndex: -4,
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
          zIndex: -3,
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
          zIndex: -3,
        }}
      />
      
      {/* Partículas Flotantes */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: Math.random() * 4 + 1 + "px",
            height: Math.random() * 4 + 1 + "px",
            backgroundColor: "var(--color-ink)",
            borderRadius: "50%",
            opacity: Math.random() * 0.15 + 0.05,
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            zIndex: -2,
          }}
          animate={{
            y: [0, Math.random() * -100 - 50],
            x: [0, (Math.random() - 0.5) * 50],
            opacity: [0, Math.random() * 0.15 + 0.05, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * -20,
          }}
        />
      ))}

      {/* Noise Overlay */}
      <div 
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.05,
          zIndex: -1,
          pointerEvents: "none",
          mixBlendMode: "overlay"
        }}
      />
    </div>
  );
}
