import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useProducts } from "../context/ProductContext";
import { resolveAsset } from "../utils/resolveAsset";

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
  const imgContainerRef = useRef(null);

  // Zoom effect states
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const zoomX = useTransform(springX, [0, 1], ["0%", "100%"]);
  const zoomY = useTransform(springY, [0, 1], ["0%", "100%"]);
  const [isZooming, setIsZooming] = useState(false);

  const handleMouseMove = (e) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

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
              ref={imgContainerRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => { setIsZooming(false); mouseX.set(0.5); mouseY.set(0.5); }}
              onMouseMove={handleMouseMove}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
                cursor: isZooming ? "zoom-in" : "default"
              }}
            >
              <motion.img
                src={resolveAsset(producto.imagenes[activeImg])}
                alt={`${producto.nombre} — vista ${activeImg + 1}`}
                animate={{ scale: isZooming ? 1.5 : 1 }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transformOrigin: `${zoomX.get()} ${zoomY.get()}`,
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
                      src={resolveAsset(img)}
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
                    <motion.button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Seleccionar color ${color}`}
                      style={{
                        position: "relative",
                        width: "32px",
                        height: "32px",
                        backgroundColor: color,
                        border: "1px solid var(--color-ink-muted)",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      {selectedColor === color && (
                        <motion.div
                          layoutId="colorRing"
                          style={{
                            position: "absolute",
                            inset: "-4px",
                            border: "2px solid var(--color-ink)",
                            borderRadius: "50%"
                          }}
                        />
                      )}
                    </motion.button>
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
                  <motion.button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      position: "relative",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--type-body-sm)",
                      fontWeight: 600,
                      backgroundColor: "transparent",
                      color: selectedSize === size ? "var(--color-canvas)" : "var(--color-ink)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {selectedSize === size && (
                      <motion.div
                        layoutId="sizeBackground"
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundColor: "var(--color-ink)",
                          zIndex: -1
                        }}
                      />
                    )}
                    {!selectedSize || selectedSize !== size ? (
                       <div style={{ position: "absolute", inset: 0, border: "1px solid var(--color-ink)", zIndex: -2 }} />
                    ) : null}
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Urgency Bar / Stock */}
            {producto.stock !== undefined && (
              <div style={{ marginTop: "var(--space-md)" }}>
                <p
                  style={{
                    fontSize: "var(--type-caption)",
                    color:
                      producto.stock > 0
                        ? "var(--color-ink)"
                        : "var(--color-sale)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "var(--space-xs)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-xs)"
                  }}
                >
                  {producto.stock > 0
                    ? (producto.stock < 5 ? `⚡ ¡Rápido! Solo quedan ${producto.stock}` : `${producto.stock} unidades disponibles`)
                    : "Agotado"}
                </p>
                {producto.stock > 0 && (
                  <div style={{ width: "100%", height: "4px", backgroundColor: "var(--color-ink-muted)", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((producto.stock / 20) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{
                        height: "100%",
                        backgroundColor: producto.stock < 5 ? "var(--color-sale)" : "var(--color-volt)"
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* CTA */}
            <motion.button 
              className="btn btn--primary" 
              whileTap={{ scale: 0.95 }}
              style={{ 
                width: "100%", 
                backgroundColor: added ? "var(--color-success)" : undefined,
                color: added ? "#FFFFFF" : undefined,
                borderColor: added ? "var(--color-success)" : undefined,
                pointerEvents: added ? "none" : "auto",
                position: "relative",
                overflow: "hidden"
              }}
              onClick={() => {
                addToCart(producto, selectedSize, selectedColor);
                setAdded(true);
              }}
              disabled={producto.stock <= 0}
            >
              <motion.span
                initial={false}
                animate={{ y: added ? -40 : 0, opacity: added ? 0 : 1 }}
                style={{ display: "block" }}
              >
                Añadir al Carrito
              </motion.span>
              <motion.span
                initial={false}
                animate={{ y: added ? 0 : 40, opacity: added ? 1 : 0 }}
                style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                ✓ Añadido
              </motion.span>
            </motion.button>
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
