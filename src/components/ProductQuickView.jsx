import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../context/ProductContext";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panel = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 24, scale: 0.98 },
};

export default function ProductQuickView({ producto, onClose }) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    producto?.colores?.[0] || null
  );
  const [selectedSize, setSelectedSize] = useState(
    producto?.tallas?.[0] || "M"
  );
  const [added, setAdded] = useState(false);
  const { addToCart } = useProducts();

  useEffect(() => {
    if (added) {
      const t = setTimeout(() => { setAdded(false); onClose(); }, 1200);
      return () => clearTimeout(t);
    }
  }, [added, onClose]);

  if (!producto) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-lg)",
        }}
      >
        <motion.div
          key="panel"
          variants={panel}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            /* Regla estricta: Ancho × Alto */
            width: "1000px",
            maxWidth: "95vw",
            height: "80vh",
            maxHeight: "90vh",
            backgroundColor: "var(--color-canvas)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              position: "absolute",
              top: "var(--space-md)",
              right: "var(--space-md)",
              zIndex: 10,
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "var(--color-canvas)",
              border: "1px solid var(--color-ink-muted)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              transition: "background-color var(--duration-micro) var(--ease-out)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="14" y2="14" />
              <line x1="14" y1="2" x2="2" y2="14" />
            </svg>
          </button>

          {/* Image Gallery (Left) */}
          <div
            style={{
              backgroundColor: "var(--color-canvas-alt)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={producto.imagenes[activeImg]}
                alt={`${producto.nombre} — vista ${activeImg + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "opacity var(--duration-std) var(--ease-out)",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            {/* Thumbnails */}
            {producto.imagenes.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-xs)",
                  padding: "var(--space-sm)",
                  overflowX: "auto",
                }}
              >
                {producto.imagenes.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: "56px",
                      height: "56px",
                      flexShrink: 0,
                      border:
                        i === activeImg
                          ? "2px solid var(--color-ink)"
                          : "1px solid var(--color-ink-muted)",
                      overflow: "hidden",
                      cursor: "pointer",
                      opacity: i === activeImg ? 1 : 0.6,
                      transition: "all var(--duration-micro) var(--ease-out)",
                      backgroundColor: "var(--color-canvas-alt)",
                    }}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${i + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.currentTarget.parentElement.style.display = "none";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details (Right) */}
          <div
            style={{
              padding: "var(--space-2xl) var(--space-xl)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-lg)",
              overflowY: "auto",
            }}
          >
            {/* Badges */}
            <div style={{ display: "flex", gap: "var(--space-xs)" }}>
              {producto.esNuevo && (
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--type-micro)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "var(--space-2xs) var(--space-xs)",
                    backgroundColor: "var(--color-ink)",
                    color: "var(--color-canvas)",
                  }}
                >
                  Nuevo
                </span>
              )}
              {producto.enOferta && (
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--type-micro)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "var(--space-2xs) var(--space-xs)",
                    backgroundColor: "var(--color-sale)",
                    color: "#FFFFFF",
                  }}
                >
                  Oferta
                </span>
              )}
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--type-h2)",
                lineHeight: "var(--lh-h2)",
                fontWeight: 700,
                letterSpacing: "var(--tracking-tight)",
                textTransform: "uppercase",
                color: "var(--color-ink)",
              }}
            >
              {producto.nombre}
            </h2>

            {/* Category + Type */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--type-body-sm)",
                color: "var(--color-ink-soft)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {producto.categoria}
              {producto.tipo && ` — ${producto.tipo}`}
            </p>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-sm)" }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-h3)",
                  fontWeight: 700,
                  color: producto.enOferta ? "var(--color-sale)" : "var(--color-ink)",
                }}
              >
                ${(producto.precioOferta || producto.precio).toFixed(2)}
              </span>
              {producto.enOferta && producto.precioOferta && (
                <span
                  style={{
                    fontSize: "var(--type-body-sm)",
                    color: "var(--color-ink-soft)",
                    textDecoration: "line-through",
                  }}
                >
                  ${producto.precio.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--type-body)",
                lineHeight: 1.6,
                color: "var(--color-ink)",
              }}
            >
              {producto.descripcion}
            </p>

            {/* Color Selector */}
            {producto.colores?.length > 0 && (
              <div>
                <p
                  style={{
                    fontSize: "var(--type-caption)",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--color-ink-soft)",
                    marginBottom: "var(--space-xs)",
                  }}
                >
                  Color: {selectedColor}
                </p>
                <div style={{ display: "flex", gap: "var(--space-xs)" }}>
                  {producto.colores.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Seleccionar color ${color}`}
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: color,
                        border:
                          selectedColor === color
                            ? "2px solid var(--color-ink)"
                            : "1px solid var(--color-ink-muted)",
                        cursor: "pointer",
                        transition: "border var(--duration-micro) var(--ease-out)",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div>
              <p
                style={{
                  fontSize: "var(--type-caption)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--color-ink-soft)",
                  marginBottom: "var(--space-xs)",
                }}
              >
                Talla: {selectedSize}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
                {(producto.tallas || ["S", "M", "L", "XL"]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--type-body-sm)",
                      fontWeight: 600,
                      backgroundColor: selectedSize === size ? "var(--color-ink)" : "transparent",
                      color: selectedSize === size ? "var(--color-canvas)" : "var(--color-ink)",
                      border: "1px solid var(--color-ink)",
                      cursor: "pointer",
                      transition: "all var(--duration-micro) var(--ease-out)",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock */}
            {producto.stock !== undefined && (
              <p
                style={{
                  fontSize: "var(--type-caption)",
                  color:
                    producto.stock > 0
                      ? "var(--color-success)"
                      : "var(--color-sale)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {producto.stock > 0
                  ? `${producto.stock} unidades disponibles`
                  : "Agotado"}
              </p>
            )}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* CTA */}
            <button 
              className="btn btn--primary" 
              style={{ 
                width: "100%", 
                backgroundColor: added ? "var(--color-success)" : undefined,
                color: added ? "#FFFFFF" : undefined,
                borderColor: added ? "var(--color-success)" : undefined,
                pointerEvents: added ? "none" : "auto"
              }}
              onClick={() => {
                addToCart(producto, selectedSize, selectedColor);
                setAdded(true);
              }}
              disabled={producto.stock <= 0}
            >
              {added ? "✓ Añadido" : "Añadir al Carrito"}
            </button>
          </div>

          {/* Responsive: stack on mobile */}
          <style>{`
            @media (max-width: 767px) {
              [data-quickview-panel] {
                grid-template-columns: 1fr !important;
                height: 95vh !important;
              }
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
