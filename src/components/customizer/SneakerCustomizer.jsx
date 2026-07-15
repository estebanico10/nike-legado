import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const COLOR_PALETTE = [
  { id: "volt", name: "Volt", hex: "#CEFF00", isPremium: true, description: "Amarillo neón firma Legado (+ $10)" },
  { id: "ink", name: "Ink", hex: "#111111", isPremium: false, description: "Negro profundo mate" },
  { id: "canvas", name: "Canvas", hex: "#FFFFFF", isPremium: false, description: "Blanco puro lienzo" },
  { id: "sale-red", name: "Sale Red", hex: "#D30005", isPremium: true, description: "Rojo vibrante competición (+ $10)" },
  { id: "indoor-blue", name: "Indoor Blue", hex: "#043174", isPremium: false, description: "Azul clásico cancha" },
  { id: "orange", name: "Orange", hex: "#FF6600", isPremium: true, description: "Naranja eléctrico urbano (+ $10)" },
  { id: "dark-grey", name: "Dark Grey", hex: "#333333", isPremium: false, description: "Gris asfalto oscuro" },
  { id: "light-grey", name: "Light Grey", hex: "#E5E5E5", isPremium: false, description: "Gris neblina andina" },
  { id: "andean-leather", name: "Andean Leather", hex: "#8B4513", isPremium: true, description: "Cuero curtido tradicional (+ $10)" }
];

export const LAYERS = [
  { id: "swoosh", label: "Swoosh (Logo)", icon: "✓" },
  { id: "upper", label: "Cuerpo (Upper)", icon: "👟" },
  { id: "sole", label: "Suela (Sole)", icon: "⚡" },
  { id: "laces", label: "Cordones (Laces)", icon: "🎀" },
  { id: "heel", label: "Talón & Texto", icon: "🏷️" }
];

export function calculatePriceDetails(activeColors = {}, customText = "") {
  const basePrice = 149.99;
  const hasPremiumColor = Object.values(activeColors).some(c => c && c.isPremium);
  const premiumColorCost = hasPremiumColor ? 10.00 : 0.00;
  const customTextCost = (customText && customText.trim().length > 0) ? 15.00 : 0.00;
  const totalPrice = basePrice + premiumColorCost + customTextCost;
  return {
    basePrice,
    premiumColorCost,
    customTextCost,
    totalPrice
  };
}


