import { useState } from "react";
import { useCustomerStore, useOrderStore } from "../../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomerCRM() {
  const { customers, toggleCustomerStatus } = useCustomerStore();
  const { orders } = useOrderStore(); // To get customer's order history
  
  const [filterTier, setFilterTier] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter(customer => {
    const matchesTier = filterTier === "todos" || customer.tier.toLowerCase() === filterTier.toLowerCase();
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const getTierColor = (tier) => {
    switch (tier.toLowerCase()) {
      case "gold": return "var(--color-volt)";
      case "silver": return "#C0C0C0";
      case "standard": return "#A0A0A0";
      default: return "#FFF";
    }
  };

  const getCustomerOrders = (customerName) => {
    return orders.filter(o => o.customer === customerName);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 className="admin-card-title" style={{ margin: 0 }}>Gestión de Clientes (CRM)</h2>
          <p style={{ color: "#757575", fontSize: "14px", marginTop: "4px" }}>Administra la base de datos de usuarios y niveles de lealtad.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["todos", "Gold", "Silver", "Standard"].map(tier => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className="btn btn--secondary"
              style={{
                fontSize: "var(--type-caption)",
                padding: "6px 16px",
                borderRadius: "20px",
                border: filterTier === tier ? `1px solid ${getTierColor(tier === 'todos' ? '' : tier)}` : "1px solid #333",
                color: filterTier === tier ? getTierColor(tier === 'todos' ? '' : tier) : "#A0A0A0",
                backgroundColor: filterTier === tier ? "rgba(255, 255, 255, 0.05)" : "transparent",
                fontWeight: filterTier === tier ? "bold" : "normal"
              }}
            >
              {tier.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "var(--space-md)" }}>
        <input 
          type="text" 
          placeholder="Buscar por ID, nombre o correo electrónico..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="admin-input"
          style={{ width: "100%", maxWidth: "400px" }}
        />
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: "auto" }}>
        {filteredCustomers.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#757575" }}>
            No se encontraron clientes con estos filtros.
          </div>
        ) : (
          <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", color: "#FFF", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #222", textAlign: "left", backgroundColor: "#0A0A0A" }}>
                <th style={{ padding: "16px" }}>Cliente</th>
                <th style={{ padding: "16px" }}>Nivel (Tier)</th>
                <th style={{ padding: "16px" }}>Gasto Total</th>
                <th style={{ padding: "16px" }}>Pedidos</th>
                <th style={{ padding: "16px" }}>Estado</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id} style={{ borderBottom: "1px solid #111", verticalAlign: "middle" }}>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ 
                        width: "40px", height: "40px", borderRadius: "50%", 
                        backgroundColor: "#222", display: "flex", alignItems: "center", 
                        justifyContent: "center", fontWeight: "bold", color: "var(--color-volt)"
                      }}>
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{customer.name}</div>
                        <div style={{ fontSize: "12px", color: "#757575" }}>{customer.email}</div>
                        <div style={{ fontSize: "11px", color: "#555" }}>{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ color: getTierColor(customer.tier), fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: getTierColor(customer.tier) }}></span>
                      {customer.tier}
                    </span>
                  </td>
                  <td style={{ padding: "16px", fontWeight: "bold", fontFamily: "var(--font-display)", fontSize: "16px", letterSpacing: "1px" }}>
                    ${customer.spent.toLocaleString()}
                  </td>
                  <td style={{ padding: "16px", color: "#A0A0A0" }}>
                    {customer.ordersCount}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      padding: "4px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase",
                      backgroundColor: customer.status === "Activo" ? "rgba(212,255,0,0.15)" : "rgba(211,0,5,0.15)",
                      color: customer.status === "Activo" ? "var(--color-volt)" : "#FF4500"
                    }}>
                      {customer.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button onClick={() => setSelectedCustomer(customer)} className="btn btn--secondary btn--sm" style={{ padding: "4px 8px", fontSize: "12px" }}>
                      Ver Perfil
                    </button>
                    <button onClick={() => toggleCustomerStatus(customer.id)} className="btn btn--secondary btn--sm" style={{ padding: "4px 8px", fontSize: "12px", borderColor: customer.status === "Activo" ? "rgba(211,0,5,0.3)" : "rgba(212,255,0,0.3)", color: customer.status === "Activo" ? "#FF4500" : "var(--color-volt)" }}>
                      {customer.status === "Activo" ? "Suspender" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Customer Profile Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column" }}
            >
              {/* Modal Header */}
              <div style={{ padding: "24px", borderBottom: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#222", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "bold", color: "var(--color-volt)" }}>
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", color: "#FFF", fontSize: "24px" }}>{selectedCustomer.name}</h3>
                    <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "#A0A0A0" }}>
                      <span>{selectedCustomer.email}</span>
                      <span>|</span>
                      <span>ID: {selectedCustomer.id}</span>
                      <span>|</span>
                      <span style={{ color: getTierColor(selectedCustomer.tier), fontWeight: "bold" }}>{selectedCustomer.tier} Member</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} style={{ background: "none", border: "none", color: "#FFF", cursor: "pointer", fontSize: "24px" }}>&times;</button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
                
                {/* Left Col: Summary */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ backgroundColor: "#1A1A1A", padding: "16px", borderRadius: "8px", border: "1px solid #333" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#757575", fontSize: "12px", textTransform: "uppercase" }}>Valor de Vida (LTV)</h4>
                    <div style={{ fontSize: "32px", fontWeight: "bold", color: "var(--color-volt)", fontFamily: "var(--font-display)", letterSpacing: "1px" }}>
                      ${selectedCustomer.spent.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ backgroundColor: "#1A1A1A", padding: "16px", borderRadius: "8px", border: "1px solid #333" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#757575", fontSize: "12px", textTransform: "uppercase" }}>Total Pedidos</h4>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: "#FFF" }}>
                      {selectedCustomer.ordersCount}
                    </div>
                  </div>
                  <div style={{ backgroundColor: "#1A1A1A", padding: "16px", borderRadius: "8px", border: "1px solid #333" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#757575", fontSize: "12px", textTransform: "uppercase" }}>Puntos de Lealtad Disp.</h4>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: "#FFF" }}>
                      {Math.floor(selectedCustomer.spent * 0.1)} pts
                    </div>
                    <button className="btn btn--secondary btn--sm" style={{ width: "100%", marginTop: "12px" }}>Ajustar Puntos</button>
                  </div>
                </div>

                {/* Right Col: Order History */}
                <div>
                  <h4 style={{ margin: "0 0 16px 0", color: "#FFF", fontSize: "16px", borderBottom: "1px solid #222", paddingBottom: "8px" }}>Historial de Pedidos</h4>
                  
                  {getCustomerOrders(selectedCustomer.name).length === 0 ? (
                    <div style={{ padding: "20px", textAlign: "center", color: "#757575", backgroundColor: "#1A1A1A", borderRadius: "8px" }}>
                      Este cliente no tiene pedidos registrados o el nombre no coincide con el registro de ventas.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {getCustomerOrders(selectedCustomer.name).map(order => (
                        <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1A1A1A", padding: "16px", borderRadius: "8px", border: "1px solid #333" }}>
                          <div>
                            <div style={{ color: "var(--color-volt)", fontWeight: "bold", fontSize: "14px", marginBottom: "4px" }}>{order.id}</div>
                            <div style={{ fontSize: "12px", color: "#A0A0A0" }}>{order.date}</div>
                          </div>
                          <div>
                            <span style={{ 
                              padding: "4px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase",
                              backgroundColor: order.status === "completado" ? "rgba(212,255,0,0.15)" : "rgba(255,255,255,0.1)",
                              color: order.status === "completado" ? "var(--color-volt)" : "#FFF"
                            }}>
                              {order.status}
                            </span>
                          </div>
                          <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                            ${order.total.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
