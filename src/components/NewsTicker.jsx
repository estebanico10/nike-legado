import { useState } from "react";
import { motion } from "framer-motion";

const ITEMS = [
  "🆕 Nueva Colección — Quito 2025",
  "🇪🇨 Herencia Ecuatoriana × Streetwear Global",
  "⚡ Edición Limitada — Solo 50 Unidades",
  "🎨 Pixel Art 16-Bit en Cada Prenda",
  "📦 Envíos a Todo Ecuador",
  "🌋 Diseñado en los Andes — Hecho para el Mundo",
];

export default function NewsTicker({ variant = "dark" }) {
  const isDark = variant === "dark";
  const [isHovered, setIsHovered] = useState(false);

  const repeatedItems = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{ skewX: isHovered ? -5 : 0, scale: isHovered ? 1.02 : 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        backgroundColor: isDark ? "var(--color-ink)" : "var(--color-volt)",
        color: isDark ? "var(--color-volt)" : "var(--color-ink)",
        overflow: "hidden",
        padding: "var(--space-sm) 0",
        borderTop: `1px solid ${isDark ? "transparent" : "rgba(0,0,0,0.1)"}`,
        borderBottom: `1px solid ${isDark ? "transparent" : "rgba(0,0,0,0.1)"}`,
        cursor: "default"
      }}
    >
      <motion.div
        style={{
          display: "flex",
          gap: "var(--space-3xl)",
          whiteSpace: "nowrap",
          width: "max-content",
        }}
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{
          duration: 28,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {repeatedItems.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--type-caption)",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-lg)",
            }}
          >
            {item}
            <span
              style={{
                width: "4px",
                height: "4px",
                backgroundColor: "currentColor",
                borderRadius: "50%",
                opacity: 0.4,
                flexShrink: 0,
              }}
            />
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
