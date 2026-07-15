import { motion } from 'framer-motion';

export default function HeroTypography() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--type-hero)',
          fontWeight: 800,
          lineHeight: 0.85,
          color: 'var(--color-volt)',
          textTransform: 'uppercase',
          textAlign: 'center',
          mixBlendMode: 'difference',
        }}
      >
        <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: '2px var(--color-volt)' }}>Nike</span>
        Legado
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        style={{
          marginTop: 'var(--space-md)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--type-body-lg)',
          color: 'var(--color-canvas)',
          maxWidth: '400px',
          textAlign: 'center',
          mixBlendMode: 'difference',
        }}
      >
        Descubre el ADN de la pasión. La colección definitiva para la calle y la cancha.
      </motion.p>
    </div>
  );
}
