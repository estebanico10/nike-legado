import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { resolveAsset } from "../utils/resolveAsset";
import OptimizedImage from "./OptimizedImage";

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { productos } = useProducts();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const results = query.length > 1 
    ? productos.filter(p => p.nombre.toLowerCase().includes(query.toLowerCase()) || p.categoria.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/tienda?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "var(--color-canvas)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="container" style={{ paddingTop: "var(--space-2xl)", paddingBottom: "var(--space-md)", borderBottom: "1px solid var(--color-ink-muted)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-md)" }}>
              <span style={{ fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "var(--type-caption)" }}>
                Búsqueda
              </span>
              <button 
                onClick={onClose}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-ink)", padding: "var(--space-xs)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-soft)" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar zapatillas, ropa, colecciones..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 5vw, 48px)",
                  textTransform: "uppercase",
                }}
              />
            </form>
          </div>

          <div className="container" style={{ flex: 1, overflowY: "auto", padding: "var(--space-xl) 0" }}>
            {query.length === 0 && (
              <div>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body-sm)", textTransform: "uppercase", color: "var(--color-ink-soft)", marginBottom: "var(--space-md)" }}>Búsquedas Populares</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
                  {["Air Max", "Jordan 1", "Running", "Ropa de Entrenamiento", "Dunk Low"].map(term => (
                    <button 
                      key={term}
                      onClick={() => setQuery(term)}
                      style={{ background: "var(--color-surface)", border: "1px solid var(--color-ink-muted)", padding: "8px 16px", borderRadius: "100px", color: "var(--color-ink)", fontSize: "var(--type-caption)", cursor: "pointer", transition: "all 0.2s" }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query.length > 1 && results.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--color-ink-soft)", paddingTop: "var(--space-3xl)" }}>
                No se encontraron resultados para "{query}"
              </div>
            )}
            
            {results.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "var(--space-lg)" }}>
                {results.slice(0, 10).map((producto, idx) => (
                  <motion.div 
                    key={producto.id} 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    onClick={() => { onClose(); navigate(`/producto/${producto.id}`); }}
                    style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div style={{ aspectRatio: "1/1", backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--color-ink-muted)", position: "relative" }}>
                      <OptimizedImage src={resolveAsset(producto.imagenes[0])} alt={producto.nombre} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }} className="search-result-img" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "var(--type-body-sm)", textTransform: "uppercase", color: "var(--color-ink)", fontWeight: 600 }}>{producto.nombre}</h4>
                      <p style={{ margin: "2px 0 0", fontSize: "var(--type-caption)", color: "var(--color-volt)", fontWeight: 700 }}>${producto.precio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {results.length > 10 && (
              <div style={{ textAlign: "center", marginTop: "var(--space-2xl)" }}>
                <button 
                  onClick={handleSearch}
                  style={{
                    background: "var(--color-ink)",
                    color: "var(--color-canvas)",
                    border: "none",
                    padding: "var(--space-sm) var(--space-xl)",
                    borderRadius: "var(--radius-full)",
                    fontFamily: "var(--font-body)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                  }}
                >
                  Ver todos los resultados
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
