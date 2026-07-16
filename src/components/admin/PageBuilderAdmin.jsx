import { useState } from "react";
import { usePageBuilderStore } from "../../store/usePageBuilderStore";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

export default function PageBuilderAdmin() {
  const { sections, toggleSection, updateSection, reorderSections } = usePageBuilderStore();
  const { addToast } = useToast();
  
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", subtitle: "" });

  // Simple move up/down logic instead of drag and drop for now
  const moveSection = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === sections.length - 1) return;
    
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + direction];
    newSections[index + direction] = temp;
    
    // update order property just in case
    const reordered = newSections.map((s, i) => ({ ...s, order: i + 1 }));
    reorderSections(reordered);
    addToast("Sección reordenada", "success");
  };

  const openEdit = (section) => {
    if (editingId === section.id) {
      setEditingId(null);
    } else {
      setEditingId(section.id);
      setEditForm({ title: section.title, subtitle: section.subtitle });
    }
  };

  const handleSaveEdit = (id) => {
    updateSection(id, editForm);
    setEditingId(null);
    addToast("Contenido de sección guardado", "success");
  };

  return (
    <div>
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <h2 className="admin-card-title" style={{ margin: 0 }}>Constructor de Página (Page Builder)</h2>
        <p style={{ color: "#757575", fontSize: "14px", marginTop: "4px" }}>Controla el orden, visibilidad y textos de las secciones de la página de inicio (Home).</p>
      </div>

      <div className="admin-card" style={{ padding: "0" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {sections.map((section, index) => (
            <div key={section.id} style={{ 
              borderBottom: "1px solid #222", 
              backgroundColor: section.isVisible ? "transparent" : "rgba(255,255,255,0.02)",
              transition: "all 0.3s ease"
            }}>
              
              <div style={{ display: "flex", alignItems: "center", padding: "16px 20px" }}>
                {/* Drag Handle / Reorder */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginRight: "20px" }}>
                  <button 
                    onClick={() => moveSection(index, -1)} 
                    disabled={index === 0}
                    style={{ background: "none", border: "none", color: index === 0 ? "#333" : "#A0A0A0", cursor: index === 0 ? "default" : "pointer", padding: "2px" }}
                  >
                    ▲
                  </button>
                  <button 
                    onClick={() => moveSection(index, 1)} 
                    disabled={index === sections.length - 1}
                    style={{ background: "none", border: "none", color: index === sections.length - 1 ? "#333" : "#A0A0A0", cursor: index === sections.length - 1 ? "default" : "pointer", padding: "2px" }}
                  >
                    ▼
                  </button>
                </div>

                {/* Section Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                    <h3 style={{ margin: 0, color: section.isVisible ? "#FFF" : "#757575", fontSize: "16px" }}>{section.name}</h3>
                    {!section.isVisible && <span style={{ backgroundColor: "rgba(211,0,5,0.15)", color: "#FF4500", padding: "2px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: "bold" }}>OCULTO</span>}
                  </div>
                  <div style={{ color: "#757575", fontSize: "13px" }}>
                    Título: <span style={{ color: "#A0A0A0" }}>{section.title || "(Sin título)"}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button onClick={() => toggleSection(section.id)} className="btn btn--secondary btn--sm" style={{ width: "80px", textAlign: "center" }}>
                    {section.isVisible ? "Ocultar" : "Mostrar"}
                  </button>
                  <button onClick={() => openEdit(section)} className="btn btn--secondary btn--sm" style={{ width: "80px", textAlign: "center" }}>
                    {editingId === section.id ? "Cerrar" : "Editar"}
                  </button>
                </div>
              </div>

              {/* Edit Panel Expanded */}
              <AnimatePresence>
                {editingId === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden", backgroundColor: "#0A0A0A" }}
                  >
                    <div style={{ padding: "20px", borderTop: "1px dashed #333", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "end" }}>
                      <div>
                        <label className="admin-label">Título de la Sección</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={editForm.title} 
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})} 
                        />
                      </div>
                      <div>
                        <label className="admin-label">Subtítulo (Opcional)</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={editForm.subtitle} 
                          onChange={(e) => setEditForm({...editForm, subtitle: e.target.value})} 
                        />
                      </div>
                      <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={() => handleSaveEdit(section.id)} className="btn btn--volt">
                          Guardar Textos
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
