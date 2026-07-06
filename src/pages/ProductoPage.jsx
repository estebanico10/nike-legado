import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../context/ProductContext";
import { useToast } from "../context/ToastContext";
import OptimizedImage from "../components/OptimizedImage";
import AnimatedBackground from "../components/AnimatedBackground";
import { resolveAsset } from "../utils/resolveAsset";
import ProductCard from "../components/ProductCard";

export default function ProductoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productos, addToCart, wishlist, toggleWishlist } = useProducts();
  const { addToast } = useToast();
  const producto = productos.find(p => p.id === id);
  const isWishlisted = producto ? wishlist.some(w => w.id === producto.id) : false;
  
  const [activeImage, setActiveImage] = useState(0);
  const [selectedTalla, setSelectedTalla] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [added, setAdded] = useState(false);

  // Set initial selected values when product loads
  useEffect(() => {
    if (producto) {
      window.scrollTo(0, 0); // Scroll to top
    }
  }, [producto]);

  // Derived state to avoid cascading renders
  const currentTalla = selectedTalla || (producto?.tallas?.length > 0 ? producto.tallas[0] : null);
  const currentColor = selectedColor || (producto?.colores?.length > 0 ? producto.colores[0] : null);

  if (!producto) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h2)" }}>Producto no encontrado</h2>
        <button className="btn btn--primary" onClick={() => navigate('/tienda')} style={{ marginTop: "var(--space-md)" }}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  const relacionados = productos
    .filter(p => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(producto, currentTalla, currentColor);
    addToast(`${producto.nombre} añadido al carrito`, "success");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(producto);
    const exists = wishlist.some((item) => item.id === producto.id);
    if (!exists) {
      addToast(`${producto.nombre} añadido a favoritos`, "success");
    } else {
      addToast(`${producto.nombre} eliminado de favoritos`, "default");
    }
  };

  const images = producto.imagenes.map(resolveAsset);

  return (
    <>
      <AnimatedBackground />
      <main style={{ padding: "var(--space-4xl) 0", position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <div className="container">
          {/* Breadcrumbs */}
          <nav style={{ marginBottom: "var(--space-xl)", fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            <Link to="/tienda" style={{ color: "inherit", textDecoration: "none" }}>Tienda</Link> 
            <span style={{ margin: "0 8px" }}>/</span>
            <Link to="/tienda" style={{ color: "inherit", textDecoration: "none" }}>{producto.categoria}</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--color-ink)", fontWeight: 500 }}>{producto.nombre}</span>
          </nav>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-3xl)", marginBottom: "var(--space-5xl)" }}>
            
            {/* Desktop split: Images (left) | Details (right) */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2xl)" }}>
              
              {/* Product Images Area */}
              <div style={{ flex: "1 1 500px", display: "flex", gap: "var(--space-md)" }}>
                {/* Thumbnails (Desktop vertical) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", width: "80px" }}>
                  {images.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImage(i)}
                      style={{ 
                        aspectRatio: "1", 
                        width: "100%", 
                        border: activeImage === i ? "2px solid var(--color-ink)" : "2px solid transparent",
                        padding: 0,
                        backgroundColor: "var(--color-canvas-alt)",
                        overflow: "hidden",
                        transition: "border-color 0.3s ease"
                      }}
                    >
                      <OptimizedImage src={img} alt={`Thumbnail ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>

                {/* Main Image */}
                <div style={{ flex: 1, backgroundColor: "var(--color-canvas-alt)", aspectRatio: "3/4", position: "relative", overflow: "hidden" }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <OptimizedImage src={images[activeImage]} alt={producto.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Badges */}
                  <div style={{ position: "absolute", top: "16px", left: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {producto.esNuevo && (
                      <span className="badge-indoor" style={{ backgroundColor: "var(--color-ink)" }}>NUEVO</span>
                    )}
                    {producto.enOferta && (
                      <span className="badge-indoor" style={{ backgroundColor: "var(--color-sale)", borderLeftColor: "var(--color-ink)" }}>OFERTA</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Info Area */}
              <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h1)", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: "var(--tracking-tight)", marginBottom: "var(--space-sm)" }}>
                  {producto.nombre}
                </h1>
                
                <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-sm)", marginBottom: "var(--space-xl)" }}>
                  <span style={{ fontSize: "var(--type-h3)", fontWeight: 600 }}>
                    ${producto.precioOferta ? producto.precioOferta.toFixed(2) : producto.precio.toFixed(2)}
                  </span>
                  {producto.precioOferta && (
                    <span style={{ fontSize: "var(--type-body)", color: "var(--color-ink-soft)", textDecoration: "line-through" }}>
                      ${producto.precio.toFixed(2)}
                    </span>
                  )}
                </div>

                <p style={{ color: "var(--color-ink-soft)", lineHeight: 1.6, marginBottom: "var(--space-2xl)" }}>
                  {producto.descripcion}
                </p>

                {/* Colors */}
                {producto.colores && producto.colores.length > 0 && (
                  <div style={{ marginBottom: "var(--space-xl)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
                      <span style={{ fontSize: "var(--type-caption)", fontWeight: 600, textTransform: "uppercase" }}>Color</span>
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                      {producto.colores.map(c => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          style={{
                            width: "36px", height: "36px", borderRadius: "50%",
                            backgroundColor: c,
                            border: "1px solid rgba(0,0,0,0.1)",
                            outline: currentColor === c ? "2px solid var(--color-ink)" : "none",
                            outlineOffset: "2px",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                          aria-label={`Color ${c}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {producto.tallas && producto.tallas.length > 0 && (
                  <div style={{ marginBottom: "var(--space-2xl)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
                      <span style={{ fontSize: "var(--type-caption)", fontWeight: 600, textTransform: "uppercase" }}>Talla</span>
                      <button style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", textDecoration: "underline", border: "none", background: "none", cursor: "pointer", padding: 0 }}>
                        Guía de tallas
                      </button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))", gap: "var(--space-xs)" }}>
                      {producto.tallas.map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedTalla(t)}
                          style={{
                            padding: "12px 0",
                            border: currentTalla === t ? "1px solid var(--color-ink)" : "1px solid var(--color-ink-muted)",
                            backgroundColor: currentTalla === t ? "var(--color-ink)" : "transparent",
                            color: currentTalla === t ? "var(--color-canvas)" : "var(--color-ink)",
                            fontSize: "var(--type-caption)",
                            fontWeight: 500,
                            cursor: "pointer",
                            borderRadius: "var(--radius-sm)",
                            transition: "all 0.2s"
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: "var(--space-md)" }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="btn btn--primary"
                    style={{
                      flex: 1,
                      padding: "18px 0",
                      fontSize: "var(--type-body)",
                      fontWeight: 600,
                      borderRadius: "100px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: added ? "var(--color-success)" : "var(--color-ink)"
                    }}
                    disabled={added}
                  >
                    {added ? (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Añadido al Carrito
                      </>
                    ) : (
                      "Añadir al Carrito"
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleWishlist}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      border: "1px solid var(--color-ink-muted)",
                      backgroundColor: "transparent",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      color: isWishlisted ? "var(--color-error, #ff3333)" : "var(--color-ink)"
                    }}
                    aria-label={isWishlisted ? "Quitar de favoritos" : "Añadir a favoritos"}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relacionados.length > 0 && (
            <section style={{ paddingTop: "var(--space-3xl)", borderTop: "1px solid var(--color-ink-muted)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", textTransform: "uppercase", marginBottom: "var(--space-2xl)" }}>
                También te podría gustar
              </h2>
              <div className="product-grid">
                {relacionados.map((p, i) => (
                  <ProductCard key={p.id} producto={p} index={i} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}