import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls, Html, useProgress } from "@react-three/drei";
import ShoeModel3D from "./ShoeModel3D";
import CameraController from "./CameraController";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: "var(--color-volt)", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", letterSpacing: "2px" }}>
        {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

export default function SneakerCustomizer({
  activeColors = {
    swoosh: COLOR_PALETTE[0],
    upper: COLOR_PALETTE[2],
    sole: COLOR_PALETTE[1],
    laces: COLOR_PALETTE[1],
    heel: COLOR_PALETTE[6]
  },
  onColorChange,
  activeTab = "swoosh",
  onTabChange,
  customText = "LEGADO",
  onTextChange,
  mode = "full" // "full" | "preview" | "controls"
}) {
  const [hoveredLayer, setHoveredLayer] = useState(null);
  const currentLayerObj = LAYERS.find(l => l.id === activeTab) || LAYERS[0];
  const currentColorObj = activeColors[activeTab] || COLOR_PALETTE[0];
  const priceDetails = calculatePriceDetails(activeColors, customText);

  // PREVIEW: 3D Canvas taking up the designated space
  const renderPreview = () => (
    <div 
      style={{
        position: "relative",
        width: "100%",
        minHeight: mode === "full" ? "70vh" : "420px",
        backgroundColor: "#050505",
        borderRadius: "16px",
        border: "1px solid #222",
        overflow: "hidden",
        boxShadow: "inset 0 0 100px rgba(0,0,0,0.9)"
      }}
    >
      <Canvas shadows camera={{ position: [4, 3, 6], fov: 45 }}>
        <Suspense fallback={<Loader />}>
          {/* Entorno y Luces */}
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <Environment preset="studio" />
          
          {/* Sombras de Contacto */}
          <ContactShadows position={[0, -0.4, 0]} opacity={0.7} scale={10} blur={2.5} far={4} />
          
          {/* Modelo 3D */}
          <ShoeModel3D colors={activeColors} customText={customText} activeTab={activeTab} />
          
          {/* Controlador Cinemático de Cámara */}
          <CameraController activeTab={activeTab} />
          
          {/* Controles para rotación manual */}
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2} 
            minDistance={3}
            maxDistance={10}
            makeDefault
          />
        </Suspense>
      </Canvas>

      {/* Etiquetas sobrepuestas (Glassmorphism UI) */}
      <div style={{
        position: "absolute",
        top: "var(--space-md)",
        left: "var(--space-md)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        zIndex: 10
      }}>
        <span style={{
          background: "rgba(206, 255, 0, 0.1)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          color: "var(--color-volt)",
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "var(--type-micro)",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          border: "1px solid rgba(206, 255, 0, 0.3)",
          textTransform: "uppercase"
        }}>
          ● Vista 3D WebGL
        </span>
      </div>
      
      <div style={{
        position: "absolute",
        bottom: "var(--space-md)",
        right: "var(--space-md)",
        background: "rgba(10, 10, 10, 0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "8px 16px",
        borderRadius: "30px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 10
      }}>
        <span style={{ color: "#AAA", fontSize: "var(--type-caption)", textTransform: "uppercase" }}>Visualizando:</span>
        <span style={{ color: "#FFF", fontSize: "var(--type-caption)", fontWeight: "bold" }}>{currentLayerObj.label}</span>
      </div>
    </div>
  );

  // CONTROLES: UI minimalista con Glassmorphism
  const renderControls = () => (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "var(--space-md)", 
      width: "100%",
      position: mode === "full" ? "absolute" : "relative",
      bottom: mode === "full" ? "30px" : "0",
      left: mode === "full" ? "50%" : "0",
      transform: mode === "full" ? "translateX(-50%)" : "none",
      maxWidth: "800px",
      zIndex: 20
    }}>
      <div style={{
        background: "rgba(15, 15, 15, 0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        padding: "var(--space-md)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
      }}>
        {/* Pestañas de Capas */}
        <div style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "12px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          marginBottom: "16px"
        }}>
          {LAYERS.map((layer) => {
            const isSelected = activeTab === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => onTabChange && onTabChange(layer.id)}
                style={{
                  position: "relative",
                  padding: "10px 16px",
                  background: isSelected ? "rgba(255,255,255,0.1)" : "transparent",
                  border: "none",
                  borderRadius: "12px",
                  color: isSelected ? "var(--color-volt)" : "#A0A0A0",
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-body-sm)",
                  fontWeight: isSelected ? 700 : 500,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s"
                }}
              >
                <span>{layer.icon}</span>
                <span>{layer.label}</span>
              </button>
            );
          })}
        </div>

        {/* Panel de Colores */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "10px" }}>
              {COLOR_PALETTE.map((colorItem) => {
                const isSelectedColor = currentColorObj.hex === colorItem.hex;
                return (
                  <motion.button
                    key={colorItem.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onColorChange && onColorChange(activeTab, colorItem)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px",
                      background: isSelectedColor ? "rgba(206, 255, 0, 0.1)" : "rgba(255, 255, 255, 0.03)",
                      border: isSelectedColor ? "1px solid var(--color-volt)" : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: colorItem.hex,
                      border: colorItem.hex === "#FFFFFF" || colorItem.hex === "#E5E5E5" ? "1px solid #444" : "1px solid transparent",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.4)"
                    }} />
                    <span style={{ color: "#FFF", fontSize: "10px", fontWeight: 600, textAlign: "center" }}>
                      {colorItem.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Texto de Talón */}
            {activeTab === "heel" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{ marginTop: "16px", display: "flex", gap: "10px" }}
              >
                <input
                  type="text"
                  maxLength={8}
                  value={customText}
                  onChange={(e) => onTextChange && onTextChange(e.target.value.toUpperCase().replace(/[^A-Z0-9 -]/g, ""))}
                  placeholder="LEGADO"
                  style={{
                    flex: 1,
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    color: "var(--color-volt)",
                    fontFamily: "var(--font-display)",
                    fontSize: "1.2rem",
                    letterSpacing: "4px",
                    textTransform: "uppercase",
                    outline: "none"
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  if (mode === "preview") return renderPreview();
  if (mode === "controls") return renderControls();

  // MODO FULL (Layout unificado)
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "80vh", display: "flex", flexDirection: "column" }}>
      {renderPreview()}
      {renderControls()}
    </div>
  );
}
