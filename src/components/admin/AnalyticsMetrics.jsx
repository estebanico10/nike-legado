import { useOrderStore, useCustomerStore } from "../../store/useStore";

export default function AnalyticsMetrics() {
  const { orders } = useOrderStore();
  const { customers } = useCustomerStore();

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const avgTicket = orders.length > 0 ? (totalSales / orders.length) : 0;
  const conversionRate = customers.length > 0 ? ((orders.length / customers.length) * 100).toFixed(1) : "0.0";

  return (
    <div>
      <h2 className="admin-card-title">Métricas y Analíticas Avanzadas</h2>
      <div className="admin-card" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", padding: "16px", border: "1px solid #333", borderRadius: "4px" }}>
          <h3 style={{ color: "#757575", fontSize: "14px", textTransform: "uppercase" }}>Ingresos Totales</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "var(--color-volt)" }}>${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="badge success">Basado en {orders.length} pedidos</span>
        </div>
        <div style={{ flex: "1 1 200px", padding: "16px", border: "1px solid #333", borderRadius: "4px" }}>
          <h3 style={{ color: "#757575", fontSize: "14px", textTransform: "uppercase" }}>Tasa de Conversión (Aprox)</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "var(--color-volt)" }}>{conversionRate}%</p>
          <span className="badge warning">Ratio de clientes/pedidos</span>
        </div>
        <div style={{ flex: "1 1 200px", padding: "16px", border: "1px solid #333", borderRadius: "4px" }}>
          <h3 style={{ color: "#757575", fontSize: "14px", textTransform: "uppercase" }}>Ticket Promedio</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "var(--color-volt)" }}>${avgTicket.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="badge success">Por pedido</span>
        </div>
      </div>
    </div>
  );
}

