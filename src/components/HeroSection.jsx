import { motion } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
        backgroundColor: "var(--color-canvas)",
      }}
    >


      {/* Content */}
      <div className="container" style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "var(--space-4xl)" }}>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "var(--space-2xl)", display: "inline-block", position: "relative" }}
        >
          {/* Animated Badge */}
          <div style={{
            position: "absolute", inset: "-4px", borderRadius: "100px",
            background: "linear-gradient(90deg, var(--color-volt), transparent, var(--color-volt))",
            backgroundSize: "200% 100%",
            animation: "shimmer 2s infinite linear",
            zIndex: -1
          }}></div>
          <div className="badge-indoor" style={{
            padding: "var(--space-xs) var(--space-md)",
            borderRadius: "100px",
          }}>
            ⚽ COLECCIÓN INDOOR GEN Z — FÚTBOL BARRIO
          </div>
        </motion.div>

        {/* Clip-path Reveal Text */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <motion.h1
            initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)", y: 40 }}
            animate={{ clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)", y: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.5rem, 10vw, 8rem)",
              fontWeight: 800,
              lineHeight: 0.9,
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-tight)",
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            NIKE <span style={{ color: "transparent", WebkitTextStroke: "2px var(--color-ink)", display: "block" }}>LEGADO</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              marginTop: "-10px",
              marginBottom: "10px",
            }}
          >
            <span className="font-street" style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              color: "var(--color-indoor-blue)",
              backgroundColor: "var(--color-volt)",
              padding: "2px 16px",
              borderRadius: "4px",
              boxShadow: "4px 4px 0px var(--color-ink)",
              display: "inline-block"
            }}>
              👑 HECHO PARA JUGAR
            </span>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            lineHeight: 1.6,
            color: "var(--color-ink-soft)",
            maxWidth: "640px",
            margin: "var(--space-md) auto var(--space-2xl)",
          }}
        >
          “El verdadero gol no fue en la cancha de cemento sino en la de tierra, donde las mochinas fueron arco y tu mamá el árbitro más duro, y aún, siempre volvíamos.” 
          <strong style={{ color: "var(--color-ink)", display: "block", marginTop: "8px" }}>FÚTBOL AMIGOS BARRIO SUEÑOS.</strong>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          style={{ display: "flex", gap: "var(--space-md)", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link to="/tienda" className="btn btn--primary" style={{
            position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", gap: "var(--space-sm)",
            backgroundColor: "var(--color-indoor-blue)", color: "#FFFFFF", borderColor: "var(--color-indoor-blue)"
          }}>
            👑 VER CAMISA GEN Z ($30)
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <a href="#coleccion" className="btn btn--secondary">
            EXPLORAR BARRIO
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          position: "absolute",
          bottom: "var(--space-2xl)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-sm)",
          zIndex: 1
        }}
      >
        <span style={{
          fontFamily: "var(--font-body)", fontSize: "var(--type-micro)",
          textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-ink-soft)"
        }}>
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          style={{ width: "2px", height: "40px", backgroundColor: "var(--color-volt)", borderRadius: "2px" }}
        />
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </section>
  );
}
