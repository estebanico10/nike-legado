import { useRef, Suspense, lazy } from "react";
const HeroScene = lazy(() => import("./3d/HeroScene"));
import HeroTypography from "./ui/HeroTypography";
import { motion } from "framer-motion";

export default function HeroSection() {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "var(--color-ink)", // Dark theme background
      }}
    >
      <Suspense fallback={<div style={{ position: 'absolute', inset: 0, background: '#0a0a0a' }} />}>
        <HeroScene />
      </Suspense>
      <HeroTypography />
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          position: "absolute",
          bottom: "var(--space-2xl)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-sm)",
          zIndex: 20
        }}
      >
        <span style={{
          fontFamily: "var(--font-body)", fontSize: "var(--type-micro)",
          textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-ink-soft)"
        }}>
          SCROLL TO EXPLORE
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          style={{ width: "2px", height: "40px", backgroundColor: "var(--color-volt)", borderRadius: "2px" }}
        />
      </motion.div>
    </section>
  );
}
