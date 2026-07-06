import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../context/ProductContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, updateCartQty, removeFromCart } = useProducts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + (item.precio * item.qty), 0);

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 9999
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "var(--color-canvas)",
              zIndex: 10000,
              display: "flex",
              flexDirection: "column",
              boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
              borderLeft: "1px solid var(--color-ink-muted)"
            }}
          >
            {/* Header */}
            <div style={{
              padding: "var(--space-lg)",
              borderBottom: "1px solid var(--color-ink-muted)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--type-h3)",
                fontWeight: 700,
                color: "var(--color-ink)",
                textTransform: "uppercase"
              }}>
                Tu Carrito ({cart.reduce((a, c) => a + c.qty, 0)})
              </h2>
              <button 
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-ink-soft)",
                  padding: "4px"
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-md)" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: "var(--space-4xl)", color: "var(--color-ink-soft)" }}>
                  <svg style={{ margin: "0 auto var(--space-md)", opacity: 0.5 }} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <p style={{ fontFamily: "var(--font-body)" }}>Tu carrito está vacío.</p>
                  <button 
                    onClick={() => { onClose(); navigate("/tienda"); }} 
                    className="btn btn--secondary" 
                    style={{ marginTop: "var(--space-lg)" }}
                  >
                    Empezar a comprar
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} style={{ display: "flex", gap: "var(--space-md)", paddingBottom: "var(--space-md)", borderBottom: "1px solid var(--color-ink-muted)" }}>
                      <div style={{ width: "80px", height: "80px", flexShrink: 0, backgroundColor: "var(--color-canvas-alt)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                        <OptimizedImage src={item.imagenes[0]} alt={item.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--type-body-sm)", color: "var(--color-ink)" }}>{item.nombre}</h4>
                            <button onClick={() => { removeFromCart(index); addToast("Producto eliminado", "info"); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-ink-soft)" }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                          </div>
                          <div style={{ fontSize: "var(--type-micro)", color: "var(--color-ink-soft)", marginTop: "4px" }}>
                            {item.size && `Talla: ${item.size} `}
                            {item.color && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                Color: <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: item.color, display: "inline-block", border: "1px solid var(--color-ink-muted)" }} />
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-sm)" }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--color-ink-muted)", borderRadius: "var(--radius-sm)" }}>
                            <button onClick={() => updateCartQty(index, -1)} style={{ padding: "4px 8px", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-ink)" }}>-</button>
                            <span style={{ padding: "0 8px", fontSize: "var(--type-body-sm)", fontFamily: "var(--font-body)" }}>{item.qty}</span>
                            <button onClick={() => updateCartQty(index, 1)} style={{ padding: "4px 8px", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-ink)" }}>+</button>
                          </div>
                          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-ink)" }}>
                            ${(item.precio * item.qty).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div style={{ padding: "var(--space-lg)", borderTop: "1px solid var(--color-ink-muted)", backgroundColor: "var(--color-canvas-alt)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-md)", fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, color: "var(--color-ink)", textTransform: "uppercase" }}>
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p style={{ fontSize: "var(--type-micro)", color: "var(--color-ink-soft)", marginBottom: "var(--space-md)", textAlign: "center" }}>
                  Impuestos y envíos calculados en el checkout.
                </p>
                <button onClick={handleCheckout} className="btn btn--primary" style={{ width: "100%", padding: "var(--space-md) 0" }}>
                  Proceder al Pago
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
