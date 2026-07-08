import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCartStore, useUIStore } from '../store/useStore';
import { resolveAsset } from '../utils/resolveAsset';
import { useState, useEffect } from 'react';

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, getCartTotal, couponCode, discountPercent, applyCoupon, removeCoupon, addToCart } = useCartStore();
  const { isCartOpen, closeCart } = useUIStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900);

  const subtotal = getCartTotal();
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  const UPSELLS = [
    { id: "socks-volt-001", nombre: "Calcetines Volt Crew", precio: 10.00, imagenes: ["./assets/products/indoor-genz-specs.png"], tallas: ["M"], colores: ["#CEFF00"], categoria: "Equipamiento", tipo: "accesorios" },
    { id: "indoor-cap-genz-001", nombre: "Gorra Street Fútbol", precio: 20.00, imagenes: ["./assets/products/timeless-cap-001-front.webp"], tallas: ["Talla única"], colores: ["#111111"], categoria: "Indoor Gen Z", tipo: "gorra" },
    { id: "laces-volt-001", nombre: "Cordones Volt Sport", precio: 5.00, imagenes: ["./assets/products/indoor-genz-front.png"], tallas: ["Talla única"], colores: ["#CEFF00"], categoria: "Equipamiento", tipo: "accesorios" }
  ];

  const filteredUpsells = UPSELLS.filter(u => !items.some(item => item.id === u.id));

  useEffect(() => {
    if (!isCartOpen) return;
    
    let expiresAt = sessionStorage.getItem("cart_expiry");
    if (!expiresAt) {
      expiresAt = Date.now() + 15 * 60 * 1000;
      sessionStorage.setItem("cart_expiry", expiresAt.toString());
    } else {
      expiresAt = parseInt(expiresAt, 10);
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isCartOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput.trim());
    setCouponMsg(result);
    if (result.success) setCouponInput("");
    setTimeout(() => setCouponMsg(null), 3000);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', top: 0, right: 0, height: '100vh', width: '100%', maxWidth: '400px',
              backgroundColor: '#0A0A0A', borderLeft: '1px solid #222', zIndex: 1001,
              display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
            }}
          >
            {/* Header */}
            <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-h3)', textTransform: 'uppercase', color: '#F5F5F5', margin: 0 }}>
                Tu Carrito
              </h2>
              <button onClick={closeCart} style={{ background: 'none', border: 'none', color: '#A0A0A0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Scarcity Timer */}
            {items.length > 0 && (
              <div style={{
                backgroundColor: timeLeft < 180 ? 'rgba(211, 0, 5, 0.15)' : 'rgba(212, 255, 0, 0.08)',
                color: timeLeft < 180 ? '#FF4500' : 'var(--color-volt)',
                padding: '10px var(--space-lg)',
                fontSize: '11px',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.05em',
                textAlign: 'center',
                borderBottom: '1px solid #1A1A1A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                animation: timeLeft < 180 ? 'pulse 1s infinite alternate' : 'none'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>¡RESERVA DE STOCK ACTIVA! EXPIRA EN: <strong>{formatTime(timeLeft)}</strong></span>
              </div>
            )}

            {/* Free Shipping Progress Bar */}
            {items.length > 0 && (
              <div style={{ padding: '16px var(--space-lg) 8px', borderBottom: '1px solid #1A1A1A' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: 'var(--type-micro)', color: '#A0A0A0' }}>
                  <span>{subtotal >= 150 ? '¡Envío gratis desbloqueado!' : `Te faltan $${(150 - subtotal).toFixed(2)} para envío gratis`}</span>
                  <span>${subtotal.toFixed(2)} / $150.00</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((subtotal / 150) * 100, 100)}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ height: '100%', backgroundColor: 'var(--color-volt)', borderRadius: '3px' }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-md)' }}>
              {items.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#757575', textAlign: 'center' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '16px', opacity: 0.5 }}>
                    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#A0A0A0', marginBottom: '8px' }}>Tu carrito está vacío</p>
                  <button onClick={closeCart} className="btn btn--secondary btn--sm">Continuar Comprando</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {items.map((item) => {
                    const price = item.enOferta && item.precioOferta ? item.precioOferta : item.precio;
                    return (
                      <div key={`${item.id}-${item.size}-${item.color}`} style={{ display: 'flex', gap: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid #1A1A1A' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={resolveAsset(item.imagenes?.[0])} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4 style={{ color: '#F5F5F5', fontSize: 'var(--type-body-sm)', margin: 0, paddingRight: '8px' }}>{item.nombre}</h4>
                            <button onClick={() => removeFromCart(item.id, item.size, item.color)} style={{ background: 'none', border: 'none', color: '#757575', cursor: 'pointer', padding: 0 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: 'var(--type-micro)', color: '#A0A0A0' }}>
                            {item.size && <span>Talla: {item.size}</span>}
                            {item.color && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Color: <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color, border: '1px solid #333' }} />
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #333', borderRadius: '4px', backgroundColor: '#111' }}>
                              <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)} style={{ padding: '4px 10px', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>-</button>
                              <span style={{ color: '#FFF', fontSize: 'var(--type-caption)', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)} style={{ padding: '4px 10px', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>+</button>
                            </div>
                            <span style={{ color: 'var(--color-volt)', fontWeight: 600 }}>${(price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Completa tu Look (Cross-Selling) */}
                  {filteredUpsells.length > 0 && (
                    <div style={{ marginTop: 'var(--space-md)', borderTop: '1px solid #1A1A1A', paddingTop: 'var(--space-md)' }}>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '11px', textTransform: 'uppercase', color: '#757575', letterSpacing: '0.08em', marginBottom: 'var(--space-sm)' }}>
                        Completa Tu Look
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {filteredUpsells.map(u => (
                          <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#111', borderRadius: '4px', border: '1px solid #1A1A1A' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <div style={{ width: '40px', height: '40px', backgroundColor: '#1A1A1A', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                <img src={resolveAsset(u.imagenes[0])} alt={u.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div>
                                <h5 style={{ margin: 0, fontSize: '12px', color: '#F5F5F5', fontWeight: 500 }}>{u.nombre}</h5>
                                <span style={{ fontSize: '11px', color: 'var(--color-volt)', fontWeight: 600 }}>${u.precio.toFixed(2)}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => addToCart(u, u.tallas[0], 1, u.colores[0])}
                              style={{
                                backgroundColor: 'var(--color-volt)', color: '#000', border: 'none',
                                width: '28px', height: '28px', borderRadius: '50%', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                                cursor: 'pointer', transition: 'transform 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              +
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: 'var(--space-lg)', borderTop: '1px solid #222', backgroundColor: '#0D0D0D' }}>
                  {/* Coupon System */}
                  <div style={{ marginBottom: "var(--space-md)" }}>
                    {couponCode ? (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(212, 255, 0, 0.1)", padding: "8px 12px", borderRadius: "4px", border: "1px dashed var(--color-volt)" }}>
                        <span style={{ fontSize: "var(--type-micro)", fontWeight: 700, color: "var(--color-ink)", textTransform: "uppercase" }}>Cupón: {couponCode}</span>
                        <button onClick={removeCoupon} style={{ background: "none", border: "none", color: "#D30005", fontSize: "var(--type-micro)", cursor: "pointer", textDecoration: "underline" }}>Remover</button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "8px" }}>
                        <input 
                          type="text" 
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Código de cupón..."
                          style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--color-ink-muted)", backgroundColor: "var(--color-canvas)", color: "var(--color-ink)", outline: "none", fontSize: "var(--type-caption)" }}
                        />
                        <button type="submit" className="btn btn--secondary btn--sm">Aplicar</button>
                      </form>
                    )}
                    {couponMsg && (
                      <p style={{ fontSize: "10px", marginTop: "4px", color: couponMsg.success ? "#4CAF50" : "#D30005" }}>{couponMsg.message}</p>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)", color: "var(--color-ink-soft)", fontSize: "var(--type-body-sm)" }}>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)", color: "#D30005", fontSize: "var(--type-body-sm)" }}>
                      <span>Descuento ({discountPercent}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)", color: "var(--color-ink-soft)", fontSize: "var(--type-body-sm)" }}>
                    <span>Envío</span>
                    <span>{subtotal >= 150 ? 'Gratis' : '$15.00'}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--color-ink-muted)", paddingTop: "var(--space-md)", marginBottom: "var(--space-xl)", fontWeight: 700, fontSize: "var(--type-h4)", fontFamily: "var(--font-display)" }}>
                    <span>Total</span>
                    <span>${(total + (subtotal >= 150 ? 0 : 15)).toFixed(2)}</span>
                  </div>
                <Link to="/checkout" onClick={closeCart} className="btn btn--volt" style={{ width: '100%', textAlign: 'center', padding: '16px', fontSize: 'var(--type-body)' }}>
                  Ir a Pagar
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
