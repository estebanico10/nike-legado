import { motion } from "framer-motion";

export default function PageTransition({ children, transitionKey }) {
  return (
    <>
      <motion.div
        key={transitionKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        {children}
      </motion.div>

      {/* Curtain effect */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "var(--color-volt)",
          zIndex: 9999,
          transformOrigin: "bottom",
          pointerEvents: "none"
        }}
      />
    </>
  );
}
