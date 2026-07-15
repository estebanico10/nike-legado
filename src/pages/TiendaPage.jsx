import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useWishlistStore, useRecentStore } from "../store/useStore";
import ProductCard from "../components/ProductCard";
import ProductQuickView from "../components/ProductQuickView";
import AnimatedBackground from "../components/AnimatedBackground";
import CompareDrawer from "../components/CompareDrawer";
import SEO from "../components/SEO";

function CountUp({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(Math.round(v))
    });
    return controls.stop;
  }, [value]);

  return <span>{displayValue}</span>;
}

export default function TiendaPage() {
  const { productos, categorias, tiposProducto } = useProducts();
  const { items: wishlist } = useWishlistStore();
  const { recentProducts } = useRecentStore();
  const [searchParams] = useSearchParams();
  const [filtroActivo, setFiltroActivo] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState(null);
  const [orden, setOrden] = useState("default"); // default, precio_asc, precio_desc, ventas
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [filtroColor, setFiltroColor] = useState(null);
  const [maxPrecio, setMaxPrecio] = useState(200);
  const [visibleCount, setVisibleCount] = useState(12);
  const [layoutMode, setLayoutMode] = useState("grid3"); // grid2, grid3, list

  const query = searchParams.get("q") || "";
  const isWishlistMode = searchParams.get("filter") === "wishlist";

  const productosFiltrados = useMemo(() => {
    return productos
      .filter((p) => {
        if (isWishlistMode) return wishlist.some((w) => w.id === p.id);
        if (query) return p.nombre.toLowerCase().includes(query.toLowerCase()) || p.categoria.toLowerCase().includes(query.toLowerCase());
        return true;
      })
      .filter((p) => (filtroActivo ? p.categoria === filtroActivo : true))
      .filter((p) => (filtroTipo ? p.tipo === filtroTipo : true))
      .filter((p) => (filtroColor ? p.colores?.includes(filtroColor) : true))
      .filter((p) => (p.precioOferta || p.precio) <= maxPrecio)
      .map(p => ({ ...p, ventas: p.ventas || ((p.id.charCodeAt(0) * 17) % 50) })) // mock ventas for sorting
      .sort((a, b) => {
        const pA = a.precioOferta || a.precio;
        const pB = b.precioOferta || b.precio;
        if (orden === "precio_asc") return pA - pB;
        if (orden === "precio_desc") return pB - pA;
        if (orden === "ventas") return b.ventas - a.ventas;
        return 0; // default
      });
  }, [productos, wishlist, isWishlistMode, query, filtroActivo, filtroTipo, filtroColor, maxPrecio, orden]);

  // Extract all unique colors
  const coloresDisponibles = useMemo(() => {
    const colors = new Set();
    productos.forEach(p => {
      if (p.colores) p.colores.forEach(c => colors.add(c));
    });
    return Array.from(colors);
  }, [productos]);

  return (
    <>
      <SEO title="Tienda" description="Explora nuestra colección de ropa, zapatos y accesorios con el estilo único del fútbol callejero ecuatoriano." />
      <AnimatedBackground />
      <main style={{ paddingTop: "var(--space-3xl)", paddingBottom: "var(--space-5xl)", position: "relative", zIndex: 1 }}>
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: "var(--space-2xl)",
              flexWrap: "wrap",
              gap: "var(--space-md)",
            }}
          >
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
                hidden: {}
              }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--type-h2)",
                lineHeight: "var(--lh-h2)",
                fontWeight: 700,
                letterSpacing: "var(--tracking-tight)",
                textTransform: "uppercase",
                color: "var(--color-ink)",
                display: "flex",
                overflow: "hidden"
              }}
            >
              {Array.from(isWishlistMode ? "FAVORITOS" : (query ? `RESULTADOS` : "COLECCIÓN")).map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { y: "100%", opacity: 0 },
                    visible: { y: "0%", opacity: 1, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } }
                  }}
                  whileHover={{ color: "var(--color-volt)", y: -5 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--type-body-sm)",
                color: "var(--color-ink-soft)",
              }}
            >
              {query && <span style={{display:"block", marginBottom:"4px"}}>Resultados para "{query}"</span>}
              <CountUp value={productosFiltrados.length} />{" "}
              {productosFiltrados.length === 1 ? "producto" : "productos"}
            </p>
          </motion.div>

          {/* Filters and Sorting */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", marginBottom: "var(--space-2xl)" }}>
            
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "var(--space-md)", alignItems: "center" }}>
              {/* Categorías */}
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-xs)",
                  overflowX: "auto",
                  paddingBottom: "var(--space-2xs)",
                  scrollbarWidth: "none"
                }}
              >
                <button
                  onClick={() => setFiltroActivo(null)}
                  className={`btn ${filtroActivo === null ? "btn--primary" : "btn--secondary"}`}
                  style={{ whiteSpace: "nowrap", fontSize: "var(--type-caption)", padding: "8px 16px", borderRadius: "999px", transition: "all 0.3s ease" }}
                >
                  Todas las categorías
                </button>
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFiltroActivo(cat)}
                    className="btn btn--secondary"
                    style={{ 
                      whiteSpace: "nowrap", 
                      fontSize: "var(--type-caption)", 
                      padding: "8px 16px", 
                      borderRadius: "999px", 
                      transition: "all 0.3s ease",
                      border: filtroActivo === cat ? "1px solid var(--color-ink)" : "1px solid var(--color-ink-muted)",
                      backgroundColor: filtroActivo === cat ? "var(--color-ink)" : "transparent",
                      color: filtroActivo === cat ? "var(--color-canvas)" : "var(--color-ink)",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Ordenamiento y Layout */}
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                  <label style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", fontWeight: 500, textTransform: "uppercase" }}>Ordenar:</label>
                  <select
                    value={orden}
                    onChange={(e) => setOrden(e.target.value)}
                    style={{
                      backgroundColor: "var(--color-canvas)",
                      border: "1px solid #E5E5E5",
                      color: "var(--color-ink)",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "var(--type-caption)",
                      fontFamily: "var(--font-body)",
                      cursor: "pointer",
                      outline: "none",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                    }}
                  >
                    <option value="default">Relevancia</option>
                    <option value="precio_asc">Precio: Menor a Mayor</option>
                    <option value="precio_desc">Precio: Mayor a Menor</option>
                    <option value="ventas">Más Vendidos</option>
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", borderLeft: "1px solid var(--color-ink-muted)", paddingLeft: "12px", marginLeft: "4px" }}>
                  <button
                    onClick={() => setLayoutMode("grid2")}
                    style={{
                      background: "none", border: "none", color: layoutMode === "grid2" ? "var(--color-volt)" : "var(--color-ink-soft)",
                      cursor: "pointer", display: "flex", padding: "4px", transition: "color 0.2s"
                    }}
                    title="Vista 2 Columnas"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="18"></rect><rect x="14" y="3" width="7" height="18"></rect></svg>
                  </button>
                  <button
                    onClick={() => setLayoutMode("grid3")}
                    style={{
                      background: "none", border: "none", color: layoutMode === "grid3" ? "var(--color-volt)" : "var(--color-ink-soft)",
                      cursor: "pointer", display: "flex", padding: "4px", transition: "color 0.2s"
                    }}
                    title="Vista 3 Columnas"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="5" height="18"></rect><rect x="9.5" y="3" width="5" height="18"></rect><rect x="17" y="3" width="5" height="18"></rect></svg>
                  </button>
                  <button
                    onClick={() => setLayoutMode("list")}
                    style={{
                      background: "none", border: "none", color: layoutMode === "list" ? "var(--color-volt)" : "var(--color-ink-soft)",
                      cursor: "pointer", display: "flex", padding: "4px", transition: "color 0.2s"
                    }}
                    title="Vista Lista"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Tipos de Producto */}
            <div style={{ display: "flex", gap: "var(--space-xs)", overflowX: "auto", paddingBottom: "var(--space-2xs)", scrollbarWidth: "none" }}>
                <button
                  onClick={() => setFiltroTipo(null)}
                  className="btn btn--secondary"
                  style={{ 
                    whiteSpace: "nowrap", 
                    fontSize: "var(--type-caption)", 
                    padding: "6px 16px", 
                    borderRadius: "999px",
                    border: filtroTipo === null ? "1px solid var(--color-ink)" : "1px solid #E5E5E5",
                    backgroundColor: filtroTipo === null ? "var(--color-ink)" : "transparent",
                    color: filtroTipo === null ? "var(--color-canvas)" : "var(--color-ink)",
                    transition: "all 0.3s ease"
                  }}
                >
                  Cualquier Tipo
                </button>
                {tiposProducto.map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setFiltroTipo(tipo)}
                    className="btn btn--secondary"
                    style={{ 
                      whiteSpace: "nowrap", 
                      fontSize: "var(--type-caption)", 
                      padding: "6px 16px", 
                      borderRadius: "999px",
                      border: filtroTipo === tipo ? "1px solid var(--color-ink)" : "1px solid #E5E5E5",
                      backgroundColor: filtroTipo === tipo ? "var(--color-ink)" : "transparent",
                      color: filtroTipo === tipo ? "var(--color-canvas)" : "var(--color-ink)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </button>
                ))}
            </div>

            {/* Advanced Filters: Price & Color */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2xl)", marginTop: "var(--space-sm)", paddingTop: "var(--space-md)", borderTop: "1px solid var(--color-ink-muted)" }}>
              {/* Price Slider */}
              <div style={{ flex: 1, minWidth: "200px", maxWidth: "300px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-xs)" }}>
                  <span style={{ fontSize: "var(--type-caption)", fontWeight: 600, textTransform: "uppercase" }}>Precio Máximo</span>
                  <span style={{ fontSize: "var(--type-caption)", fontWeight: 600 }}>${maxPrecio}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  step="5" 
                  value={maxPrecio}
                  onChange={(e) => setMaxPrecio(Number(e.target.value))}
                  style={{ width: "100%", cursor: "pointer", accentColor: "var(--color-ink)" }}
                />
              </div>

              {/* Color Filter */}
              <div style={{ flex: 1, minWidth: "200px" }}>
                <span style={{ display: "block", fontSize: "var(--type-caption)", fontWeight: 600, textTransform: "uppercase", marginBottom: "var(--space-sm)" }}>Color</span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setFiltroColor(null)}
                    style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      backgroundColor: "transparent",
                      border: "1px solid #E5E5E5",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: filtroColor === null ? "var(--color-ink)" : "var(--color-ink-soft)",
                      fontWeight: filtroColor === null ? 700 : 400
                    }}
                    title="Todos los colores"
                  >
                    ALL
                  </button>
                  {coloresDisponibles.map(c => (
                    <button
                      key={c}
                      onClick={() => setFiltroColor(c)}
                      style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        backgroundColor: c,
                        border: "1px solid rgba(0,0,0,0.1)",
                        outline: filtroColor === c ? "2px solid var(--color-ink)" : "none",
                        outlineOffset: "2px",
                        cursor: "pointer"
                      }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Grid Animado */}
          <AnimatePresence mode="popLayout">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            style={{
              display: "grid",
              gridTemplateColumns: layoutMode === "grid2" 
                ? "repeat(auto-fill, minmax(calc(50% - var(--space-md)), 1fr))" 
                : layoutMode === "grid3"
                ? "repeat(auto-fill, minmax(calc(33.333% - var(--space-md)), 1fr))"
                : "1fr",
              gap: "var(--space-lg)",
            }}
          >
            {productosFiltrados.slice(0, visibleCount).map((producto, i) => (
              <motion.div 
                key={producto.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0, 0, 0.2, 1] } }
                }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                whileHover={{ y: layoutMode === "list" ? 0 : -8 }}
              >
                <ProductCard
                  producto={producto}
                  index={i}
                  onQuickView={setQuickViewProduct}
                  layoutMode={layoutMode}
                />
              </motion.div>
            ))}
          </motion.div>
          </AnimatePresence>

          {/* Load More Button */}
          {visibleCount < productosFiltrados.length && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--space-4xl)" }}>
              <button 
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="btn btn--secondary"
              >
                Cargar Más
              </button>
            </div>
          )}

          {productosFiltrados.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                padding: "var(--space-4xl) 0",
                color: "var(--color-ink-soft)",
              }}
            >
              <p style={{ fontSize: "var(--type-body-lg)" }}>
                No hay productos en esta categoría aún.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      {/* QuickView Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <ProductQuickView
            producto={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </AnimatePresence>
      <CompareDrawer />
    </>
  );
}
