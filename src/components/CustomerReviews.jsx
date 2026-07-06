import { useState } from 'react';
import { motion } from 'framer-motion';

const reviewsData = [
  { id: 1, name: 'Carlos M.', date: 'hace 2 semanas', rating: 5, text: 'Excelente calidad, llegaron mucho antes de lo esperado. Super cómodas para correr.' },
  { id: 2, name: 'Ana P.', date: 'hace 1 mes', rating: 4, text: 'Muy bonitas, el material se siente premium. Recomiendo pedir media talla más.' },
  { id: 3, name: 'Jorge R.', date: 'hace 2 meses', rating: 5, text: 'El diseño es increíble y combinan con todo. 100% originales.' },
];

export default function CustomerReviews() {
  const [reviews] = useState(reviewsData);
  
  const averageRating = 4.8;
  const totalReviews = 124;

  return (
    <div style={{ marginTop: 'var(--space-4xl)', padding: 'var(--space-2xl) 0', borderTop: '1px solid var(--color-ink-muted)' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-h3)', marginBottom: 'var(--space-xl)', textTransform: 'uppercase' }}>
        Reseñas de Clientes
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-2xl)' }}>
        
        {/* Summary */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-xs)' }}>
            <span style={{ fontSize: '4rem', fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{averageRating}</span>
            <span style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--type-body-sm)' }}>de 5 estrellas</span>
          </div>
          
          <div style={{ display: 'flex', gap: '4px', color: 'var(--color-volt)', marginBottom: 'var(--space-sm)' }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill={i < Math.floor(averageRating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            ))}
          </div>
          <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--type-caption)', marginBottom: 'var(--space-lg)' }}>Basado en {totalReviews} reseñas</p>

          <button className="btn btn--secondary" style={{ width: '100%', maxWidth: '250px' }}>Escribir una reseña</button>
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {reviews.map((review, i) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-ink-muted)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', color: 'var(--color-ink)' }}>
                  {[...Array(5)].map((_, idx) => (
                    <svg key={idx} width="14" height="14" viewBox="0 0 24 24" fill={idx < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <span style={{ fontSize: 'var(--type-micro)', color: 'var(--color-ink-soft)' }}>{review.date}</span>
              </div>
              <p style={{ fontWeight: 600, fontSize: 'var(--type-body-sm)', margin: '0 0 4px 0' }}>{review.name}</p>
              <p style={{ margin: 0, fontSize: 'var(--type-body-sm)', color: 'var(--color-ink-soft)', lineHeight: 1.5 }}>"{review.text}"</p>
            </motion.div>
          ))}
          <button style={{ background: 'none', border: 'none', color: 'var(--color-ink)', textDecoration: 'underline', cursor: 'pointer', textAlign: 'left', padding: '16px 0' }}>
            Cargar más reseñas
          </button>
        </div>
      </div>
    </div>
  );
}
