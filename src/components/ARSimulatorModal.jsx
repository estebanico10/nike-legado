import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { resolveAsset } from "../utils/resolveAsset";

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2} position={[0, -1, 0]} />;
}

export default function ARSimulatorModal({ isOpen, onClose, product }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isOpen) {
      const initTimer = setTimeout(() => {
        setLoading(true);
        setCameraActive(false);
      }, 0);
      const timer = setTimeout(() => {
        setLoading(false);
        setCameraActive(true);
      }, 1500);
      return () => {
        clearTimeout(initTimer);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "#000", zIndex: 9999, display: "flex", flexDirection: "column"
        }}
      >
        <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", display: "flex", justifyContent: "space-between", zIndex: 10 }}>
          <h3 style={{ color: "#FFF", fontFamily: "var(--font-display)", textTransform: "uppercase", margin: 0, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            Realidad Aumentada
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#FFF", cursor: "pointer", padding: "8px", backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "50%" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {loading && (
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 5, backgroundColor: "#111" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-volt)" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            </motion.div>
            <p style={{ marginTop: "16px", color: "var(--color-volt)", fontFamily: "var(--font-display)", textTransform: "uppercase" }}>Activando Cámara...</p>
          </div>
        )}

        {/* Fake Camera Feed Background */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: cameraActive ? 0.3 : 0, transition: "opacity 0.5s", backgroundImage: "url('https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1000&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} />
        
        {/* AR Grid Overlay */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "linear-gradient(rgba(212,255,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,255,0,0.1) 1px, transparent 1px)", backgroundSize: "50px 50px", opacity: cameraActive ? 1 : 0, transition: "opacity 0.5s", pointerEvents: "none" }} />

        {/* 3D Canvas */}
        {cameraActive && product?.modelo3D && (
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={1} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
              <Environment preset="city" />
              <Model url={resolveAsset(product.modelo3D)} />
              <OrbitControls enableZoom={true} enablePan={true} autoRotate autoRotateSpeed={2} />
            </Canvas>
          </div>
        )}

        {cameraActive && !product?.modelo3D && (
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#FFF", backgroundColor: "rgba(0,0,0,0.8)", padding: "16px 24px", borderRadius: "8px", fontFamily: "var(--font-display)", textTransform: "uppercase" }}>Modelo 3D no disponible para este producto.</p>
          </div>
        )}

        <div style={{ position: "absolute", bottom: "40px", left: "0", right: "0", display: "flex", justifyContent: "center", pointerEvents: "none" }}>
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{ backgroundColor: "rgba(0,0,0,0.7)", padding: "12px 24px", borderRadius: "100px", color: "var(--color-volt)", fontFamily: "var(--font-display)", textTransform: "uppercase", fontSize: "14px", border: "1px solid var(--color-volt)", pointerEvents: "auto", backdropFilter: "blur(10px)" }}
          >
            Apunte la cámara al suelo y mueva el modelo
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
