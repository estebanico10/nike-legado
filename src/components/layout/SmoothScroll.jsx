import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect } from 'react'

export default function SmoothScroll({ children }) {
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
