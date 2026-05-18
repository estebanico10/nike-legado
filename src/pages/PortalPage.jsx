import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function PortalPage() {
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
      {/* Background Decor */}
      <div style={{
        position: "absolute",
        top: "-10%", right: "-5%",
        width: "50vh", height: "50vh",
        backgroundColor: "var(--color-volt)",
        filter: "blur(150px)",
        opacity: 0.1,
        zIndex: 0
      }}></div>

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
        >
          {/* Logo Section */}
          <div style={{ marginBottom: "var(--space-3xl)" }}>
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "80px", height: "auto", color: "var(--color-ink)", margin: "0 auto var(--space-md)" }}
              aria-label="Nike"
            >
              <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z" />
            </svg>
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: "var(--type-h1)", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "var(--tracking-tight)", color: "var(--color-ink)",
              margin: 0
            }}>
              NIKE <span style={{ color: "var(--color-volt)", textShadow: "0px 0px 1px #000" }}>LEGADO</span>
            </h1>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "var(--type-body)", color: "var(--color-ink-soft)",
              textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "var(--space-sm)"
            }}>
              Portal de Acceso del Sistema
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/inicio" className="btn btn--primary" style={{ padding: "var(--space-lg) var(--space-2xl)", fontSize: "var(--type-body)", minWidth: "240px" }}>
              ENTRAR A LA TIENDA
            </Link>
            
            <Link to="/admin" className="btn btn--secondary" style={{ padding: "var(--space-lg) var(--space-2xl)", fontSize: "var(--type-body)", minWidth: "240px" }}>
              PANEL CMS ADMIN
            </Link>
          </div>
          
          <div style={{ marginTop: "var(--space-4xl)" }}>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "var(--type-micro)", color: "var(--color-ink-muted)",
              textTransform: "uppercase", letterSpacing: "0.06em"
            }}>
              Proyecto Universitario • FRENM Studios • UNEMI
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
