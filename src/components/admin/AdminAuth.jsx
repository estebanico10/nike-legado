import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminAuth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("adminAuth") === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "JesusesVida.10") {
      sessionStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-md)" }}>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="glass-card"
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "var(--space-2xl)",
            borderRadius: "var(--radius-lg)",
            backgroundColor: "#111111",
            border: "1px solid #222",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div style={{ marginBottom: "var(--space-xl)", textAlign: "center" }}>
            <div style={{ 
              width: "48px", 
              height: "48px", 
              backgroundColor: "var(--color-volt)", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              margin: "0 auto var(--space-md)",
              color: "#111"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", color: "#F5F5F5", textTransform: "uppercase" }}>Acceso Restringido</h1>
            <p style={{ color: "#757575", fontSize: "var(--type-body-sm)", marginTop: "var(--space-xs)" }}>Ingresa la contraseña para continuar</p>
          </div>

          <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                autoFocus
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: error ? "1px solid var(--color-error, #ff3333)" : "1px solid #333",
                  backgroundColor: "#1A1A1A",
                  color: "#F5F5F5",
                  outline: "none",
                  fontSize: "var(--type-body)",
                  fontFamily: "monospace"
                }}
              />
              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    style={{ color: "var(--color-error, #ff3333)", fontSize: "var(--type-micro)", marginTop: "8px", fontWeight: 500 }}
                  >
                    Contraseña incorrecta
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            
            <button type="submit" className="btn btn--volt" style={{ padding: "14px", width: "100%" }}>
              Entrar
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
