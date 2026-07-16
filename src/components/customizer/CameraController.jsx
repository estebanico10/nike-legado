import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { cameraPositions } from "./customizerData";

export default function CameraController({ activeTab, controlsRef, customView }) {
  const { camera } = useThree();

  useEffect(() => {
    const targetKey = customView || activeTab || "default";
    const target = cameraPositions[targetKey] || cameraPositions.default;
    
    // Animar la posición de la cámara con GSAP
    gsap.to(camera.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 1.2,
      ease: "power3.inOut",
      onUpdate: () => {
        if (controlsRef && controlsRef.current) {
          controlsRef.current.update();
        }
      }
    });

    // Animar el objetivo (lookAt target) del OrbitControls en lugar de bloquear en useFrame
    if (controlsRef && controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        x: target.lookAt.x,
        y: target.lookAt.y,
        z: target.lookAt.z,
        duration: 1.2,
        ease: "power3.inOut",
        onUpdate: () => {
          controlsRef.current.update();
        }
      });
    }
  }, [activeTab, customView, camera, controlsRef]);

  return null;
}
