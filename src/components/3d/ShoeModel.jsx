import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

export default function ShoeModel() {
  const meshRef = useRef(null);
  const scroll = useScroll();

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Rotación base y reacción al mouse (suave)
    const targetRotationX = (state.pointer.y * Math.PI) / 4;
    const targetRotationY = (state.pointer.x * Math.PI) / 4;
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.05);

    // Efecto parallax con el scroll
    if (scroll) {
      const scrollY = scroll.offset;
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, scrollY * -2, 0.1);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, scrollY * 5, 0.1);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Placeholder para la zapatilla - Una figura geométrica estilizada hasta tener el GLTF */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[1, 3, 4, 16]} />
        <meshPhysicalMaterial 
          color="#111111" 
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={2}
        />
      </mesh>
      
      {/* Acentos Volt Glowing */}
      <mesh position={[0, 0, 1.1]}>
        <planeGeometry args={[0.5, 2]} />
        <meshBasicMaterial color="#CEFF00" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
