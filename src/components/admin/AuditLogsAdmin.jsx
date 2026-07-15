import React, { useState } from "react";

export default function AuditLogsAdmin() {
  const [logs] = useState([
    { id: 1, action: "User Login", user: "admin@nike.com", date: "2026-07-14T19:20:00", details: "Success" },
    { id: 2, action: "Order Export", user: "admin@nike.com", date: "2026-07-14T19:15:00", details: "Exported 150 orders to CSV" },
    { id: 3, action: "Product Added", user: "editor@nike.com", date: "2026-07-14T18:30:00", details: "Nike Air Max 90" },
    { id: 4, action: "Demo Data Injected", user: "admin@nike.com", date: "2026-07-14T17:45:00", details: "15 simulated orders injected" },
  ]);

  return (
    <div style={{ marginTop: "var(--space-md)" }}>
      <h2 style={{ fontSize: "var(--type-h3)", fontFamily: "var(--font-display)", color: "#F5F5F5", marginBottom: "var(--space-md)", textTransform: "uppercase" }}>Logs de Auditoría</h2>
      <div style={{ backgroundColor: "#111111", border: "1px solid #222", borderRadius: "var(--radius-md)", padding: "var(--space-md)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", color: "#F5F5F5", fontSize: "14px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #333", color: "var(--color-volt)" }}>
              <th style={{ padding: "12px 8px" }}>ID</th>
              <th style={{ padding: "12px 8px" }}>Acción</th>
              <th style={{ padding: "12px 8px" }}>Usuario</th>
              <th style={{ padding: "12px 8px" }}>Fecha</th>
              <th style={{ padding: "12px 8px" }}>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} style={{ borderBottom: "1px solid #222" }}>
                <td style={{ padding: "12px 8px" }}>{log.id}</td>
                <td style={{ padding: "12px 8px", fontWeight: "bold" }}>{log.action}</td>
                <td style={{ padding: "12px 8px", color: "#A0A0A0" }}>{log.user}</td>
                <td style={{ padding: "12px 8px", color: "#A0A0A0" }}>{new Date(log.date).toLocaleString()}</td>
                <td style={{ padding: "12px 8px" }}>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
