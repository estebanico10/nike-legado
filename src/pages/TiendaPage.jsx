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
  const [orden, setOrden] = useState("default");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [filtroColor, setFiltroColor] = useState(null);
  const [maxPrecio, setMaxPrecio] = useState(200);
  const [visibleCount, setVisibleCount] = useState(12);

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
      .map(p => ({ ...p, ventas: p.ventas || ((p.id.charCodeAt(0) * 17) % 50) }))
      .sort((a, b) => {
        const pA = a.precioOferta || a.precio;
        const pB = b.precioOferta || b.precio;
        if (orden === "precio_asc") return pA - pB;
        if (orden === "precio_desc") return pB - pA;
        if (orden === "ventas") return b.ventas - a.ventas;
        return 0;
      });
  }, [productos, wishlist, isWishlistMode, query, filtroActivo, filtroTipo, filtroColor, maxPrecio, orden]);

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
      <main className="pt-24 pb-32 relative z-10" style={{ backgroundColor: "var(--color-ink)", color: "var(--color-canvas)" }}>
        <div className="max-w-global mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
            className="flex items-baseline justify-between mb-16 flex-wrap gap-4 border-b border-gray-200 pb-8"
          >
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
                hidden: {}
              }}
              className="font-sans text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-gray-900 flex overflow-hidden leading-none"
            >
              {Array.from(isWishlistMode ? "FAVORITOS" : (query ? `RESULTADOS` : "COLECCIÓN")).map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { y: "100%", opacity: 0 },
                    visible: { y: "0%", opacity: 1, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } }
                  }}
                  whileHover={{ color: "#ceff00", y: -5 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
            <p className="font-sans text-base text-gray-400 font-medium max-w-sm ml-auto text-right">
              {query && <span className="block mb-1 text-white">Resultados para "{query}"</span>}
              Mostrando <CountUp value={productosFiltrados.length} />{" "}
              {productosFiltrados.length === 1 ? "producto" : "productos"} seleccionados para superar tus límites.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Lateral Filters Panel */}
            <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-10">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Categorías</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setFiltroActivo(null)}
                    className={`text-left text-sm py-2 px-4 rounded-lg font-medium transition-colors ${filtroActivo === null ? "bg-white text-black" : "bg-transparent text-gray-400 hover:bg-[#111] hover:text-white"}`}
                  >
                    Todas las categorías
                  </button>
                  {categorias.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFiltroActivo(cat)}
                      className={`text-left text-sm py-2 px-4 rounded-lg font-medium transition-colors ${filtroActivo === cat ? "bg-white text-black" : "bg-transparent text-gray-400 hover:bg-[#111] hover:text-white"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Tipo</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setFiltroTipo(null)}
                    className={`text-left text-sm py-2 px-4 rounded-lg font-medium transition-colors ${filtroTipo === null ? "bg-white text-black" : "bg-transparent text-gray-400 hover:bg-[#111] hover:text-white"}`}
                  >
                    Cualquier Tipo
                  </button>
                  {tiposProducto.map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => setFiltroTipo(tipo)}
                      className={`text-left text-sm py-2 px-4 rounded-lg font-medium transition-colors ${filtroTipo === tipo ? "bg-white text-black" : "bg-transparent text-gray-400 hover:bg-[#111] hover:text-white"}`}
                    >
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex justify-between">
                  <span>Precio Máx.</span>
                  <span className="text-white font-mono">${maxPrecio}</span>
                </h3>
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  step="5" 
                  value={maxPrecio}
                  onChange={(e) => setMaxPrecio(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Color</h3>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setFiltroColor(null)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] transition-all ${filtroColor === null ? "border-white text-white font-bold" : "border-gray-800 text-gray-500"}`}
                    title="Todos los colores"
                  >
                    ALL
                  </button>
                  {coloresDisponibles.map(c => (
                    <button
                      key={c}
                      onClick={() => setFiltroColor(c)}
                      className="w-10 h-10 rounded-full border border-gray-200 transition-all"
                      style={{
                        backgroundColor: c,
                        boxShadow: filtroColor === c ? "0 0 0 2px black, 0 0 0 4px white" : "none",
                      }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex justify-end mb-8">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Ordenar por:</label>
                  <select
                    value={orden}
                    onChange={(e) => setOrden(e.target.value)}
                    className="bg-[#111] border-2 border-gray-800 text-white py-3 px-6 rounded-full text-sm font-bold cursor-pointer outline-none shadow-sm focus:ring-2 focus:ring-white focus:border-white appearance-none"
                  >
                    <option value="default">Relevancia</option>
                    <option value="precio_asc">Precio: Menor a Mayor</option>
                    <option value="precio_desc">Precio: Mayor a Menor</option>
                    <option value="ventas">Más Vendidos</option>
                  </select>
                </div>
              </div>

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
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16"
                >
                  {productosFiltrados.slice(0, visibleCount).map((producto, i) => (
                    <motion.div 
                      key={producto.id}
                      layout
                      variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                      }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    >
                      <div style={{ transform: `translateY(${i % 2 !== 0 ? '40px' : '0'})` }}>
                        <ProductCard
                          producto={producto}
                          index={i}
                          onQuickView={setQuickViewProduct}
                          layoutMode="grid3"
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {visibleCount < productosFiltrados.length && (
                <div className="flex justify-center mt-16">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 12)}
                    className="bg-white text-black font-bold uppercase tracking-wider py-4 px-12 rounded-full hover:bg-gray-200 transition-colors shadow-lg"
                  >
                    Cargar Más
                  </button>
                </div>
              )}

              {productosFiltrados.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-32 bg-[#111] rounded-3xl border border-gray-800"
                >
                  <p className="text-xl text-gray-400 font-medium">No hay productos que coincidan con los filtros.</p>
                  <button onClick={() => { setFiltroActivo(null); setFiltroTipo(null); setFiltroColor(null); setMaxPrecio(200); }} className="mt-6 text-white underline font-bold">Borrar filtros</button>
                </motion.div>
              )}
            </div>
          </div>
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
