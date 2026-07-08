import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SEOHead from "../components/common/SEOHead";
import { useUserStore, useOrderStore } from "../store/useStore";
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    // Logic for logout would go here
    navigate("/login");
  };

  if (!user) return null;

  const { orders } = useOrderStore();
  const orderHistory = orders.filter(o => o.customerEmail === user.email);

  return (
    <div style={{
      minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px",
      backgroundColor: "var(--color-bg)", color: "var(--color-ink)"
    }}>
      <SEOHead title="Mi Cuenta | Nike" description="Gestiona tu perfil, historial de pedidos y preferencias." />
      
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #222", paddingBottom: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", textTransform: "uppercase", margin: 0, color: "#F5F5F5" }}>
              Hola, {user.name}
            </h1>
            <p style={{ color: "#A0A0A0", fontSize: "var(--type-body)", marginTop: "8px", marginBottom: "16px" }}>{user.email}</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(212, 255, 0, 0.1)", color: "var(--color-volt)", padding: "4px 12px", borderRadius: "100px", fontSize: "var(--type-caption)", fontWeight: 700, border: "1px solid var(--color-volt)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg>
              {user.coins || 0} NikeCoins
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn--secondary btn--sm">
            Cerrar Sesión
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-lg)" }}>
          
          {/* Beneficios */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: "#0A0A0A", padding: "var(--space-lg)", borderRadius: "var(--radius-md)", border: "1px solid #222" }}>
            <h3 style={{ fontSize: "var(--type-h4)", marginBottom: "var(--space-md)", color: "#F5F5F5" }}>Nivel de Membresía</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "var(--color-volt)", display: "flex", alignItems: "center", justifyContent: "center", color: "#111", fontWeight: "bold", fontSize: "1.5rem" }}>
                G
              </div>
              <div>
                <h4 style={{ margin: 0, color: "#F5F5F5" }}>Gold Member</h4>
                <p style={{ margin: 0, color: "var(--color-volt)", fontSize: "var(--type-caption)" }}>1,250 Puntos Nike</p>
              </div>
            </div>
            <p style={{ color: "#A0A0A0", fontSize: "var(--type-caption)" }}>Tienes acceso a envíos gratis y acceso anticipado a SNKRS.</p>
          </motion.div>

          {/* Historial de Pedidos */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ backgroundColor: "#0A0A0A", padding: "var(--space-lg)", borderRadius: "var(--radius-md)", border: "1px solid #222", gridColumn: "span 2" }}>
            <h3 style={{ fontSize: "var(--type-h4)", marginBottom: "var(--space-md)", color: "#F5F5F5" }}>Historial de Pedidos</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {orderHistory.map(order => (
                <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", backgroundColor: "#111", borderRadius: "4px", border: "1px solid #222" }}>
                  <div>
                    <h5 style={{ margin: 0, color: "#F5F5F5", fontSize: "var(--type-body-sm)" }}>{order.item}</h5>
                    <div style={{ display: "flex", gap: "16px", marginTop: "8px", color: "#757575", fontSize: "var(--type-micro)" }}>
                      <span>Pedido: {order.id}</span>
                      <span>Fecha: {order.date}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontWeight: "bold", color: "#F5F5F5" }}>{order.total}</p>
                    <p style={{ margin: 0, color: "var(--color-volt)", fontSize: "var(--type-micro)", marginTop: "4px" }}>{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn--secondary" style={{ width: "100%", marginTop: "16px" }}>Ver todos los pedidos</button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
