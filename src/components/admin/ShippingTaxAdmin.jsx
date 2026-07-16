import { useState } from "react";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ShippingTaxAdmin() {
  const { shippingRates, taxes, updateTaxes, addShippingRate, updateShippingRate, deleteShippingRate } = useSettingsStore();
  const { addToast } = useToast();
  
  const [taxForm, setTaxForm] = useState(taxes);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [rateForm, setRateForm] = useState({
    name: "",
    price: 0,
    minOrderValue: 0,
    estimatedDays: ""
  });

  const handleTaxSubmit = (e) => {
    e.preventDefault();
    updateTaxes(taxForm);
    addToast("Configuración de impuestos guardada", "success");
  };

  const openModal = (rate = null) => {
    if (rate) {
      setEditingId(rate.id);
      setRateForm(rate);
    } else {
      setEditingId(null);
      setRateForm({ name: "", price: 0, minOrderValue: 0, estimatedDays: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleRateSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateShippingRate(editingId, rateForm);
      addToast("Tarifa actualizada", "success");
    } else {
      addShippingRate(rateForm);
      addToast("Nueva tarifa añadida", "success");
    }
    closeModal();
  };

  return (
    <div>
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <h2 className="admin-card-title" style={{ margin: 0 }}>Envíos e Impuestos</h2>
        <p style={{ color: "#757575", fontSize: "14px", marginTop: "4px" }}>Configura los costos de envío logísticos y tasas impositivas globales.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px", alignItems: "start" }}>
        
        {/* Taxes Panel */}
        <form onSubmit={handleTaxSubmit} className="admin-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ margin: 0, color: "#FFF", fontSize: "16px", borderBottom: "1px solid #333", paddingBottom: "12px" }}>
            Configuración de Impuestos
          </h3>
          
          <div>
            <label className="admin-label">Tasa de Impuesto Global (%)</label>
            <input 
              type="number" 
              step="0.01" 
              className="admin-input" 
              value={taxForm.globalRate} 
              onChange={e => setTaxForm({...taxForm, globalRate: Number(e.target.value)})} 
              required 
            />
            <p style={{ fontSize: "11px", color: "#757575", margin: "4px 0 0 0" }}>Se aplica al subtotal de la compra (ej. 16 para IVA).</p>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#1A1A1A", padding: "12px", borderRadius: "8px" }}>
            <input 
              type="checkbox" 
              id="includedInPrice" 
              checked={taxForm.includedInPrice} 
              onChange={e => setTaxForm({...taxForm, includedInPrice: e.target.checked})}
              style={{ width: "18px", height: "18px", accentColor: "var(--color-volt)" }}
            />
            <label htmlFor="includedInPrice" style={{ color: "#FFF", cursor: "pointer", margin: 0, fontSize: "14px" }}>
              Los precios del catálogo ya incluyen impuestos
            </label>
          </div>

          <button type="submit" className="btn btn--volt" style={{ marginTop: "8px" }}>
            Guardar Impuestos
          </button>
        </form>

        {/* Shipping Rates Panel */}
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", paddingBottom: "12px", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, color: "#FFF", fontSize: "16px" }}>
              Tarifas de Envío
            </h3>
            <button onClick={() => openModal()} className="btn btn--secondary btn--sm" style={{ borderColor: "var(--color-volt)", color: "var(--color-volt)" }}>
              + Añadir Tarifa
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {shippingRates.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#757575" }}>No hay tarifas configuradas.</div>
            ) : (
              shippingRates.map(rate => (
                <div key={rate.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1A1A1A", padding: "16px", borderRadius: "8px", border: "1px solid #333" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ color: "#FFF", fontWeight: "bold", fontSize: "16px" }}>{rate.name}</span>
                      {rate.price === 0 && <span style={{ backgroundColor: "rgba(212,255,0,0.15)", color: "var(--color-volt)", padding: "2px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: "bold" }}>GRATIS</span>}
                    </div>
                    <div style={{ fontSize: "12px", color: "#A0A0A0" }}>
                      Tiempo est.: {rate.estimatedDays} días | Mínimo pedido: ${rate.minOrderValue}
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <div style={{ fontWeight: "bold", fontSize: "18px", fontFamily: "var(--font-display)", color: "var(--color-volt)" }}>
                      ${rate.price.toFixed(2)}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => openModal(rate)} className="btn btn--secondary btn--sm" style={{ padding: "6px" }}>Editar</button>
                      <button onClick={() => { if(window.confirm('¿Borrar esta tarifa?')) deleteShippingRate(rate.id); }} className="btn btn--secondary btn--sm" style={{ padding: "6px", borderColor: "rgba(211,0,5,0.3)", color: "#FF4500" }}>Borrar</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Rate Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px", padding: "24px", width: "100%", maxWidth: "450px" }}
            >
              <h3 style={{ margin: "0 0 20px 0", color: "#FFF", fontSize: "20px" }}>
                {editingId ? "Editar Tarifa de Envío" : "Nueva Tarifa"}
              </h3>
              
              <form onSubmit={handleRateSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label className="admin-label">Nombre del Método de Envío</label>
                  <input type="text" className="admin-input" value={rateForm.name} onChange={e => setRateForm({...rateForm, name: e.target.value})} required placeholder="Ej: Estándar, Exprés, Same-day" />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label className="admin-label">Costo ($)</label>
                    <input type="number" step="0.01" className="admin-input" value={rateForm.price} onChange={e => setRateForm({...rateForm, price: Number(e.target.value)})} required />
                  </div>
                  <div>
                    <label className="admin-label">Pedido Mín. ($)</label>
                    <input type="number" step="0.01" className="admin-input" value={rateForm.minOrderValue} onChange={e => setRateForm({...rateForm, minOrderValue: Number(e.target.value)})} required />
                    <p style={{ fontSize: "10px", color: "#757575", margin: "4px 0 0 0" }}>0 = sin mínimo</p>
                  </div>
                </div>

                <div>
                  <label className="admin-label">Tiempo Estimado (Días)</label>
                  <input type="text" className="admin-input" value={rateForm.estimatedDays} onChange={e => setRateForm({...rateForm, estimatedDays: e.target.value})} required placeholder="Ej: 3-5, 1-2" />
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
