import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// ── Helper: crea material con el hex dado ──────────────────────────────────
function useMat(hex, roughness = 0.45, metalness = 0.05) {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(hex || "#ffffff"),
        roughness,
        metalness,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hex]
  );
}

// ── Swoosh extruido con Shape de Three.js ─────────────────────────────────
function NikeSwoosh({ color = "#ffffff", position = [0, 0, 0] }) {
  const mat = useMat(color, 0.3, 0.25);

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
    () => ({
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.004,
      bevelSegments: 3,
    }),
    []
  );

  const geo = useMemo(
    () => new THREE.ExtrudeGeometry(shape, extrudeSettings),
    [shape, extrudeSettings]
  );

  return (
    <mesh
      geometry={geo}
      material={mat}
      position={position}
      scale={[0.44, 0.44, 1]}
      rotation={[0, 0, -0.1]}
      castShadow
    />
  );
}

// ── Cordones ─────────────────────────────────────────────────────────────
function Laces({ color = "#eeeeee" }) {
  const mat = useMat(color, 0.85, 0);
  const laceGeo = useMemo(() => new THREE.CylinderGeometry(0.008, 0.008, 0.31, 8), []);
  const laceY = [-0.09, -0.05, -0.01, 0.03, 0.07, 0.11];
  return (
    <group position={[0.02, 0.22, 0.04]}>
      {laceY.map((y, i) => (
        <mesh key={i} geometry={laceGeo} material={mat}
          position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow />
      ))}
    </group>
  );
}

function ShoeInstance({ c, customText, matUpper, matSole, matHeel, matInner, matMidsole, matTongue }) {
  return (
    <>
      {/* Outsole (suela inferior, gruesa) */}
      <RoundedBox args={[1.12, 0.12, 0.44]} radius={0.045} smoothness={4}
        position={[0, -0.32, 0]} material={matSole} castShadow receiveShadow />

      {/* Midsole / Air unit */}
      <RoundedBox args={[1.06, 0.08, 0.39]} radius={0.03} smoothness={4}
        position={[0.01, -0.22, 0]} material={matMidsole} castShadow />

      {/* Upper — parte trasera (más alta) */}
      <RoundedBox args={[0.44, 0.38, 0.39]} radius={0.06} smoothness={6}
        position={[-0.3, 0.0, 0]} material={matUpper} castShadow receiveShadow />

      {/* Upper — zona media */}
      <RoundedBox args={[0.26, 0.28, 0.38]} radius={0.04} smoothness={4}
        position={[0.06, -0.02, 0]} material={matUpper} castShadow />

      {/* Upper — parte delantera (toe box) */}
      <RoundedBox args={[0.44, 0.2, 0.36]} radius={0.05} smoothness={4}
        position={[0.3, -0.1, 0]} material={matUpper} castShadow receiveShadow />

      {/* Puntera redondeada */}
      <mesh castShadow receiveShadow position={[0.53, -0.17, 0]}>
        <sphereGeometry args={[0.11, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
        <primitive object={matUpper} attach="material" />
      </mesh>

      {/* Collar (abertura) */}
      <mesh position={[-0.28, 0.19, 0]} castShadow>
        <torusGeometry args={[0.15, 0.038, 10, 28, Math.PI]} />
        <primitive object={matInner} attach="material" />
      </mesh>

      {/* Heel counter */}
      <RoundedBox args={[0.24, 0.32, 0.35]} radius={0.07} smoothness={6}
        position={[-0.44, -0.02, 0]} material={matHeel} castShadow />

      {/* Pull tab del talón */}
      <RoundedBox args={[0.04, 0.12, 0.08]} radius={0.015} smoothness={4}
        position={[-0.56, 0.22, 0]} material={matHeel} castShadow />

      {/* Lengüeta */}
      <RoundedBox args={[0.16, 0.28, 0.06]} radius={0.03} smoothness={4}
        position={[-0.06, 0.16, 0.2]} rotation={[0.25, 0, 0]} material={matTongue} castShadow />

      {/* SWOOSH lateral izquierdo */}
      <NikeSwoosh color={c.swoosh} position={[-0.22, -0.1, 0.21]} />

      {/* SWOOSH lateral derecho (espejo) */}
      <group rotation={[0, Math.PI, 0]} position={[-0.22, -0.1, -0.21]}>
        <NikeSwoosh color={c.swoosh} position={[-1.08, 0, 0.02]} />
      </group>

      {/* Cordones */}
      <Laces color={c.laces} />

      {/* "NIKE" en el lateral del talón */}
      <Text
        position={[-0.44, 0.06, 0.185]}
        rotation={[0, 0, 0]}
        fontSize={0.055}
        color={c.swoosh}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        NIKE
      </Text>

      {/* Texto personalizado grabado con láser */}
      {customText && customText.trim().length > 0 && (
        <Text
          position={[-0.44, -0.1, 0.185]}
          rotation={[0, 0, 0]}
          fontSize={0.032}
          color={"rgba(255,255,255,0.6)"}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          {customText.toUpperCase()}
        </Text>
      )}
    </>
  );
}

// ── Modelo principal Nike Sneaker ─────────────────────────────────────────
export default function NikeShoeModel({ colors = {}, customText = "", shoeVisibility = "both" }) {
  const groupRef = useRef();

  const c = {
    upper:  colors.upper?.hex  || "#CEFF00",
    sole:   colors.sole?.hex   || "#111111",
    swoosh: colors.swoosh?.hex || "#ffffff",
    laces:  colors.laces?.hex  || "#eeeeee",
    heel:   colors.heel?.hex   || "#222222",
  };

  const matUpper   = useMat(c.upper,  0.4,  0.05);
  const matSole    = useMat(c.sole,   0.65, 0.0);
  const matHeel    = useMat(c.heel,   0.5,  0.05);
  const matInner   = useMat("#1a1a1a", 0.9, 0.0);
  const matMidsole = useMat("#ddeeff", 0.5,  0.0);
  const matTongue  = useMat(c.upper,  0.5,  0.0);

  const sharedProps = { c, customText, matUpper, matSole, matHeel, matInner, matMidsole, matTongue };

  // Animación de flotación suave
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
    }
  });

  return (
    <group ref={groupRef} scale={1.2} position={[0, -0.1, 0]} rotation={[0, 0.35, 0]}>
      {/* Zapato Base */}
      <group position={shoeVisibility === "both" ? [-0.6, 0, 0] : [0, 0, 0]}>
        {(shoeVisibility === "left" || shoeVisibility === "both") && (
          <ShoeInstance {...sharedProps} />
        )}
      </group>

      {/* Clon (Espejo) para el pie derecho */}
      <group position={shoeVisibility === "both" ? [0.6, 0, 0] : [0, 0, 0]} scale={[-1, 1, 1]}>
        {(shoeVisibility === "right" || shoeVisibility === "both") && (
          <ShoeInstance {...sharedProps} />
        )}
      </group>
    </group>
  );
}
