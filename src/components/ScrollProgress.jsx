import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        backgroundColor: "var(--color-volt)",
        transformOrigin: "0%",
        scaleX: scrollYProgress,
        zIndex: 9999, // Above everything
      }}
    />
  );
}
