import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";

export default function AdminAuth({ children }) {
  const { user, login } = useAuthStore();
  
  const handleLogin = (role) => {
    login({ name: `Demo ${role}` }, role);
    sessionStorage.setItem("adminAuth", "true");
  };

  if (user) {
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
            <p style={{ color: "#757575", fontSize: "var(--type-body-sm)", marginTop: "var(--space-xs)" }}>Selecciona un rol para ingresar</p>
          </div>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <button onClick={() => handleLogin('Super Admin')} className="btn btn--volt" style={{ padding: "14px", width: "100%" }}>
              ⚡ Demo Login: Super Admin
            </button>
            <button onClick={() => handleLogin('Analista')} className="btn" style={{ padding: "14px", width: "100%", backgroundColor: "#333", color: "#fff", border: "none" }}>
              ⚡ Demo Login: Analista
            </button>
            <button onClick={() => handleLogin('Moderador')} className="btn" style={{ padding: "14px", width: "100%", backgroundColor: "#333", color: "#fff", border: "none" }}>
              ⚡ Demo Login: Moderador
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
