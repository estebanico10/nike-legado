import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{
        backgroundColor: "var(--color-ink)",
        color: "var(--color-canvas)",
        padding: "var(--space-4xl) 0 var(--space-xl)",
        marginTop: "auto",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-2xl)", marginBottom: "var(--space-3xl)" }}>
          
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", marginBottom: "var(--space-md)", textTransform: "uppercase" }}>Legado</h4>
            <p style={{ color: "var(--color-canvas)", opacity: 0.7, fontSize: "var(--type-body-sm)" }}>
              Diseñado en los Andes. <br />
              Hecho para el mundo.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body)", marginBottom: "var(--space-md)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Navegación</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              <li><Link to="/inicio" style={{ color: "var(--color-canvas)", opacity: 0.7, textDecoration: "none", transition: "opacity 0.2s" }} onMouseOver={e=>e.target.style.opacity=1} onMouseOut={e=>e.target.style.opacity=0.7}>Inicio</Link></li>
              <li><Link to="/tienda" style={{ color: "var(--color-canvas)", opacity: 0.7, textDecoration: "none", transition: "opacity 0.2s" }} onMouseOver={e=>e.target.style.opacity=1} onMouseOut={e=>e.target.style.opacity=0.7}>Tienda</Link></li>
              <li><Link to="/nosotros" style={{ color: "var(--color-canvas)", opacity: 0.7, textDecoration: "none", transition: "opacity 0.2s" }} onMouseOver={e=>e.target.style.opacity=1} onMouseOut={e=>e.target.style.opacity=0.7}>Nosotros</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body)", marginBottom: "var(--space-md)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Legal</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              <li><a href="#" style={{ color: "var(--color-canvas)", opacity: 0.7, textDecoration: "none" }}>Términos y Condiciones</a></li>
              <li><a href="#" style={{ color: "var(--color-canvas)", opacity: 0.7, textDecoration: "none" }}>Política de Privacidad</a></li>
            </ul>
          </div>

        </div>
        
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "var(--space-lg)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-md)", fontSize: "var(--type-caption)", opacity: 0.5 }}>
          <p>&copy; {new Date().getFullYear()} Nike Legado. Todos los derechos reservados.</p>
          <p>Quito, Ecuador 🇪🇨</p>
        </div>
      </div>
      
      {/* Background decoration */}
      <div 
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "50%",
          height: "150%",
          background: "radial-gradient(ellipse at center, rgba(206, 255, 0, 0.05) 0%, rgba(0,0,0,0) 70%)",
          zIndex: 1,
          pointerEvents: "none"
        }}
      />
    </motion.footer>
  );
}
