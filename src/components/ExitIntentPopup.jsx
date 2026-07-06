import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    // Check if already shown this session
    if (sessionStorage.getItem("exitIntentShown")) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API call
    setTimeout(() => {
      addToast("¡Gracias! Revisa tu correo para tu cupón del 10%.", "success");
      setIsOpen(false);
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(6px)",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "var(--space-md)"
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card"
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "600px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--color-ink)",
                color: "var(--color-canvas)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.5)"
              }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsOpen(false)} 
                style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.1)", border: "none", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--color-canvas)", zIndex: 10 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* Image Section */}
                <div style={{ height: "200px", width: "100%", backgroundColor: "var(--color-ink)", overflow: "hidden", position: "relative" }}>
                   <div style={{ position: "absolute", inset: 0, background: "linear-gradient(45deg, var(--color-ink), var(--color-indoor-blue))", opacity: 0.8 }} />
                   <img src="https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&w=800&q=80" alt="Nike Lifestyle" style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "overlay" }} />
                   <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                     <h2 style={{ fontFamily: "var(--font-display)", fontSize: "4rem", fontWeight: 800, margin: 0, color: "var(--color-volt)", textTransform: "uppercase", lineHeight: 1 }}>10% OFF</h2>
                     <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", textTransform: "uppercase", letterSpacing: "0.2em" }}>EN TU PRIMERA COMPRA</span>
                   </div>
                </div>

                {/* Form Section */}
                <div style={{ padding: "var(--space-2xl)", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body-sm)", color: "rgba(255,255,255,0.7)", marginBottom: "var(--space-xl)", lineHeight: 1.5 }}>
                    Únete a nuestra lista VIP y recibe acceso anticipado a drops exclusivos, eventos y un cupón de descuento en tu primer pedido.
                  </p>

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                    <input 
                      type="email" 
                      placeholder="Tu correo electrónico" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ 
                        width: "100%", 
                        padding: "16px", 
                        borderRadius: "var(--radius-sm)", 
                        border: "1px solid rgba(255,255,255,0.2)", 
                        backgroundColor: "rgba(255,255,255,0.05)", 
                        color: "var(--color-canvas)",
                        fontSize: "var(--type-body)",
                        outline: "none"
                      }} 
                    />
                    <button type="submit" className="btn btn--volt" style={{ padding: "16px", fontSize: "var(--type-body-sm)", fontWeight: 700, borderRadius: "var(--radius-sm)" }}>
                      RECLAMAR MI 10%
                    </button>
                  </form>
                  <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "var(--type-micro)", marginTop: "var(--space-lg)", cursor: "pointer", textDecoration: "underline" }}>
                    No, prefiero pagar precio completo
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
