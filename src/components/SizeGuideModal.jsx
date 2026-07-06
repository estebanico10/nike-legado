import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SizeGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("hombres");

  const sizeData = {
    hombres: [
      { size: "S", chest: "88-96", waist: "73-81", hips: "88-96" },
      { size: "M", chest: "96-104", waist: "81-89", hips: "96-104" },
      { size: "L", chest: "104-112", waist: "89-97", hips: "104-112" },
      { size: "XL", chest: "112-124", waist: "97-109", hips: "112-120" }
    ],
    mujeres: [
      { size: "XS", chest: "76-83", waist: "60-67", hips: "84-91" },
      { size: "S", chest: "83-90", waist: "67-74", hips: "91-98" },
      { size: "M", chest: "90-97", waist: "74-81", hips: "98-105" },
      { size: "L", chest: "97-104", waist: "81-88", hips: "105-112" }
    ]
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 9999
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "600px",
              backgroundColor: "var(--color-canvas)",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              zIndex: 10000,
              overflow: "hidden"
            }}
          >
            <div style={{ padding: "var(--space-xl)", borderBottom: "1px solid var(--color-ink-muted)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", fontWeight: 700, margin: 0, color: "var(--color-ink)", textTransform: "uppercase" }}>
                Guía de Tallas
              </h3>
              <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-ink-soft)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div style={{ padding: "var(--space-xl)" }}>
              <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
                <button
                  onClick={() => setActiveTab("hombres")}
                  className={activeTab === "hombres" ? "btn btn--primary" : "btn btn--secondary"}
                  style={{ flex: 1 }}
                >
                  Hombres
                </button>
                <button
                  onClick={() => setActiveTab("mujeres")}
                  className={activeTab === "mujeres" ? "btn btn--primary" : "btn btn--secondary"}
                  style={{ flex: 1 }}
                >
                  Mujeres
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "var(--type-body-sm)" }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--color-canvas-alt)", color: "var(--color-ink)" }}>
                      <th style={{ padding: "var(--space-sm)", textAlign: "left", borderBottom: "2px solid var(--color-ink-muted)" }}>Talla</th>
                      <th style={{ padding: "var(--space-sm)", textAlign: "left", borderBottom: "2px solid var(--color-ink-muted)" }}>Pecho (cm)</th>
                      <th style={{ padding: "var(--space-sm)", textAlign: "left", borderBottom: "2px solid var(--color-ink-muted)" }}>Cintura (cm)</th>
                      <th style={{ padding: "var(--space-sm)", textAlign: "left", borderBottom: "2px solid var(--color-ink-muted)" }}>Cadera (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData[activeTab].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--color-ink-muted)" }}>
                        <td style={{ padding: "var(--space-sm)", fontWeight: 600, color: "var(--color-ink)" }}>{row.size}</td>
                        <td style={{ padding: "var(--space-sm)", color: "var(--color-ink-soft)" }}>{row.chest}</td>
                        <td style={{ padding: "var(--space-sm)", color: "var(--color-ink-soft)" }}>{row.waist}</td>
                        <td style={{ padding: "var(--space-sm)", color: "var(--color-ink-soft)" }}>{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={{ marginTop: "var(--space-lg)", fontSize: "var(--type-micro)", color: "var(--color-ink-soft)", fontFamily: "var(--font-body)", textAlign: "center" }}>
                *Las medidas son aproximadas. Si estás entre dos tallas, pide la menor para un ajuste más ceñido o la mayor para un ajuste más holgado.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
