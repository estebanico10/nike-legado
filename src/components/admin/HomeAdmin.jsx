import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSite } from "../../context/SiteContext";

export default function HomeAdmin() {
  const { homeSections, updateHomeSection, reorderHomeSections } = useSite();
  const [editingSection, setEditingSection] = useState(null);

  const moveSection = (index, dir) => {
    const newArr = [...homeSections];
    const targetIndex = index + dir;
    if (targetIndex < 0 || targetIndex >= newArr.length) return;
    
    // Swap
    [newArr[index], newArr[targetIndex]] = [newArr[targetIndex], newArr[index]];
    
    // Update order property
    newArr.forEach((s, i) => s.order = i + 1);
    reorderHomeSections(newArr);
  };

  const handleToggleVisible = (section) => {
    updateHomeSection(section.id, { visible: !section.visible });
  };

  const handleEdit = (section) => {
    setEditingSection(JSON.parse(JSON.stringify(section))); // deep copy
  };

  const handleSaveSection = (e) => {
    e.preventDefault();
    updateHomeSection(editingSection.id, editingSection);
    setEditingSection(null);
  };

  const setEditVal = (key, val) => {
    setEditingSection(p => ({ ...p, [key]: val }));
  };

  const handleImageChange = (index, field, val) => {
    const newImages = [...editingSection.images];
    newImages[index][field] = val;
    setEditVal("images", newImages);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
        <h3 style={{ fontSize: "var(--type-h3)", fontFamily: "var(--font-display)", color: "#F5F5F5" }}>Secciones de Inicio</h3>
      </div>

      <AnimatePresence mode="wait">
        {editingSection && (
          <motion.form 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, height: 0 }} 
            onSubmit={handleSaveSection}
            style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", backgroundColor: "#0D0D0D", padding: "var(--space-xl)", border: "1px solid #222", borderRadius: "var(--radius-md)", marginBottom: "var(--space-xl)" }}
          >
            <h4 style={{ color: "var(--color-volt)" }}>Editando: {editingSection.type.toUpperCase()}</h4>
            <div>
              <label className="admin-label">Título</label>
              <input required className="admin-input" type="text" value={editingSection.title} onChange={e => setEditVal("title", e.target.value)} />
            </div>
            
            {editingSection.description !== undefined && (
              <div>
                <label className="admin-label">Descripción</label>
                <textarea className="admin-textarea" value={editingSection.description} onChange={e => setEditVal("description", e.target.value)} />
              </div>
            )}

            {editingSection.images && (
              <div>
                <label className="admin-label">Imágenes (Lookbook)</label>
                {editingSection.images.map((img, i) => (
                  <div key={img.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "var(--space-xs)", marginBottom: "var(--space-sm)", backgroundColor: "#1A1A1A", padding: "var(--space-sm)", borderRadius: "var(--radius-sm)" }}>
                    <div>
                      <label style={{fontSize: "10px", color: "#888"}}>Título</label>
                      <input className="admin-input" style={{padding: "4px"}} type="text" value={img.title} onChange={e => handleImageChange(i, "title", e.target.value)} />
                    </div>
                    <div>
                      <label style={{fontSize: "10px", color: "#888"}}>Subtítulo</label>
                      <input className="admin-input" style={{padding: "4px"}} type="text" value={img.subtitle} onChange={e => handleImageChange(i, "subtitle", e.target.value)} />
                    </div>
                    <div>
                      <label style={{fontSize: "10px", color: "#888"}}>URL Imagen</label>
                      <input className="admin-input" style={{padding: "4px"}} type="text" value={img.src} onChange={e => handleImageChange(i, "src", e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)", marginTop: "var(--space-sm)" }}>
              <button type="button" className="btn btn--secondary btn--sm" onClick={() => setEditingSection(null)} style={{ color: "#A0A0A0", borderColor: "#333" }}>Cancelar</button>
              <button type="submit" className="btn btn--volt btn--sm">Guardar Cambios</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
        {[...homeSections].sort((a, b) => a.order - b.order).map((section, index) => (
          <div key={section.id} style={{ backgroundColor: "#111111", padding: "var(--space-md)", borderRadius: "var(--radius-md)", border: "1px solid #222", display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <button onClick={() => moveSection(index, -1)} disabled={index === 0} style={{ color: index === 0 ? "#333" : "#888", cursor: index === 0 ? "default" : "pointer" }}>▲</button>
              <button onClick={() => moveSection(index, 1)} disabled={index === homeSections.length - 1} style={{ color: index === homeSections.length - 1 ? "#333" : "#888", cursor: index === homeSections.length - 1 ? "default" : "pointer" }}>▼</button>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", color: "#F5F5F5", display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                {section.title}
                <span style={{ fontSize: "10px", backgroundColor: "#333", padding: "2px 6px", borderRadius: "10px", textTransform: "uppercase" }}>{section.type}</span>
              </div>
              {section.description && <div style={{ fontSize: "var(--type-caption)", color: "#A0A0A0", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "400px" }}>{section.description}</div>}
            </div>

            <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
              <button onClick={() => handleToggleVisible(section)} style={{ fontSize: "var(--type-micro)", color: section.visible ? "var(--color-volt)" : "#888" }}>
                {section.visible ? "Ocultar" : "Mostrar"}
              </button>
              <button className="btn btn--secondary btn--sm" onClick={() => handleEdit(section)} style={{ padding: "4px 8px", fontSize: "var(--type-micro)" }}>Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
