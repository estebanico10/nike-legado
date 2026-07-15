import { motion } from "framer-motion";

export default function PageLoadingIndicator() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 99990,
        pointerEvents: "none",
      }}
    >
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: ["0%", "70%", "95%"] }}
        transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity }}
        style={{
          height: "3px",
          backgroundColor: "var(--color-volt)",
          boxShadow: "0 0 10px var(--color-volt)",
        }}
      />
    </div>
  );
}
