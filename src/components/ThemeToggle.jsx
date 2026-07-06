import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem("nike-legado-theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    const saved = localStorage.getItem("nike-legado-theme");
    if (saved === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("nike-legado-theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Alternar tema claro/oscuro"
      style={{
        position: "relative",
        width: "48px",
        height: "24px",
        borderRadius: "var(--radius-md)",
        backgroundColor: isDark ? "var(--color-ink)" : "var(--color-canvas-alt)",
        border: "1.5px solid var(--color-ink-muted)",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "var(--radius-sm)",
          backgroundColor: isDark ? "var(--color-canvas)" : "var(--color-ink)",
          position: "absolute",
          top: "2px",
          left: isDark ? "26px" : "2px",
        }}
      />
    </button>
  );
}
