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
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggle}
      aria-label="Alternar tema claro/oscuro"
      style={{
        position: "relative",
        width: "56px",
        height: "28px",
        borderRadius: "var(--radius-full)",
        backgroundColor: "var(--color-canvas-alt)",
        border: "1px solid var(--color-ink-muted)",
        cursor: "pointer",
        padding: "2px",
        display: "flex",
        alignItems: "center",
        justifyContent: isDark ? "flex-end" : "flex-start",
      }}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "var(--radius-full)",
          backgroundColor: isDark ? "var(--color-volt)" : "var(--color-ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isDark ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-canvas)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        )}
      </motion.div>
    </motion.button>
  );
}
