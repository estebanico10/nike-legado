import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SizeRecommender() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ height: 170, weight: 70, fit: "regular" });
  const [recommendedSize, setRecommendedSize] = useState(null);

  const calculateSize = () => {
    let size = "M";
    const score = data.height + data.weight * 2;
    
    if (score < 280) size = "S";
    else if (score > 340) size = "L";
    else if (score > 380) size = "XL";

    if (data.fit === "loose" && size !== "XL") {
      size = size === "S" ? "M" : size === "M" ? "L" : "XL";
    }
    if (data.fit === "tight" && size !== "S") {
      size = size === "XL" ? "L" : size === "L" ? "M" : "S";
    }
    
    setRecommendedSize(size);
    setStep(4);
  };

  return (
    <div style={{ marginBottom: "var(--space-lg)" }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: "none", border: "1px dashed var(--color-ink)", 
          padding: "8px 16px", borderRadius: "100px", 
          display: "flex", alignItems: "center", gap: "8px", 
          cursor: "pointer", fontSize: "var(--type-micro)", 
          fontWeight: 600, textTransform: "uppercase" 
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.13 15.57a9 9 0 1 0 3.87-10.43L2 12"></path></svg>
        Descubre tu talla ideal
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
                  <p style={{ fontSize: "var(--type-caption)", marginBottom: "8px" }}>¿Cuánto mides? ({data.height} cm)</p>
                  <input type="range" min="140" max="210" value={data.height} onChange={(e) => setData({...data, height: parseInt(e.target.value)})} style={{ width: "100%", marginBottom: "12px" }} />
                  <button className="btn btn--secondary btn--sm" onClick={() => setStep(2)}>Siguiente</button>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p style={{ fontSize: "var(--type-caption)", marginBottom: "8px" }}>¿Cuánto pesas? ({data.weight} kg)</p>
                  <input type="range" min="40" max="120" value={data.weight} onChange={(e) => setData({...data, weight: parseInt(e.target.value)})} style={{ width: "100%", marginBottom: "12px" }} />
                  <button className="btn btn--secondary btn--sm" onClick={() => setStep(3)}>Siguiente</button>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p style={{ fontSize: "var(--type-caption)", marginBottom: "8px" }}>¿Cómo te gusta el ajuste?</p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    {['tight', 'regular', 'loose'].map(f => (
                      <button 
                        key={f}
                        onClick={() => setData({...data, fit: f})}
                        style={{ padding: "6px 12px", border: `1px solid ${data.fit === f ? "var(--color-ink)" : "var(--color-ink-muted)"}`, background: data.fit === f ? "var(--color-ink)" : "transparent", color: data.fit === f ? "var(--color-canvas)" : "var(--color-ink)", fontSize: "var(--type-micro)", cursor: "pointer", flex: 1 }}
                      >
                        {f === 'tight' ? 'Ajustado' : f === 'loose' ? 'Suelto' : 'Regular'}
                      </button>
                    ))}
                  </div>
                  <button className="btn btn--volt btn--sm" onClick={calculateSize}>Ver Recomendación</button>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "var(--space-sm) 0" }}>
                  <p style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)" }}>Te recomendamos la talla:</p>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-volt)", margin: "8px 0" }}>{recommendedSize}</h3>
                  <button style={{ background: "none", border: "none", textDecoration: "underline", color: "var(--color-ink)", cursor: "pointer", fontSize: "var(--type-micro)" }} onClick={() => setStep(1)}>Volver a calcular</button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
