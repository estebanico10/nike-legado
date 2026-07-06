import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";

export default function NewsletterModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState([]);
  const { addToast } = useToast();

  const togglePref = (pref) => {
    if (preferences.includes(pref)) {
      setPreferences(preferences.filter(p => p !== pref));
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!email) return;
    setStep(2);
  };

  const handleSubmit = () => {
    addToast("¡Suscripción exitosa! Revisa tu bandeja de entrada.", "success");
    onClose();
    setTimeout(() => {
      setStep(1);
      setEmail("");
      setPreferences([]);
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 99999, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            style={{ width: "100%", maxWidth: "500px", backgroundColor: "var(--color-canvas)", borderRadius: "16px", padding: "32px", position: "relative" }}
          >
            <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "var(--color-ink)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {step === 1 ? (
              <form onSubmit={handleNext}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", textTransform: "uppercase", marginBottom: "8px" }}>Únete al Legado</h3>
                <p style={{ color: "var(--color-ink-soft)", marginBottom: "24px" }}>Ingresa tu correo para recibir acceso exclusivo.</p>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com" 
                  required
                  style={{ width: "100%", padding: "16px", border: "1px solid var(--color-ink-muted)", borderRadius: "8px", marginBottom: "16px", fontSize: "16px" }}
                />
                <button type="submit" className="btn btn--primary" style={{ width: "100%" }}>Siguiente</button>
              </form>
            ) : (
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", textTransform: "uppercase", marginBottom: "8px" }}>¿Qué te interesa?</h3>
                <p style={{ color: "var(--color-ink-soft)", marginBottom: "24px" }}>Personalizaremos tus correos basados en esto.</p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                  {["Calzado Deportivo", "Calzado Casual", "Ropa de Entrenamiento", "Accesorios"].map(pref => (
                    <button 
                      key={pref}
                      onClick={() => togglePref(pref)}
                      style={{ 
                        padding: "16px", 
                        border: preferences.includes(pref) ? "2px solid var(--color-volt)" : "1px solid var(--color-ink-muted)", 
                        borderRadius: "8px", 
                        background: preferences.includes(pref) ? "var(--color-ink)" : "transparent",
                        color: preferences.includes(pref) ? "var(--color-canvas)" : "var(--color-ink)",
                        textAlign: "left",
                        cursor: "pointer",
                        fontWeight: preferences.includes(pref) ? "bold" : "normal",
                        transition: "all 0.2s"
                      }}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
                
                <button onClick={handleSubmit} className="btn btn--primary" style={{ width: "100%" }}>Completar Registro</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
