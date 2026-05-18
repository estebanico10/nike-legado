import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { resolveAsset } from "../../utils/resolveAsset";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const MOCK_DATA = {
  diaria: [
    { name: "00:00", ventas: 120 }, { name: "04:00", ventas: 80 }, { name: "08:00", ventas: 250 },
    { name: "12:00", ventas: 400 }, { name: "16:00", ventas: 300 }, { name: "20:00", ventas: 450 },
  ],
  semanal: [
    { name: "Lun", ventas: 1200 }, { name: "Mar", ventas: 1800 }, { name: "Mié", ventas: 1500 },
    { name: "Jue", ventas: 2100 }, { name: "Vie", ventas: 3000 }, { name: "Sáb", ventas: 3500 }, { name: "Dom", ventas: 2800 },
  ],
  mensual: [
    { name: "S1", ventas: 8500 }, { name: "S2", ventas: 9200 }, { name: "S3", ventas: 7800 }, { name: "S4", ventas: 10500 },
  ],
  anual: [
    { name: "Ene", ventas: 35000 }, { name: "Feb", ventas: 42000 }, { name: "Mar", ventas: 38000 }, { name: "Abr", ventas: 45000 },
    { name: "May", ventas: 41000 }, { name: "Jun", ventas: 50000 }, { name: "Jul", ventas: 48000 }, { name: "Ago", ventas: 52000 },
    { name: "Sep", ventas: 47000 }, { name: "Oct", ventas: 55000 }, { name: "Nov", ventas: 80000 }, { name: "Dic", ventas: 95000 },
  ]
};

export default function SalesDashboard() {
  const { productos } = useProducts();
  const [period, setPeriod] = useState("semanal");

  // Fake sales for products to show top sellers
  const topSellers = [...productos].map(p => ({
    ...p,
    ventas: p.ventas || Math.floor(Math.random() * 200) + 10
  })).sort((a, b) => b.ventas - a.ventas).slice(0, 5);

  const totalSales = MOCK_DATA[period].reduce((sum, item) => sum + item.ventas, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
      {/* Header and Period selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-md)" }}>
        <h3 style={{ fontSize: "var(--type-h3)", fontFamily: "var(--font-display)", color: "#F5F5F5", textTransform: "uppercase" }}>
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
      </div>

      {/* Main KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-md)" }}>
        <div style={{ backgroundColor: "#111111", padding: "var(--space-lg)", borderRadius: "var(--radius-md)", border: "1px solid #222" }}>
          <p style={{ fontSize: "var(--type-caption)", color: "#A0A0A0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ingresos Totales ({period})</p>
          <div style={{ fontSize: "var(--type-h2)", fontFamily: "var(--font-display)", color: "var(--color-volt)", marginTop: "var(--space-xs)" }}>
            ${totalSales.toLocaleString()}
          </div>
        </div>
        <div style={{ backgroundColor: "#111111", padding: "var(--space-lg)", borderRadius: "var(--radius-md)", border: "1px solid #222" }}>
          <p style={{ fontSize: "var(--type-caption)", color: "#A0A0A0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Órdenes</p>
          <div style={{ fontSize: "var(--type-h2)", fontFamily: "var(--font-display)", color: "#F5F5F5", marginTop: "var(--space-xs)" }}>
            {Math.floor(totalSales / 85).toLocaleString()}
          </div>
        </div>
        <div style={{ backgroundColor: "#111111", padding: "var(--space-lg)", borderRadius: "var(--radius-md)", border: "1px solid #222" }}>
          <p style={{ fontSize: "var(--type-caption)", color: "#A0A0A0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ticket Promedio</p>
          <div style={{ fontSize: "var(--type-h2)", fontFamily: "var(--font-display)", color: "#F5F5F5", marginTop: "var(--space-xs)" }}>
            $85.00
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ backgroundColor: "#111111", padding: "var(--space-xl)", borderRadius: "var(--radius-md)", border: "1px solid #222", height: "400px" }}>
        <h4 style={{ color: "#F5F5F5", marginBottom: "var(--space-lg)", fontSize: "var(--type-body)" }}>Tendencia de Ingresos</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_DATA[period]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
      <div style={{ backgroundColor: "#111111", padding: "var(--space-xl)", borderRadius: "var(--radius-md)", border: "1px solid #222" }}>
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
