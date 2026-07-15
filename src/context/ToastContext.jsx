import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, options = "success") => {
    const id = crypto.randomUUID();
    const type = typeof options === 'string' ? options : (options.type || "success");
    const action = typeof options === 'object' ? options.action : null;
    
    setToasts((prev) => [...prev, { id, message, type, action }]);
    
    // Auto remove after 4s unless it has an action
    if (!action) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div 
        style={{
          position: "fixed",
          bottom: "var(--space-2xl)",
          right: "var(--space-xl)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-xs)",
          pointerEvents: "none"
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              style={{
                background: toast.type === "success" ? "var(--color-ink)" : toast.type === "warning" ? "#FFB800" : toast.type === "error" ? "#D30005" : "#1A1A1A",
                color: toast.type === "warning" ? "#111" : "#fff",
                padding: "var(--space-sm) var(--space-xl)",
                borderRadius: "var(--radius-full)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--type-caption)",
                fontWeight: 600,
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-xs)",
                pointerEvents: "auto",
                border: toast.type === "info" ? "1px solid #333" : "none"
              }}
              role={toast.type === "error" || toast.type === "warning" ? "alert" : "status"}
              aria-live={toast.type === "error" || toast.type === "warning" ? "assertive" : "polite"}
            >
              {toast.type === "success" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-volt)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
              {toast.type === "error" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              )}
              {toast.type === "warning" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              )}
              {toast.type === "info" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-volt)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              )}
              {toast.message}
              
              {toast.action && (
                <button 
                  onClick={() => { toast.action.onClick(); removeToast(toast.id); }}
                  style={{
                    background: "transparent", border: "none", cursor: "pointer",
                    color: toast.type === "warning" ? "#111" : "var(--color-volt)",
                    fontWeight: 800, marginLeft: "var(--space-md)",
                    textTransform: "uppercase", fontSize: "10px", padding: "4px 8px", borderRadius: "10px",
                    backgroundColor: "rgba(255,255,255,0.1)"
                  }}
                >
                  {toast.action.label}
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
