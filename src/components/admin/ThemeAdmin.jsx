import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";

export default function ThemeAdmin() {
  const { themeSettings, setThemeSettings, defaultTheme } = useTheme();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState(themeSettings);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Update theme in real-time for preview
    setThemeSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setThemeSettings(formData);
    addToast("Tema actualizado exitosamente", "success");
  };

  const handleReset = () => {
    setFormData(defaultTheme);
    setThemeSettings(defaultTheme);
    addToast("Tema restaurado a por defecto", "info");
  };

  return (
    <div className="admin-card">
      <h2 className="admin-card-title">Editor de Temas y Branding</h2>
      <p style={{ color: "#757575", marginBottom: "var(--space-lg)", fontSize: "var(--type-body-sm)" }}>
        Modifica los colores globales de la tienda. Los cambios se verán reflejados al instante en toda la página.
      </p>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        <div>
          <label className="admin-label">Color Principal (Volt)</label>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input 
              type="color" 
              name="volt" 
              value={formData.volt} 
              onChange={handleChange}
              style={{ width: "50px", height: "40px", cursor: "pointer", background: "none", border: "none" }}
            />
            <input 
              type="text" 
              className="admin-input" 
              name="volt" 
              value={formData.volt} 
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="admin-label">Color de Fondo (Canvas)</label>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input 
              type="color" 
              name="canvas" 
              value={formData.canvas} 
              onChange={handleChange}
              style={{ width: "50px", height: "40px", cursor: "pointer", background: "none", border: "none" }}
            />
            <input 
              type="text" 
              className="admin-input" 
              name="canvas" 
              value={formData.canvas} 
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="admin-label">Color de Texto (Ink)</label>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input 
              type="color" 
              name="ink" 
              value={formData.ink} 
              onChange={handleChange}
              style={{ width: "50px", height: "40px", cursor: "pointer", background: "none", border: "none" }}
            />
            <input 
              type="text" 
              className="admin-input" 
              name="ink" 
              value={formData.ink} 
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", marginTop: "var(--space-md)" }}>
          <button type="submit" className="btn btn--volt">Guardar Tema</button>
          <button type="button" className="btn btn--secondary" onClick={handleReset}>Restaurar Default</button>
        </div>
      </form>
    </div>
  );
}
