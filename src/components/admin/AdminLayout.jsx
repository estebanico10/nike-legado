import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLayout({ activeTab, setActiveTab, children }) {
  const navigate = useNavigate();
  
  const TABS = [
    { id: "inventario", label: "Inventario", icon: "box" },
    { id: "ventas", label: "Ventas y Dashboard", icon: "trending-up" },
    { id: "social", label: "Redes Sociales", icon: "instagram" },
    { id: "configuracion", label: "Configuración Tienda", icon: "settings" },
    { id: "inicio", label: "CMS de Inicio", icon: "layout" },
    { id: "equipo", label: "Equipo", icon: "users" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    navigate("/");
  };

  const renderIcon = (id) => {
    switch (id) {
      case "inventario": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
      case "ventas": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
      case "social": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
      case "configuracion": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
      case "inicio": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
      case "equipo": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0A0A0A", color: "#F5F5F5" }}>
      {/* Sidebar */}
      <aside style={{
        width: "260px",
        backgroundColor: "#111111",
        borderRight: "1px solid #222",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100
      }}>
        {/* Top Brand Logo */}
        <div style={{ padding: "var(--space-lg)", borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "32px", backgroundColor: "var(--color-volt)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#111" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 22h-2V11c0-1.7-1.3-3-3-3h-6c-1.7 0-3 1.3-3 3v11H4V11c0-2.8 2.2-5 5-5h6c2.8 0 5 2.2 5 5v11zM15 2H9v3h6V2z"/></svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--type-body)", textTransform: "uppercase", letterSpacing: "0.1em", color: "#F5F5F5" }}>Nike CMS</span>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: "var(--space-md) var(--space-sm)", display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto" }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 16px",
                backgroundColor: activeTab === tab.id ? "rgba(212, 255, 0, 0.1)" : "transparent",
                color: activeTab === tab.id ? "var(--color-volt)" : "#A0A0A0",
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-body)",
                fontSize: "var(--type-body-sm)",
                fontWeight: activeTab === tab.id ? 600 : 500,
                transition: "all 0.2s ease"
              }}
            >
              {renderIcon(tab.id)}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Bottom Sidebar Action */}
        <div style={{ padding: "var(--space-md)", borderTop: "1px solid #222" }}>
          <Link to="/inicio" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", color: "#757575", textDecoration: "none", fontSize: "var(--type-body-sm)", fontWeight: 500 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
            Salir a la tienda
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ marginLeft: "260px", flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        
        {/* Top Bar with Greeting */}
        <header style={{ 
          height: "80px", 
          padding: "0 var(--space-2xl)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          borderBottom: "1px solid #222",
          backgroundColor: "rgba(10, 10, 10, 0.8)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 90
        }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", fontWeight: 700, color: "#F5F5F5", textTransform: "uppercase" }}>
              Hola, Esteban
            </h1>
            <p style={{ fontSize: "var(--type-caption)", color: "#757575" }}>Bienvenido al Panel de Administración</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
            <button onClick={handleLogout} style={{ background: "none", border: "1px solid #333", color: "#A0A0A0", padding: "8px 16px", borderRadius: "100px", fontSize: "var(--type-caption)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              Cerrar Sesión
            </button>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--color-volt)", color: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.2rem", overflow: "hidden" }}>
              E
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div style={{ padding: "var(--space-2xl)", flex: 1, maxWidth: "1200px", width: "100%" }}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
