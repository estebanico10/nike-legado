import { useState } from "react";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQAdmin() {
  const { faqs, addFaq, updateFaq, deleteFaq } = useSettingsStore();
  const { addToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General",
    isActive: true
  });

  const categories = ["General", "Envíos", "Devoluciones", "Pagos", "Club Lealtad"];

  const openModal = (faq = null) => {
    if (faq) {
      setEditingId(faq.id);
      setFormData(faq);
    } else {
      setEditingId(null);
      setFormData({ question: "", answer: "", category: "General", isActive: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateFaq(editingId, formData);
      addToast("Pregunta actualizada", "success");
    } else {
      addFaq(formData);
      addToast("Nueva pregunta añadida", "success");
    }
    closeModal();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 className="admin-card-title" style={{ margin: 0 }}>Centro de Ayuda (FAQ)</h2>
          <p style={{ color: "#757575", fontSize: "14px", marginTop: "4px" }}>Gestiona las preguntas frecuentes que ven tus clientes.</p>
        </div>
        <button onClick={() => openModal()} className="btn btn--volt">
          + Añadir Pregunta
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        {faqs.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#757575" }}>No hay preguntas configuradas.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {faqs.map(faq => (
              <div key={faq.id} style={{ padding: "20px", borderBottom: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", backgroundColor: faq.isActive ? "transparent" : "rgba(255,255,255,0.02)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <span style={{ 
                      backgroundColor: "#222", color: "var(--color-volt)", padding: "2px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" 
                    }}>
                      {faq.category}
                    </span>
                    {!faq.isActive && <span style={{ color: "#FF4500", fontSize: "12px", fontWeight: "bold" }}>OCULTO</span>}
                  </div>
                  <h4 style={{ margin: "0 0 8px 0", color: faq.isActive ? "#FFF" : "#A0A0A0", fontSize: "16px" }}>{faq.question}</h4>
                  <p style={{ margin: 0, color: "#757575", fontSize: "14px", lineHeight: "1.5" }}>{faq.answer}</p>
                </div>
                
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => updateFaq(faq.id, { isActive: !faq.isActive })} className="btn btn--secondary btn--sm" style={{ padding: "6px" }}>
                    {faq.isActive ? "Ocultar" : "Mostrar"}
                  </button>
                  <button onClick={() => openModal(faq)} className="btn btn--secondary btn--sm" style={{ padding: "6px" }}>Editar</button>
                  <button onClick={() => { if(window.confirm('¿Borrar esta pregunta?')) deleteFaq(faq.id); }} className="btn btn--secondary btn--sm" style={{ padding: "6px", borderColor: "rgba(211,0,5,0.3)", color: "#FF4500" }}>Borrar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px", padding: "24px", width: "100%", maxWidth: "500px" }}
            >
              <h3 style={{ margin: "0 0 20px 0", color: "#FFF", fontSize: "20px" }}>
                {editingId ? "Editar Pregunta" : "Nueva Pregunta Frecuente"}
              </h3>
              
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label className="admin-label">Categoría</label>
                  <select className="admin-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="admin-label">Pregunta</label>
                  <input type="text" className="admin-input" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} required />
                </div>
                
                <div>
                  <label className="admin-label">Respuesta</label>
                  <textarea className="admin-input" value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} rows={5} required />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                  <input 
                    type="checkbox" 
                    id="isActive" 
                    checked={formData.isActive} 
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    style={{ width: "18px", height: "18px", accentColor: "var(--color-volt)" }}
                  />
                  <label htmlFor="isActive" style={{ color: "#FFF", cursor: "pointer" }}>Publicar (Visible en la tienda)</label>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button type="button" onClick={closeModal} className="btn btn--secondary" style={{ flex: 1 }}>Cancelar</button>
                  <button type="submit" className="btn btn--volt" style={{ flex: 1 }}>Guardar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
