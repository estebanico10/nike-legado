import { useState } from "react";
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
  const [isRotating, setIsRotating] = useState(false);

  const currentLayerObj = LAYERS.find(l => l.id === activeTab) || LAYERS[0];
  const currentColorObj = activeColors[activeTab] || COLOR_PALETTE[0];
  const priceDetails = calculatePriceDetails(activeColors, customText);

  const renderPreview = () => (
    <div 
      style={{
        position: "relative",
        width: "100%",
        minHeight: "420px",
        backgroundColor: "#0F0F0F",
        borderRadius: "16px",
        border: "1px solid #222",
        padding: "var(--space-lg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        boxShadow: "inset 0 0 80px rgba(0,0,0,0.8)"
      }}
    >
      {/* Background Decorative Grid & Glow */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "radial-gradient(#222 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        opacity: 0.6,
        pointerEvents: "none"
      }} />
      
      <motion.div
        animate={{
          scale: isRotating ? [1, 1.05, 1] : 1,
          rotate: isRotating ? [0, -2, 2, 0] : 0
        }}
        transition={{ duration: 0.6 }}
        style={{
          position: "absolute",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${activeColors.swoosh?.hex || "#CEFF00"}22 0%, transparent 70%)`,
          filter: "blur(40px)",
          pointerEvents: "none"
        }}
      />

      {/* Viewport Header Controls */}
      <div style={{
        position: "absolute",
        top: "var(--space-md)",
        left: "var(--space-md)",
        right: "var(--space-md)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{
            backgroundColor: "rgba(206, 255, 0, 0.15)",
            color: "var(--color-volt)",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "var(--type-micro)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            border: "1px solid var(--color-volt)",
            textTransform: "uppercase"
          }}>
            ● Vista Interactiva por Capas
          </span>
          {hoveredLayer && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                color: "#F5F5F5",
                fontSize: "var(--type-caption)",
                backgroundColor: "#1A1A1A",
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid #333"
              }}
            >
              Clic para editar: <strong>{LAYERS.find(l => l.id === hoveredLayer)?.label}</strong>
            </motion.span>
          )}
        </div>

        <button
          onClick={() => setIsRotating(!isRotating)}
          style={{
            backgroundColor: "#1A1A1A",
            color: "#CCCCCC",
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "6px 12px",
            fontSize: "var(--type-caption)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-volt)"; e.currentTarget.style.color = "#FFF"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#CCCCCC"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
          Inspeccionar
        </button>
      </div>

      {/* High-Impact SVG Sneaker Model */}
      <motion.div
        key="sneaker-preview"
        style={{ width: "100%", maxWidth: "620px", position: "relative", zIndex: 2, padding: "20px 0" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 800 480" style={{ width: "100%", height: "auto", overflow: "visible", dropShadow: "0 25px 35px rgba(0,0,0,0.6)" }}>
          <defs>
            <linearGradient id="soleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#000" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="upperShade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
              <stop offset="80%" stopColor="#000" stopOpacity="0.25" />
            </linearGradient>
            <filter id="glowActive" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="var(--color-volt)" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Ground Shadow */}
          <ellipse cx="410" cy="430" rx="310" ry="22" fill="rgba(0,0,0,0.6)" filter="blur(10px)" />
          <ellipse cx="430" cy="432" rx="240" ry="12" fill="rgba(0,0,0,0.8)" filter="blur(5px)" />

          {/* ==================== 1. SOLE (SUELA) ==================== */}
          <g
            onClick={() => onTabChange && onTabChange("sole")}
            onMouseEnter={() => setHoveredLayer("sole")}
            onMouseLeave={() => setHoveredLayer(null)}
            style={{ cursor: "pointer", transition: "all 0.3s" }}
            filter={activeTab === "sole" ? "url(#glowActive)" : "none"}
          >
            <path
              d="M 120 380 Q 110 410 140 415 L 670 415 Q 710 410 705 365 Q 690 355 640 360 L 160 365 Q 130 365 120 380 Z"
              fill={activeColors.sole?.hex || "#111111"}
              stroke="#1A1A1A"
              strokeWidth="3"
            />
            <path
              d="M 120 380 Q 110 410 140 415 L 670 415 Q 710 410 705 365 Q 690 355 640 360 L 160 365 Q 130 365 120 380 Z"
              fill="url(#soleGradient)"
              style={{ pointerEvents: "none" }}
            />
            <path d="M 140 415 L 150 405 M 170 415 L 180 405 M 200 415 L 210 405 M 620 415 L 630 405 M 650 415 L 660 405" stroke="#111" strokeWidth="2" opacity="0.4" />
            <path d="M 140 375 Q 400 373 680 373" stroke={activeColors.sole?.hex === "#111111" || activeColors.sole?.hex === "#333333" ? "#666" : "#222"} strokeWidth="2" strokeDasharray="8 6" fill="none" />
            <text x="480" y="398" fill={activeColors.sole?.hex === "#FFFFFF" || activeColors.sole?.hex === "#E5E5E5" ? "#111" : "#FFF"} opacity="0.7" fontFamily="var(--font-display)" fontWeight="800" fontSize="16" letterSpacing="4">
              AIR LEGADO
            </text>
          </g>

          {/* ==================== 2. UPPER (CUERPO PRINCIPAL) ==================== */}
          <g
            onClick={() => onTabChange && onTabChange("upper")}
            onMouseEnter={() => setHoveredLayer("upper")}
            onMouseLeave={() => setHoveredLayer(null)}
            style={{ cursor: "pointer" }}
            filter={activeTab === "upper" ? "url(#glowActive)" : "none"}
          >
            <path
              d="M 480 180 C 560 165 620 170 660 210 Q 690 260 690 355 L 450 360 L 480 180 Z"
              fill={activeColors.upper?.hex || "#FFFFFF"}
              stroke="#1A1A1A"
              strokeWidth="2.5"
            />
            <path
              d="M 310 240 L 480 180 L 450 360 L 250 362 Z"
              fill={activeColors.upper?.hex || "#FFFFFF"}
              stroke="#1A1A1A"
              strokeWidth="2.5"
            />
            <path
              d="M 140 365 Q 130 320 220 280 L 310 240 L 250 362 Z"
              fill={activeColors.upper?.hex || "#FFFFFF"}
              stroke="#1A1A1A"
              strokeWidth="2.5"
            />
            <path
              d="M 140 365 Q 125 330 180 300 Q 230 280 270 300 L 250 362 Z"
              fill={activeColors.upper?.hex || "#FFFFFF"}
              stroke="#1A1A1A"
              strokeWidth="2.5"
              style={{ filter: "brightness(0.92)" }}
            />
            <path
              d="M 310 240 L 460 185 Q 475 220 440 280 L 290 310 Z"
              fill={activeColors.upper?.hex || "#FFFFFF"}
              stroke="#1A1A1A"
              strokeWidth="2.5"
              style={{ filter: "brightness(0.96)" }}
            />
            <path
              d="M 140 365 Q 130 320 220 280 L 480 180 C 560 165 620 170 660 210 Q 690 260 690 355 L 140 365 Z"
              fill="url(#upperShade)"
              style={{ pointerEvents: "none" }}
            />
            <g fill="#1A1A1A" opacity="0.35">
              <circle cx="200" cy="325" r="3" />
              <circle cx="215" cy="320" r="3" />
              <circle cx="230" cy="317" r="3" />
              <circle cx="195" cy="338" r="3" />
              <circle cx="212" cy="334" r="3" />
              <circle cx="228" cy="331" r="3" />
              <circle cx="244" cy="328" r="3" />
            </g>
            <path d="M 260 362 L 280 305 Q 230 288 185 305" stroke={activeColors.upper?.hex === "#111111" || activeColors.upper?.hex === "#333333" ? "#666" : "#333"} strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
            <path d="M 445 360 L 472 188" stroke={activeColors.upper?.hex === "#111111" || activeColors.upper?.hex === "#333333" ? "#666" : "#333"} strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
          </g>

          {/* ==================== 3. HEEL PATCH / TEXT AREA (TALÓN) ==================== */}
          <g
            onClick={() => onTabChange && onTabChange("heel")}
            onMouseEnter={() => setHoveredLayer("heel")}
            onMouseLeave={() => setHoveredLayer(null)}
            style={{ cursor: "pointer" }}
            filter={activeTab === "heel" ? "url(#glowActive)" : "none"}
          >
            <path
              d="M 590 175 C 630 170 660 180 675 220 L 650 255 C 630 240 600 235 580 230 Z"
              fill={activeColors.heel?.hex || "#333333"}
              stroke="#1A1A1A"
              strokeWidth="2.5"
            />
            <path
              d="M 596 182 C 628 178 653 186 667 220 L 647 248 C 630 235 602 230 584 225 Z"
              stroke={activeColors.heel?.hex === "#111111" || activeColors.heel?.hex === "#333333" ? "#AAA" : "#111"}
              strokeWidth="1.5"
              strokeDasharray="4 3"
              fill="none"
            />
            <g transform="rotate(12 630 215)">
              <text
                x="630"
                y="218"
                textAnchor="middle"
                fill={activeColors.heel?.hex === "#FFFFFF" || activeColors.heel?.hex === "#E5E5E5" || activeColors.heel?.hex === "#CEFF00" ? "#111111" : "#FFFFFF"}
                fontFamily="var(--font-display)"
                fontWeight="800"
                fontSize={customText && customText.length > 6 ? "15px" : "18px"}
                letterSpacing="2px"
                style={{ pointerEvents: "none", filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.4))" }}
              >
                {(customText || "LEGADO").toUpperCase()}
              </text>
            </g>
          </g>

          {/* ==================== 4. SWOOSH (LOGO) ==================== */}
          <g
            onClick={() => onTabChange && onTabChange("swoosh")}
            onMouseEnter={() => setHoveredLayer("swoosh")}
            onMouseLeave={() => setHoveredLayer(null)}
            style={{ cursor: "pointer" }}
            filter={activeTab === "swoosh" ? "url(#glowActive)" : "drop-shadow(2px 6px 10px rgba(0,0,0,0.5))"}
          >
            <path
              d="M 685 245 Q 520 295 380 330 Q 300 350 250 315 Q 240 305 255 295 Q 280 280 340 305 C 440 345 560 280 685 245 Z"
              fill={activeColors.swoosh?.hex || "#CEFF00"}
              stroke="#1A1A1A"
              strokeWidth="3"
            />
            <path
              d="M 670 250 Q 520 298 385 330 Q 310 345 265 315 Q 255 308 265 302 Q 280 292 335 310 C 430 342 550 285 670 250 Z"
              fill="#FFF"
              opacity="0.18"
              style={{ pointerEvents: "none" }}
            />
          </g>

          {/* ==================== 5. LACES (CORDONES) ==================== */}
          <g
            onClick={() => onTabChange && onTabChange("laces")}
            onMouseEnter={() => setHoveredLayer("laces")}
            onMouseLeave={() => setHoveredLayer(null)}
            style={{ cursor: "pointer" }}
            filter={activeTab === "laces" ? "url(#glowActive)" : "none"}
          >
            <path
              d="M 360 220 L 490 145 Q 530 160 510 205 L 430 260 Z"
              fill="#222"
              stroke="#111"
              strokeWidth="2"
            />
            <path d="M 330 255 Q 380 230 435 270" stroke={activeColors.laces?.hex || "#111111"} strokeWidth="14" strokeLinecap="round" />
            <path d="M 350 240 Q 400 215 450 250" stroke={activeColors.laces?.hex || "#111111"} strokeWidth="14" strokeLinecap="round" />
            <path d="M 370 225 Q 420 200 465 230" stroke={activeColors.laces?.hex || "#111111"} strokeWidth="14" strokeLinecap="round" />
            <path d="M 390 210 Q 440 185 480 210" stroke={activeColors.laces?.hex || "#111111"} strokeWidth="14" strokeLinecap="round" />
            <circle cx="330" cy="255" r="5" fill="#333" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="350" cy="240" r="5" fill="#333" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="370" cy="225" r="5" fill="#333" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="390" cy="210" r="5" fill="#333" stroke="#FFF" strokeWidth="1.5" />
            <path d="M 470 190 Q 495 160 515 185 Q 490 205 470 190 Z" fill={activeColors.laces?.hex || "#111111"} stroke="#111" strokeWidth="1.5" />
            <path d="M 470 190 Q 455 160 435 180 Q 450 205 470 190 Z" fill={activeColors.laces?.hex || "#111111"} stroke="#111" strokeWidth="1.5" />
            <line x1="470" y1="190" x2="490" y2="225" stroke={activeColors.laces?.hex || "#111111"} strokeWidth="6" strokeLinecap="round" />
            <line x1="490" y1="225" x2="494" y2="232" stroke="var(--color-volt)" strokeWidth="6" strokeLinecap="round" />
          </g>
        </svg>
      </motion.div>

      {/* Selected Layer Indicator Tag */}
      <div style={{
        position: "absolute",
        bottom: "var(--space-md)",
        backgroundColor: "#111111",
        border: "1px solid #333",
        padding: "8px 16px",
        borderRadius: "30px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 10
      }}>
        <span style={{ color: "#888", fontSize: "var(--type-caption)", textTransform: "uppercase" }}>Capas activas:</span>
        <div style={{ display: "flex", gap: "6px" }}>
          {LAYERS.map(layer => (
            <button
              key={layer.id}
              onClick={() => onTabChange && onTabChange(layer.id)}
              title={layer.label}
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: activeColors[layer.id]?.hex || "#333",
                border: activeTab === layer.id ? "2px solid var(--color-volt)" : "1px solid #444",
                cursor: "pointer",
                transition: "transform 0.2s",
                transform: activeTab === layer.id ? "scale(1.2)" : "scale(1)"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderControls = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)", width: "100%" }}>
      {/* Layer Navigation Tabs */}
      <div style={{
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        paddingBottom: "4px",
        borderBottom: "1px solid #222"
      }}>
        {LAYERS.map((layer) => {
          const isSelected = activeTab === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => onTabChange && onTabChange(layer.id)}
              style={{
                position: "relative",
                padding: "12px 18px",
                background: "transparent",
                border: "none",
                color: isSelected ? "var(--color-volt)" : "#A0A0A0",
                fontFamily: "var(--font-display)",
                fontSize: "var(--type-body-sm)",
                fontWeight: isSelected ? 700 : 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
                transition: "color 0.2s"
              }}
            >
              <span>{layer.icon}</span>
              <span>{layer.label}</span>
              {isSelected && (
                <motion.div
                  layoutId="activeLayerTab"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  style={{
                    position: "absolute",
                    bottom: "-1px",
                    left: 0,
                    right: 0,
                    height: "3px",
                    backgroundColor: "var(--color-volt)",
                    borderRadius: "3px 3px 0 0"
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Color Swatch Picker for Current Tab */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          style={{
            backgroundColor: "#111111",
            border: "1px solid #222",
            borderRadius: "16px",
            padding: "var(--space-lg)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-md)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", textTransform: "uppercase", color: "#F5F5F5", margin: 0 }}>
                Elige Color para: <span style={{ color: "var(--color-volt)" }}>{currentLayerObj.label}</span>
              </h3>
              <p style={{ fontSize: "var(--type-caption)", color: "#888", margin: "4px 0 0 0" }}>
                Selección actual: <strong>{currentColorObj.name}</strong> {currentColorObj.isPremium && <span style={{ color: "var(--color-volt)" }}>[+ $10 Acabado Premium]</span>}
              </p>
            </div>
          </div>

          {/* Color Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "12px" }}>
            {COLOR_PALETTE.map((colorItem) => {
              const isSelectedColor = currentColorObj.hex === colorItem.hex;
              return (
                <motion.button
                  key={colorItem.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onColorChange && onColorChange(activeTab, colorItem)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 8px",
                    backgroundColor: isSelectedColor ? "#1F1F1F" : "#141414",
                    border: isSelectedColor ? "2px solid var(--color-volt)" : "1px solid #292929",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background-color 0.2s",
                    position: "relative"
                  }}
                >
                  <div style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    backgroundColor: colorItem.hex,
                    border: colorItem.hex === "#FFFFFF" || colorItem.hex === "#E5E5E5" ? "1px solid #444" : "1px solid #222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
                  }}>
                    {isSelectedColor && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke={colorItem.hex === "#FFFFFF" || colorItem.hex === "#E5E5E5" || colorItem.hex === "#CEFF00" ? "#111" : "#FFF"}
                        strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </motion.svg>
                    )}
                  </div>

                  <div style={{ textAlign: "center", width: "100%" }}>
                    <div style={{ color: "#FFF", fontSize: "var(--type-caption)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {colorItem.name}
                    </div>
                    {colorItem.isPremium && (
                      <span style={{
                        display: "inline-block",
                        fontSize: "9px",
                        fontFamily: "var(--font-display)",
                        color: "#000",
                        backgroundColor: "var(--color-volt)",
                        padding: "1px 6px",
                        borderRadius: "8px",
                        fontWeight: 700,
                        marginTop: "4px"
                      }}>
                        + $10
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Custom Heel Text Section when Heel Tab is Active */}
          {activeTab === "heel" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              style={{
                marginTop: "var(--space-md)",
                padding: "var(--space-md)",
                backgroundColor: "#181818",
                border: "1px dashed var(--color-volt)",
                borderRadius: "12px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "4px" }}>
                <label style={{ color: "#F5F5F5", fontSize: "var(--type-body-sm)", fontWeight: 600 }}>
                  Texto Personalizado en Talón (Max 8 caracteres, MAYÚSCULAS)
                </label>
                <span style={{ color: "var(--color-volt)", fontSize: "var(--type-caption)", fontWeight: 700 }}>
                  + $15.00 USD
                </span>
              </div>
              
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="text"
                  maxLength={8}
                  value={customText}
                  onChange={(e) => onTextChange && onTextChange(e.target.value.toUpperCase().replace(/[^A-Z0-9 -]/g, ""))}
                  placeholder="Ej. QUITO, BARRIO, GEN-Z, LEGADO"
                  style={{
                    flex: 1,
                    minWidth: "180px",
                    backgroundColor: "#0A0A0A",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    color: "var(--color-volt)",
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--type-h4)",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    outline: "none"
                  }}
                />
                <button
                  onClick={() => onTextChange && onTextChange("LEGADO")}
                  style={{
                    backgroundColor: "#222",
                    color: "#AAA",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "var(--type-caption)",
                    cursor: "pointer"
                  }}
                >
                  Restablecer
                </button>
              </div>
              <p style={{ fontSize: "var(--type-micro)", color: "#888", marginTop: "8px", marginBottom: 0 }}>
                💡 El texto se graba con láser digital y se previsualiza instantáneamente en la parte posterior del talón.
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  if (mode === "preview") return renderPreview();
  if (mode === "controls") return renderControls();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)", width: "100%" }}>
      {renderPreview()}
      {renderControls()}
    </div>
  );
}
