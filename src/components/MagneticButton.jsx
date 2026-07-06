import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagneticButton({ children, className = '', style = {} }) {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // High-performance spring physics
  const springX = useSpring(x, { stiffness: 180, damping: 12, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 180, damping: 12, mass: 0.2 });
  
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    // Set translation to 35% of offset
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, display: 'inline-block', ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
