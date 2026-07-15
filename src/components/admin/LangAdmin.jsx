import { useState } from "react";
import { useLang } from "../../context/LangContext";
import { useToast } from "../../context/ToastContext";

export default function LangAdmin() {
  const { lang, setLang, translations, setTranslations } = useLang();
  const { addToast } = useToast();
  
  // Create a working copy of translations for the current language
  const [formData, setFormData] = useState(translations[lang]);

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    setFormData(translations[newLang] || {});
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setTranslations(prev => ({
      ...prev,
      [lang]: formData
    }));
    addToast(`Traducciones para '${lang.toUpperCase()}' guardadas`, "success");
  };

  return (
    <div className="admin-card">
      <h2 className="admin-card-title">Gestor de Idiomas y Textos</h2>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <p style={{ color: "#757575", fontSize: "var(--type-body-sm)" }}>
          Modifica cualquier texto visible en la tienda pública.
        </p>
        <select className="admin-select" value={lang} onChange={handleLangChange} style={{ width: "200px" }}>
          <option value="es">Español (ES)</option>
          <option value="en">Inglés (EN)</option>
        </select>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {Object.keys(formData).map((key) => (
          <div key={key} style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px", alignItems: "center", borderBottom: "1px solid #222", paddingBottom: "12px" }}>
            <label className="admin-label" style={{ marginBottom: 0, color: "#A0A0A0", textTransform: "none", letterSpacing: "normal" }}>
              {key}
            </label>
            <input 
              type="text" 
              className="admin-input" 
              value={formData[key]} 
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}

        <div style={{ marginTop: "var(--space-lg)", position: "sticky", bottom: "20px", background: "#111", padding: "16px", borderRadius: "8px", border: "1px solid #333", zIndex: 10 }}>
          <button type="submit" className="btn btn--volt" style={{ width: "100%" }}>Guardar Textos ({lang.toUpperCase()})</button>
        </div>
      </form>
    </div>
  );
}
