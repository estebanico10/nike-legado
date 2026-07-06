import { motion } from "framer-motion";

export default function Skeleton({ width = "100%", height = "100%", style = {}, borderRadius = "var(--radius-none)" }) {
  return (
    <motion.div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: "var(--color-canvas-alt)",
        position: "relative",
        overflow: "hidden",
        ...style
      }}
    >
      <motion.div
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />
    </motion.div>
  );
}
