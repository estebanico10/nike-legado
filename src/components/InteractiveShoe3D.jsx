import { useRef, useState, Suspense } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";

function Shoe({ shoeColors, ...props }) {
  const mesh = useRef();
  // Este es un modelo de zapatilla de ejemplo de uso libre de PMNDRS
  const { nodes, materials } = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/shoe-1/model.gltf");
  
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={mesh} {...props} dispose={null}>
      <mesh receiveShadow castShadow geometry={nodes.shoe.geometry} material={materials.laces} material-color={shoeColors.laces} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_1.geometry} material={materials.mesh} material-color={shoeColors.mesh} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_2.geometry} material={materials.caps} material-color={shoeColors.inner} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_3.geometry} material={materials.inner} material-color={shoeColors.inner} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_4.geometry} material={materials.sole} material-color={shoeColors.sole} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_5.geometry} material={materials.stripes} material-color={shoeColors.stripes} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_6.geometry} material={materials.band} material-color={shoeColors.mesh} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_7.geometry} material={materials.patch} material-color={shoeColors.stripes} />
    </group>
  );
}

// Removida precarga agresiva para evitar fallos si el servidor 3D está caído.
// useGLTF.preload("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/shoe-1/model.gltf");

export default function InteractiveShoe3D() {
  const [colors, setColors] = useState({
    mesh: "#ffffff",
    stripes: "#d4ff00",
    sole: "#ffffff",
    laces: "#111111",
    inner: "#111111",
  });

  const [activePart, setActivePart] = useState("stripes");

  const colorOptions = [
    "#ffffff", "#111111", "#d4ff00", "#ff3366", "#3366ff", "#00ff99", "#ff9900", "#808080"
  ];

  const parts = [
    { id: "mesh", label: "Cuerpo" },
    { id: "stripes", label: "Logo/Detalles" },
    { id: "sole", label: "Suela" },
    { id: "laces", label: "Cordones" },
  ];

  return (
    <div style={{ width: "100%", height: "600px", position: "relative", backgroundColor: "var(--color-canvas-alt)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      
      {/* 3D Canvas */}
      <ErrorBoundary>
        <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
          <color attach="background" args={["#f4f4f4"]} />
          <ambientLight intensity={0.7} />
          <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1} castShadow shadow-bias={-0.0001} />
          
          <Suspense fallback={null}>
            <Shoe shoeColors={colors} position={[0, -0.8, 0]} rotation={[0.3, Math.PI, 0]} />
            <Environment preset="city" />
            <ContactShadows position={[0, -0.8, 0]} opacity={0.75} scale={10} blur={2} far={4} />
          </Suspense>
          
          <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
        </Canvas>
      </ErrorBoundary>

      {/* Nike By You Overlay UI */}
      <div style={{ position: "absolute", inset: "0", pointerEvents: "none", padding: "var(--space-2xl)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        
        {/* Header */}
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", textTransform: "uppercase", color: "#111", margin: 0, lineHeight: 1 }}>
            Nike By You
          </h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body)", color: "#555", margin: "4px 0 0 0" }}>
            Diseña tu propia leyenda.
          </p>
        </div>

        {/* Customization Controls */}
        <div style={{ pointerEvents: "auto", display: "flex", flexDirection: "column", gap: "var(--space-md)", maxWidth: "320px", backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", padding: "var(--space-lg)", borderRadius: "var(--radius-md)", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          
          <div style={{ display: "flex", gap: "var(--space-sm)", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
            {parts.map(part => (
              <button
                key={part.id}
                onClick={() => setActivePart(part.id)}
                style={{
                  background: activePart === part.id ? "#111" : "transparent",
                  color: activePart === part.id ? "#fff" : "#555",
                  border: `1px solid ${activePart === part.id ? "#111" : "#ddd"}`,
                  padding: "6px 12px",
                  borderRadius: "100px",
                  fontSize: "var(--type-caption)",
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s"
                }}
              >
                {part.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {colorOptions.map(color => (
              <button
                key={color}
                onClick={() => setColors(prev => ({ ...prev, [activePart]: color }))}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  border: colors[activePart] === color ? "3px solid #111" : "1px solid #ddd",
                  boxShadow: colors[activePart] === color ? "0 0 0 2px #fff inset" : "none",
                  cursor: "pointer",
                  transition: "transform 0.1s",
                  transform: colors[activePart] === color ? "scale(1.1)" : "scale(1)"
                }}
                aria-label={`Seleccionar color ${color}`}
              />
            ))}
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn--primary"
            style={{ width: "100%", marginTop: "var(--space-sm)", backgroundColor: "var(--color-volt)", color: "#111" }}
          >
            Terminar Diseño - $180
          </motion.button>
        </div>
      </div>
    </div>
  );
}
