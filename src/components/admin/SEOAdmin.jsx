import { useState } from "react";
import { useSEO } from "../../context/SEOContext";
import { useToast } from "../../context/ToastContext";

export default function SEOAdmin() {
  const { seoConfig, setSeoConfig } = useSEO();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState(seoConfig);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSeoConfig(formData);
    addToast("Configuración SEO guardada correctamente", "success");
  };

  return (
    <div className="admin-card">
      <h2 className="admin-card-title">Configuración SEO Global</h2>
      <p style={{ color: "#757575", marginBottom: "var(--space-lg)", fontSize: "var(--type-body-sm)" }}>
        Controla cómo se muestra tu tienda en Google y redes sociales.
      </p>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        <div>
          <label className="admin-label">Título del Sitio (Meta Title)</label>
          <input 
            type="text" 
            className="admin-input" 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            placeholder="Ej: Nike Legado | Tienda Oficial"
            required
          />
        </div>

        <div>
          <label className="admin-label">Descripción (Meta Description)</label>
          <textarea 
            className="admin-textarea" 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            placeholder="Describe tu tienda para los motores de búsqueda..."
            required
          />
        </div>

        <div>
          <label className="admin-label">Palabras Clave (Meta Keywords - separadas por coma)</label>
          <input 
            type="text" 
            className="admin-input" 
            name="keywords" 
            value={formData.keywords} 
            onChange={handleChange}
            placeholder="nike, zapatillas, streetwear..."
          />
        </div>

        <div style={{ marginTop: "var(--space-md)" }}>
          <button type="submit" className="btn btn--volt">Guardar SEO</button>
        </div>
      </form>
    </div>
  );
}
