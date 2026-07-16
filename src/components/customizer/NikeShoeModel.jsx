import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useGLTF, Float } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import { resolveAsset } from "../../utils/resolveAsset";

// ── Helper: Swoosh extruido con Shape de Three.js ─────────────────────────────────
function NikeSwoosh({ color = "#ffffff", position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.3, metalness: 0.25 }),
    [color]
  );

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0.15, 0.06, 0.38, 0.2,  0.58, 0.1);
    s.bezierCurveTo(0.78, 0.01, 0.96, -0.04, 1.1, 0.02);
    s.bezierCurveTo(0.82, 0.24, 0.48, 0.3,  0.28, 0.23);
    s.bezierCurveTo(0.08, 0.16, 0.02, 0.06,  0,  0);
    return s;
  }, []);

  const extrudeSettings = useMemo(
    () => ({ depth: 0.02, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 3 }),
    []
  );

  const geo = useMemo(() => new THREE.ExtrudeGeometry(shape, extrudeSettings), [shape, extrudeSettings]);

  return (
    <mesh geometry={geo} material={mat} position={position} scale={[0.44 * scale, 0.44 * scale, 1 * scale]} rotation={rotation} castShadow />
  );
}

function ShoeInstance({ c, customText, nodes }) {
  // El modelo original Adidas necesita ser rotado para verse de lado
  const shoeScale = 8.8;

  // Controles en tiempo real para tapar el logo de Adidas con el Swoosh
  const { swooshExtX, swooshExtY, swooshExtZ, swooshExtRX, swooshExtRY, swooshExtRZ, swooshScale } = useControls('Swoosh Exterior', {
    swooshExtX: { value: 0.08, step: 0.01 },
    swooshExtY: { value: 0.04, step: 0.01 },
    swooshExtZ: { value: 0.08, step: 0.01 },
    swooshExtRX: { value: 0, step: 0.05 },
    swooshExtRY: { value: 0, step: 0.05 },
    swooshExtRZ: { value: 0, step: 0.05 },
    swooshScale: { value: 0.8, step: 0.05 },
  });

  const { swooshIntX, swooshIntY, swooshIntZ, swooshIntRX, swooshIntRY, swooshIntRZ } = useControls('Swoosh Interior', {
    swooshIntX: { value: -0.05, step: 0.01 },
    swooshIntY: { value: 0.04, step: 0.01 },
    swooshIntZ: { value: -0.06, step: 0.01 },
    swooshIntRX: { value: 0, step: 0.05 },
    swooshIntRY: { value: Math.PI, step: 0.05 },
    swooshIntRZ: { value: 0, step: 0.05 },
  });

  return (
    <group position={[0, -0.35, 0]} scale={shoeScale}>
      {/* Mallas del GLB original (Shoe.glb) */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        {nodes && Object.keys(nodes).map(key => {
          const node = nodes[key];
          if (node.isMesh) {
            return (
              <mesh key={key} geometry={node.geometry} material={node.material} castShadow receiveShadow />
            );
          }
          return null;
        })}

        {/* Añadir el Logo de Nike (Swoosh) superpuesto al modelo de Adidas para ocultarlo o re-brandearlo */}
        {/* Lado Exterior */}
        <NikeSwoosh color={c.swoosh} position={[swooshExtX, swooshExtY, swooshExtZ]} rotation={[swooshExtRX, swooshExtRY, swooshExtRZ]} scale={swooshScale} />
        {/* Lado Interior */}
        <NikeSwoosh color={c.swoosh} position={[swooshIntX, swooshIntY, swooshIntZ]} rotation={[swooshIntRX, swooshIntRY, swooshIntRZ]} scale={swooshScale} />
      </group>

      {/* Texto personalizado grabado con láser */}
      {customText && customText.trim().length > 0 && (
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
    </group>
  );
}

// ── Modelo Híbrido (Shoe.glb + Nike Swoosh procedural) ─────────────────────────────────────────
export default function NikeShoeModel({ colors = {}, customText = "", shoeVisibility = "both" }) {
  const groupRef = useRef();

  const c = {
    upper:  colors.upper?.hex  || "#CEFF00",
    swoosh: colors.swoosh?.hex || "#ffffff",
  };

  // Cargar el modelo base original
  const modelPath = resolveAsset("/assets/Shoe.glb");
  const { nodes, materials } = useGLTF(modelPath);

  // Aplicar colores al modelo base
  useEffect(() => {
    if (materials) {
      Object.values(materials).forEach(mat => {
        if (mat && mat.color) {
          mat.color.set(c.upper);
          mat.roughness = 0.35;
          mat.metalness = 0.1;
        }
      });
    }
  }, [c.upper, materials]);

  const sharedProps = { c, customText, nodes, materials };

  // Animación de flotación suave
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
    }
  });

  // Escala base para el grupo de presentación
  const presentationScale = 1.0; 

  return (
    <group ref={groupRef} scale={presentationScale} position={[0, -0.1, 0]} rotation={[0, 0, 0]}>
      <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.04}>
        {/* Zapato Base (Pie Izquierdo) */}
        <group position={shoeVisibility === "both" ? [-1.4, 0, 0] : [0, 0, 0]}>
          {(shoeVisibility === "left" || shoeVisibility === "both") && (
            <ShoeInstance {...sharedProps} />
          )}
        </group>

        {/* Clon (Espejo) para el pie derecho */}
        <group position={shoeVisibility === "both" ? [1.4, 0, 0] : [0, 0, 0]} scale={[-1, 1, 1]}>
          {(shoeVisibility === "right" || shoeVisibility === "both") && (
            <ShoeInstance {...sharedProps} />
          )}
        </group>
      </Float>
    </group>
  );
}

// Precargar el modelo para que esté listo de inmediato
useGLTF.preload(resolveAsset("/assets/Shoe.glb"));
