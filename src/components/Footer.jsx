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
        paddingTop: "var(--space-4xl)",
        marginTop: "auto",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 2, paddingBottom: "var(--space-2xl)" }}>
        
        {/* Superior Area */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-3xl)", marginBottom: "var(--space-4xl)" }}>
          
          {/* Newsletter / Brand */}
          <div style={{ gridColumn: "1 / -1", maxWidth: "500px", marginBottom: "var(--space-xl)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", marginBottom: "var(--space-sm)", textTransform: "uppercase", lineHeight: 1.1 }}>
              Unete al Legado.
            </h3>
            <p style={{ color: "var(--color-canvas)", opacity: 0.7, fontSize: "var(--type-body)", marginBottom: "var(--space-xl)" }}>
              Recibe acceso anticipado a los últimos lanzamientos, colaboraciones exclusivas y eventos.
            </p>
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "var(--space-xs)" }}>
              <input 
                type="email" 
                placeholder="TU CORREO ELECTRÓNICO"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--color-canvas)",
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-body-sm)",
                  letterSpacing: "0.05em",
                  flex: 1,
                  padding: "var(--space-xs) 0"
                }}
              />
              <motion.button 
                whileHover={{ x: 5 }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-canvas)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 var(--space-sm)"
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body-sm)", marginBottom: "var(--space-lg)", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5 }}>Navegación</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {["Inicio", "Tienda", "Nosotros", "Contacto"].map((item) => (
                <motion.li key={item} whileHover={{ x: 5 }}>
                  <Link to={`/${item.toLowerCase()}`} style={{ color: "var(--color-canvas)", textDecoration: "none", fontSize: "var(--type-body-lg)", fontFamily: "var(--font-display)", textTransform: "uppercase", transition: "opacity 0.2s" }} onMouseOver={e=>e.target.style.opacity=1} onMouseOut={e=>e.target.style.opacity=0.7}>
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body-sm)", marginBottom: "var(--space-lg)", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5 }}>Legal</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {["Términos y Condiciones", "Política de Privacidad", "Devoluciones"].map((item) => (
                <motion.li key={item} whileHover={{ x: 5 }}>
                  <a href="#" style={{ color: "var(--color-canvas)", textDecoration: "none", fontSize: "var(--type-body)", opacity: 0.7, transition: "opacity 0.2s" }} onMouseOver={e=>e.target.style.opacity=1} onMouseOut={e=>e.target.style.opacity=0.7}>
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body-sm)", marginBottom: "var(--space-lg)", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5 }}>Social</h4>
            <div style={{ display: "flex", gap: "var(--space-md)" }}>
              {/* Instagram */}
              <motion.a whileHover={{ y: -3, opacity: 1 }} href="#" style={{ color: "var(--color-canvas)", opacity: 0.7 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </motion.a>
              {/* Twitter/X */}
              <motion.a whileHover={{ y: -3, opacity: 1 }} href="#" style={{ color: "var(--color-canvas)", opacity: 0.7 }}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
              </motion.a>
              {/* YouTube */}
              <motion.a whileHover={{ y: -3, opacity: 1 }} href="#" style={{ color: "var(--color-canvas)", opacity: 0.7 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </motion.a>
            </div>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "var(--space-lg)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-md)", fontSize: "var(--type-caption)", opacity: 0.5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
            <p>&copy; {new Date().getFullYear()} Nike Legado. Todos los derechos reservados.</p>
            <div style={{ display: "flex", gap: "var(--space-xs)", alignItems: "center", marginLeft: "var(--space-md)" }}>
              <button style={{ background: "none", border: "none", color: "var(--color-canvas)", fontSize: "var(--type-micro)", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>ES</button>
              <span style={{ color: "var(--color-canvas)", fontSize: "var(--type-micro)" }}>|</span>
              <button style={{ background: "none", border: "none", color: "var(--color-canvas)", opacity: 0.6, fontSize: "var(--type-micro)", cursor: "pointer" }}>EN</button>
            </div>
          </div>
          <p style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
            Quito, Ecuador 
            <svg width="16" height="12" viewBox="0 0 3 2">
              <rect width="3" height="2" fill="#ef3340"/>
              <rect width="3" height="1" y="0.5" fill="#0033a0"/>
              <rect width="3" height="0.5" fill="#ffcd00"/>
              <g transform="translate(1.5,1) scale(0.15)">
                <circle r="1" fill="#fff" opacity="0.8"/>
              </g>
            </svg>
          </p>
        </div>
      </div>
      
      {/* Giant Background Text */}
      <div 
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(100px, 20vw, 300px)",
          fontWeight: 900,
          color: "var(--color-canvas)",
          opacity: 0.03,
          lineHeight: 0.75,
          textAlign: "center",
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          overflow: "hidden",
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}
      >
        LEGADO
      </div>

      {/* Background decoration */}
      <div 
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "50%",
          height: "150%",
          background: "radial-gradient(ellipse at center, rgba(206, 255, 0, 0.03) 0%, rgba(0,0,0,0) 70%)",
          zIndex: 1,
          pointerEvents: "none"
        }}
      />
    </motion.footer>
  );
}
