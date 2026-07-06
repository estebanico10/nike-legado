import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useWishlistStore, useCartStore, useUIStore } from "../store/useStore";
import { resolveAsset } from "../utils/resolveAsset";

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { openCart } = useUIStore();

  const handleAddToCart = (item) => {
    // Assuming default size/color if not specified
    addToCart({ ...item, size: item.tallas?.[0] || 'U', color: item.colores?.[0] || 'Default' });
    openCart();
  };

  return (
    <main style={{ paddingTop: "var(--space-4xl)", paddingBottom: "var(--space-5xl)", minHeight: "80vh" }}>
      <div className="container">
        
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "var(--type-hero)",
            lineHeight: "var(--lh-hero)", fontWeight: 700,
            letterSpacing: "var(--tracking-tight)", textTransform: "uppercase",
            color: "var(--color-ink)", marginBottom: "var(--space-md)",
          }}>
            FAVORITOS
          </h1>
          <p style={{ color: "var(--color-ink-soft)", fontSize: "var(--type-body)", marginBottom: "var(--space-3xl)" }}>
            {items.length} {items.length === 1 ? 'artículo guardado' : 'artículos guardados'}
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ 
              padding: "var(--space-4xl) 0", textAlign: "center", borderTop: "1px solid var(--color-ink-muted)",
              borderBottom: "1px solid var(--color-ink-muted)"
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-muted)" strokeWidth="1.5" style={{ margin: "0 auto var(--space-md)" }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body)", color: "var(--color-ink-soft)", marginBottom: "var(--space-xl)" }}>
              Aún no has guardado ningún producto.
            </p>
            <Link to="/tienda" className="btn btn--secondary" style={{ display: "inline-block" }}>
              Explorar Tienda
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-2xl)" }}>
            <AnimatePresence>
              {items.map((producto, i) => (
                <motion.div 
                  key={producto.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  style={{ position: "relative" }}
                >
                  <Link to={`/producto/${producto.id}`} style={{ display: "block", textDecoration: "none", color: "inherit", backgroundColor: "var(--color-canvas-alt)", borderRadius: "var(--radius-sm)", overflow: "hidden", aspectRatio: "3/4", position: "relative" }}>
                    <img src={resolveAsset(producto.imagenes[0])} alt={producto.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, padding: "var(--space-sm)", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {producto.enOferta && <span style={{ backgroundColor: "#D30005", color: "white", padding: "4px 8px", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }}>Oferta</span>}
                      {producto.esNuevo && <span style={{ backgroundColor: "white", color: "black", padding: "4px 8px", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }}>Nuevo</span>}
                    </div>
                  </Link>

                  <button 
                    onClick={() => toggleWishlist(producto)}
                    style={{ position: "absolute", top: "12px", right: "12px", background: "white", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", zIndex: 10 }}
                    aria-label="Quitar de favoritos"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>

                  <div style={{ marginTop: "var(--space-md)" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body)", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px" }}>{producto.nombre}</h3>
                    <p style={{ color: "var(--color-ink-soft)", fontSize: "var(--type-caption)", textTransform: "uppercase", marginBottom: "8px" }}>{producto.categoria}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: producto.enOferta ? "#D30005" : "var(--color-ink)" }}>
                        ${(producto.precioOferta || producto.precio).toFixed(2)}
                        {producto.enOferta && <span style={{ textDecoration: "line-through", color: "var(--color-ink-muted)", marginLeft: "8px", fontSize: "0.9em" }}>${producto.precio.toFixed(2)}</span>}
                      </span>
                    </div>
                    <button onClick={() => handleAddToCart(producto)} className="btn btn--secondary" style={{ width: "100%", marginTop: "var(--space-md)", padding: "8px", fontSize: "var(--type-micro)" }}>
                      Añadir al Carrito
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
