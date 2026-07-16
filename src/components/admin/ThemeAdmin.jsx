import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";

export default function ThemeAdmin() {
  const { themeSettings, setThemeSettings, defaultTheme } = useTheme();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState(() => themeSettings || defaultTheme);
  const [activeTab, setActiveTab] = useState("dark"); // "light" or "dark"

  const handleChangeColor = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [name]: value
        }
      };
      setThemeSettings(updated);
      return updated;
    });
  };

  const handleChangeGlobal = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      setThemeSettings(updated);
      return updated;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setThemeSettings(formData);
    addToast("Tema y Branding actualizados exitosamente", "success");
  };

  const handleReset = () => {
    if(window.confirm("¿Seguro que deseas restaurar el diseño original?")) {
      setFormData(defaultTheme);
      setThemeSettings(defaultTheme);
      addToast("Diseño restaurado a valores por defecto", "info");
    }
  };

  const PRESET_THEMES = [
    { name: "Nike Dark (Por defecto)", values: { light: { volt: "#CEFF00", canvas: "#FAFAFA", canvasAlt: "#F5F5F5", canvasNav: "rgba(255,255,255,0.8)", ink: "#111111", inkSoft: "#757575", inkMuted: "#CCCCCC", surface: "#FFFFFF" }, dark: { volt: "#CEFF00", canvas: "#060606", canvasAlt: "#1A1A1A", canvasNav: "rgba(17,17,17,0.8)", ink: "#FFFFFF", inkSoft: "#A0A0A0", inkMuted: "#3A3A3A", surface: "#111111" }, displayFont: '"Oswald", "Barlow Condensed", sans-serif', bodyFont: '"Inter", "Helvetica Neue", sans-serif', borderRadius: "0px", buttonStyle: "solid" } },
    { name: "Techwear Cyber", values: { light: { volt: "#00FFCC", canvas: "#E5E5E5", canvasAlt: "#D4D4D4", canvasNav: "rgba(229,229,229,0.8)", ink: "#0A0A0E", inkSoft: "#555555", inkMuted: "#999999", surface: "#FFFFFF" }, dark: { volt: "#00FFCC", canvas: "#0A0A0E", canvasAlt: "#101016", canvasNav: "rgba(10,10,14,0.8)", ink: "#E0E0FF", inkSoft: "#8888AA", inkMuted: "#444466", surface: "#161622" }, displayFont: '"Space Grotesk", sans-serif', bodyFont: '"Inter", sans-serif', borderRadius: "4px", buttonStyle: "outline" } },
    { name: "Minimal Light", values: { light: { volt: "#FF4500", canvas: "#FAFAFA", canvasAlt: "#EEEEEE", canvasNav: "rgba(250,250,250,0.8)", ink: "#111111", inkSoft: "#666666", inkMuted: "#BBBBBB", surface: "#FFFFFF" }, dark: { volt: "#FF4500", canvas: "#111111", canvasAlt: "#181818", canvasNav: "rgba(17,17,17,0.8)", ink: "#FAFAFA", inkSoft: "#AAAAAA", inkMuted: "#555555", surface: "#1A1A1A" }, displayFont: '"Helvetica Neue", sans-serif', bodyFont: '"Inter", sans-serif', borderRadius: "100px", buttonStyle: "solid" } }
  ];

  const applyPreset = (presetValues) => {
    setFormData(presetValues);
    setThemeSettings(presetValues);
    addToast("Preset aplicado", "success");
  };

  // Safe fallback if activeTab data doesn't exist
  const currentColors = formData[activeTab] || {};

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 className="admin-card-title" style={{ margin: 0 }}>Editor de Diseño Visual</h2>
          <p style={{ color: "#757575", fontSize: "14px", marginTop: "4px" }}>Controla colores por separado (Claro/Oscuro) y estilos globales.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={handleReset} className="btn btn--secondary" style={{ borderColor: "rgba(211,0,5,0.3)", color: "#FF4500" }}>
            Restaurar Original
          </button>
          <button onClick={handleSave} className="btn btn--volt">
            Guardar Cambios
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
        {/* Controls Panel */}
        <form onSubmit={handleSave} className="admin-card" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", paddingBottom: "8px", marginBottom: "16px" }}>
              <h3 style={{ color: "#FFF", fontSize: "15px", margin: 0 }}>Paleta de Colores</h3>
              <div style={{ display: "flex", background: "rgba(0,0,0,0.5)", borderRadius: "8px", padding: "4px", gap: "4px" }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("light")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: activeTab === "light" ? "var(--color-volt)" : "transparent",
                    color: activeTab === "light" ? "#000" : "#A0A0A0",
                    fontWeight: activeTab === "light" ? "bold" : "normal",
                    fontSize: "12px",
                    transition: "all 0.2s"
                  }}
                >
                  MODO CLARO
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("dark")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: activeTab === "dark" ? "var(--color-volt)" : "transparent",
                    color: activeTab === "dark" ? "#000" : "#A0A0A0",
                    fontWeight: activeTab === "dark" ? "bold" : "normal",
                    fontSize: "12px",
                    transition: "all 0.2s"
                  }}
                >
                  MODO OSCURO
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label className="admin-label">Acento Principal (Volt)</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input type="color" name="volt" value={currentColors.volt || "#CEFF00"} onChange={handleChangeColor} style={{ width: "36px", height: "36px", cursor: "pointer", background: "none", border: "none" }} />
                  <input type="text" className="admin-input" name="volt" value={currentColors.volt || "#CEFF00"} onChange={handleChangeColor} />
                </div>
              </div>
              <div>
                <label className="admin-label">Fondo Global (Canvas)</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input type="color" name="canvas" value={currentColors.canvas || "#060606"} onChange={handleChangeColor} style={{ width: "36px", height: "36px", cursor: "pointer", background: "none", border: "none" }} />
                  <input type="text" className="admin-input" name="canvas" value={currentColors.canvas || "#060606"} onChange={handleChangeColor} />
                </div>
              </div>
              <div>
                <label className="admin-label">Texto Principal (Ink)</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input type="color" name="ink" value={currentColors.ink || "#FFFFFF"} onChange={handleChangeColor} style={{ width: "36px", height: "36px", cursor: "pointer", background: "none", border: "none" }} />
                  <input type="text" className="admin-input" name="ink" value={currentColors.ink || "#FFFFFF"} onChange={handleChangeColor} />
                </div>
              </div>
              <div>
                <label className="admin-label">Fondo Secundario (Surface)</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input type="color" name="surface" value={currentColors.surface || "#111111"} onChange={handleChangeColor} style={{ width: "36px", height: "36px", cursor: "pointer", background: "none", border: "none" }} />
                  <input type="text" className="admin-input" name="surface" value={currentColors.surface || "#111111"} onChange={handleChangeColor} />
                </div>
              </div>
            </div>
            
            <h4 style={{ color: "#FFF", fontSize: "13px", marginTop: "24px", marginBottom: "16px", opacity: 0.7 }}>Colores Secundarios</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label className="admin-label">Texto Secundario (Ink Soft)</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input type="color" name="inkSoft" value={currentColors.inkSoft || (activeTab === "dark" ? "#A0A0A0" : "#757575")} onChange={handleChangeColor} style={{ width: "36px", height: "36px", cursor: "pointer", background: "none", border: "none" }} />
                  <input type="text" className="admin-input" name="inkSoft" value={currentColors.inkSoft || (activeTab === "dark" ? "#A0A0A0" : "#757575")} onChange={handleChangeColor} />
                </div>
              </div>
              <div>
                <label className="admin-label">Texto Apagado (Ink Muted)</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input type="color" name="inkMuted" value={currentColors.inkMuted || (activeTab === "dark" ? "#3A3A3A" : "#CCCCCC")} onChange={handleChangeColor} style={{ width: "36px", height: "36px", cursor: "pointer", background: "none", border: "none" }} />
                  <input type="text" className="admin-input" name="inkMuted" value={currentColors.inkMuted || (activeTab === "dark" ? "#3A3A3A" : "#CCCCCC")} onChange={handleChangeColor} />
                </div>
              </div>
              <div>
                <label className="admin-label">Fondo Alternativo (Canvas Alt)</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input type="color" name="canvasAlt" value={currentColors.canvasAlt || (activeTab === "dark" ? "#1A1A1A" : "#F5F5F5")} onChange={handleChangeColor} style={{ width: "36px", height: "36px", cursor: "pointer", background: "none", border: "none" }} />
                  <input type="text" className="admin-input" name="canvasAlt" value={currentColors.canvasAlt || (activeTab === "dark" ? "#1A1A1A" : "#F5F5F5")} onChange={handleChangeColor} />
                </div>
              </div>
              <div>
                <label className="admin-label">Fondo Navegación (Canvas Nav)</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input type="text" className="admin-input" name="canvasNav" value={currentColors.canvasNav || (activeTab === "dark" ? "rgba(17, 17, 17, 0.80)" : "rgba(255, 255, 255, 0.80)")} onChange={handleChangeColor} placeholder="rgba(...)" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ color: "#FFF", fontSize: "15px", borderBottom: "1px solid #333", paddingBottom: "8px", marginBottom: "16px" }}>Tipografía y Estilo Global</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="admin-label">Tipografía para Títulos</label>
                <select className="admin-input" name="displayFont" value={formData.displayFont} onChange={handleChangeGlobal}>
                  <option value='"Oswald", "Barlow Condensed", sans-serif'>Oswald (Impactante, Estrecha)</option>
                  <option value='"Inter", "Helvetica Neue", sans-serif'>Inter (Moderna, Limpia)</option>
                  <option value='"Space Grotesk", sans-serif'>Space Grotesk (Futurista, Tech)</option>
                </select>
              </div>
              
              <div>
                <label className="admin-label">Tipografía para Párrafos</label>
                <select className="admin-input" name="bodyFont" value={formData.bodyFont} onChange={handleChangeGlobal}>
                  <option value='"Inter", "Helvetica Neue", sans-serif'>Inter (Moderna, Limpia)</option>
                  <option value='"Roboto", sans-serif'>Roboto (Clásica)</option>
                  <option value='"Arial", sans-serif'>Arial (Segura)</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="admin-label">Redondeo (Border Radius)</label>
                  <select className="admin-input" name="borderRadius" value={formData.borderRadius} onChange={handleChangeGlobal}>
                    <option value="0px">Cuadrado (0px)</option>
                    <option value="4px">Sutil (4px)</option>
                    <option value="12px">Redondeado (12px)</option>
                    <option value="100px">Pastilla (100px)</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Estilo de Botones</label>
                  <select className="admin-input" name="buttonStyle" value={formData.buttonStyle} onChange={handleChangeGlobal}>
                    <option value="solid">Sólido</option>
                    <option value="outline">Contorno</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </form>

        {/* Live Preview Panel & Presets */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div className="admin-card" style={{ padding: "20px" }}>
            <h3 style={{ color: "#FFF", fontSize: "15px", marginBottom: "16px" }}>Temas Predefinidos</h3>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {PRESET_THEMES.map((preset, idx) => (
                <button 
                  key={idx} 
                  onClick={() => applyPreset(preset.values)}
                  className="btn btn--secondary btn--sm"
                  style={{ fontSize: "12px", border: `1px solid ${preset.values.dark.volt}` }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ 
            backgroundColor: currentColors.canvas, 
            color: currentColors.ink,
            border: `1px solid ${currentColors.inkMuted || (activeTab === "dark" ? "#3A3A3A" : "#CCCCCC")}`, 
            borderRadius: "12px", 
            padding: "32px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            transition: "all 0.3s ease",
            // Forzamos CSS variables locales para que el CSS nativo reaccione
            "--color-volt": currentColors.volt || "#CEFF00",
            "--color-canvas": currentColors.canvas || "#060606",
            "--color-ink": currentColors.ink || "#FFFFFF",
            "--color-surface": currentColors.surface || "#111111",
            "--color-ink-soft": currentColors.inkSoft || (activeTab === "dark" ? "#A0A0A0" : "#757575"),
            "--color-ink-muted": currentColors.inkMuted || (activeTab === "dark" ? "#3A3A3A" : "#CCCCCC"),
            "--color-canvas-alt": currentColors.canvasAlt || (activeTab === "dark" ? "#1A1A1A" : "#F5F5F5"),
            "--color-canvas-nav": currentColors.canvasNav || (activeTab === "dark" ? "rgba(17,17,17,0.8)" : "rgba(255,255,255,0.8)")
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <h2 style={{ 
                fontFamily: formData.displayFont, 
                fontSize: "28px", 
                margin: 0, 
                textTransform: "uppercase", 
                letterSpacing: "1px" 
              }}>
                Nike <span style={{ color: currentColors.volt }}>Legado</span>
              </h2>
              <div style={{ display: "flex", gap: "16px", fontFamily: formData.bodyFont, fontSize: "14px" }}>
                <span style={{ cursor: "pointer", borderBottom: `2px solid ${currentColors.volt}` }}>Hombre</span>
                <span style={{ cursor: "pointer", opacity: 0.7 }}>Mujer</span>
                <span style={{ cursor: "pointer", opacity: 0.7 }}>SNKRS</span>
              </div>
            </div>

            <div style={{ 
              backgroundColor: currentColors.surface,
              borderRadius: formData.borderRadius,
              padding: "24px",
              marginBottom: "24px",
              display: "flex",
              gap: "24px",
              alignItems: "center"
            }}>
              <div style={{ width: "120px", height: "120px", backgroundColor: "rgba(128,128,128,0.1)", borderRadius: formData.borderRadius }}></div>
              <div>
                <h3 style={{ fontFamily: formData.displayFont, fontSize: "22px", margin: "0 0 8px 0" }}>Nike Air Max Plus</h3>
                <p style={{ fontFamily: formData.bodyFont, opacity: 0.7, margin: "0 0 16px 0", fontSize: "14px" }}>
                  Domina las calles con la mejor amortiguación. El legado continúa con esta edición especial.
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button style={{
                    backgroundColor: formData.buttonStyle === "solid" ? currentColors.volt : "transparent",
                    color: formData.buttonStyle === "solid" ? "#000" : currentColors.volt,
                    border: `2px solid ${currentColors.volt}`,
                    borderRadius: formData.borderRadius,
                    padding: "8px 24px",
                    fontFamily: formData.displayFont,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}>
                    Añadir al Carrito
                  </button>
                  <button style={{
                    backgroundColor: "transparent",
                    color: currentColors.ink,
                    border: `1px solid ${currentColors.ink}40`,
                    borderRadius: formData.borderRadius,
                    padding: "8px 24px",
                    fontFamily: formData.bodyFont,
                    cursor: "pointer",
                    fontSize: "14px"
                  }}>
                    Detalles
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: i === 1 ? currentColors.volt : `${currentColors.ink}40` }}></div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
