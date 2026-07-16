import { useState } from "react";
import { useCustomizerStore } from "../../store/useCustomizerStore";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomizerAdmin() {
  const { colors, pricing, updatePricing, addColor, updateColor, removeColor } = useCustomizerStore();
  const { addToast } = useToast();
  
  const [priceForm, setPriceForm] = useState(pricing);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [editingColorId, setEditingColorId] = useState(null);
  const [colorForm, setColorForm] = useState({
    name: "",
    hex: "#000000",
    isPremium: false,
    description: ""
  });

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceForm(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSavePrices = (e) => {
    e.preventDefault();
    updatePricing(priceForm);
    addToast("Precios del Customizer actualizados", "success");
  };

  const handleColorSubmit = (e) => {
    e.preventDefault();
    if (editingColorId) {
      updateColor(editingColorId, colorForm);
      addToast("Color actualizado", "success");
    } else {
      addColor(colorForm);
      addToast("Nuevo color añadido", "success");
    }
    closeColorModal();
  };

  const openColorModal = (color = null) => {
    if (color) {
      setEditingColorId(color.id);
      setColorForm(color);
    } else {
      setEditingColorId(null);
      setColorForm({ name: "", hex: "#000000", isPremium: false, description: "" });
    }
    setIsColorModalOpen(true);
  };

  const closeColorModal = () => {
    setIsColorModalOpen(false);
    setEditingColorId(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 className="admin-card-title" style={{ margin: 0 }}>Nike By You (Customizer)</h2>
          <p style={{ color: "#757575", fontSize: "14px", marginTop: "4px" }}>Configura los precios, capas y paleta de colores del estudio 3D.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px", alignItems: "start" }}>
        
        {/* Pricing Panel */}
        <form onSubmit={handleSavePrices} className="admin-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ margin: 0, color: "#FFF", fontSize: "16px", borderBottom: "1px solid #333", paddingBottom: "12px" }}>
            Estructura de Precios
          </h3>
          
          <div>
            <label className="admin-label">Precio Base del Modelo 3D ($)</label>
            <input type="number" step="0.01" name="basePrice" value={priceForm.basePrice} onChange={handlePriceChange} className="admin-input" required />
          </div>
          
          <div>
            <label className="admin-label">Recargo por Color Premium ($)</label>
            <input type="number" step="0.01" name="premiumColorSurcharge" value={priceForm.premiumColorSurcharge} onChange={handlePriceChange} className="admin-input" required />
            <p style={{ fontSize: "11px", color: "#757575", margin: "4px 0 0 0" }}>Se aplica una sola vez si usan colores premium.</p>
          </div>
          
          <div>
            <label className="admin-label">Recargo por Texto Personalizado ($)</label>
            <input type="number" step="0.01" name="customTextSurcharge" value={priceForm.customTextSurcharge} onChange={handlePriceChange} className="admin-input" required />
          </div>

          <button type="submit" className="btn btn--volt" style={{ marginTop: "8px" }}>
            Guardar Precios
          </button>
        </form>

        {/* Colors Panel */}
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", paddingBottom: "12px", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, color: "#FFF", fontSize: "16px" }}>
              Paleta de Colores Disponibles
            </h3>
            <button onClick={() => openColorModal()} className="btn btn--secondary btn--sm" style={{ borderColor: "var(--color-volt)", color: "var(--color-volt)" }}>
              + Añadir Color
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
            {colors.map(color => (
              <div key={color.id} style={{ 
                backgroundColor: "#1A1A1A", 
                border: "1px solid #333", 
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative"
              }}>
                <div style={{ height: "60px", backgroundColor: color.hex, borderBottom: "1px solid #333" }} />
                
                {color.isPremium && (
                  <span style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#D30005", color: "#FFF", fontSize: "10px", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>
                    PREMIUM
                  </span>
                )}

                <div style={{ padding: "12px" }}>
                  <div style={{ fontWeight: "bold", color: "#FFF", fontSize: "14px", marginBottom: "4px" }}>{color.name}</div>
                  <div style={{ color: "#757575", fontSize: "11px", marginBottom: "8px", height: "30px", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {color.description}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => openColorModal(color)} style={{ flex: 1, backgroundColor: "#333", color: "#FFF", border: "none", padding: "4px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>
                      Editar
                    </button>
                    <button 
                      onClick={() => { if(window.confirm('¿Eliminar color?')) removeColor(color.id); }} 
                      style={{ flex: 1, backgroundColor: "rgba(211,0,5,0.2)", color: "#FF4500", border: "none", padding: "4px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Color Modal */}
      <AnimatePresence>
        {isColorModalOpen && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px", padding: "24px", width: "100%", maxWidth: "400px" }}
            >
              <h3 style={{ margin: "0 0 20px 0", color: "#FFF", fontSize: "20px" }}>
                {editingColorId ? "Editar Color" : "Añadir Nuevo Color"}
              </h3>
              
              <form onSubmit={handleColorSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label className="admin-label">Nombre del Color</label>
                  <input type="text" className="admin-input" value={colorForm.name} onChange={e => setColorForm({...colorForm, name: e.target.value})} required />
                </div>
                
                <div>
                  <label className="admin-label">Código Hexadecimal</label>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <input type="color" value={colorForm.hex} onChange={e => setColorForm({...colorForm, hex: e.target.value})} style={{ width: "40px", height: "40px", cursor: "pointer", background: "none", border: "none" }} />
                    <input type="text" className="admin-input" value={colorForm.hex} onChange={e => setColorForm({...colorForm, hex: e.target.value})} required />
                  </div>
                </div>

                <div>
                  <label className="admin-label">Descripción</label>
                  <input type="text" className="admin-input" value={colorForm.description} onChange={e => setColorForm({...colorForm, description: e.target.value})} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px", backgroundColor: "#1A1A1A", padding: "12px", borderRadius: "8px" }}>
                  <input 
                    type="checkbox" 
                    id="isPremium" 
                    checked={colorForm.isPremium} 
                    onChange={e => setColorForm({...colorForm, isPremium: e.target.checked})}
                    style={{ width: "18px", height: "18px", accentColor: "var(--color-volt)", cursor: "pointer" }}
                  />
                  <label htmlFor="isPremium" style={{ color: "#FFF", cursor: "pointer", fontSize: "14px", margin: 0 }}>
                    Es un color Premium (+ recargo)
                  </label>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button type="button" onClick={closeColorModal} className="btn btn--secondary" style={{ flex: 1 }}>Cancelar</button>
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
