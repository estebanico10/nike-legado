import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, PresentationControls, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";

function BoxShoe(props) {
  const mesh = useRef();
  
  // Rotating the shoe slowly
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group {...props}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1} floatingRange={[0, 0.2]}>
        <mesh ref={mesh} position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 1, 3]} />
          <meshStandardMaterial 
            color="#d4ff00" 
            metalness={0.8}
            roughness={0.2}
            envMapIntensity={1}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function InteractiveShoe3D() {
  return (
    <div style={{ width: "100%", height: "500px", position: "relative", backgroundColor: "var(--color-canvas-alt)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 45 }}>
        <color attach="background" args={["#f4f4f4"]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <PresentationControls 
          global 
          rotation={[0, 0.3, 0]} 
          polar={[-Math.PI / 3, Math.PI / 3]} 
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <BoxShoe />
        </PresentationControls>

        <ContactShadows position={[0, -1.4, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      <div style={{ position: "absolute", bottom: "16px", left: "16px", pointerEvents: "none" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", textTransform: "uppercase", color: "#111" }}>Explora en 3D</h3>
        <p style={{ fontSize: "var(--type-caption)", color: "#555" }}>Arrastra para rotar</p>
      </div>
    </div>
  );
}
