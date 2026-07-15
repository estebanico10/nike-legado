import { motion } from "framer-motion";

export default function MarqueeText() {
  return (
    <div style={{
      width: "100vw", marginLeft: "calc(-50vw + 50%)", overflow: "hidden", backgroundColor: "var(--color-volt)", color: "#111",
      padding: "var(--space-md) 0", borderTop: "2px solid var(--color-ink)", borderBottom: "2px solid var(--color-ink)",
      display: "flex", whiteSpace: "nowrap", alignItems: "center", marginBottom: "var(--space-4xl)"
    }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
        style={{ display: "flex", gap: "var(--space-2xl)", paddingRight: "var(--space-2xl)" }}
      >
        {Array(10).fill("STREETWEAR ECUATORIANO ✦ MINIMALISMO ABSOLUTO ✦ HERENCIA ANDINA ✦ ").map((text, i) => (
          <span key={i} style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{text}</span>
        ))}
      </motion.div>
    </div>
  );
}
