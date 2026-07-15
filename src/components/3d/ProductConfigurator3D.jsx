import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useState, useRef, Suspense } from 'react';
import * as THREE from 'three';

function Shoe({ color, isExploded }) {
  const group = useRef();
  
  // Animación de 'Exploded View'
  useFrame(() => {
    if (!group.current) return;
    
    // Suela
    group.current.children[0].position.y = THREE.MathUtils.lerp(
      group.current.children[0].position.y,
      isExploded ? -1.5 : 0,
      0.1
    );
    
    // Cuerpo
    group.current.children[1].position.y = THREE.MathUtils.lerp(
      group.current.children[1].position.y,
      isExploded ? 0 : 0,
      0.1
    );
    
    // Cordones/Lengüeta
    group.current.children[2].position.y = THREE.MathUtils.lerp(
      group.current.children[2].position.y,
      isExploded ? 1.5 : 0,
      0.1
    );
  });

  return (
    <group ref={group} dispose={null}>
      {/* Suela (Mesh 1) */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.4, 3]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>
      
      {/* Cuerpo Principal (Mesh 2) */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1.1, 0.6, 2.8]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.2}
          clearcoat={0.5}
        />
      </mesh>
      
      {/* Cordones (Mesh 3) */}
      <mesh castShadow receiveShadow position={[0, 0.9, -0.2]}>
        <boxGeometry args={[0.5, 0.2, 1.5]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
    </group>
  );
}

export default function ProductConfigurator3D({ initialColor = '#CEFF00' }) {
  const [shoeColor, setShoeColor] = useState(initialColor);
  const [isExploded, setIsExploded] = useState(false);

  const colors = ['#CEFF00', '#FF0055', '#00DDFF', '#FFFFFF', '#111111'];

  return (
    <div style={{ position: 'relative', width: '100%', height: '80vh', backgroundColor: '#050505', borderRadius: '24px', overflow: 'hidden' }}>
      
      {/* UI Overlay */}
      <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-end' }}>
        
        <button 
          onClick={() => setIsExploded(!isExploded)}
          style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '100px',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          {isExploded ? 'Ensamblar' : 'Vista Exploded'}
        </button>

        <div style={{ display: 'flex', gap: '12px', background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '100px', backdropFilter: 'blur(10px)' }}>
          {colors.map(c => (
            <button
              key={c}
              onClick={() => setShoeColor(c)}
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: c,
                border: shoeColor === c ? '2px solid #fff' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10 }}>
        <h3 style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: 'var(--type-h3)', margin: 0, textTransform: 'uppercase' }}>
          Interactivo 360°
        </h3>
        <p style={{ color: '#aaa', fontFamily: 'var(--font-body)', fontSize: 'var(--type-caption)' }}>
          Arrastra para rotar. Haz scroll para zoom.
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [4, 2, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={2} castShadow />
          <Environment preset="city" />
          
          <group position={[0, 0, 0]}>
            <Shoe color={shoeColor} isExploded={isExploded} />
            <ContactShadows position={[0, -0.8, 0]} opacity={0.7} scale={10} blur={2} far={4} />
          </group>
          
          <OrbitControls 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2} 
            minDistance={3}
            maxDistance={8}
            autoRotate={!isExploded}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
