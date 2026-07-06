import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function PortalPage() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "var(--color-canvas)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Decor & Texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.05,
        backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
        pointerEvents: "none",
        zIndex: 0
      }}></div>
      
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "60vh", height: "60vh",
        background: "radial-gradient(circle, var(--color-volt) 0%, transparent 70%)",
        filter: "blur(120px)",
        opacity: 0.05,
        zIndex: 0,
      }}></div>

      {/* Grid Pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(17,17,17,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        zIndex: 0
      }}></div>

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] }}
        >
          {/* Logo Section */}
          <div style={{ marginBottom: "var(--space-2xl)" }}>
            <motion.svg
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="1"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100px", height: "auto", margin: "0 auto var(--space-xl)", display: "block" }}
              aria-label="Nike"
              initial={{ pathLength: 0, fill: "rgba(0,0,0,0)" }}
              animate={{ pathLength: 1, fill: "var(--color-ink)" }}
              transition={{ duration: 1.5, ease: "easeInOut", fill: { delay: 1, duration: 0.5 } }}
            >
              <path stroke="none" d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z" />
              <motion.path 
                fill="none"
                d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z" 
              />
            </motion.svg>
            
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "var(--tracking-tight)", color: "var(--color-ink)",
              margin: 0, position: "relative",
              transform: glitch ? "skewX(-5deg)" : "none",
              textShadow: glitch ? "2px 0 var(--color-volt), -2px 0 red" : "none",
              transition: "transform 0.05s, text-shadow 0.05s"
            }}>
              NIKE <span style={{ color: "var(--color-volt)", textShadow: "0px 0px 2px rgba(0,0,0,0.5)" }}>LEGADO</span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              style={{
                fontFamily: "var(--font-body)", fontSize: "var(--type-body)", color: "var(--color-ink-soft)",
                textTransform: "uppercase", letterSpacing: "0.2em", marginTop: "var(--space-md)"
              }}
            >
              Streetwear Ecuatoriano
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            style={{ display: "flex", gap: "var(--space-md)", justifyContent: "center", flexWrap: "wrap", marginTop: "var(--space-3xl)" }}
          >
            <Link to="/inicio" style={{ textDecoration: "none" }}>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn--primary" 
                style={{ padding: "var(--space-lg) var(--space-2xl)", fontSize: "var(--type-body)", minWidth: "240px", display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-sm)" }}
              >
                INGRESAR AL SITIO
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </motion.button>
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            style={{ marginTop: "var(--space-4xl)" }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", padding: "var(--space-xs) var(--space-md)", border: "1px solid var(--color-ink-muted)", borderRadius: "var(--radius-none)" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-volt)", animation: "pulse 2s infinite" }} />
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--type-micro)", color: "var(--color-ink-soft)",
                textTransform: "uppercase", letterSpacing: "0.06em", margin: 0
              }}>
                Proyecto Universitario • FRENM Studios • UNEMI
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(206, 255, 0, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(206, 255, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(206, 255, 0, 0); }
        }
      `}</style>
    </main>
  );
}
