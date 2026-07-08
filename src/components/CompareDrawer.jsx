import { motion, AnimatePresence } from "framer-motion";
import { useCompareStore } from "../store/useStore";
import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";
import { resolveAsset } from "../utils/resolveAsset";

export default function CompareDrawer() {
  const { compareItems, removeFromCompare, clearCompare } = useCompareStore();

  if (compareItems.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "var(--color-canvas)",
          borderTop: "1px solid var(--color-ink-muted)",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.1)",
          zIndex: 1000,
          padding: "var(--space-md) 0",
        }}
      >
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-sm)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", textTransform: "uppercase", margin: 0 }}>
              Comparar Productos ({compareItems.length}/3)
            </h3>
            <button 
              onClick={clearCompare}
              style={{ background: "none", border: "none", color: "var(--color-ink-soft)", textDecoration: "underline", cursor: "pointer", fontSize: "var(--type-caption)" }}
            >
              Limpiar todo
            </button>
          </div>

          <div style={{ display: "flex", gap: "var(--space-md)", overflowX: "auto", paddingBottom: "var(--space-sm)" }}>
            {compareItems.map(item => (
              <div key={item.id} style={{ flex: "1", minWidth: "250px", backgroundColor: "var(--color-canvas-alt)", padding: "var(--space-sm)", borderRadius: "var(--radius-sm)", position: "relative" }}>
                <button 
                  onClick={() => removeFromCompare(item.id)}
                  style={{ position: "absolute", top: "8px", right: "8px", background: "var(--color-ink)", color: "var(--color-canvas)", border: "none", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2 }}
                >
                  &times;
                </button>
                <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center", marginBottom: "var(--space-sm)" }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "4px", overflow: "hidden", backgroundColor: "#f0f0f0" }}>
                    <OptimizedImage src={resolveAsset(item.imagenes[0])} alt={item.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "var(--type-caption)", fontWeight: 600 }}>{item.nombre}</h4>
                    <span style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)" }}>${item.precioOferta || item.precio}</span>
                  </div>
                </div>
                
                {/* Specifications List */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-ink-soft)" }}>Categoría:</span> <b>{item.categoria}</b></li>
                  <li style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-ink-soft)" }}>Amortiguación:</span> <b>{item.tipo === 'zapatilla' ? 'React/Zoom' : 'N/A'}</b></li>
                  <li style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-ink-soft)" }}>Materiales:</span> <b>Flyknit / Reciclado</b></li>
                </ul>

                <Link to={`/producto/${item.id}`} className="btn btn--secondary" style={{ width: "100%", marginTop: "var(--space-sm)", fontSize: "12px", padding: "8px" }}>
                  Ver Detalles
                </Link>
              </div>
            ))}

            {/* Empty slots placeholders */}
            {[...Array(3 - compareItems.length)].map((_, i) => (
              <div key={`empty-${i}`} style={{ flex: "1", minWidth: "250px", border: "2px dashed var(--color-ink-muted)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", color: "var(--color-ink-soft)", fontSize: "var(--type-caption)" }}>
                Añadir producto
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
