import { motion } from "framer-motion";

const ease = [0, 0, 0.2, 1];

const timelinePhases = [
  {
    phase: "FASE 01",
    title: "Conceptualización & Branding",
    desc: "Definición de la identidad gráfica, reglas de diseño (escala de 8px, chrome invisible) y la narrativa: streetwear minimalista con herencia andina."
  },
  {
    phase: "FASE 02",
    title: "UI/UX & Prototipado",
    desc: "Diseño de wireframes de alta fidelidad, paleta cromática basada en espacio negativo y creación de la arquitectura de la información SPA."
  },
  {
    phase: "FASE 03",
    title: "Desarrollo Front-End",
    desc: "Implementación en React 18, Vite, Framer Motion y Vanilla CSS. Creación del sistema de ruteo, transiciones de página y animaciones complejas (mesh, parallax, tilt)."
  },
  {
    phase: "FASE 04",
    title: "Validación & Despliegue",
    desc: "Pruebas de rendimiento, optimización de assets, integración del CMS local y despliegue final. Pulido del motion design."
  }
];

export default function VerticalTimeline() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)", position: "relative" }}>
      {/* Línea vertical */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: "24px", width: "2px", backgroundColor: "var(--color-ink-muted)", zIndex: 0 }} />
      
      {timelinePhases.map((item, i) => (
        <motion.div 
          key={item.phase}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease, delay: i * 0.15 }}
          style={{ display: "flex", gap: "var(--space-xl)", position: "relative", zIndex: 1 }}
        >
          {/* Nodo */}
          <div style={{ 
            width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "var(--color-volt)", border: "4px solid var(--color-canvas)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 0 2px var(--color-ink)"
          }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "#111" }}>{i + 1}</span>
          </div>
          
          {/* Contenido */}
          <div style={{ paddingTop: "8px" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-caption)", fontWeight: 600, color: "var(--color-ink-soft)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.phase}</span>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", fontWeight: 700, color: "var(--color-ink)", textTransform: "uppercase", marginTop: "var(--space-2xs)", marginBottom: "var(--space-sm)" }}>{item.title}</h4>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body-sm)", color: "var(--color-ink-soft)", lineHeight: 1.6, maxWidth: "600px" }}>{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
