import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useUIStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { resolveAsset } from '../utils/resolveAsset';

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();

  const total = getCartTotal();

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
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: 'var(--space-lg)', borderTop: '1px solid #222', backgroundColor: '#0D0D0D' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)', color: '#F5F5F5', fontSize: 'var(--type-body)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700 }}>${total.toFixed(2)}</span>
                </div>
                <p style={{ fontSize: 'var(--type-micro)', color: '#757575', marginBottom: 'var(--space-md)', textAlign: 'center' }}>Los impuestos y el envío se calculan en el checkout.</p>
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
