import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
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
                background: toast.type === "success" ? "var(--color-ink)" : "var(--color-error, #ff3333)",
                color: toast.type === "success" ? "var(--color-canvas)" : "#fff",
                padding: "var(--space-sm) var(--space-xl)",
                borderRadius: "var(--radius-full)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--type-caption)",
                fontWeight: 600,
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-xs)"
              }}
            >
              {toast.type === "success" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-volt)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
              {toast.message}
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
