import { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";

export default function AuditLogsAdmin() {
  const { logs, exportLogs, clearLogs } = useAuditStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 15;

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch = 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchSeverity = filterSeverity === "all" || log.severity === filterSeverity;
      
      return matchSearch && matchSeverity;
    });
  }, [logs, searchTerm, filterSeverity]);

  // Pagination logic
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const getSeverityBadge = (severity) => {
    switch(severity) {
      case "critical": return <span style={{ backgroundColor: "rgba(211,0,5,0.2)", color: "#FF4500", padding: "4px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>CRÍTICO</span>;
      case "warning": return <span style={{ backgroundColor: "rgba(255,165,0,0.2)", color: "#FFA500", padding: "4px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>ADVERTENCIA</span>;
      case "info":
      default: return <span style={{ backgroundColor: "rgba(212,255,0,0.15)", color: "var(--color-volt)", padding: "4px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>INFO</span>;
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 className="admin-card-title" style={{ margin: 0 }}>Logs de Auditoría</h2>
          <p style={{ color: "#757575", fontSize: "14px", marginTop: "4px" }}>Registro completo de actividad del sistema.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={exportLogs} className="btn btn--secondary" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar CSV
          </button>
          <button onClick={() => { if(window.confirm('¿Eliminar todos los logs?')) clearLogs(); }} className="btn btn--secondary" style={{ borderColor: "rgba(211,0,5,0.3)", color: "#FF4500" }}>
            Limpiar Logs
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "var(--space-md)", flexWrap: "wrap" }}>
        <input 
          type="text" 
          placeholder="Buscar por usuario, acción o detalle..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-input"
          style={{ flex: 1, minWidth: "250px" }}
        />
        <select 
          value={filterSeverity} 
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="admin-select"
          style={{ width: "auto", minWidth: "150px" }}
        >
          <option value="all">Todas las severidades</option>
          <option value="info">Info</option>
          <option value="warning">Advertencias</option>
          <option value="critical">Críticas</option>
        </select>
      </div>

      <div className="admin-card" style={{ overflowX: "auto", padding: 0 }}>
        {filteredLogs.length === 0 ? (
          <p style={{ padding: "24px", textAlign: "center", color: "#757575", margin: 0 }}>No se encontraron logs que coincidan con la búsqueda.</p>
        ) : (
          <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", color: "#FFF", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #222", textAlign: "left", backgroundColor: "#0A0A0A" }}>
                <th style={{ padding: "16px" }}>Timestamp</th>
                <th style={{ padding: "16px" }}>Nivel</th>
                <th style={{ padding: "16px" }}>Acción</th>
                <th style={{ padding: "16px" }}>Usuario</th>
                <th style={{ padding: "16px" }}>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: "1px solid #111", verticalAlign: "middle" }}>
                  <td style={{ padding: "16px", color: "#A0A0A0", fontSize: "12px" }}>
                    {new Date(log.date).toLocaleString()}
                  </td>
                  <td style={{ padding: "16px" }}>
                    {getSeverityBadge(log.severity)}
                  </td>
                  <td style={{ padding: "16px", fontWeight: "bold", color: "#E0E0E0" }}>
                    {log.action}
                  </td>
                  <td style={{ padding: "16px", color: "#A0A0A0" }}>
                    {log.user}
                  </td>
                  <td style={{ padding: "16px", color: "#CCC", fontSize: "13px", maxWidth: "400px" }}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
          <span style={{ color: "#757575", fontSize: "13px" }}>
            Mostrando {indexOfFirstLog + 1} - {Math.min(indexOfLastLog, filteredLogs.length)} de {filteredLogs.length} logs
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn--secondary btn--sm"
            >
              Anterior
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn btn--secondary btn--sm"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
