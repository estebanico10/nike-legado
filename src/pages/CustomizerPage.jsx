import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import SneakerCustomizer from "../components/customizer/SneakerCustomizer";
import { useCustomizerStore } from "../store/useCustomizerStore";
import { useCartStore, useLoyaltyStore } from "../store/useStore";
import { useToast } from "../context/ToastContext";

const generateId = () => Date.now().toString();

export default function CustomizerPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToast } = useToast();
  
  const { colors, calculatePrice } = useCustomizerStore();

  const [activeColors, setActiveColors] = useState({
    swoosh: colors[0] || { name: 'Default', hex: '#000', id: 'def' },
    upper: colors[2] || colors[0] || { name: 'Default', hex: '#000', id: 'def' },
    sole: colors[1] || colors[0] || { name: 'Default', hex: '#000', id: 'def' },
    laces: colors[1] || colors[0] || { name: 'Default', hex: '#000', id: 'def' },
    heel: colors[6] || colors[0] || { name: 'Default', hex: '#000', id: 'def' }
  });

  const [activeTab, setActiveTab] = useState("swoosh");
  const [customText, setCustomText] = useState("LEGADO");
  const [selectedSize, setSelectedSize] = useState("28");
  const [savedDesigns, setSavedDesigns] = useState(() => {
    try {
      const stored = localStorage.getItem("nike_saved_designs");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Error loading saved designs:", e);
      return [];
    }
  });
  const [showSavedModal, setShowSavedModal] = useState(false);

  const priceDetails = calculatePrice(activeColors, customText);

  const handleColorChange = (layerId, colorObj) => {
    setActiveColors((prev) => ({
      ...prev,
      [layerId]: colorObj
    }));
  };

  const handleAddToCart = () => {
    const colorSummary = `Swoosh: ${activeColors.swoosh.name} | Upper: ${activeColors.upper.name} | Suela: ${activeColors.sole.name} | Cordones: ${activeColors.laces.name}`;
    
    const customItem = {
      id: generateId(),
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
      id: generateId(),
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

      <main className="h-screen w-full relative overflow-hidden bg-black text-white" style={{ fontFamily: "var(--font-body)" }}>
        
        {/* 3D Canvas Background */}
        <div className="absolute inset-0 z-0">
          <SneakerCustomizer
            mode="preview"
            activeColors={activeColors}
            onColorChange={handleColorChange}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            customText={customText}
            onTextChange={setCustomText}
          />
        </div>

        {/* Top Navbar overlay for 3D view */}
        <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[var(--color-volt)] text-[var(--color-ink)] font-display font-bold text-[10px] px-2.5 py-1 rounded-sm uppercase tracking-wider">
                EXCLUSIVO ONLINE
              </span>
            </div>
            <h1 className="font-display text-4xl font-extrabold uppercase tracking-tight text-white m-0 leading-none">
              NIKE BY YOU
            </h1>
            <h2 className="font-display text-2xl font-bold uppercase text-[var(--color-volt-text)] m-0 mt-1">
              LEGADO
            </h2>
            <p className="text-neutral-400 text-xs mt-3 leading-relaxed">
              Construye tu identidad callejera y andina capa por capa. Elige acabados de alta densidad y graba láser tu firma en el talón.
            </p>
          </div>

          <button
            onClick={() => setShowSavedModal(true)}
            className="pointer-events-auto backdrop-blur-md bg-black/50 border border-white/20 text-white px-5 py-3 rounded-full font-display text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:border-[var(--color-volt)] hover:text-[var(--color-volt-text)] transition-all cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
            Mis Diseños ({savedDesigns.length})
          </button>
        </div>

        {/* Bottom UI Area */}
        <div className="absolute bottom-0 left-0 w-full p-6 z-10 flex flex-col md:flex-row justify-between items-end gap-6 pointer-events-none">
          
          {/* Left: Size & Price */}
          <div className="pointer-events-auto backdrop-blur-xl bg-black/60 border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-4">
              <div>
                <span className="text-neutral-500 text-xs uppercase tracking-wider block mb-1">Precio Total</span>
                <span className="font-display text-3xl font-bold text-white">${priceDetails.totalPrice.toFixed(2)}</span>
              </div>
              <div className="text-right text-[10px] text-neutral-400">
                {priceDetails.premiumColorCost > 0 && <div className="text-[var(--color-volt-text)]">+ Color Premium</div>}
                {priceDetails.customTextCost > 0 && <div className="text-[var(--color-volt-text)]">+ Grabado Láser</div>}
              </div>
            </div>

            <div className="mb-5">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-neutral-400 uppercase tracking-wider">Talla (US/MX)</span>
                <span className="text-[var(--color-volt-text)] underline cursor-pointer">Guía</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["26", "26.5", "27", "27.5", "28", "28.5"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 min-w-[45px] py-2 rounded-lg text-sm font-semibold transition-all ${selectedSize === size ? "bg-[var(--color-volt)] text-black" : "bg-white/5 text-white hover:bg-white/10 border border-white/5"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full bg-[var(--color-volt)] text-black font-display font-bold uppercase text-sm py-4 rounded-xl shadow-[0_0_20px_rgba(206,255,0,0.3)] hover:shadow-[0_0_30px_rgba(206,255,0,0.5)] transition-all"
            >
              Añadir al Carrito
            </motion.button>
          </div>

          {/* Center/Right: Customization Controls */}
          <div className="pointer-events-auto flex-1 w-full max-w-2xl">
            <SneakerCustomizer
              mode="controls"
              activeColors={activeColors}
              onColorChange={handleColorChange}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              customText={customText}
              onTextChange={setCustomText}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveDesign}
                className="text-xs uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                Guardar Progreso
              </button>
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
