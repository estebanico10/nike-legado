import { useState } from "react";
import { useOrderStore } from "../../store/useStore";
import { motion } from "framer-motion";

export default function OrderManagement() {
  const { orders, updateOrderStatus } = useOrderStore();
  const [filterStatus, setFilterStatus] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "todos" || order.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "procesando": return { bg: "rgba(255, 165, 0, 0.15)", text: "#FFA500" };
      case "enviado": return { bg: "rgba(0, 229, 255, 0.15)", text: "#00E5FF" };
      case "entregado": return { bg: "rgba(212, 255, 0, 0.15)", text: "var(--color-volt)" };
      default: return { bg: "rgba(255,255,255,0.1)", text: "#FFF" };
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexWrap: "wrap", gap: "12px" }}>
        <h2 className="admin-card-title" style={{ margin: 0 }}>Gestión de Pedidos</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["todos", "Procesando", "Enviado", "Entregado"].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className="btn btn--secondary"
              style={{
                fontSize: "var(--type-caption)",
                padding: "6px 12px",
                borderRadius: "20px",
                border: filterStatus === status ? "1px solid var(--color-volt)" : "1px solid #333",
                color: filterStatus === status ? "var(--color-volt)" : "#A0A0A0",
                backgroundColor: filterStatus === status ? "rgba(212, 255, 0, 0.05)" : "transparent"
              }}
            >
              {status.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "var(--space-md)", display: "flex", gap: "10px" }}>
        <input 
          type="text" 
          placeholder="Buscar por cliente, email o ID de pedido..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            backgroundColor: "#111",
            border: "1px solid #222",
            borderRadius: "4px",
            padding: "10px 14px",
            color: "#FFF",
            outline: "none"
          }}
        />
      </div>

      <div className="admin-card" style={{ overflowX: "auto", padding: 0 }}>
        {filteredOrders.length === 0 ? (
          <p style={{ padding: "24px", textAlign: "center", color: "#757575", margin: 0 }}>No se encontraron pedidos.</p>
        ) : (
          <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", color: "#FFF", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #222", textAlign: "left" }}>
                <th style={{ padding: "16px" }}>Pedido</th>
                <th style={{ padding: "16px" }}>Cliente</th>
                <th style={{ padding: "16px" }}>Fecha</th>
                <th style={{ padding: "16px" }}>Artículos</th>
                <th style={{ padding: "16px" }}>Total</th>
                <th style={{ padding: "16px" }}>Estado</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const sColor = getStatusColor(order.status);
                return (
                  <tr key={order.id} style={{ borderBottom: "1px solid #111", verticalAlign: "middle" }}>
                    <td style={{ padding: "16px", fontWeight: "bold", color: "#FFF" }}>{order.id}</td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                      <div style={{ fontSize: "12px", color: "#757575" }}>{order.customerEmail}</div>
                    </td>
                    <td style={{ padding: "16px", color: "#A0A0A0" }}>{order.date}</td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontSize: "12px", color: "#D0D0D0" }}>
                        {order.items?.map((item, idx) => (
                          <div key={idx}>{item.nombre} x {item.quantity}</div>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "16px", color: "var(--color-volt)", fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                    <td style={{ padding: "16px" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "100px",
                        fontSize: "11px",
                        fontWeight: 600,
                        backgroundColor: sColor.bg,
                        color: sColor.text,
                        textTransform: "uppercase"
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        style={{
                          backgroundColor: "#161616",
                          border: "1px solid #333",
                          color: "#FFF",
                          borderRadius: "4px",
                          padding: "6px 10px",
                          cursor: "pointer",
                          outline: "none"
                        }}
                      >
                        <option value="Procesando">Procesando</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregado">Entregado</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
