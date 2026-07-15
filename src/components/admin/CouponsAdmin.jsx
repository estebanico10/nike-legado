import { useState } from "react";
import { useCouponStore } from "../../store/useCouponStore";
import { motion, AnimatePresence } from "framer-motion";

export default function CouponsAdmin() {
  const { coupons, addCoupon, deleteCoupon, toggleCouponStatus } = useCouponStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: 0,
    usageLimit: 0,
    minAmount: 0,
    expiryDate: "",
    description: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ["value", "usageLimit", "minAmount"].includes(name) ? Number(value) : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || formData.code.trim() === "") return;
    
    addCoupon({
      ...formData,
      code: formData.code.toUpperCase().trim(),
      status: "active"
    });
    
    setIsModalOpen(false);
    setFormData({
      code: "",
      type: "percentage",
      value: 0,
      usageLimit: 0,
      minAmount: 0,
      expiryDate: "",
      description: ""
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 className="admin-card-title" style={{ margin: 0 }}>Gestor de Cupones</h2>
          <p style={{ color: "#757575", fontSize: "14px", marginTop: "4px" }}>Crea y administra códigos de descuento y promociones.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn--volt"
        >
          + Nuevo Cupón
        </button>
      </div>

      <div className="admin-card" style={{ overflowX: "auto", padding: 0 }}>
        {coupons.length === 0 ? (
          <p style={{ padding: "24px", textAlign: "center", color: "#757575", margin: 0 }}>No hay cupones configurados.</p>
        ) : (
          <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", color: "#FFF", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #222", textAlign: "left" }}>
                <th style={{ padding: "16px" }}>Código</th>
                <th style={{ padding: "16px" }}>Tipo y Valor</th>
                <th style={{ padding: "16px" }}>Condiciones</th>
                <th style={{ padding: "16px" }}>Uso / Límite</th>
                <th style={{ padding: "16px" }}>Vencimiento</th>
                <th style={{ padding: "16px" }}>Estado</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => {
                const isExpired = new Date(coupon.expiryDate) < new Date();
                const limitReached = coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit;
                
                return (
                  <tr key={coupon.id} style={{ borderBottom: "1px solid #111", verticalAlign: "middle" }}>
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontWeight: 700, color: "var(--color-volt)", fontSize: "16px", letterSpacing: "1px" }}>{coupon.code}</div>
                      <div style={{ fontSize: "12px", color: "#757575" }}>{coupon.description}</div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      {coupon.type === "percentage" ? `${coupon.value}% OFF` : 
                       coupon.type === "fixed" ? `$${coupon.value} OFF` : 
                       "Envío Gratis"}
                    </td>
                    <td style={{ padding: "16px", color: "#A0A0A0" }}>
                      {coupon.minAmount > 0 ? `Min. $${coupon.minAmount}` : "Sin mínimo"}
                    </td>
                    <td style={{ padding: "16px", color: limitReached ? "#FF4500" : "#FFF" }}>
                      {coupon.usageCount} / {coupon.usageLimit > 0 ? coupon.usageLimit : "∞"}
                    </td>
                    <td style={{ padding: "16px", color: isExpired ? "#FF4500" : "#A0A0A0" }}>
                      {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "Sin fecha"}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "100px",
                        fontSize: "11px",
                        fontWeight: 600,
                        backgroundColor: coupon.status === "active" && !isExpired && !limitReached ? "rgba(212, 255, 0, 0.15)" : "rgba(211, 0, 5, 0.15)",
                        color: coupon.status === "active" && !isExpired && !limitReached ? "var(--color-volt)" : "#FF4500",
                        textTransform: "uppercase"
                      }}>
                        {isExpired ? "Expirado" : limitReached ? "Agotado" : coupon.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => toggleCouponStatus(coupon.id)}
                        className="btn btn--secondary btn--sm"
                        style={{ fontSize: "12px", padding: "4px 8px" }}
                      >
                        {coupon.status === "active" ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        onClick={() => deleteCoupon(coupon.id)}
                        className="btn btn--secondary btn--sm"
                        style={{ fontSize: "12px", padding: "4px 8px", color: "#FF4500", borderColor: "rgba(255,69,0,0.3)" }}
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Nuevo Cupón */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px", padding: "24px", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}
            >
              <h3 style={{ margin: "0 0 20px 0", color: "#FFF", fontSize: "20px" }}>Crear Nuevo Cupón</h3>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                <div>
                  <label className="admin-label">Código del Cupón (Ej: VIP20)</label>
                  <input type="text" name="code" value={formData.code} onChange={handleChange} className="admin-input" required style={{ textTransform: "uppercase" }} />
                </div>
                
                <div>
                  <label className="admin-label">Descripción</label>
                  <input type="text" name="description" value={formData.description} onChange={handleChange} className="admin-input" placeholder="Ej: 20% descuento VIP" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label className="admin-label">Tipo de Descuento</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="admin-input">
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="fixed">Monto Fijo ($)</option>
                      <option value="freeshipping">Envío Gratis</option>
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Valor ({formData.type === 'percentage' ? '%' : '$'})</label>
                    <input type="number" name="value" value={formData.value} onChange={handleChange} className="admin-input" min="0" disabled={formData.type === 'freeshipping'} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label className="admin-label">Límite de Usos (0 = ilimitado)</label>
                    <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleChange} className="admin-input" min="0" />
                  </div>
                  <div>
                    <label className="admin-label">Monto Mínimo Compra ($)</label>
                    <input type="number" name="minAmount" value={formData.minAmount} onChange={handleChange} className="admin-input" min="0" />
                  </div>
                </div>

                <div>
                  <label className="admin-label">Fecha de Expiración</label>
                  <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="admin-input" required />
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "16px", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn--secondary">Cancelar</button>
                  <button type="submit" className="btn btn--volt">Crear Cupón</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
