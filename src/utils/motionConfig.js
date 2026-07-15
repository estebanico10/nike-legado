export const transitions = {
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 25 },
  smooth: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  snappy: { duration: 0.3, ease: [0.76, 0, 0.24, 1] },
  micro: { duration: 0.15, ease: 'easeOut' },
};

export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  stagger: {
    visible: { transition: { staggerChildren: 0.08 } },
    hidden: {},
  },
};

export const viewport = {
  once: { once: true },
  onceWithMargin: { once: true, margin: '-100px' },
};
