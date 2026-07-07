export default function AnalyticsMetrics() {
  return (
    <div>
      <h2 className="admin-card-title">Métricas y Analíticas Avanzadas</h2>
      <div className="admin-card" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", padding: "16px", border: "1px solid #333", borderRadius: "4px" }}>
          <h3 style={{ color: "#757575", fontSize: "14px", textTransform: "uppercase" }}>Tráfico del Mes</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "var(--color-volt)" }}>45,200</p>
          <span className="badge success">+12% vs mes anterior</span>
        </div>
        <div style={{ flex: "1 1 200px", padding: "16px", border: "1px solid #333", borderRadius: "4px" }}>
          <h3 style={{ color: "#757575", fontSize: "14px", textTransform: "uppercase" }}>Conversión</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "var(--color-volt)" }}>3.2%</p>
          <span className="badge warning">-0.5% vs mes anterior</span>
        </div>
        <div style={{ flex: "1 1 200px", padding: "16px", border: "1px solid #333", borderRadius: "4px" }}>
          <h3 style={{ color: "#757575", fontSize: "14px", textTransform: "uppercase" }}>Ticket Promedio</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "var(--color-volt)" }}>$125.00</p>
          <span className="badge success">+5% vs mes anterior</span>
        </div>
      </div>
    </div>
  );
}
