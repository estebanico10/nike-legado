import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

import { useToast } from "../context/ToastContext";
import { resolveAsset } from "../utils/resolveAsset";
import OptimizedImage from "./OptimizedImage";
import { useCartStore, useWishlistStore, useCompareStore } from "../store/useStore";
import CountdownTimer from "./CountdownTimer";
import { useI18nStore } from "../store/useI18nStore";

export default function ProductCard({ producto, index, onQuickView, layoutMode = "grid3" }) {
  const { formatPrice } = useI18nStore();
  const [hoveredColor, setHoveredColor] = useState(null);
  
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
  const { addToCart } = useCartStore();
  const { addToast } = useToast();
  const { toggleWishlist, items: wishlist } = useWishlistStore();
  const { toggleCompare, compareItems } = useCompareStore();
  const isWished = wishlist.some((item) => item.id === producto.id);
  const isCompared = compareItems.some((item) => item.id === producto.id);
  const cardRef = useRef(null);

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
    e.preventDefault(); 
    e.stopPropagation();
    const defaultSize = producto.tallas?.[0] || "M";
    const defaultColor = producto.colores?.[0] || "#000000";
    addToCart(producto, defaultSize, 1, defaultColor);
    addToast(`${producto.nombre} añadido al carrito`, "success");
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  return (
    <Link to={`/producto/${producto.id}`} className="no-underline text-inherit block group h-full">
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
        className={`flex ${layoutMode === "list" ? "flex-row" : "flex-col"} gap-0 cursor-pointer rounded-2xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full`}
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className={`relative overflow-hidden bg-gray-100 ${layoutMode === "list" ? "w-64 shrink-0" : "w-full aspect-square"} ${layoutMode === "list" ? "rounded-l-2xl" : "rounded-t-2xl"}`}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          {/* Glare Effect */}
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
            style={{
              background: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)",
              opacity: hovered ? glareOpacity : 0,
              left: glareX,
              top: glareY,
              transform: "translate(-50%, -50%)",
            }}
          />
          
          <motion.div
            layoutId={`product-image-${producto.id}`}
            className="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
            animate={{ opacity: hovered && !img2Error ? 0 : 1 }}
          >
            <OptimizedImage
              src={portada}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {!img2Error && (
            <motion.div
              className="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out scale-95 group-hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
            >
              <OptimizedImage
                src={segundaImagen}
                alt={`${producto.nombre} — vista alternativa`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(producto); }}
            className="absolute top-4 right-4 bg-white border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md z-10 transition-transform duration-200 hover:scale-110"
            aria-label={isWished ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isWished ? "#D30005" : "none"} stroke={isWished ? "#D30005" : "#111111"} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>

          {producto.esNuevo && (
            <span className="absolute top-4 left-4 font-sans text-xs font-bold uppercase tracking-wider py-1.5 px-3 bg-black text-white z-[2]">
              Nuevo
            </span>
          )}

          {producto.enOferta && (
            <span className={`absolute ${producto.esNuevo ? 'top-14' : 'top-4'} left-4 font-sans text-xs font-bold uppercase tracking-wider py-1.5 px-3 bg-red-600 text-white z-[2]`}>
              Oferta
            </span>
          )}

          <AnimatePresence>
            {hovered && (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
                className="absolute bottom-4 left-4 right-4 z-[3] flex gap-2"
              >
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-4 font-sans text-xs font-bold uppercase tracking-widest border-none cursor-pointer transition-colors duration-200 flex items-center justify-center gap-2 rounded-full shadow-lg ${addedToCart ? "bg-green-500 text-white" : "bg-[#ceff00] text-black hover:bg-white"}`}
                >
                  {addedToCart ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Agregado
                    </>
                  ) : (
                    "Agregar al carrito"
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={(e) => { e.stopPropagation(); onQuickView?.(producto); }}
                  className="w-10 h-10 shrink-0 bg-white/90 text-black border-none cursor-pointer flex items-center justify-center backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors"
                  title="Vista rápida"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="flex flex-col gap-2 p-6 flex-1 bg-white relative z-10">
          <motion.h3
            layoutId={`product-title-${producto.id}`}
            className="font-sans text-lg font-bold text-gray-900 uppercase tracking-tight m-0"
          >
            {producto.nombre}
          </motion.h3>

          <div className="flex flex-col mt-auto">
            {producto.enOferta && <div className="mb-3"><CountdownTimer hours={producto.id ? (producto.id.length * 5) % 48 + 12 : 24} /></div>}
            
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                {producto.enOferta && producto.precioOferta && (
                  <span className="text-sm text-gray-400 line-through mb-1">
                    {formatPrice(producto.precio)}
                  </span>
                )}
                <span className={`text-xl font-black tracking-tight ${producto.enOferta ? "text-red-600" : "text-gray-900"}`}>
                  {formatPrice(producto.precioOferta || producto.precio)}
                </span>
              </div>

              {producto.colores && producto.colores.length > 0 && (
                <div className="flex gap-1.5 ml-auto pb-1">
                  {producto.colores.map((colorStr, idx) => {
                    const colorMap = {
                      "Blanco": "#ffffff", "Negro": "#111111", "Rojo": "#D30005", "Azul": "#0033a0", "Gris": "#cccccc", "Beige": "#f5f5dc", "Rosa": "#ffc0cb", "Verde": "#ceff00"
                    };
                    const hex = colorMap[colorStr] || "#ddd";
                    return (
                      <div 
                        key={idx}
                        onMouseEnter={() => setHoveredColor({ nombre: colorStr })}
                        onMouseLeave={() => setHoveredColor(null)}
                        className="w-5 h-5 rounded-full border border-gray-200 cursor-pointer transition-all duration-200"
                        style={{ 
                          backgroundColor: hex, 
                          boxShadow: hoveredColor?.nombre === colorStr ? "0 0 0 2px white, 0 0 0 4px black" : "none",
                        }}
                        title={colorStr}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
