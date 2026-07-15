import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { useOrderStore } from "../../store/useStore";
import { resolveAsset } from "../../utils/resolveAsset";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SalesDashboard() {
  const { productos } = useProducts();
  const { orders } = useOrderStore();
  const [period, setPeriod] = useState("semanal");

  // Fake sales for products to show top sellers
  // Provide a stable pseudo-random value based on product ID to avoid hydration/render mismatch
  const getStableRandom = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash % 200) + 10;
  };

  const topSellers = [...productos].map(p => ({
    ...p,
    ventas: p.ventas || getStableRandom(p.id.toString())
  })).sort((a, b) => b.ventas - a.ventas).slice(0, 5);

  const realSalesTotal = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const realOrdersCount = orders.length;
  const avgTicket = realOrdersCount ? (realSalesTotal / realOrdersCount) : 0;
  const lowStockCount = productos.filter(p => p.stock !== undefined && p.stock < 10).length;

  // We use mock chart data combined with real totals for display purposes as real data dates are just strings
  const chartData = [
    { name: "Lun", ventas: 1200 }, { name: "Mar", ventas: 1800 }, { name: "Mié", ventas: 1500 },
    { name: "Jue", ventas: 2100 }, { name: "Vie", ventas: 3000 }, { name: "Sáb", ventas: 3500 }, { name: "Dom", ventas: 2800 }
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Cliente,Email,Fecha,Estado,Total\n"
      + orders.map(o => `${o.id},"${o.customerName}","${o.customerEmail}","${o.date}","${o.status}",${o.total}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reporte_ventas_real.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
      {/* Header and Period selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-md)" }}>
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>
          Rendimiento de Ventas
        </h3>
        
        <div style={{ display: "flex", gap: "var(--space-xs)", backgroundColor: "#111111", padding: "4px", borderRadius: "var(--radius-md)", border: "1px solid #222" }}>
          {["diaria", "semanal", "mensual", "anual"].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                backgroundColor: period === p ? "var(--color-volt)" : "transparent",
                color: period === p ? "#111" : "#A0A0A0",
                border: "none",
                padding: "var(--space-xs) var(--space-sm)",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--type-caption)",
                fontWeight: 600,
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <button 
          onClick={handleExportCSV}
          className="btn btn--secondary btn--sm"
          style={{ borderColor: "#333", color: "#A0A0A0" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "8px", verticalAlign: "middle" }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Exportar CSV
        </button>
      </div>

      {/* Main KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-md)" }}>
        <div className="admin-card">
          <p style={{ fontSize: "var(--type-caption)", color: "#A0A0A0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ingresos Totales Reales</p>
          <div style={{ fontSize: "var(--type-h2)", fontFamily: "var(--font-display)", color: "var(--color-volt)", marginTop: "var(--space-xs)" }}>
            ${realSalesTotal.toLocaleString()}
          </div>
        </div>
        <div className="admin-card">
          <p style={{ fontSize: "var(--type-caption)", color: "#A0A0A0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Órdenes Totales</p>
          <div style={{ fontSize: "var(--type-h2)", fontFamily: "var(--font-display)", color: "#F5F5F5", marginTop: "var(--space-xs)" }}>
            {realOrdersCount.toLocaleString()}
          </div>
        </div>
        <div className="admin-card">
          <p style={{ fontSize: "var(--type-caption)", color: "#A0A0A0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ticket Promedio</p>
          <div style={{ fontSize: "var(--type-h2)", fontFamily: "var(--font-display)", color: "#F5F5F5", marginTop: "var(--space-xs)" }}>
            ${avgTicket.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="admin-card" style={{ border: lowStockCount > 0 ? "1px solid #D30005" : "none" }}>
          <p style={{ fontSize: "var(--type-caption)", color: lowStockCount > 0 ? "#D30005" : "#A0A0A0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Alertas de Stock (&lt; 10)</p>
          <div style={{ fontSize: "var(--type-h2)", fontFamily: "var(--font-display)", color: lowStockCount > 0 ? "#D30005" : "#F5F5F5", marginTop: "var(--space-xs)" }}>
            {lowStockCount} pzas
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="admin-card" style={{ height: "400px" }}>
        <h4 style={{ color: "#F5F5F5", marginBottom: "var(--space-lg)", fontSize: "var(--type-body)" }}>Tendencia de Ingresos</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-volt)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-volt)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis dataKey="name" stroke="#555" tick={{ fill: "#A0A0A0", fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis stroke="#555" tick={{ fill: "#A0A0A0", fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#0D0D0D", borderColor: "#333", borderRadius: "8px", color: "#F5F5F5" }}
              itemStyle={{ color: "var(--color-volt)" }}
              formatter={(value) => [`$${value}`, "Ingresos"]}
            />
            <Area type="monotone" dataKey="ventas" stroke="var(--color-volt)" strokeWidth={2} fillOpacity={1} fill="url(#colorVentas)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="admin-card">
        <h4 style={{ color: "#F5F5F5", marginBottom: "var(--space-lg)", fontSize: "var(--type-body)" }}>Productos Más Vendidos</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {topSellers.map((product, index) => (
            <div key={product.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", paddingBottom: "var(--space-sm)", borderBottom: index < topSellers.length - 1 ? "1px solid #222" : "none" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: index < 3 ? "var(--color-volt)" : "#333", color: index < 3 ? "#111" : "#A0A0A0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>
                {index + 1}
              </div>
              <div style={{ width: "40px", height: "40px", backgroundColor: "#1A1A1A", borderRadius: "4px", overflow: "hidden" }}>
                {product.imagenes?.[0] && <img src={resolveAsset(product.imagenes[0])} alt={product.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#F5F5F5", fontWeight: 500, fontSize: "var(--type-body-sm)" }}>{product.nombre}</div>
                <div style={{ color: "#A0A0A0", fontSize: "var(--type-caption)" }}>{product.categoria}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "var(--color-volt)", fontWeight: "bold" }}>{product.ventas} uds.</div>
                <div style={{ color: "#555", fontSize: "var(--type-caption)" }}>${(product.ventas * (product.precioOferta || product.precio)).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
