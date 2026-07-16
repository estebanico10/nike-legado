import { useState } from "react";

import { useCouponStore } from "../../store/useCouponStore";

export default function MarketingAdmin() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCouponStore();
  // const { banners, addBanner, updateBanner, deleteBanner } = useBannerStore();
  
  const [activeTab, setActiveTab] = useState("coupons");
  
  // Coupon Form State
  const [couponForm, setCouponForm] = useState({ code: "", discountPercent: "", expiresAt: "" });
  
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discountPercent) return;
    addCoupon({
      code: couponForm.code.toUpperCase(),
      discountPercent: Number(couponForm.discountPercent),
      active: true,
      expiresAt: couponForm.expiresAt || "2026-12-31"
    });
    setCouponForm({ code: "", discountPercent: "", expiresAt: "" });
  };

  return (
    <div>
      <h2 className="admin-card-title">Campañas y Marketing</h2>
      
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <button 
          onClick={() => setActiveTab("coupons")}
          style={{
            padding: "8px 16px", 
            background: activeTab === "coupons" ? "var(--color-volt)" : "transparent",
            color: activeTab === "coupons" ? "#000" : "#fff",
            border: "1px solid var(--color-volt)",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Cupones
        </button>
        <button 
          onClick={() => setActiveTab("banners")}
          style={{
            padding: "8px 16px", 
            background: activeTab === "banners" ? "var(--color-volt)" : "transparent",
            color: activeTab === "banners" ? "#000" : "#fff",
            border: "1px solid var(--color-volt)",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Banners
        </button>
      </div>

      {activeTab === "coupons" && (
        <div className="admin-card">
          <h3 style={{ marginBottom: "16px", color: "var(--color-volt)" }}>Gestión de Cupones</h3>
          
          <form onSubmit={handleAddCoupon} style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "12px", marginBottom: "4px", color: "#A0A0A0" }}>Código</label>
              <input 
                type="text" 
                value={couponForm.code}
                onChange={e => setCouponForm({...couponForm, code: e.target.value})}
                placeholder="Ej. VERANO20"
                style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "4px" }}
              />
            </div>
            <div style={{ width: "100px" }}>
              <label style={{ display: "block", fontSize: "12px", marginBottom: "4px", color: "#A0A0A0" }}>Descuento %</label>
              <input 
                type="number" 
                value={couponForm.discountPercent}
                onChange={e => setCouponForm({...couponForm, discountPercent: e.target.value})}
                placeholder="20"
                min="1" max="100"
                style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "4px" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "12px", marginBottom: "4px", color: "#A0A0A0" }}>Vence</label>
              <input 
                type="date" 
                value={couponForm.expiresAt}
                onChange={e => setCouponForm({...couponForm, expiresAt: e.target.value})}
                style={{ width: "100%", padding: "8px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "4px" }}
              />
            </div>
            <button type="submit" style={{ padding: "9px 16px", background: "var(--color-volt)", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
              Añadir Cupón
            </button>
          </form>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #333", textAlign: "left" }}>
                <th style={{ padding: "12px 8px", color: "#A0A0A0", fontWeight: "normal" }}>Código</th>
                <th style={{ padding: "12px 8px", color: "#A0A0A0", fontWeight: "normal" }}>Descuento</th>
                <th style={{ padding: "12px 8px", color: "#A0A0A0", fontWeight: "normal" }}>Vence</th>
                <th style={{ padding: "12px 8px", color: "#A0A0A0", fontWeight: "normal" }}>Estado</th>
                <th style={{ padding: "12px 8px", color: "#A0A0A0", fontWeight: "normal" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id} style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: "12px 8px", fontWeight: "bold" }}>{coupon.code}</td>
                  <td style={{ padding: "12px 8px" }}>{coupon.discountPercent}%</td>
                  <td style={{ padding: "12px 8px" }}>{coupon.expiresAt}</td>
                  <td style={{ padding: "12px 8px" }}>
                    <button 
                      onClick={() => updateCoupon(coupon.id, { active: !coupon.active })}
                      style={{
                        padding: "4px 8px",
                        fontSize: "12px",
                        borderRadius: "12px",
                        border: "none",
                        cursor: "pointer",
                        background: coupon.active ? "rgba(206, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)",
                        color: coupon.active ? "var(--color-volt)" : "#ff4444"
                      }}
                    >
                      {coupon.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <button 
                      onClick={() => deleteCoupon(coupon.id)}
                      style={{ background: "transparent", border: "none", color: "#ff4444", cursor: "pointer", fontSize: "18px" }}
                      title="Eliminar"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: "24px", textAlign: "center", color: "#666" }}>No hay cupones activos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "banners" && (
        <div className="admin-card">
          <h3 style={{ marginBottom: "16px", color: "var(--color-volt)" }}>Banners Promocionales</h3>
          <p style={{ color: "#A0A0A0" }}>Módulo de banners en desarrollo.</p>
        </div>
      )}
    </div>
  );
}
