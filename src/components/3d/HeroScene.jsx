import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import ShoeModel from './ShoeModel';
import DynamicEnvironment from './DynamicEnvironment';

export default function HeroScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ScrollControls pages={3} damping={0.1}>
          <DynamicEnvironment />
          <ShoeModel />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
