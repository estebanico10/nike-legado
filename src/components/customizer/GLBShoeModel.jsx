import { useRef, useEffect } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { resolveAsset } from "../../utils/resolveAsset";
import { MeshoptDecoder } from "meshoptimizer";

export default function GLBShoeModel({ modelConfig, colors }) {
  const group = useRef();
  
  const modelPath = resolveAsset(modelConfig.asset);
  // Carga con decodificador meshopt
  const { nodes, materials } = useGLTF(modelPath, true, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  useEffect(() => {
    if (!materials || !modelConfig.materialMap) return;

    const applyColorToMaterial = (materialName, hexColor) => {
      const mat = materials[materialName];
      if (mat && mat.color) {
        // En modelos GLB con un solo material bakeado (ej. Air Jordan), el color funciona como un tinte global
        // En modelos con materiales por piezas (ej. Air Force 1), cambia el color base.
        mat.color.set(hexColor);
      }
    };

    if (modelConfig.supportsLayerColors) {
      // Mapeo por capas (ej. Air Force 1)
      const map = modelConfig.materialMap;
      if (map.upper) {
        const c = colors.upper?.hex || "#ffffff";
        if (Array.isArray(map.upper)) map.upper.forEach(m => applyColorToMaterial(m, c));
        else applyColorToMaterial(map.upper, c);
      }
      if (map.swoosh) {
        const c = colors.swoosh?.hex || "#ffffff";
        if (Array.isArray(map.swoosh)) map.swoosh.forEach(m => applyColorToMaterial(m, c));
        else applyColorToMaterial(map.swoosh, c);
      }
      if (map.sole) {
        const c = colors.sole?.hex || "#111111";
        if (Array.isArray(map.sole)) map.sole.forEach(m => applyColorToMaterial(m, c));
        else applyColorToMaterial(map.sole, c);
      }
      if (map.laces) {
        const c = colors.laces?.hex || "#eeeeee";
        if (Array.isArray(map.laces)) map.laces.forEach(m => applyColorToMaterial(m, c));
        else applyColorToMaterial(map.laces, c);
      }
      if (map.heel) {
        const c = colors.heel?.hex || "#222222";
        if (Array.isArray(map.heel)) map.heel.forEach(m => applyColorToMaterial(m, c));
        else applyColorToMaterial(map.heel, c);
      }
    } else {
      // Tinte global (ej. Air Jordan 1)
      const c = colors.upper?.hex || "#ffffff"; // Usamos upper como tinte general
      if (modelConfig.materialMap.upper) {
        applyColorToMaterial(modelConfig.materialMap.upper, c);
      }
    }
  }, [colors, materials, modelConfig]);

  return (
    <group 
      ref={group} 
      position={modelConfig.position} 
      rotation={modelConfig.rotation} 
      scale={modelConfig.scale} 
      dispose={null}
    >
      <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.04}>
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
              />
            );
          }
          return null;
        })}
      </Float>
    </group>
  );
}
