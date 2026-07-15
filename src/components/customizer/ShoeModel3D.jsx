import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Text, Float } from "@react-three/drei";
import * as THREE from "three";

export default function ShoeModel3D({ colors, customText }) {
  const group = useRef();
  
  // Load the downloaded realistic Shoe model
  const { nodes, materials } = useGLTF("/assets/Shoe.glb");

  // Apply colors dynamically
  useEffect(() => {
    if (materials) {
      // The Khronos shoe usually has one or a few materials. We tint all of them to the upper color.
      Object.values(materials).forEach(mat => {
        // Ensure it's a standard or physical material
        if (mat.color) {
          // Tint the material with the selected "upper" color
          const colorObj = new THREE.Color(colors.upper?.hex || "#ffffff");
          
          // If the model has textures, the color multiplies with the texture.
          // To make the color pop more, we can adjust it
          mat.color = colorObj;
          mat.needsUpdate = true;
        }
      });
    }
  }, [colors, materials]);

  // Breathing animation
  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]} dispose={null} scale={15}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
        
        {/* Render the realistic shoe mesh */}
        {nodes && Object.keys(nodes).map(key => {
          const node = nodes[key];
          if (node.isMesh) {
            return (
              <mesh 
                key={key}
                geometry={node.geometry} 
                material={node.material} 
                castShadow 
                receiveShadow
                rotation={[0, -Math.PI / 2, 0]} // Adjust rotation so it faces right
              />
            );
          }
          return null;
        })}

        {/* Laser Engraving on Heel (Adjusted position for the new model scale) */}
        {customText && (
          <Text
            position={[-0.1, 0.08, -0.05]}
            rotation={[0, -Math.PI / 2, 0]}
            fontSize={0.03}
            color={"#ffffff"}
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.002}
            outlineColor={"#000000"}
          >
            {customText.toUpperCase()}
          </Text>
        )}

      </Float>
    </group>
  );
}

// Preload the model
useGLTF.preload("/assets/Shoe.glb");
