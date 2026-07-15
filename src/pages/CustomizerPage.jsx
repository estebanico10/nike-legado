import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import AnimatedBackground from "../components/AnimatedBackground";
import SneakerCustomizer, {
  COLOR_PALETTE,
  LAYERS,
  calculatePriceDetails
} from "../components/customizer/SneakerCustomizer";
import { useCartStore, useLoyaltyStore } from "../store/useStore";
import { useToast } from "../context/ToastContext";

const SIZES_MX = ["24", "24.5", "25", "25.5", "26", "26.5", "27", "27.5", "28", "28.5", "29", "29.5", "30"];

export default function CustomizerPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToast } = useToast();

  const [activeColors, setActiveColors] = useState({
    swoosh: COLOR_PALETTE[0], // Volt
    upper: COLOR_PALETTE[2], // Canvas
    sole: COLOR_PALETTE[1], // Ink
    laces: COLOR_PALETTE[1], // Ink
    heel: COLOR_PALETTE[6] // Dark Grey
  });

  const [activeTab, setActiveTab] = useState("swoosh");
  const [customText, setCustomText] = useState("LEGADO");
  const [selectedSize, setSelectedSize] = useState("28");
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [showSavedModal, setShowSavedModal] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nike_saved_designs");
      if (stored) {
        setSavedDesigns(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading saved designs:", e);
    }
  }, []);

  const priceDetails = calculatePriceDetails(activeColors, customText);

  const handleColorChange = (layerId, colorObj) => {
    setActiveColors((prev) => ({
      ...prev,
      [layerId]: colorObj
    }));
  };

  const handleAddToCart = () => {
    const colorSummary = `Swoosh: ${activeColors.swoosh.name} | Upper: ${activeColors.upper.name} | Suela: ${activeColors.sole.name} | Cordones: ${activeColors.laces.name}`;
    
    const customItem = {
      id: Date.now().toString(),
      nombre: `Nike By You — Custom Edition${customText && customText !== "LEGADO" ? ` "${customText}"` : ""}`,
      precio: priceDetails.totalPrice,
      precioOferta: priceDetails.totalPrice,
      talla: selectedSize,
      size: selectedSize,
      color: activeColors.upper.hex,
      colorResumen: colorSummary,
      esPersonalizado: true,
      customText: customText ? customText.trim() : "LEGADO",
      imagenes: ["/instagram/post 1.jpeg"],
    };

    addToCart(customItem, selectedSize, 1, activeColors.upper.hex);
    useLoyaltyStore.getState().addPoints(100, `Crear Nike By You (${customText || "LEGADO"})`);
    addToast("¡Nike By You añadido y +100 PTS Street Cred ganados!", "success");
  };

  const handleSaveDesign = () => {
    const newDesign = {
      id: Date.now().toString(),
      nombre: `Diseño ${savedDesigns.length + 1} (${customText || "LEGADO"})`,
      date: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }),
      colors: activeColors,
      customText: customText,
      price: priceDetails.totalPrice
    };

    const updated = [newDesign, ...savedDesigns.slice(0, 9)];
    setSavedDesigns(updated);
    try {
      localStorage.setItem("nike_saved_designs", JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving design locally:", e);
    }
    useLoyaltyStore.getState().addPoints(50, `Guardar diseño (${customText || "LEGADO"})`);
    addToast("¡Diseño guardado en Mis Diseños locales y +50 PTS Street Cred ganados!", "success");
  };

  const handleLoadDesign = (design) => {
    if (design.colors) setActiveColors(design.colors);
    if (design.customText !== undefined) setCustomText(design.customText);
    setShowSavedModal(false);
    addToast(`¡Diseño "${design.nombre}" cargado al estudio!`, "info");
  };

  const handleDeleteDesign = (id, e) => {
    e.stopPropagation();
    const updated = savedDesigns.filter(d => d.id !== id);
    setSavedDesigns(updated);
    try {
      localStorage.setItem("nike_saved_designs", JSON.stringify(updated));
    } catch (err) {
      console.error("Error deleting design:", err);
    }
    addToast("Diseño eliminado de tu colección.", "info");
  };

  return (
    <>
      <SEO
        title="Nike By You"
        description="Diseña tus propias zapatillas Nike Legado personalizadas por capas y estilo callejero."
      />
      <AnimatedBackground />

      <main className="min-h-screen py-16 pb-32">
        <div className="container max-w-[1400px] mx-auto px-6">
          
          {/* Studio Header */}
          <header className="mb-12 flex flex-wrap justify-between items-end gap-6 border-b border-neutral-800 pb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[var(--color-volt)] text-[var(--color-ink)] font-display font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                  EXCLUSIVO ONLINE
                </span>
                <span className="text-neutral-400 text-xs uppercase tracking-wider">
                  ESTUDIO 3D DIGITAL
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-neutral-100 m-0 leading-tight">
                NIKE BY YOU <span className="text-[var(--color-volt-text)]">— LEGADO</span>
              </h1>
              <p className="text-neutral-400 text-sm mt-2 max-w-2xl">
                Construye tu identidad callejera y andina capa por capa. Elige acabados de alta densidad y graba láser tu firma exclusiva en el talón.
              </p>
            </div>

            <button
              onClick={() => setShowSavedModal(true)}
              className="bg-neutral-900 border border-neutral-700 text-neutral-100 px-5 py-3 rounded-full font-display text-sm font-semibold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 hover:border-[var(--color-volt)] hover:text-[var(--color-volt-text)] cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Mis Diseños ({savedDesigns.length})
            </button>
          </header>

          {/* Desktop Split View Layout */}
          <div className="flex flex-col lg:grid lg:grid-cols-[minmax(380px,1.05fr)_minmax(420px,1.35fr)] gap-12 items-start">
            
            {/* LEFT COLUMN: Sticky Sneaker SVG Preview + Price Breakdown Card */}
            <div className="flex flex-col gap-8 lg:sticky lg:top-[100px]">
              
              <SneakerCustomizer
                mode="preview"
                activeColors={activeColors}
                onColorChange={handleColorChange}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                customText={customText}
                onTextChange={setCustomText}
              />

              {/* Price Breakdown Card */}
              <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <h3 className="font-display text-lg uppercase text-neutral-100 m-0 mb-4 border-b border-neutral-800 pb-2 flex justify-between items-center">
                  <span>Desglose de Precio</span>
                  <span className="text-[var(--color-volt-text)]">${priceDetails.totalPrice.toFixed(2)}</span>
                </h3>

                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between text-neutral-300">
                    <span>Zapatilla Base Nike By You</span>
                    <span className="font-semibold text-white">$149.99</span>
                  </div>

                  <div className={`flex justify-between ${priceDetails.premiumColorCost > 0 ? 'text-[var(--color-volt-text)]' : 'text-neutral-500'}`}>
                    <span className="flex items-center gap-2">
                      Acabado Color Premium
                      {priceDetails.premiumColorCost > 0 && (
                        <span className="text-[10px] bg-[var(--color-volt)]/15 text-[var(--color-volt-text)] px-1.5 py-0.5 rounded">ACTIVO</span>
                      )}
                    </span>
                    <span className="font-semibold">+${priceDetails.premiumColorCost.toFixed(2)}</span>
                  </div>

                  <div className={`flex justify-between ${priceDetails.customTextCost > 0 ? 'text-[var(--color-volt-text)]' : 'text-neutral-500'}`}>
                    <span className="flex items-center gap-2">
                      Grabado Láser en Talón ({customText || "Sin texto"})
                      {priceDetails.customTextCost > 0 && (
                        <span className="text-[10px] bg-[var(--color-volt)]/15 text-[var(--color-volt-text)] px-1.5 py-0.5 rounded">CUSTOM</span>
                      )}
                    </span>
                    <span className="font-semibold">+${priceDetails.customTextCost.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-dashed border-neutral-700 mt-2 pt-3 flex justify-between items-baseline">
                    <span className="font-display text-lg text-white uppercase">
                      Total Inversión
                    </span>
                    <span className="font-display text-2xl text-[var(--color-volt-text)] font-bold">
                      ${priceDetails.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Customization Tabs, Color Palette, Size Selector & Action Buttons */}
            <div className="flex flex-col gap-10">
              
              {/* Controls mode of SneakerCustomizer */}
              <SneakerCustomizer
                mode="controls"
                activeColors={activeColors}
                onColorChange={handleColorChange}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                customText={customText}
                onTextChange={setCustomText}
              />

              {/* Size Selector from 24 to 30 */}
              <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display text-lg uppercase text-neutral-100 m-0">
                    Selecciona Tu Talla <span className="text-neutral-500 text-sm font-normal">(CM / MX)</span>
                  </h3>
                  <span className="text-xs text-[var(--color-volt-text)] font-semibold cursor-pointer underline">
                    Guía de Tallas
                  </span>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2.5">
                  {SIZES_MX.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`bg-[#141414] border border-[#292929] text-neutral-300 font-display text-base font-semibold py-3 px-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-[var(--color-volt)] hover:text-white hover:-translate-y-0.5 ${selectedSize === size ? "bg-[var(--color-volt)] border-[var(--color-volt)] text-[var(--color-ink)] font-extrabold shadow-[0_4px_15px_rgba(206,255,0,0.4)]" : ""}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-neutral-500 mt-3 mb-0">
                  📏 Ajuste fiel a la talla. Recomendamos pedir media talla más si prefieres ajuste holgado para básquetbol o uso urbano.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 sticky bottom-4 z-10 lg:static">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAddToCart}
                  className="bg-[var(--color-volt)] text-[var(--color-ink)] font-display text-xl font-bold uppercase tracking-wider border-none rounded-xl py-4 px-6 cursor-pointer flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(206,255,0,0.3)] transition-all duration-200 w-full"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  AÑADIR AL CARRITO — ${priceDetails.totalPrice.toFixed(2)}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSaveDesign}
                  className="bg-transparent text-neutral-100 font-display text-lg font-semibold uppercase tracking-wider border-2 border-neutral-800 rounded-xl py-3.5 px-6 cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-200 hover:border-[var(--color-volt)] hover:text-[var(--color-volt-text)] w-full"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  GUARDAR EN MIS DISEÑOS
                </motion.button>

                <div className="flex justify-between items-center pt-2 border-t border-neutral-800 text-[10px] sm:text-xs text-neutral-500 w-full">
                  <span>🔒 Garantía de fabricación artesanal 3-4 semanas</span>
                  <span>⚡ Envío gratis en Ecuador & MX</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* Saved Designs Modal */}
      <AnimatePresence>
        {showSavedModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-neutral-800 rounded-2xl p-8 w-full max-w-[680px] max-h-[85vh] flex flex-col shadow-[0_25px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="font-display text-2xl uppercase text-white m-0">
                    Mis Diseños Guardados
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 mb-0">
                    Carga tus combinaciones personalizadas para continuar editando o comprar.
                  </p>
                </div>
                <button
                  onClick={() => setShowSavedModal(false)}
                  className="bg-transparent border-none text-neutral-500 cursor-pointer p-1 hover:text-white transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 custom-scrollbar">
                {savedDesigns.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-50">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    <p className="font-display text-lg uppercase m-0 mb-1">No tienes diseños guardados</p>
                    <p className="text-xs m-0">Crea una combinación única y haz clic en "Guardar en Mis Diseños".</p>
                  </div>
                ) : (
                  savedDesigns.map((design) => (
                    <div
                      key={design.id}
                      onClick={() => handleLoadDesign(design)}
                      className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-4 flex justify-between items-center cursor-pointer transition-all duration-200 hover:border-[var(--color-volt)] hover:bg-[#202020] group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#0f0f0f] border border-neutral-800 flex items-center justify-center relative overflow-hidden">
                          {/* Mini dots showing colors */}
                          <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: design.colors?.swoosh?.hex || "#CEFF00" }} />
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: design.colors?.upper?.hex || "#FFF" }} />
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: design.colors?.sole?.hex || "#111" }} />
                          </div>
                        </div>

                        <div>
                          <h4 className="font-display text-base uppercase text-white m-0">
                            {design.nombre || `Diseño #${design.id.slice(-4)}`}
                          </h4>
                          <span className="text-xs text-neutral-500">
                            Talón: <strong className="text-[var(--color-volt-text)]">{design.customText || "LEGADO"}</strong> | {design.date || "Hoy"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-display font-bold text-[var(--color-volt-text)] text-lg">
                          ${design.price ? design.price.toFixed(2) : "159.99"}
                        </span>

                        <button
                          onClick={(e) => handleDeleteDesign(design.id, e)}
                          title="Eliminar diseño"
                          className="bg-transparent border-none text-neutral-500 cursor-pointer p-1.5 hover:text-red-600 transition-colors"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
