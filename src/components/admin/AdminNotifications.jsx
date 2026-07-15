import { useState, useMemo, useEffect, useRef } from "react";
import { useOrderStore, useCommunityStore } from "../../store/useStore";
import { useProducts } from "../../context/ProductContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminNotifications({ setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  
  const { orders } = useOrderStore();
  const { posts } = useCommunityStore();
  const { productos } = useProducts();

  const notifications = useMemo(() => {
    const notifs = [];

    // Orders pending processing
    const pendingOrders = orders.filter(o => o.status === "procesando" || o.status === "pendiente");
    if (pendingOrders.length > 0) {
      notifs.push({
        id: "orders_pending",
        type: "warning",
        title: "Pedidos Pendientes",
        message: `Hay ${pendingOrders.length} pedidos esperando ser procesados.`,
        action: () => setActiveTab("pedidos")
      });
    }

    // Community posts waiting for approval
    const pendingPosts = posts.filter(p => p.approved === undefined || p.approved === null);
    if (pendingPosts.length > 0) {
      notifs.push({
        id: "posts_pending",
        type: "info",
        title: "Posts de Comunidad",
        message: `Tienes ${pendingPosts.length} posts nuevos esperando moderación.`,
        action: () => setActiveTab("comunidad")
      });
    }

    // Low stock products
    const lowStock = productos.filter(p => p.stock !== undefined && p.stock <= 5);
    if (lowStock.length > 0) {
      notifs.push({
        id: "low_stock",
        type: "critical",
        title: "Alerta de Inventario",
        message: `${lowStock.length} productos tienen stock bajo (5 o menos).`,
        action: () => setActiveTab("inventario")
      });
    }

    return notifs;
  }, [orders, posts, productos, setActiveTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIconForType = (type) => {
    switch (type) {
      case "critical": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF4500" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
      case "warning": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
      case "info":
      default: return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-volt)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
    }
  };

  return (
    <div style={{ position: "relative" }} ref={panelRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: "none", 
          border: "none", 
          color: "#FFF", 
          cursor: "pointer", 
          position: "relative",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {notifications.length > 0 && (
          <span style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            backgroundColor: "#D30005",
            color: "#FFF",
            fontSize: "10px",
            fontWeight: "bold",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #000"
          }}>
            {notifications.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              width: "320px",
              backgroundColor: "#111",
              border: "1px solid #333",
              borderRadius: "8px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              zIndex: 1000,
              marginTop: "8px",
              overflow: "hidden"
            }}
          >
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #222", backgroundColor: "#1A1A1A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ margin: 0, fontSize: "14px", color: "#F5F5F5" }}>Notificaciones</h4>
              <span style={{ fontSize: "11px", color: "#A0A0A0" }}>{notifications.length} pendientes</span>
            </div>
            
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div style={{ padding: "32px 16px", textAlign: "center", color: "#757575", fontSize: "13px" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: "0 auto 8px", opacity: 0.5 }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <p style={{ margin: 0 }}>Todo al día. No hay alertas nuevas.</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      notif.action();
                      setIsOpen(false);
                    }}
                    style={{ 
                      padding: "12px 16px", 
                      borderBottom: "1px solid #222",
                      cursor: "pointer",
                      display: "flex",
                      gap: "12px",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1A1A1A"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <div style={{ marginTop: "2px" }}>
                      {getIconForType(notif.type)}
                    </div>
                    <div>
                      <h5 style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#F5F5F5" }}>{notif.title}</h5>
                      <p style={{ margin: 0, fontSize: "12px", color: "#A0A0A0", lineHeight: "1.4" }}>{notif.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
