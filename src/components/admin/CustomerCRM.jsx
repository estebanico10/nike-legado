import { useState } from "react";
import { useCustomerStore } from "../../store/useStore";
import { motion } from "framer-motion";

export default function CustomerCRM() {
  const { customers, toggleCustomerStatus } = useCustomerStore();
  const [filterTier, setFilterTier] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(customer => {
    const matchesTier = filterTier === "todos" || customer.tier.toLowerCase() === filterTier.toLowerCase();
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexWrap: "wrap", gap: "12px" }}>
        <h2 className="admin-card-title" style={{ margin: 0 }}>Gestión de Clientes (CRM)</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["todos", "Gold", "Silver", "Standard"].map(tier => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className="btn btn--secondary"
              style={{
                fontSize: "var(--type-caption)",
                padding: "6px 12px",
                borderRadius: "20px",
                border: filterTier === tier ? "1px solid var(--color-volt)" : "1px solid #333",
                color: filterTier === tier ? "var(--color-volt)" : "#A0A0A0",
                backgroundColor: filterTier === tier ? "rgba(212, 255, 0, 0.05)" : "transparent"
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
          placeholder="Buscar clientes por nombre o correo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
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
        {filteredCustomers.length === 0 ? (
          <p style={{ padding: "24px", textAlign: "center", color: "#757575", margin: 0 }}>No se encontraron clientes.</p>
        ) : (
          <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", color: "#FFF", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #222", textAlign: "left" }}>
                <th style={{ padding: "16px" }}>Cliente</th>
                <th style={{ padding: "16px" }}>Membresía</th>
                <th style={{ padding: "16px" }}>Pedidos</th>
                <th style={{ padding: "16px" }}>Gastado</th>
                <th style={{ padding: "16px" }}>Estado de Cuenta</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(c => (
                <tr key={c.id} style={{ borderBottom: "1px solid #111", verticalAlign: "middle" }}>
                  <td style={{ padding: "16px" }}>
                    <div style={{ fontWeight: 500, color: "#FFF" }}>{c.name}</div>
                    <div style={{ fontSize: "12px", color: "#757575" }}>{c.email}</div>
                  </td>
                  <td style={{ padding: "16px", fontWeight: 700, color: getTierColor(c.tier) }}>
                    {c.tier.toUpperCase()}
                  </td>
                  <td style={{ padding: "16px", color: "#A0A0A0" }}>{c.ordersCount} pedidos</td>
                  <td style={{ padding: "16px", color: "#FFF", fontWeight: 600 }}>${c.spent.toFixed(2)}</td>
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "100px",
                      fontSize: "11px",
                      fontWeight: 600,
                      backgroundColor: c.status === "Activo" ? "rgba(212, 255, 0, 0.15)" : "rgba(211, 0, 5, 0.15)",
                      color: c.status === "Activo" ? "var(--color-volt)" : "#FF4500",
                      textTransform: "uppercase"
                    }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <button
                      onClick={() => toggleCustomerStatus(c.id)}
                      className="btn btn--secondary btn--sm"
                      style={{
                        borderColor: c.status === "Activo" ? "#D30005" : "var(--color-volt)",
                        color: c.status === "Activo" ? "#FFF" : "#000",
                        backgroundColor: c.status === "Activo" ? "rgba(211,0,5,0.2)" : "var(--color-volt)",
                        fontSize: "12px"
                      }}
                    >
                      {c.status === "Activo" ? "Suspender" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
