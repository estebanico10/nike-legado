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

  const { orders } = useOrderStore();
  
  if (!user) return null;

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

          {/* Historial de Pedidos Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ backgroundColor: "#0A0A0A", padding: "var(--space-lg)", borderRadius: "var(--radius-md)", border: "1px solid #222", gridColumn: "span 2" }}>
            <h3 style={{ fontSize: "var(--type-h4)", marginBottom: "var(--space-md)", color: "#F5F5F5" }}>Historial de Pedidos</h3>
            
            {orderHistory.length === 0 ? (
              <div style={{ padding: "var(--space-xl) 0", textAlign: "center", color: "#A0A0A0" }}>
                No tienes pedidos recientes.
              </div>
            ) : (
              <div style={{ position: "relative", paddingLeft: "32px" }}>
                {/* Línea vertical del timeline */}
                <div style={{ position: "absolute", left: "11px", top: "8px", bottom: "8px", width: "2px", backgroundColor: "#222" }}></div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {orderHistory.map((order) => {
                    const isDelivered = order.status === "Entregado";
                    const isProcessing = order.status === "Procesando";
                    
                    let statusColor = "#757575";
                    if (isDelivered) statusColor = "var(--color-volt)";
                    if (isProcessing) statusColor = "#FFB800"; // Warning color

                    return (
                      <div key={order.id} style={{ position: "relative" }}>
                        {/* Punto del timeline */}
                        <div style={{ position: "absolute", left: "-32px", top: "4px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: statusColor, border: "2px solid #0A0A0A", zIndex: 2, boxShadow: `0 0 0 4px ${statusColor}33` }}></div>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px", backgroundColor: "#111", borderRadius: "8px", border: "1px solid #222", transition: "transform 0.2s, border-color 0.2s" }} className="hover-card">
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                              <h5 style={{ margin: 0, color: "#F5F5F5", fontSize: "var(--type-body-sm)" }}>{order.item || "Pedido Múltiple"}</h5>
                              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "100px", backgroundColor: `${statusColor}22`, color: statusColor, fontWeight: 700, textTransform: "uppercase" }}>{order.status}</span>
                            </div>
                            <div style={{ display: "flex", gap: "16px", color: "#757575", fontSize: "var(--type-micro)" }}>
                              <span>ID: {order.id}</span>
                              <span>•</span>
                              <span>{order.date}</span>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ margin: 0, fontWeight: "bold", color: "#F5F5F5" }}>${order.total}</p>
                            <button style={{ background: "transparent", border: "none", color: "var(--color-ink-muted)", fontSize: "var(--type-micro)", textDecoration: "underline", marginTop: "4px", cursor: "pointer" }}>Ver Detalles</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {orderHistory.length > 0 && (
              <button className="btn btn--secondary" style={{ width: "100%", marginTop: "24px" }}>Ver todos los pedidos</button>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
