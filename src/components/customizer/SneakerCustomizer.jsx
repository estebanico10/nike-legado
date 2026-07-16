import { Suspense, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomizerStore } from "../../store/useCustomizerStore";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls, Html, useProgress } from "@react-three/drei";
import NikeShoeModel from "./NikeShoeModel";
import GLBShoeModel from "./GLBShoeModel";
import CameraController from "./CameraController";
import ErrorBoundary from "../ErrorBoundary";
import gsap from "gsap";

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
  activeColors = {},
  onColorChange,
  activeTab = "swoosh",
  onTabChange,
  customText = "LEGADO",
  onTextChange,
  mode = "full", // "full" | "preview" | "controls"
  selectedModelId = "air-force-1",
  shoeVisibility = "both"
}) {
  const { colors, layers, shoeModels } = useCustomizerStore();
  const selectedModelConfig = shoeModels.find(m => m.id === selectedModelId) || shoeModels[0];
  const currentLayerObj = layers.find(l => l.id === activeTab) || layers[0] || { id: "swoosh", label: "Swoosh" };
  const currentColorObj = activeColors[activeTab] || colors[0] || { hex: "#000", name: "Default" };

  const orbitControlsRef = useRef();
  const [customView, setCustomView] = useState("general");
  const [autoRotate, setAutoRotate] = useState(false);

  const handleZoom = (direction) => {
    if (orbitControlsRef.current && orbitControlsRef.current.object) {
      const camera = orbitControlsRef.current.object;
      const target = orbitControlsRef.current.target;
      const currentPos = camera.position.clone();
      const dirVec = currentPos.clone().sub(target).normalize();
      const distance = currentPos.distanceTo(target);
      const newDistance = direction === "in" 
        ? Math.max(2.5, distance * 0.75) 
        : Math.min(16, distance * 1.3);
      
      const newPos = target.clone().add(dirVec.multiplyScalar(newDistance));
      
      gsap.to(camera.position, {
        x: newPos.x,
        y: newPos.y,
        z: newPos.z,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => orbitControlsRef.current?.update()
      });
    }
  };

  const handleTabSelection = (layerId) => {
    if (onTabChange) onTabChange(layerId);
    setCustomView(layerId);
    setAutoRotate(false);
  };

  // PREVIEW: 3D Canvas con controles y HUD de visualización optimizados para alto rendimiento
  const renderPreview = () => (
    <div 
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        overflow: "hidden"
      }}
    >
      <ErrorBoundary fallback={
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#111", color: "#FFF", padding: "20px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--color-volt)", textTransform: "uppercase", marginBottom: "8px" }}>Visor 3D</p>
          <p style={{ fontSize: "0.9rem", color: "#AAA" }}>Modelo 3D recargándose. Por favor actualice la página o verifique su conexión.</p>
        </div>
      }>
        <Canvas 
          shadows 
          camera={{ position: [5, 2.2, 6.2], fov: 45 }}
          dpr={[1, Math.min(1.5, typeof window !== 'undefined' ? window.devicePixelRatio : 1)]}
          performance={{ min: 0.5 }}
          gl={{ powerPreference: "high-performance", antialias: true, alpha: false }}
        >
          <Suspense fallback={<Loader />}>
            {/* Entorno y Luces */}
            <ambientLight intensity={0.6} />
            <spotLight position={[10, 12, 10]} angle={0.2} penumbra={1} intensity={1.2} castShadow />
            <Environment preset="studio" />
            
            {/* Sombras de Contacto — posicionadas justo bajo el zapato */}
            <ContactShadows position={[0, -0.38, 0]} opacity={0.55} scale={3.5} blur={1.8} far={1.2} resolution={512} frames={1} />
            
            {/* Modelo 3D */}
            {selectedModelConfig.type === "procedural" ? (
              <NikeShoeModel colors={activeColors} customText={customText} shoeVisibility={shoeVisibility} />
            ) : (
              <GLBShoeModel modelConfig={selectedModelConfig} colors={activeColors} shoeVisibility={shoeVisibility} />
            )}
            
            {/* Controlador Cinemático de Cámara (GSAP) */}
            <CameraController activeTab={activeTab} controlsRef={orbitControlsRef} customView={customView} />
            
            {/* Controles — zoom scroll/pinch completamente libre */}
            <OrbitControls 
              ref={orbitControlsRef}
              enableZoom={true}
              zoomSpeed={1.2}
              enablePan={true} 
              screenSpacePanning={true}
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
              minDistance={1.2}
              maxDistance={22}
              makeDefault
              autoRotate={autoRotate}
              autoRotateSpeed={1.8}
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* HUD de Controles de Visualización 3D (Ergonómico, flotante y accesible) */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(12, 12, 12, 0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        padding: "6px 12px",
        borderRadius: "100px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        zIndex: 30,
        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        pointerEvents: "auto",
        maxWidth: "92vw",
        overflowX: "auto"
      }}>
        {/* Zoom In / Zoom Out */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", borderRight: "1px solid rgba(255,255,255,0.15)", paddingRight: "8px" }}>
          <button
            onClick={() => handleZoom("in")}
            title="Acercar (Zoom In)"
            style={{
              background: "rgba(255,255,255,0.08)", border: "none", color: "#FFF", width: "28px", height: "28px",
              borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: "bold", transition: "all 0.2s"
            }}
          >
            +
          </button>
          <button
            onClick={() => handleZoom("out")}
            title="Alejar (Zoom Out)"
            style={{
              background: "rgba(255,255,255,0.08)", border: "none", color: "#FFF", width: "28px", height: "28px",
              borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: "bold", transition: "all 0.2s"
            }}
          >
            -
          </button>
        </div>

        {/* Vistas predefinidas */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {[
            { id: "general", label: "General", icon: "👁️" },
            { id: "lateral", label: "Lateral", icon: "👟" },
            { id: "top", label: "Superior", icon: "⬆️" },
            { id: "heel", label: "Talón", icon: "🏷️" }
          ].map(view => {
            const isCurrent = customView === view.id;
            return (
              <button
                key={view.id}
                onClick={() => {
                  setCustomView(view.id);
                  setAutoRotate(false);
                }}
                style={{
                  background: isCurrent ? "var(--color-volt)" : "transparent",
                  color: isCurrent ? "#000" : "#AAA",
                  border: isCurrent ? "1px solid var(--color-volt)" : "1px solid transparent",
                  padding: "4px 10px",
                  borderRadius: "100px",
                  fontSize: "11px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap"
                }}
              >
                <span>{view.label}</span>
              </button>
            );
          })}
        </div>

        {/* Auto-Rotate Turntable */}
        <div style={{ borderLeft: "1px solid rgba(255,255,255,0.15)", paddingLeft: "8px" }}>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Giro 360° automático"
            style={{
              background: autoRotate ? "var(--color-volt)" : "rgba(255,255,255,0.08)",
              color: autoRotate ? "#000" : "#FFF",
              border: "none",
              padding: "4px 10px",
              borderRadius: "100px",
              fontSize: "11px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s",
              whiteSpace: "nowrap"
            }}
          >
            <span>🔄 360°</span>
          </button>
        </div>
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
      position: "relative",
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
          {layers.map((layer) => {
            const isSelected = activeTab === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => handleTabSelection(layer.id)}
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
              {colors.map((colorItem) => {
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
