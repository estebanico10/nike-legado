import { useRef, useEffect } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { resolveAsset } from "../../utils/resolveAsset";

export default function ShoeModel3D({ colors, customText }) {
  const group = useRef();
  
  // Load the downloaded realistic Shoe model using resolveAsset for GitHub Pages / Vite base URL support
  const modelPath = resolveAsset("/assets/Shoe.glb");
  const { nodes, materials } = useGLTF(modelPath);

  // Apply colors dynamically sin recompilar shaders ni crear objetos basura
  useEffect(() => {
    if (materials) {
      const targetHex = colors.upper?.hex || "#ffffff";
      Object.values(materials).forEach(mat => {
        if (mat && mat.color) {
          mat.color.set(targetHex);
          mat.roughness = 0.35;
          mat.metalness = 0.1;
        }
      });
    }
  }, [colors.upper?.hex, materials]);

  return (
    <group ref={group} position={[0, -0.35, 0]} dispose={null} scale={8.8}>
      <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.04}>
        
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
useGLTF.preload(resolveAsset("/assets/Shoe.glb"));
