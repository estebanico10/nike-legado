import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text, Float } from "@react-three/drei";

// Material generador según el tipo
const createMaterial = (color, type) => {
  const baseConfig = { color: color || "#ffffff" };
  
  switch (type) {
    case "premium":
      return (
        <meshPhysicalMaterial 
          {...baseConfig} 
          roughness={0.2} 
          metalness={0.1} 
          clearcoat={1} 
          clearcoatRoughness={0.1}
        />
      );
    case "rubber": // Suela
      return (
        <meshStandardMaterial 
          {...baseConfig} 
          roughness={0.9} 
          metalness={0} 
        />
      );
    case "canvas": // Upper normal
      return (
        <meshStandardMaterial 
          {...baseConfig} 
          roughness={0.7} 
          metalness={0.1}
        />
      );
    case "accent": // Cordones / Swoosh
      return (
        <meshPhysicalMaterial 
          {...baseConfig} 
          roughness={0.3} 
          metalness={0.2} 
          emissive={color} 
          emissiveIntensity={0.2}
        />
      );
    default:
      return <meshStandardMaterial {...baseConfig} roughness={0.5} />;
  }
};

export default function ShoeModel3D({ colors, customText }) {
  const group = useRef();

  // Animación de respiración muy suave para darle vida si no hay interacción fuerte
  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]} dispose={null}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        
        {/* SUELA (Sole) */}
        <RoundedBox 
          args={[1.2, 0.4, 3.8]} 
          radius={0.15} 
          smoothness={4} 
          position={[0, 0.2, 0]}
        >
          {createMaterial(colors.sole?.hex, "rubber")}
        </RoundedBox>

        {/* CUERPO PRINCIPAL (Upper) */}
        <RoundedBox 
          args={[1.1, 1.2, 3.6]} 
          radius={0.3} 
          smoothness={4} 
          position={[0, 1.0, 0.1]}
        >
          {createMaterial(colors.upper?.hex, colors.upper?.isPremium ? "premium" : "canvas")}
        </RoundedBox>

        {/* CUELLO / TALÓN (Heel) */}
        <RoundedBox 
          args={[1.0, 0.8, 0.8]} 
          radius={0.2} 
          smoothness={4} 
          position={[0, 1.6, -1.3]}
        >
          {createMaterial(colors.heel?.hex, "canvas")}
        </RoundedBox>

        {/* LOGO SWOOSH (Representación abstracta) */}
        <RoundedBox 
          args={[0.1, 0.6, 2]} 
          radius={0.05} 
          smoothness={2} 
          position={[0.56, 1.2, 0]}
          rotation={[0.2, 0, 0]}
        >
          {createMaterial(colors.swoosh?.hex, "accent")}
        </RoundedBox>
        <RoundedBox 
          args={[0.1, 0.6, 2]} 
          radius={0.05} 
          smoothness={2} 
          position={[-0.56, 1.2, 0]}
          rotation={[0.2, 0, 0]}
        >
          {createMaterial(colors.swoosh?.hex, "accent")}
        </RoundedBox>

        {/* CORDONES (Laces) */}
        <RoundedBox 
          args={[0.6, 0.2, 1.8]} 
          radius={0.1} 
          smoothness={2} 
          position={[0, 1.7, 0.8]}
          rotation={[0.3, 0, 0]}
        >
          {createMaterial(colors.laces?.hex, "accent")}
        </RoundedBox>

        {/* GRABADO LÁSER EN EL TALÓN */}
        <Text
          position={[0, 1.6, -1.71]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.25}
          color={colors.heel?.hex === "#FFFFFF" || colors.heel?.hex === "#E5E5E5" || colors.heel?.hex === "#CEFF00" ? "#111111" : "#FFFFFF"}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor={colors.swoosh?.hex}
        >
          {(customText || "LEGADO").toUpperCase()}
        </Text>

      </Float>
    </group>
  );
}
