import { useRef, useEffect, useMemo } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { resolveAsset } from "../../utils/resolveAsset";
import { MeshoptDecoder } from "meshoptimizer";

export default function GLBShoeModel({ modelConfig, colors, shoeVisibility = "both" }) {
  const group = useRef();
  
  const modelPath = resolveAsset(modelConfig.asset);
  // Carga con decodificador meshopt
  const { scene, materials } = useGLTF(modelPath, true, true, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  useEffect(() => {
    if (!materials || !modelConfig.materialMap) return;

    const applyColorToMaterial = (materialName, hexColor, isSwoosh = false) => {
      const mat = materials[materialName];
      if (mat && mat.color) {
        // En modelos GLB con un solo material bakeado (ej. Air Jordan), el color funciona como un tinte global
        // En modelos con materiales por piezas (ej. Air Force 1), cambia el color base.
        mat.color.set(hexColor);
        
        // Si es el Swoosh (y tiene texturas oscuras por defecto), removemos la textura base (map) 
        // para que el color sólido puro sea visible (pero mantenemos el normalMap de cuero)
        if (isSwoosh && mat.map) {
          mat.map = null;
          mat.needsUpdate = true;
        }
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
        if (Array.isArray(map.swoosh)) map.swoosh.forEach(m => applyColorToMaterial(m, c, true));
        else applyColorToMaterial(map.swoosh, c, true);
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

  // Manejar la visibilidad de los zapatos para modelos "nativos" (ej. AF1 que trae ambos)
  useEffect(() => {
    if (modelConfig.pairBehavior === "native" && modelConfig.pairConfig) {
      const { leftRegex, rightRegex } = modelConfig.pairConfig;
      
      scene.traverse((node) => {
        // En AF1, usamos los nombres de los objetos para saber de qué pie son
        const isLeft = leftRegex ? leftRegex.test(node.name) : false;
        const isRight = rightRegex ? rightRegex.test(node.name) : false;
        
        if (isLeft || isRight) {
           if (shoeVisibility === "left") {
             node.visible = isLeft;
           } else if (shoeVisibility === "right") {
             node.visible = isRight;
           } else {
             node.visible = true;
           }
        }
      });
    }
  }, [scene, shoeVisibility, modelConfig]);

  // Clonar la escena para el modo espejo (Air Jordan 1)
  const mirroredScene = useMemo(() => {
    if (modelConfig.pairBehavior === "clone") {
      return scene.clone(true);
    }
    return null;
  }, [scene, modelConfig.pairBehavior]);

  return (
    <group 
      ref={group} 
      position={modelConfig.position} 
      scale={modelConfig.scale} 
      dispose={null}
    >
      <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.04}>
        
        {modelConfig.pairBehavior === "native" ? (
          /* Renderizado Base para Nativos (Air Force 1) */
          <group rotation={modelConfig.rotation || [0,0,0]}>
            <primitive object={scene} />
          </group>
        ) : (
          /* Renderizado Modo Espejo para modelado individual (Air Jordan 1) */
          <>
            <group position={shoeVisibility === "both" ? [-modelConfig.pairConfig.offset, 0, 0] : [0, 0, 0]}>
              {(shoeVisibility === "left" || shoeVisibility === "both") && (
                <group rotation={modelConfig.rotation || [0,0,0]}>
                  <primitive object={scene} />
                </group>
              )}
            </group>
            
            {(shoeVisibility === "right" || shoeVisibility === "both") && mirroredScene && (
              <group position={shoeVisibility === "both" ? [modelConfig.pairConfig.offset, 0, 0] : [0, 0, 0]} scale={[-1, 1, 1]}>
                <group rotation={modelConfig.rotation || [0,0,0]}>
                  <primitive object={mirroredScene} />
                </group>
              </group>
            )}
          </>
        )}

      </Float>
    </group>
  );
}
