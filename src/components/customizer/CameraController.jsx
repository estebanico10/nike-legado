import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";

// Definimos las posiciones de cámara según la pestaña fuera del componente
const cameraPositions = {
  swoosh: { x: 5, y: 1.5, z: 4, lookAt: { x: 0, y: 1, z: 0 } },
  upper: { x: 3, y: 4, z: 5, lookAt: { x: 0, y: 1, z: 0 } },
  sole: { x: 0, y: -2, z: 6, lookAt: { x: 0, y: 0.5, z: 0 } },
  laces: { x: 0, y: 5, z: 2, lookAt: { x: 0, y: 1.5, z: 0 } },
  heel: { x: -4, y: 2, z: -5, lookAt: { x: 0, y: 1, z: -1.5 } },
  default: { x: 4, y: 3, z: 6, lookAt: { x: 0, y: 1, z: 0 } }
};

export default function CameraController({ activeTab }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    const target = cameraPositions[activeTab] || cameraPositions.default;
    
    // Animar la posición de la cámara
    gsap.to(camera.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 1.2,
      ease: "power3.inOut"
    });

    // Guardar el objetivo actual para que useFrame lo mantenga enfocado
    controlsRef.current = target.lookAt;
  }, [activeTab, camera]);

  useFrame(() => {
    if (controlsRef.current) {
      camera.lookAt(controlsRef.current.x, controlsRef.current.y, controlsRef.current.z);
    }
  });

  return null;
}
