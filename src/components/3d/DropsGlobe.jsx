import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function GlobeMesh() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Esfera base wireframe */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial 
          color="#333333" 
          wireframe={true}
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Esfera interior sólida (para bloquear visión trasera) */}
      <mesh>
        <sphereGeometry args={[1.98, 32, 32]} />
        <meshBasicMaterial color="#050505" />
      </mesh>
      
      {/* Anillos orbitales */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.52, 64]} />
        <meshBasicMaterial color="#CEFF00" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <ringGeometry args={[2.8, 2.81, 64]} />
        <meshBasicMaterial color="#fff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function DropMarkers() {
  const groupRef = useRef();
  
  // Posiciones aleatorias alrededor del globo
  const markers = useMemo(() => {
    const arr = [];
    for(let i = 0; i < 15; i++) {
      const phi = Math.acos(-1 + (2 * i) / 15);
      const theta = Math.sqrt(15 * Math.PI) * phi;
      
      const x = 2 * Math.cos(theta) * Math.sin(phi);
      const y = 2 * Math.sin(theta) * Math.sin(phi);
      const z = 2 * Math.cos(phi);
      
      // Highlight solo algunos
      const isHighlight = i % 3 === 0;
      
      arr.push({ pos: [x, y, z], isHighlight });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {markers.map((m, i) => (
        <mesh key={i} position={m.pos}>
          <sphereGeometry args={[m.isHighlight ? 0.08 : 0.04, 16, 16]} />
          <meshBasicMaterial color={m.isHighlight ? "#CEFF00" : "#ffffff"} />
        </mesh>
      ))}
    </group>
  );
}

export default function DropsGlobe() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <fog attach="fog" args={['#0C0C0C', 3, 10]} />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <GlobeMesh />
        <DropMarkers />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
