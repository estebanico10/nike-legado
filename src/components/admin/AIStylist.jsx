import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StylistChat from "../ui/StylistChat";

export default function AIStylist() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="admin-glass-panel" style={{ padding: "40px", minHeight: "600px", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "30px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "20px" }}>
        <h2 className="admin-card-title" style={{ display: "flex", alignItems: "center", gap: "12px", margin: 0 }}>
          <span style={{ color: "var(--color-volt)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
          </span>
          Nike AI Stylist (Beta)
        </h2>
        <p style={{ color: "#888", fontSize: "14px", marginTop: "8px", maxWidth: "600px" }}>
          Un asesor virtual de moda impulsado por inteligencia artificial. El asistente conoce todo el catálogo de Nike Legado y recomienda combinaciones perfectas según la ocasión y el perfil del usuario.
        </p>
      </div>

      {!isActive ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}
        >
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(206, 255, 0, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-volt)" strokeWidth="1.5"><path d="M12 2a10 10 0 0 1 10 10v7a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a8 8 0 1 0-16 0h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7A10 10 0 0 1 12 2z"></path></svg>
          </div>
          <h3 style={{ fontSize: "20px", color: "#FFF", marginBottom: "12px", fontFamily: "var(--font-display)", textTransform: "uppercase" }}>Iniciar Sesión de Estilo</h3>
          <p style={{ color: "#777", marginBottom: "30px", maxWidth: "400px" }}>
            Inicia una simulación para probar cómo interactúan los clientes con el AI Stylist para obtener recomendaciones personalizadas de ropa y sneakers.
          </p>
          <button 
            onClick={() => setIsActive(true)}
            style={{ 
              background: "var(--color-volt)", 
              color: "#000", 
              border: "none", 
              padding: "12px 32px", 
              borderRadius: "30px", 
              fontFamily: "var(--font-display)", 
              fontWeight: 700, 
              fontSize: "14px", 
              textTransform: "uppercase", 
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(206, 255, 0, 0.3)"
            }}
          >
            Conectar AI Stylist
          </button>
        </motion.div>
      ) : (
        <StylistChat onClose={() => setIsActive(false)} />
      )}
    </div>
  );
}
