import { useState } from 'react';
import { motion } from 'framer-motion';

const reviewsData = [
  { id: 1, name: 'Martín G.', date: 'Hace 2 días', rating: 5, text: 'Increíbles, súper cómodas y el diseño es aún mejor en persona.', photos: ['https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=300&q=80'] },
  { id: 2, name: 'Sofía R.', date: 'Hace 1 semana', rating: 4, text: 'Muy buenas zapatillas. La talla es exacta, recomiendo pedir su talla habitual.', photos: [] },
  { id: 3, name: 'Carlos M.', date: 'Hace 1 mes', rating: 5, text: 'La amortiguación es espectacular para correr, 10/10.', photos: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&q=80', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80'] },
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
              {review.photos && review.photos.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {review.photos.map((photo, j) => (
                    <div key={j} style={{ width: '64px', height: '64px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-ink-muted)' }}>
                      <img src={photo} alt={`User photo ${j}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
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
