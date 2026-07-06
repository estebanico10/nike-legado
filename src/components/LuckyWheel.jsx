import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PRIZES = [
  { label: '10% OFF', code: 'NIKE10', color: '#111' },
  { label: 'Envío Gratis', code: 'FREESHIP', color: '#333' },
  { label: '15% OFF', code: 'NIKE15', color: '#111' },
  { label: 'Intenta de nuevo', code: null, color: '#555' },
  { label: '20% OFF', code: 'NIKE20', color: 'var(--color-volt)' },
  { label: 'Intenta de nuevo', code: null, color: '#555' },
];

export default function LuckyWheel({ onClose }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState(null);
  const [email, setEmail] = useState('');
  const [started, setStarted] = useState(false);

  const spin = () => {
    if (isSpinning || !email.includes('@')) return;
    
    setIsSpinning(true);
    setPrize(null);

    // Bias towards 10% or Free Shipping (indexes 0, 1)
    const prizeIndex = Math.random() > 0.3 ? (Math.random() > 0.5 ? 0 : 1) : Math.floor(Math.random() * PRIZES.length);
    const sliceAngle = 360 / PRIZES.length;
    
    // Calculate final rotation
    const targetRotation = rotation + (360 * 5) + (360 - (prizeIndex * sliceAngle)) - (sliceAngle / 2);

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setPrize(PRIZES[prizeIndex]);
    }, 5000); 
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-md)'
    }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          backgroundColor: '#0A0A0A', border: '1px solid #333', borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-2xl)', maxWidth: '900px', width: '100%',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2xl)', position: 'relative'
        }}
        className="lucky-wheel-modal"
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#A0A0A0', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>

        {/* Text Section */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-h2)', textTransform: 'uppercase', color: '#F5F5F5', marginBottom: 'var(--space-sm)' }}>
            Gira y <span style={{ color: 'var(--color-volt)' }}>Gana</span>
          </h2>
          <p style={{ color: '#A0A0A0', marginBottom: 'var(--space-lg)' }}>Ingresa tu correo para girar la ruleta y ganar descuentos exclusivos o envío gratis en tu compra.</p>

          {!started ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <input 
                type="email" 
                placeholder="tu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '12px 16px', backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#FFF', width: '100%', borderRadius: '4px' }}
              />
              <button 
                className="btn btn--volt" 
                onClick={() => setStarted(true)} 
                disabled={!email.includes('@')}
                style={{ opacity: email.includes('@') ? 1 : 0.5 }}
              >
                Continuar
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <button onClick={spin} disabled={isSpinning || prize} className="btn btn--volt" style={{ width: '100%', padding: '16px', fontSize: 'var(--type-body)' }}>
                {isSpinning ? 'Girando...' : '¡Girar Ahora!'}
              </button>

              <AnimatePresence>
                {prize && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 'var(--space-md)', backgroundColor: '#111', border: '1px solid var(--color-volt)', borderRadius: '4px', textAlign: 'center' }}>
                    {prize.code ? (
                      <>
                        <p style={{ color: '#F5F5F5', marginBottom: '8px' }}>¡Ganaste <strong>{prize.label}</strong>!</p>
                        <p style={{ color: '#A0A0A0', fontSize: '12px', marginBottom: '8px' }}>Usa este código en el carrito:</p>
                        <div style={{ padding: '8px', backgroundColor: 'var(--color-volt)', color: '#111', fontWeight: 700, letterSpacing: '2px', fontSize: '1.2rem' }}>{prize.code}</div>
                      </>
                    ) : (
                      <p style={{ color: '#F5F5F5' }}>Oh no, no hubo suerte esta vez. ¡Sigue atento a nuestras promos!</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Wheel Section */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, color: 'var(--color-volt)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2z" /></svg>
          </div>
          
          <motion.div 
            style={{ width: '100%', height: '100%', borderRadius: '50%', border: '8px solid #222', overflow: 'hidden', position: 'relative' }}
            animate={{ rotate: rotation }}
            transition={{ duration: 5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {PRIZES.map((p, i) => {
              const rotationAngle = (i * 360) / PRIZES.length;
              return (
                <div 
                  key={i}
                  style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '50%', transformOrigin: 'bottom left', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: p.color, transform: `rotate(${rotationAngle}deg) skewY(${90 - (360/PRIZES.length)}deg)` }}
                >
                  <div style={{ position: 'absolute', color: p.color === 'var(--color-volt)' ? '#111' : '#FFF', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', transform: `skewY(-${90 - (360/PRIZES.length)}deg) rotate(${ (360/PRIZES.length)/2 }deg) translateY(-90px)` }}>
                    {p.label}
                  </div>
                </div>
              );
            })}
          </motion.div>

          <div style={{ position: 'absolute', width: '40px', height: '40px', backgroundColor: '#111', borderRadius: '50%', border: '4px solid #222', zIndex: 5 }}></div>
        </div>

      </motion.div>
      <style>{`
        @media (max-width: 768px) {
          .lucky-wheel-modal { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
