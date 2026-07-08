import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useProducts } from "../context/ProductContext";
import { useToast } from "../context/ToastContext";
import { resolveAsset } from "../utils/resolveAsset";
import OptimizedImage from "./OptimizedImage";
import { useWishlistStore } from "../store/useStore";
import CountdownTimer from "./CountdownTimer";

export default function ProductCard({ producto, index, onQuickView, layoutMode = "grid3" }) {
  const [hoveredColor, setHoveredColor] = useState(null);
  
  // Use the color's specific image if available, else default
  const getDisplayImage = () => {
    if (hoveredColor && hoveredColor.imagen) {
      return resolveAsset(hoveredColor.imagen);
    }
    return resolveAsset(producto.imagenes[0]);
  };

  const portada = getDisplayImage();
  const segundaImagen = resolveAsset(producto.imagenes[1] || producto.imagenes[0]);
  const [imgError] = useState(false);
  const [img2Error] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useProducts();
  const { addToast } = useToast();
  const { toggleWishlist, items: wishlist } = useWishlistStore();
  const isWished = wishlist.some((item) => item.id === producto.id);
  const cardRef = useRef(null);

  // 3D Tilt Effect State
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useTransform(mouseXSpring, [-0.5, 0.5], [0.3, 0.5]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent link click
    e.stopPropagation();
    const defaultSize = producto.tallas?.[0] || "M";
    const defaultColor = producto.colores?.[0] || "#000000";
    addToCart(producto, defaultSize, defaultColor);
    addToast(`${producto.nombre} añadido al carrito`, "success");
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  return (
    <Link to={`/producto/${producto.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <motion.article
        ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.08,
      }}
      onClick={() => onQuickView?.(producto)}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "flex",
        flexDirection: layoutMode === "list" ? "row" : "column",
        gap: "var(--space-md)",
        cursor: "pointer",
        perspective: "1000px" // For 3D tilt
      }}
    >
      {/* Image Container with Tilt */}
      <motion.div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          width: layoutMode === "list" ? "200px" : "100%",
          overflow: "hidden",
          backgroundColor: "var(--color-canvas-alt)",
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glare Effect */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            background: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)",
            opacity: hovered ? glareOpacity : 0,
            left: glareX,
            top: glareY,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            mixBlendMode: "overlay",
          }}
        />
        {imgError ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "8px",
              color: "var(--color-ink-soft)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--type-caption)",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>{producto.id}</span>
          </div>
        ) : (
          <>
            {/* Primary Image */}
            <motion.div
              layoutId={`product-image-${producto.id}`}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
              animate={{ opacity: hovered && !img2Error ? 0 : 1, scale: hovered ? 1.04 : 1 }}
              transition={{ duration: 0.45, ease: [0, 0, 0.2, 1] }}
            >
              <OptimizedImage
                src={portada}
                alt={producto.nombre}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>

            {/* Secondary Image (hover reveal) */}
            {!img2Error && (
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.96 }}
                transition={{ duration: 0.45, ease: [0, 0, 0.2, 1] }}
              >
                <OptimizedImage
                  src={segundaImagen}
                  alt={`${producto.nombre} — vista alternativa`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </motion.div>
            )}
          </>
        )}

          {/* Wishlist Heart Overlay */}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(producto); }}
            style={{
              position: "absolute", top: "12px", right: "12px",
              background: "white", border: "none", borderRadius: "50%",
              width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", zIndex: 10,
              color: isWished ? "#D30005" : "var(--color-ink)",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            aria-label={isWished ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isWished ? "#D30005" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>

        {/* Badges */}
        {producto.esNuevo && (
          <span
            style={{
              position: "absolute",
              top: "var(--space-sm)",
              left: "var(--space-sm)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--type-micro)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "var(--space-2xs) var(--space-xs)",
              backgroundColor: "var(--color-ink)",
              color: "var(--color-canvas)",
              zIndex: 2,
            }}
          >
            Nuevo
          </span>
        )}

        {producto.enOferta && (
          <span
            style={{
              position: "absolute",
              top: producto.esNuevo ? "var(--space-xl)" : "var(--space-sm)",
              left: "var(--space-sm)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--type-micro)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "var(--space-2xs) var(--space-xs)",
              backgroundColor: "var(--color-sale)",
              color: "#FFFFFF",
              zIndex: 2,
            }}
          >
            Oferta
          </span>
        )}

        {/* Hover CTA */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
              style={{
                position: "absolute",
                bottom: "var(--space-sm)",
                left: "var(--space-sm)",
                right: "var(--space-sm)",
                zIndex: 3,
                display: "flex",
                gap: "var(--space-xs)",
              }}
            >
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  padding: "var(--space-sm) var(--space-md)",
                  backgroundColor: addedToCart ? "var(--color-success)" : "var(--color-volt)",
                  color: "#111111",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--type-caption)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--space-xs)",
                }}
              >
                {addedToCart ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    ¡Agregado!
                  </>
                ) : (
                  "Agregar al carrito"
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={(e) => { e.stopPropagation(); onQuickView?.(producto); }}
                style={{
                  padding: "var(--space-sm)",
                  backgroundColor: "rgba(255,255,255,0.92)",
                  color: "var(--color-ink)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(8px)",
                }}
                title="Vista rápida"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Product Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xs)" }}>
        <motion.h3
          layoutId={`product-title-${producto.id}`}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--type-body)",
            fontWeight: 500,
            color: "var(--color-ink)",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            position: "relative",
            margin: 0
          }}
        >
          {producto.nombre}
          {producto.esNuevo && (
            <span style={{ position: "absolute", top: "-24px", left: "0px", backgroundColor: "var(--color-canvas)", color: "var(--color-ink)", padding: "2px 6px", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", zIndex: 5, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>Nuevo</span>
          )}
        </motion.h3>

        <div style={{ padding: "var(--space-md)" }}>
          {producto.enOferta && <div style={{ marginBottom: "8px" }}><CountdownTimer hours={producto.id ? (producto.id.length * 5) % 48 + 12 : 24} /></div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-xs)" }}>
          <span
            style={{
              fontSize: "var(--type-body)",
              fontWeight: 500,
              color: producto.enOferta ? "var(--color-sale)" : "var(--color-ink)",
            }}
          >
            ${(producto.precioOferta || producto.precio).toFixed(2)}
          </span>

          {producto.enOferta && producto.precioOferta && (
            <span
              style={{
                fontSize: "var(--type-caption)",
                color: "var(--color-ink-soft)",
                textDecoration: "line-through",
              }}
            >
              ${producto.precio.toFixed(2)}
            </span>
          )}

          <div style={{ display: "flex", gap: "var(--space-2xs)", marginLeft: "auto" }}>
            {producto.colores.map((color) => (
              <span
                key={color}
                aria-label={`Color ${color}`}
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: color,
                  border: "1px solid var(--color-ink-muted)",
                  borderRadius: "var(--radius-sm)",
                }}
              />
            ))}
          </div>
        </div>
        </div>
        
        {producto.colores && producto.colores.length > 0 && (
          <div style={{ display: "flex", gap: "6px", padding: "0 var(--space-md) var(--space-md)", marginTop: "-4px" }}>
            {producto.colores.map((colorStr, idx) => {
              // Extract hex if formatted as "Name|#HEX" (mocking it for now, assuming color mappings)
              const colorMap = {
                "Blanco": "#ffffff", "Negro": "#111111", "Rojo": "#D30005", "Azul": "#0033a0", "Gris": "#cccccc", "Beige": "#f5f5dc", "Rosa": "#ffc0cb", "Verde": "#ceff00"
              };
              const hex = colorMap[colorStr] || "#ddd";
              return (
                <div 
                  key={idx}
                  onMouseEnter={() => setHoveredColor({ nombre: colorStr })}
                  onMouseLeave={() => setHoveredColor(null)}
                  style={{ 
                    width: "14px", height: "14px", borderRadius: "50%", 
                    backgroundColor: hex, 
                    border: "1px solid var(--color-ink-muted)",
                    boxShadow: hoveredColor?.nombre === colorStr ? "0 0 0 2px var(--color-canvas), 0 0 0 3px var(--color-ink)" : "none",
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                  title={colorStr}
                />
              );
            })}
          </div>
        )}
      </div>
      </motion.article>
    </Link>
  );
}
