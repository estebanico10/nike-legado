import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";

export default function AdminAuth({ children }) {
  const { user, login, error, clearError } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular un pequeño delay de red para efecto UX
    await new Promise(r => setTimeout(r, 600));
    
    const success = login(username, password);
    setLoading(false);
    
    if (success) {
      sessionStorage.setItem("adminAuth", "true");
    }
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
            <p style={{ color: "#757575", fontSize: "var(--type-body-sm)", marginTop: "var(--space-xs)" }}>Ingresa tus credenciales de administrador</p>
          </div>

          <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            {error && (
              <div style={{ padding: "var(--space-sm)", backgroundColor: "rgba(211, 0, 5, 0.1)", border: "1px solid #D30005", borderRadius: "var(--radius-sm)", color: "#D30005", fontSize: "var(--type-body-sm)", textAlign: "center" }}>
                {error}
              </div>
            )}
            
            <div>
              <label className="admin-label" style={{ color: "#A0A0A0", fontSize: "var(--type-caption)", marginBottom: "var(--space-xs)", display: "block" }}>Usuario</label>
              <input 
                type="text" 
                className="admin-input" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: "100%", padding: "12px", backgroundColor: "#1A1A1A", border: "1px solid #333", color: "#F5F5F5", borderRadius: "var(--radius-sm)" }}
                placeholder="Ej. estebanico10"
              />
            </div>

            <div>
              <label className="admin-label" style={{ color: "#A0A0A0", fontSize: "var(--type-caption)", marginBottom: "var(--space-xs)", display: "block" }}>Contraseña</label>
              <input 
                type="password" 
                className="admin-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "12px", backgroundColor: "#1A1A1A", border: "1px solid #333", color: "#F5F5F5", borderRadius: "var(--radius-sm)" }}
                placeholder="••••••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn--volt" style={{ padding: "14px", width: "100%", marginTop: "var(--space-sm)", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Verificando..." : "Iniciar Sesión ⚡"}
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
