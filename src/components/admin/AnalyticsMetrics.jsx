import { useOrderStore, useCustomerStore } from "../../store/useStore";
import { exportToCSV } from "../../utils/exporter";

export default function AnalyticsMetrics() {
  const { orders } = useOrderStore();
  const { customers } = useCustomerStore();

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const avgTicket = orders.length > 0 ? (totalSales / orders.length) : 0;
  const conversionRate = customers.length > 0 ? ((orders.length / customers.length) * 100).toFixed(1) : "0.0";
  
  const bestsellers = [
    { name: "Nike Air Max", sales: 120 },
    { name: "Nike Dunk Low", sales: 90 },
    { name: "Nike Force 1", sales: 75 }
  ];

  const deadstock = [
    { name: "Nike React", stock: 50 },
    { name: "Nike Pegasus", stock: 45 }
  ];

  const handleExport = () => {
    exportToCSV(orders, "pedidos_exportados.csv");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
        <h2 className="admin-card-title">Métricas y Analíticas Avanzadas</h2>
        <button className="btn btn--primary btn--sm" onClick={handleExport} style={{ backgroundColor: "var(--color-volt)", color: "#000", fontWeight: "bold" }}>
          Exportar Pedidos a CSV
        </button>
      </div>
      <div className="admin-card" style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "var(--space-md)" }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-md)" }}>
        <div className="admin-card" style={{ padding: "16px", border: "1px solid #333", borderRadius: "4px", backgroundColor: "#111" }}>
          <h3 style={{ color: "var(--color-volt)", fontSize: "16px", marginBottom: "16px" }}>Funnel de Conversión</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ background: "#222", padding: "8px", borderRadius: "4px" }}>Visitas: 10,000</div>
            <div style={{ background: "#222", padding: "8px", borderRadius: "4px", width: "80%" }}>Agregados al Carrito: 2,500 (25%)</div>
            <div style={{ background: "#222", padding: "8px", borderRadius: "4px", width: "60%" }}>Inicios de Pago: 1,000 (10%)</div>
            <div style={{ background: "var(--color-volt)", color: "#000", padding: "8px", borderRadius: "4px", width: "30%", fontWeight: "bold" }}>Compras: {orders.length}</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: "16px", border: "1px solid #333", borderRadius: "4px", backgroundColor: "#111" }}>
          <h3 style={{ color: "var(--color-volt)", fontSize: "16px", marginBottom: "16px" }}>Top Bestsellers vs Deadstock</h3>
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: "#FFF", fontSize: "14px", marginBottom: "8px" }}>Bestsellers</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#A0A0A0", fontSize: "14px" }}>
                {bestsellers.map(item => (
                  <li key={item.name} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", padding: "8px 0" }}>
                    <span>{item.name}</span>
                    <span style={{ color: "#FFF" }}>{item.sales}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: "#FFF", fontSize: "14px", marginBottom: "8px" }}>Deadstock</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#A0A0A0", fontSize: "14px" }}>
                {deadstock.map(item => (
                  <li key={item.name} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", padding: "8px 0" }}>
                    <span>{item.name}</span>
                    <span style={{ color: "#D30005" }}>{item.stock}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
