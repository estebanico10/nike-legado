import { useState, useEffect } from "react";
import { useSEO } from "../../context/SEOContext";
import { useToast } from "../../context/ToastContext";
import { motion } from "framer-motion";

export default function SEOAdmin() {
  const { seoConfig, setSeoConfig } = useSEO();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState(seoConfig);

  // Keep internal state in sync if external changes occur
  useEffect(() => {
    setFormData(seoConfig);
  }, [seoConfig]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSeoConfig(formData);
    addToast("Configuración SEO guardada correctamente", "success");
  };

  // Character counts for SEO best practices
  const titleLength = formData.title?.length || 0;
  const descLength = formData.description?.length || 0;
  
  const getScoreColor = (len, min, max) => {
    if (len === 0) return "#A0A0A0";
    if (len < min) return "#FFA500";
    if (len > max) return "#D30005";
    return "var(--color-volt)";
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
        <div>
          <h2 className="admin-card-title" style={{ margin: 0 }}>SEO Avanzado y Metadatos</h2>
          <p style={{ color: "#757575", fontSize: "14px", marginTop: "4px" }}>Controla cómo se muestra tu tienda en Google, Facebook y Twitter.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-lg)" }}>
        {/* SERP & Social Preview Panel */}
        <div style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px", padding: "24px" }}>
          <h3 style={{ fontSize: "16px", color: "var(--color-volt)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Vista Previa en Vivo</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {/* Google SERP Preview */}
            <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "8px", fontFamily: "arial, sans-serif" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <div style={{ width: "28px", height: "28px", backgroundColor: "#f2f2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🌐</div>
                <div>
                  <div style={{ fontSize: "14px", color: "#202124", lineHeight: 1 }}>Nike Legado</div>
                  <div style={{ fontSize: "12px", color: "#4d5156", lineHeight: 1 }}>https://nike-legado.vercel.app</div>
                </div>
              </div>
              <div style={{ color: "#1a0dab", fontSize: "20px", lineHeight: 1.3, marginBottom: "4px", cursor: "pointer" }}>
                {formData.title || "Título de la página"}
              </div>
              <div style={{ color: "#4d5156", fontSize: "14px", lineHeight: 1.58 }}>
                {formData.description || "Descripción de la página que aparecerá en los resultados de búsqueda."}
              </div>
            </div>

            {/* Twitter Card Preview */}
            <div style={{ backgroundColor: "#000", border: "1px solid #333", borderRadius: "16px", overflow: "hidden", fontFamily: "system-ui, -apple-system, sans-serif" }}>
              <div style={{ height: "160px", backgroundColor: "#333", backgroundImage: `url(${formData.ogImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ padding: "12px" }}>
                <div style={{ color: "#71767b", fontSize: "13px", marginBottom: "2px" }}>nike-legado.vercel.app</div>
                <div style={{ color: "#e7e9ea", fontSize: "15px", marginBottom: "4px" }}>{formData.ogTitle || formData.title || "Título"}</div>
                <div style={{ color: "#71767b", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{formData.description}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSave} style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h4 style={{ color: "#FFF", margin: 0, borderBottom: "1px solid #222", paddingBottom: "8px" }}>General (Google)</h4>
              
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <label className="admin-label" style={{ margin: 0 }}>Meta Title</label>
                  <span style={{ fontSize: "12px", color: getScoreColor(titleLength, 30, 60) }}>{titleLength}/60 char</span>
                </div>
                <input type="text" className="admin-input" name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Nike Legado | Tienda Oficial" required />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <label className="admin-label" style={{ margin: 0 }}>Meta Description</label>
                  <span style={{ fontSize: "12px", color: getScoreColor(descLength, 120, 160) }}>{descLength}/160 char</span>
                </div>
                <textarea className="admin-textarea" name="description" value={formData.description} onChange={handleChange} placeholder="Describe tu tienda para los motores de búsqueda..." required rows={3} />
              </div>

              <div>
                <label className="admin-label">Meta Keywords</label>
                <input type="text" className="admin-input" name="keywords" value={formData.keywords} onChange={handleChange} placeholder="nike, zapatillas, streetwear..." />
              </div>

              <div>
                <label className="admin-label">Directivas de Indexación (Robots)</label>
                <select className="admin-input" name="robots" value={formData.robots} onChange={handleChange}>
                  <option value="index, follow">Indexar y seguir enlaces (Recomendado)</option>
                  <option value="noindex, follow">No indexar, pero seguir enlaces</option>
                  <option value="noindex, nofollow">Ocultar a buscadores (Modo Privado)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h4 style={{ color: "#FFF", margin: 0, borderBottom: "1px solid #222", paddingBottom: "8px" }}>Social Media (Open Graph & Twitter)</h4>
              
              <div>
                <label className="admin-label">OG Title (Opcional, sobrescribe título general)</label>
                <input type="text" className="admin-input" name="ogTitle" value={formData.ogTitle} onChange={handleChange} placeholder="Ej: Únete a la cultura Nike Legado" />
              </div>

              <div>
                <label className="admin-label">Imagen para compartir (URL de la imagen)</label>
                <input type="text" className="admin-input" name="ogImage" value={formData.ogImage} onChange={handleChange} placeholder="https://dominio.com/imagen.jpg" />
                <p style={{ fontSize: "11px", color: "#757575", marginTop: "4px", margin: 0 }}>Recomendado: 1200 x 630 pixels</p>
              </div>

              <div>
                <label className="admin-label">Estilo de Twitter Card</label>
                <select className="admin-input" name="twitterCard" value={formData.twitterCard} onChange={handleChange}>
                  <option value="summary_large_image">Imagen Grande (Recomendado)</option>
                  <option value="summary">Imagen Pequeña / Resumen</option>
                </select>
              </div>

              <div>
                <label className="admin-label">Theme Color (Color de barra en móviles)</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input type="color" name="themeColor" value={formData.themeColor} onChange={handleChange} style={{ width: "40px", height: "40px", cursor: "pointer", background: "none", border: "none" }} />
                  <input type="text" className="admin-input" name="themeColor" value={formData.themeColor} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px", borderTop: "1px solid #222", paddingTop: "24px" }}>
            <button type="submit" className="btn btn--volt" style={{ minWidth: "200px" }}>
              Guardar Configuración SEO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
