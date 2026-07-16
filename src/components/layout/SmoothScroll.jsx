import { ReactLenis } from 'lenis/react'
import { useLocation } from 'react-router-dom'

export default function SmoothScroll({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Si estamos en el panel de administración (/admin), devolvemos los hijos directamente
  // para no interceptar el scroll nativo de las barras de herramientas y paneles internos.
  if (isAdmin) {
    return <>{children}</>;
  }

  // Configuración premium de smooth scroll
  return (
    <ReactLenis root options={{ 
      lerp: 0.08, // Valor bajo para mucha suavidad (tipo Awwwards)
      duration: 1.5,
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    }}>
      {children}
    </ReactLenis>
  )
}
