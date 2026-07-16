import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import "../../admin.css";

export default function PresentationAdmin() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const fetchSections = useCallback(() => {
    setLoading(true);
    fetch("http://localhost:3001/presentationSections")
      .then(res => res.json())
      .then(data => {
        setSections(data.sort((a, b) => a.order - b.order));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar la presentación:", err);
        addToast("Error al cargar los datos", "error");
        setLoading(false);
      });
  }, [addToast]);

  useEffect(() => {
    let active = true;
    fetch("http://localhost:3001/presentationSections")
      .then(res => res.json())
      .then(data => {
        if (active) {
          setSections(data.sort((a, b) => a.order - b.order));
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Error al cargar la presentación:", err);
        if (active) {
          addToast("Error al cargar los datos", "error");
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, [addToast]);

  const handleSave = (e) => {
    e.preventDefault();
    const isNew = !editingSection.id;
    const url = isNew 
      ? `http://localhost:3001/presentationSections` 
      : `http://localhost:3001/presentationSections/${editingSection.id}`;
    
    const method = isNew ? "POST" : "PUT";
    
    let payload = editingSection;
    if (isNew) {
      payload = {
        ...editingSection,
        order: sections.length > 0 ? Math.max(...sections.map(s => s.order)) + 1 : 1,
        visible: true
      };
    }

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        fetchSections();
        setIsModalOpen(false);
        addToast(isNew ? "Sección añadida" : "Sección actualizada", "success");
      })
      .catch(() => addToast("Error al guardar", "error"));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta sección?")) {
      fetch(`http://localhost:3001/presentationSections/${id}`, {
        method: "DELETE"
      })
        .then(() => {
          fetchSections();
          addToast("Sección eliminada", "success");
        })
        .catch(() => addToast("Error al eliminar", "error"));
    }
  };

  const handleToggleVisible = (section) => {
    fetch(`http://localhost:3001/presentationSections/${section.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !section.visible })
    })
      .then(() => {
        setSections(prev => prev.map(s => s.id === section.id ? { ...s, visible: !s.visible } : s));
        addToast("Visibilidad actualizada", "success");
      })
      .catch(() => addToast("Error al actualizar", "error"));
  };

  const handleReorder = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === sections.length - 1) return;

    const newSections = [...sections];
    const item = newSections[index];
    const swapItem = newSections[index + direction];
    
    // Swap order values
    const tempOrder = item.order;
    item.order = swapItem.order;
    swapItem.order = tempOrder;

    // Update both on server
    Promise.all([
      fetch(`http://localhost:3001/presentationSections/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: item.order })
      }),
      fetch(`http://localhost:3001/presentationSections/${swapItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: swapItem.order })
      })
    ]).then(() => {
      fetchSections();
    });
  };

  return (
    <div className="admin-panel-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xl)" }}>
        <div>
          <h2>Gestión de Presentación</h2>
          <p style={{ color: "var(--color-ink-soft)" }}>Controla las diapositivas de la ruta /presentacion</p>
        </div>
        <button 
          className="btn btn--primary" 
          onClick={() => {
            setEditingSection({ title: "", content: "", images: [] });
            setIsModalOpen(true);
          }}
        >
          Añadir Sección
        </button>
      </div>

      {loading ? (
        <p>Cargando secciones...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          {sections.map((section, index) => (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "var(--space-md)",
                backgroundColor: "var(--color-canvas)",
                border: "1px solid var(--color-ink-muted)",
                borderRadius: "var(--radius-md)",
                opacity: section.visible === false ? 0.6 : 1
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", fontWeight: 700, marginRight: "16px" }}>#{section.order}</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem" }}>{section.title}</span>
                <p style={{ fontSize: "var(--type-micro)", color: "var(--color-ink-soft)", marginTop: "4px", maxWidth: "600px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {section.content}
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                {/* Reorder controls */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginRight: "16px" }}>
                  <button onClick={() => handleReorder(index, -1)} disabled={index === 0} style={{ background: "none", border: "none", cursor: index === 0 ? "default" : "pointer", opacity: index === 0 ? 0.3 : 1 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
                  </button>
                  <button onClick={() => handleReorder(index, 1)} disabled={index === sections.length - 1} style={{ background: "none", border: "none", cursor: index === sections.length - 1 ? "default" : "pointer", opacity: index === sections.length - 1 ? 0.3 : 1 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                </div>

                <label style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "8px" }}>
                  <input type="checkbox" checked={section.visible !== false} onChange={() => handleToggleVisible(section)} />
                  <span style={{ fontSize: "12px" }}>Visible</span>
                </label>

                <button onClick={() => { setEditingSection(section); setIsModalOpen(true); }} className="btn btn--secondary btn--sm">
                  Editar
                </button>
                <button onClick={() => handleDelete(section.id)} className="btn btn--secondary btn--sm" style={{ borderColor: "#D30005", color: "#D30005" }}>
                  Borrar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999
        }}>
          <div style={{
            backgroundColor: "var(--color-canvas)", padding: "var(--space-2xl)",
            borderRadius: "var(--radius-lg)", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto"
          }}>
            <h3>{editingSection.id ? "Editar Sección" : "Nueva Sección"}</h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", marginTop: "var(--space-md)" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Título</label>
                <input 
                  required 
                  type="text" 
                  value={editingSection.title || ""}
                  onChange={e => setEditingSection({...editingSection, title: e.target.value})}
                  className="input-field" 
                  style={{ width: "100%" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Contenido (soporta saltos de línea)</label>
                <textarea 
                  required 
                  rows={6}
                  value={editingSection.content || ""}
                  onChange={e => setEditingSection({...editingSection, content: e.target.value})}
                  className="input-field" 
                  style={{ width: "100%", resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 600 }}>Imágenes (URLs separadas por comas - Opcional)</label>
                <input 
                  type="text" 
                  value={(editingSection.images || []).join(", ")}
                  onChange={e => {
                    const val = e.target.value;
                    const arr = val.split(",").map(s => s.trim()).filter(Boolean);
                    setEditingSection({...editingSection, images: arr});
                  }}
                  className="input-field" 
                  style={{ width: "100%" }}
                  placeholder="https://...jpg, https://...png"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)", marginTop: "var(--space-lg)" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn--secondary">Cancelar</button>
                <button type="submit" className="btn btn--primary">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
