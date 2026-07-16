import { Environment, Float, Sparkles, ContactShadows } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export default function DynamicEnvironment() {
  const lightRef = useRef(null);

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime) * 3;
      lightRef.current.position.z = Math.cos(state.clock.elapsedTime) * 3;
    }
  });

  return (
    <>
      <color attach="background" args={['#050505']} />
      
      <ambientLight intensity={0.2} />
      <directionalLight 
        ref={lightRef}
        position={[5, 5, 5]} 
        intensity={2} 
        color="#CEFF00" 
        castShadow 
      />
      <spotLight position={[-5, 5, -5]} intensity={1} color="#ffffff" />
      
      {/* Environment map for realistic reflections */}
      <Environment preset="city" />

      {/* Cinematic Particles */}
      <Sparkles 
        count={150} 
        scale={10} 
        size={2} 
        speed={0.4} 
        opacity={0.2} 
        color="#CEFF00" 
      />

      {/* Floating effect for the entire scene */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <ContactShadows 
          position={[0, -2, 0]} 
          opacity={0.5} 
          scale={10} 
          blur={2.5} 
          far={4} 
        />
      </Float>
    </>
  );
}
