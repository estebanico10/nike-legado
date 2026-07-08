import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SizeRecommender() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ brand: "Adidas", size: 40 });
  const [recommendedSize, setRecommendedSize] = useState(null);

  const calculateSize = () => {
    let size = data.size;
    // Mock logic for Fit Predictor
    if (data.brand === "Adidas") size += 0.5;
    else if (data.brand === "Puma") size -= 0.5;
    else if (data.brand === "Reebok") size += 1;
    
    setRecommendedSize(size);
    setStep(3);
  };

  return (
    <div style={{ marginBottom: "var(--space-lg)" }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: "var(--color-ink)", border: "none", color: "var(--color-canvas)",
          padding: "8px 16px", borderRadius: "100px", 
          display: "flex", alignItems: "center", gap: "8px", 
          cursor: "pointer", fontSize: "var(--type-micro)", 
          fontWeight: 600, textTransform: "uppercase", width: "100%", justifyContent: "center"
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        Fit Predictor (Talla Ideal)
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginTop: "var(--space-sm)" }}
          >
            <div style={{ backgroundColor: "var(--color-canvas-alt)", padding: "var(--space-md)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-ink-muted)" }}>
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p style={{ fontSize: "var(--type-caption)", marginBottom: "8px", fontWeight: 600 }}>¿Qué marca usas normalmente?</p>
                  <select 
                    value={data.brand} 
                    onChange={(e) => setData({...data, brand: e.target.value})} 
                    style={{ width: "100%", padding: "8px", marginBottom: "12px", borderRadius: "4px", border: "1px solid #ccc" }}
                  >
                    <option value="Adidas">Adidas</option>
                    <option value="Puma">Puma</option>
                    <option value="Reebok">Reebok</option>
                    <option value="New Balance">New Balance</option>
                    <option value="Otras">Otras</option>
                  </select>
                  <button className="btn btn--secondary btn--sm" style={{ width: "100%" }} onClick={() => setStep(2)}>Siguiente</button>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p style={{ fontSize: "var(--type-caption)", marginBottom: "8px", fontWeight: 600 }}>¿Qué talla eres en {data.brand}?</p>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
                    <input 
                      type="range" min="35" max="48" step="0.5" 
                      value={data.size} 
                      onChange={(e) => setData({...data, size: parseFloat(e.target.value)})} 
                      style={{ flex: 1, accentColor: "var(--color-ink)" }} 
                    />
                    <span style={{ fontWeight: "bold", fontSize: "16px" }}>{data.size}</span>
                  </div>
                  <button className="btn btn--volt btn--sm" style={{ width: "100%" }} onClick={calculateSize}>Ver Recomendación</button>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "var(--space-sm) 0" }}>
                  <p style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)" }}>Tu talla ideal en Nike es:</p>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", color: "var(--color-volt)", margin: "8px 0", WebkitTextStroke: "1px black" }}>{recommendedSize}</h3>
                  <p style={{ fontSize: "12px", color: "gray", fontStyle: "italic" }}>Basado en el ajuste de este modelo específico.</p>
                  <button style={{ background: "none", border: "none", textDecoration: "underline", color: "var(--color-ink)", cursor: "pointer", fontSize: "var(--type-micro)", marginTop: "12px" }} onClick={() => setStep(1)}>Volver a calcular</button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
