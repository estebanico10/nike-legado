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

      <style>{`
        .customizer-split-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-2xl);
        }
        @media (min-width: 1024px) {
          .customizer-split-grid {
            display: grid;
            grid-template-columns: minmax(380px, 1.05fr) minmax(420px, 1.35fr);
            gap: var(--space-2xl);
            align-items: start;
          }
          .customizer-sticky-left {
            position: sticky;
            top: 100px;
          }
        }
        .size-btn {
          background-color: #141414;
          border: 1px solid #292929;
          color: #CCC;
          font-family: var(--font-display);
          font-size: var(--type-body);
          font-weight: 600;
          padding: 12px 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .size-btn:hover {
          border-color: var(--color-volt);
          color: #FFF;
          transform: translateY(-2px);
        }
        .size-btn.active {
          background-color: var(--color-volt);
          border-color: var(--color-volt);
          color: var(--color-ink);
          font-weight: 800;
          box-shadow: 0 4px 15px rgba(206, 255, 0, 0.4);
        }
      `}</style>

      <main style={{ minHeight: "100vh", padding: "var(--space-3xl) 0 var(--space-5xl)" }}>
        <div className="container" style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 var(--space-lg)" }}>
          
          {/* Studio Header */}
          <header style={{ marginBottom: "var(--space-2xl)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "var(--space-md)", borderBottom: "1px solid #222", paddingBottom: "var(--space-lg)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{
                  backgroundColor: "var(--color-volt)",
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "11px",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  EXCLUSIVO ONLINE
                </span>
                <span style={{ color: "#888", fontSize: "var(--type-caption)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  ESTUDIO 3D DIGITAL
                </span>
              </div>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--type-h1)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-tight)",
                color: "#F5F5F5",
                margin: 0,
                lineHeight: 1.1
              }}>
                NIKE BY YOU <span style={{ color: "var(--color-volt)" }}>— LEGADO</span>
              </h1>
              <p style={{ color: "#999", fontSize: "var(--type-body-sm)", margin: "8px 0 0 0", maxWidth: "600px" }}>
                Construye tu identidad callejera y andina capa por capa. Elige acabados de alta densidad y graba láser tu firma exclusiva en el talón.
              </p>
            </div>

            <button
              onClick={() => setShowSavedModal(true)}
              style={{
                backgroundColor: "#161616",
                border: "1px solid #333",
                color: "#F5F5F5",
                padding: "12px 20px",
                borderRadius: "30px",
                fontFamily: "var(--font-display)",
                fontSize: "var(--type-body-sm)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-volt)"; e.currentTarget.style.color = "var(--color-volt)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#F5F5F5"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Mis Diseños ({savedDesigns.length})
            </button>
          </header>

          {/* Desktop Split View Layout */}
          <div className="customizer-split-grid">
            
            {/* LEFT COLUMN: Sticky Sneaker SVG Preview + Price Breakdown Card */}
            <div className="customizer-sticky-left" style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
              
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
              <div style={{
                backgroundColor: "#111111",
                border: "1px solid #222",
                borderRadius: "16px",
                padding: "var(--space-lg)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-h4)",
                  textTransform: "uppercase",
                  color: "#F5F5F5",
                  margin: "0 0 var(--space-md) 0",
                  borderBottom: "1px solid #222",
                  paddingBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span>Desglose de Precio</span>
                  <span style={{ color: "var(--color-volt)" }}>${priceDetails.totalPrice.toFixed(2)}</span>
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "var(--type-body-sm)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#CCC" }}>
                    <span>Zapatilla Base Nike By You</span>
                    <span style={{ fontWeight: 600, color: "#FFF" }}>$149.99</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", color: priceDetails.premiumColorCost > 0 ? "var(--color-volt)" : "#666" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      Acabado Color Premium
                      {priceDetails.premiumColorCost > 0 && (
                        <span style={{ fontSize: "10px", backgroundColor: "rgba(206,255,0,0.15)", color: "var(--color-volt)", padding: "2px 6px", borderRadius: "4px" }}>ACTIVO</span>
                      )}
                    </span>
                    <span style={{ fontWeight: 600 }}>+${priceDetails.premiumColorCost.toFixed(2)}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", color: priceDetails.customTextCost > 0 ? "var(--color-volt)" : "#666" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      Grabado Láser en Talón ({customText || "Sin texto"})
                      {priceDetails.customTextCost > 0 && (
                        <span style={{ fontSize: "10px", backgroundColor: "rgba(206,255,0,0.15)", color: "var(--color-volt)", padding: "2px 6px", borderRadius: "4px" }}>CUSTOM</span>
                      )}
                    </span>
                    <span style={{ fontWeight: 600 }}>+${priceDetails.customTextCost.toFixed(2)}</span>
                  </div>

                  <div style={{
                    borderTop: "1px dashed #333",
                    marginTop: "8px",
                    paddingTop: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline"
                  }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", color: "#FFF", textTransform: "uppercase" }}>
                      Total Inversión
                    </span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", color: "var(--color-volt)", fontWeight: 700 }}>
                      ${priceDetails.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Customization Tabs, Color Palette, Size Selector & Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
              
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
              <div style={{
                backgroundColor: "#111111",
                border: "1px solid #222",
                borderRadius: "16px",
                padding: "var(--space-lg)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", textTransform: "uppercase", color: "#F5F5F5", margin: 0 }}>
                    Selecciona Tu Talla <span style={{ color: "#888", fontSize: "14px", fontWeight: 400 }}>(CM / MX)</span>
                  </h3>
                  <span style={{ fontSize: "var(--type-caption)", color: "var(--color-volt)", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>
                    Guía de Tallas
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))", gap: "10px" }}>
                  {SIZES_MX.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`size-btn ${selectedSize === size ? "active" : ""}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <p style={{ fontSize: "var(--type-caption)", color: "#777", marginTop: "12px", marginBottom: 0 }}>
                  📏 Ajuste fiel a la talla. Recomendamos pedir media talla más si prefieres ajuste holgado para básquetbol o uso urbano.
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-md)",
                backgroundColor: "#141414",
                border: "1px solid #2A2A2A",
                borderRadius: "16px",
                padding: "var(--space-lg)"
              }}>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAddToCart}
                  style={{
                    backgroundColor: "var(--color-volt)",
                    color: "var(--color-ink)",
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--type-h3)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    border: "none",
                    borderRadius: "12px",
                    padding: "18px var(--space-lg)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    boxShadow: "0 8px 25px rgba(206, 255, 0, 0.3)",
                    transition: "all 0.2s"
                  }}
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
                  style={{
                    backgroundColor: "transparent",
                    color: "#F5F5F5",
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--type-h4)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    border: "2px solid #333",
                    borderRadius: "12px",
                    padding: "16px var(--space-lg)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-volt)"; e.currentTarget.style.color = "var(--color-volt)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#F5F5F5"; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  GUARDAR EN MIS DISEÑOS
                </motion.button>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid #222", fontSize: "var(--type-micro)", color: "#888" }}>
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
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(10px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-md)"
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                backgroundColor: "#111111",
                border: "1px solid #333",
                borderRadius: "20px",
                padding: "var(--space-xl)",
                width: "100%",
                maxWidth: "680px",
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 25px 50px rgba(0,0,0,0.8)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", borderBottom: "1px solid #222", paddingBottom: "var(--space-md)" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", textTransform: "uppercase", color: "#FFF", margin: 0 }}>
                    Mis Diseños Guardados
                  </h3>
                  <p style={{ fontSize: "var(--type-caption)", color: "#888", margin: "4px 0 0 0" }}>
                    Carga tus combinaciones personalizadas para continuar editando o comprar.
                  </p>
                </div>
                <button
                  onClick={() => setShowSavedModal(false)}
                  style={{ background: "none", border: "none", color: "#888", cursor: "pointer", padding: "4px" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px" }}>
                {savedDesigns.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "var(--space-2xl) 0", color: "#666" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: "0 auto 12px", opacity: 0.5 }}>
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", textTransform: "uppercase" }}>No tienes diseños guardados</p>
                    <p style={{ fontSize: "var(--type-caption)" }}>Crea una combinación única y haz clic en "Guardar en Mis Diseños".</p>
                  </div>
                ) : (
                  savedDesigns.map((design) => (
                    <div
                      key={design.id}
                      onClick={() => handleLoadDesign(design)}
                      style={{
                        backgroundColor: "#181818",
                        border: "1px solid #2A2A2A",
                        borderRadius: "12px",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-volt)"; e.currentTarget.style.backgroundColor = "#202020"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2A2A2A"; e.currentTarget.style.backgroundColor = "#181818"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "10px",
                          backgroundColor: "#0F0F0F",
                          border: "1px solid #333",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          overflow: "hidden"
                        }}>
                          {/* Mini dots showing colors */}
                          <div style={{ display: "flex", gap: "3px" }}>
                            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: design.colors?.swoosh?.hex || "#CEFF00" }} />
                            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: design.colors?.upper?.hex || "#FFF" }} />
                            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: design.colors?.sole?.hex || "#111" }} />
                          </div>
                        </div>

                        <div>
                          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body)", textTransform: "uppercase", color: "#FFF", margin: 0 }}>
                            {design.nombre || `Diseño #${design.id.slice(-4)}`}
                          </h4>
                          <span style={{ fontSize: "var(--type-caption)", color: "#888" }}>
                            Talón: <strong style={{ color: "var(--color-volt)" }}>{design.customText || "LEGADO"}</strong> | {design.date || "Hoy"}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-volt)", fontSize: "var(--type-h4)" }}>
                          ${design.price ? design.price.toFixed(2) : "159.99"}
                        </span>

                        <button
                          onClick={(e) => handleDeleteDesign(design.id, e)}
                          title="Eliminar diseño"
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#666",
                            cursor: "pointer",
                            padding: "6px"
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "#D30005"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "#666"; }}
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
