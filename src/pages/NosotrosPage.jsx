import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { resolveAsset } from "../utils/resolveAsset";

import { useSite } from "../context/SiteContext";

const colorData = [
  { name: "Primary Space", hex: "#FFFFFF", pct: 55, desc: "Espacio negativo dominante — el silencio visual que da peso al contenido" },
  { name: "Primary Dark / Text", hex: "#111111", pct: 18, desc: "Tipografía, iconografía y elementos de interfaz de alta jerarquía" },
  { name: "Indoor Navy Blue", hex: "#043174", pct: 12, desc: "El color del fútbol indoor, remates en mangas y cuellos deportivos" },
  { name: "Background / UI", hex: "#F5F5F5", pct: 8, desc: "Superficies secundarias, contenedores de producto y canvas alternativo" },
  { name: "Energy Volt", hex: "#CEFF00", pct: 5, desc: "Acentos de interacción: CTAs primarios, indicadores activos, graffitis" },
  { name: "Secondary Text", hex: "#757575", pct: 2, desc: "Metadata, captions, descripciones secundarias y labels de formulario" },
];


const ease = [0, 0, 0.2, 1];

/* ─── Reusable sub-components ─── */

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)", fontSize: "var(--type-caption)", fontWeight: 500,
      textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-ink-soft)",
      marginBottom: "var(--space-md)",
    }}>{children}</p>
  );
}

function SectionTitle({ children, style }) {
  return (
    <h2 style={{
      fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", lineHeight: "var(--lh-h2)",
      fontWeight: 700, letterSpacing: "var(--tracking-tight)", textTransform: "uppercase",
      color: "var(--color-ink)", marginBottom: "var(--space-2xl)", ...style,
    }}>{children}</h2>
  );
}

function PhotoPlaceholder({ src, width, height, label, style }) {
  const [error, setError] = useState(!src);

  if (!error && src) {
    return (
      <img
        src={resolveAsset(src)}
        alt={label || "Photo"}
        style={{ width, height, objectFit: "cover", display: "block", ...style }}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div style={{
      width, height, backgroundColor: "var(--color-canvas-alt)",
      border: "2px dashed var(--color-ink-muted)", display: "flex", alignItems: "center",
      justifyContent: "center", flexDirection: "column", gap: "12px",
      color: "var(--color-ink-soft)", fontFamily: "var(--font-body)",
      fontSize: "var(--type-caption)", textTransform: "uppercase", letterSpacing: "0.08em",
      overflow: "hidden", ...style,
    }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

function TeamMemberPhoto({ member }) {
  const [error, setError] = useState(!member.photo);

  if (!error && member.photo) {
    return (
      <div style={{ overflow: "hidden", width: "160px", height: "160px", backgroundColor: "var(--color-canvas-alt)" }}>
        <motion.img
          src={resolveAsset(member.photo)}
          alt={member.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: member.objectPosition || "center center", display: "block", filter: "grayscale(100%)" }}
          whileHover={{ scale: 1.05, filter: "grayscale(0%)" }}
          transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
          onError={() => setError(true)}
        />
      </div>
    );
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.05, borderColor: "var(--color-volt)" }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      style={{
        width: "160px", height: "160px", backgroundColor: "var(--color-canvas-alt)",
        border: "2px dashed var(--color-ink-muted)", display: "flex",
        alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px",
      }}>
      <span style={{
        fontFamily: "var(--font-display)", fontSize: "var(--type-h2)",
        fontWeight: 700, color: "var(--color-ink-muted)", letterSpacing: "0.02em",
      }}>{member.initials}</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-muted)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    </motion.div>
  );
}

function MarqueeText() {
  return (
    <div style={{
      width: "100vw", marginLeft: "calc(-50vw + 50%)", overflow: "hidden", backgroundColor: "var(--color-volt)", color: "#111",
      padding: "var(--space-md) 0", borderTop: "2px solid var(--color-ink)", borderBottom: "2px solid var(--color-ink)",
      display: "flex", whiteSpace: "nowrap", alignItems: "center", marginBottom: "var(--space-4xl)"
    }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
        style={{ display: "flex", gap: "var(--space-2xl)", paddingRight: "var(--space-2xl)" }}
      >
        {Array(10).fill("STREETWEAR ECUATORIANO ✦ MINIMALISMO ABSOLUTO ✦ HERENCIA ANDINA ✦ ").map((text, i) => (
          <span key={i} style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{text}</span>
        ))}
      </motion.div>
    </div>
  );
}

function DonutChart({ data, size = 260 }) {
  const cx = size / 2, cy = size / 2, radius = size * 0.38, strokeWidth = size * 0.18;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {data.map((item, i) => {
        const dashLength = (item.pct / 100) * circumference;
        const prevSum = data.slice(0, i).reduce((sum, curr) => sum + curr.pct, 0);
        const dashOffset = -(prevSum / 100) * circumference;
        return (
          <motion.circle key={item.name} cx={cx} cy={cy} r={radius} fill="none"
            stroke={item.hex} strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={dashOffset}
            style={{ transformOrigin: "center", transform: "rotate(-90deg)",
              filter: item.hex === "#FFFFFF" ? "drop-shadow(0 0 1px rgba(0,0,0,0.15))" : "none" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.12, duration: 0.5, ease }} />
        );
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="var(--color-ink)" fontFamily="var(--font-display)" fontSize="26" fontWeight="700">100%</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--color-ink-soft)" fontFamily="var(--font-body)" fontSize="10" letterSpacing="0.08em">DISTRIBUCIÓN</text>
    </svg>
  );
}

/* ─── Timeline Component ─── */

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

function VerticalTimeline() {
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

/* ─── Main Page ─── */

export default function NosotrosPage() {
  const { team } = useSite();
  return (
    <>
      <AnimatedBackground />
      <main style={{ paddingTop: "var(--space-4xl)", paddingBottom: "var(--space-5xl)", position: "relative", zIndex: 1 }}>
      <div className="container">

        {/* ═══════════════════════════════════════════════
            SECTION 1 — HERO: GRUPO FRENM STUDIOS
        ═══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}>

          <SectionLabel>Quiénes Somos — El Equipo</SectionLabel>

          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "var(--type-hero)",
            lineHeight: "var(--lh-hero)", fontWeight: 700,
            letterSpacing: "var(--tracking-tight)", textTransform: "uppercase",
            color: "var(--color-ink)", marginBottom: "var(--space-md)",
          }}>
            GRUPO FRENM<br />
            <span style={{ color: "var(--color-volt)", WebkitTextStroke: "1px var(--color-ink)" }}>STUDIOS</span>
          </h1>

          <p style={{
            fontFamily: "var(--font-body)", fontSize: "var(--type-body-lg)",
            lineHeight: 1.7, color: "var(--color-ink-soft)", maxWidth: "680px",
            marginBottom: "var(--space-lg)",
          }}>
            Somos un colectivo creativo de la <strong style={{ color: "var(--color-ink)" }}>Universidad Estatal de Milagro (UNEMI)</strong>,
            carrera de <strong style={{ color: "var(--color-ink)" }}>Multimedia y Producción Audiovisual</strong>.
            Fusionamos diseño digital de vanguardia con la riqueza visual de nuestra herencia ecuatoriana 🇪🇨
          </p>

          <div style={{
            display: "flex", gap: "var(--space-xs)", alignItems: "center",
            marginBottom: "var(--space-3xl)",
          }}>
            <span style={{
              display: "inline-block", padding: "var(--space-2xs) var(--space-md)",
              backgroundColor: "var(--color-ink)", color: "var(--color-canvas)",
              fontFamily: "var(--font-body)", fontSize: "var(--type-micro)",
              textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600,
            }}>UNEMI</span>
            <span style={{
              display: "inline-block", padding: "var(--space-2xs) var(--space-md)",
              backgroundColor: "var(--color-volt)", color: "#111",
              fontFamily: "var(--font-body)", fontSize: "var(--type-micro)",
              textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600,
            }}>Multimedia &amp; Producción Audiovisual</span>
          </div>
        </motion.div>

        {/* Group Photo Placeholder */}
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "var(--space-4xl)" }}>
          <PhotoPlaceholder src={team.groupPhoto} width="100%" height="420px" label="Foto grupal — FRENM Studios"
            style={{ borderRadius: "0", objectPosition: team.groupPhotoPosition || "center 18%" }} />
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "var(--type-caption)",
            color: "var(--color-ink-soft)", marginTop: "var(--space-xs)",
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>↑ Espacio reservado para fotografía del equipo completo — 1200 × 420</p>
        </motion.div>

        <MarqueeText />

        {/* ═══════════════════════════════════════════════
            SECTION 2 — INTEGRANTES
        ═══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}>

          <SectionLabel>El Equipo Creativo ✦</SectionLabel>
          <SectionTitle>INTEGRANTES</SectionTitle>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "var(--space-lg)",
          }} className="team-grid">
            {team.members.map((member, i) => (
              <motion.div key={member.email}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: "var(--space-md)", textAlign: "center",
                }}>
                <TeamMemberPhoto member={member} />

                <div>
                  <p style={{
                    fontFamily: "var(--font-display)", fontSize: "var(--type-body-sm)",
                    fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em",
                    color: "var(--color-ink)", lineHeight: 1.3, marginBottom: "var(--space-2xs)",
                  }}>{member.name}</p>
                  <a href={`mailto:${member.email}`} style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--type-caption)",
                    color: "var(--color-ink-soft)", textDecoration: "none",
                    transition: "color var(--duration-micro) var(--ease-out)",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-volt)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-ink-soft)"}>
                    📧 {member.email}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <hr className="section-divider" style={{ margin: "var(--space-4xl) 0" }} />

        {/* ═══════════════════════════════════════════════
            SECTION 3 — SOBRE EL PROYECTO
        ═══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}
          style={{ marginBottom: "var(--space-4xl)" }}>

          <SectionLabel>Sobre el Proyecto 🎯 — El Manifiesto</SectionLabel>
          <SectionTitle>EL ALMA DEL BARRIO</SectionTitle>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3xl)",
            alignItems: "start",
          }} className="about-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
              <div className="glass" style={{
                padding: "var(--space-xl)", borderRadius: "var(--radius-md)",
                borderLeft: "4px solid var(--color-volt)", backgroundColor: "rgba(4, 49, 116, 0.05)"
              }}>
                <p style={{
                  fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                  lineHeight: 1.3, fontWeight: 700, color: "var(--color-ink)", textTransform: "uppercase",
                  marginBottom: "var(--space-md)"
                }}>
                  “EL VERDADERO GOL NO SE MARCÓ EN UN GRAN ESTADIO, SINO EN UNA CANCHA IMPROVISADA DE TIERRA, DONDE LAS MOCHILAS SERVÍAN DE ARCO Y NUESTRAS MAMÁS SE CONVERTÍAN EN LAS ÁRBITRAS; PITANDO UN FINAL INESPERADO, PERO NOSOTROS SIEMPRE LE DECÍAMOS: «¡UNA MÁS Y NOS VAMOS!».”
                </p>
                <span className="font-street" style={{ color: "var(--color-indoor-blue)", fontSize: "var(--type-h4)" }}>
                  — FÚTBOL AMIGOS BARRIO SUEÑOS
                </span>
              </div>

              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--type-body)",
                lineHeight: 1.8, color: "var(--color-ink-soft)",
              }}>
                <strong style={{ color: "var(--color-ink)" }}>Nike Legado</strong> nace como una respuesta universitaria a la estética del deporte rey en las calles ecuatorianas ⚽🇪🇨. No hablamos del fútbol de los estadios gigantes, sino de la pasión que se vive en la calle, en la cancha techada del barrio, donde se forja el carácter.
              </p>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "var(--type-body)",
                lineHeight: 1.8, color: "var(--color-ink-soft)",
              }}>
                Nuestra prenda estrella, la <strong style={{ color: "var(--color-indoor-blue)" }}>Camisa Nike Indoor Gen Z</strong>, captura esta energía con gráficos estilo graffiti, remates en Azul Indoor y destellos en Volt fosforescente que representan la electricidad de jugar entre amigos hasta que se esconde el sol.
              </p>
            </div>

            <div style={{
              display: "flex", flexDirection: "column", gap: "var(--space-md)",
            }}>
              {[
                { icon: "⚡", title: "ENERGÍA", text: "El ritmo incesante del partido callejero. La intensidad de no dar ningún balón por perdido en la cancha de cemento o tierra." },
                { icon: "☺", title: "CREATIVIDAD", text: "La gambeta, el túnel y la improvisación en espacios reducidos. El arte urbano aplicado a la indumentaria deportiva." },
                { icon: "👥", title: "AMISTAD", text: "El código no escrito de la calle. Los compañeros de equipo que se convierten en familia y los partidos que duran para siempre." },
                { icon: "👑", title: "ACTITUD", text: "Jugar con orgullo, llevar el nombre de nuestro barrio en el pecho y no achicarse ante ningún rival." },
              ].map((item, i) => (
                <motion.div key={item.title}
                  initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease }}
                  whileHover={{ scale: 1.02, x: 8 }}
                  style={{
                    padding: "var(--space-lg)", backgroundColor: "var(--color-canvas-alt)",
                    display: "flex", gap: "var(--space-md)", alignItems: "flex-start",
                    borderLeft: i === 0 ? "3px solid var(--color-volt)" : "3px solid var(--color-indoor-blue)",
                    borderRadius: "var(--radius-sm)"
                  }}>
                  <span style={{ fontSize: "28px", lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{
                      fontFamily: "var(--font-display)", fontSize: "var(--type-h4)",
                      fontWeight: 700, textTransform: "uppercase", color: "var(--color-ink)",
                      marginBottom: "var(--space-2xs)",
                    }}>{item.title}</p>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--type-body-sm)",
                      lineHeight: 1.5, color: "var(--color-ink-soft)",
                    }}>{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <hr className="section-divider" style={{ marginBottom: "var(--space-4xl)" }} />

        {/* ═══════════════════════════════════════════════
            SECTION 4 — SISTEMA DE DISEÑO (data-viz)
        ═══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}>

          <SectionLabel>Identidad Visual — Sistema de Diseño</SectionLabel>
          <SectionTitle>PROPORCIÓN CROMÁTICA</SectionTitle>

          <div style={{
            display: "grid", gridTemplateColumns: "auto 1fr", gap: "var(--space-3xl)",
            alignItems: "start",
          }} className="nosotros-chart-grid">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DonutChart data={colorData} size={260} />
            </motion.div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {colorData.map((item, i) => (
                <motion.div key={item.name} initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease }}
                  style={{
                    display: "grid", gridTemplateColumns: "32px 1fr auto",
                    gap: "var(--space-md)", alignItems: "center",
                    padding: "var(--space-md) 0", borderBottom: "1px solid var(--color-ink-muted)",
                  }}>
                  <div style={{
                    width: "32px", height: "32px", backgroundColor: item.hex,
                    border: item.hex === "#FFFFFF" ? "1px solid var(--color-ink-muted)" : "none",
                  }} />
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body-sm)", fontWeight: 500, color: "var(--color-ink)" }}>
                      {item.name}
                      <span style={{ marginLeft: "var(--space-xs)", fontFamily: "monospace", fontSize: "var(--type-caption)", color: "var(--color-ink-soft)" }}>{item.hex}</span>
                    </p>
                    <p style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", lineHeight: 1.4, marginTop: "var(--space-2xs)" }}>{item.desc}</p>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", fontWeight: 700, color: "var(--color-ink)", minWidth: "48px", textAlign: "right" }}>{item.pct}%</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <hr className="section-divider" style={{ margin: "var(--space-4xl) 0" }} />

        {/* ═══════════════════════════════════════════════
            SECTION 5 — PRINCIPIOS DE DISEÑO
        ═══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}>

          <SectionLabel>Principios Fundacionales ✦</SectionLabel>
          <SectionTitle>REGLAS INQUEBRANTABLES</SectionTitle>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-lg)",
          }}>
            {[
              { num: "01", title: "Photography-First", text: "Cero decoración. Cero sombras. El producto sobre fondo neutro es el único protagonista visual." },
              { num: "02", title: "Chrome Invisible", text: "La interfaz no debe notarse. Los controles se reducen a su expresión mínima." },
              { num: "03", title: "Motion Orgánico", text: "Toda animación usa curvas ease-out. Sin transiciones lineales. El movimiento imita la inercia real." },
              { num: "04", title: "Escala 8px", text: "Cada espacio, margen y dimensión es múltiplo de 8. Consistencia matemática absoluta." },
              { num: "05", title: "Volt Estratégico", text: "El color #CEFF00 es exclusivo para call-to-actions de máxima prioridad." },
              { num: "06", title: "Ancho × Alto", text: "Toda dimensión de contenedor se declara ancho primero, alto después. Sin excepciones." },
            ].map((p, i) => (
              <motion.div key={p.num} initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease }}
                style={{
                  padding: "var(--space-lg)", backgroundColor: "var(--color-canvas-alt)",
                  display: "flex", flexDirection: "column", gap: "var(--space-sm)",
                }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h1)", fontWeight: 700, color: "var(--color-ink-muted)", lineHeight: 1 }}>{p.num}</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, textTransform: "uppercase", color: "var(--color-ink)" }}>{p.title}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body-sm)", lineHeight: 1.6, color: "var(--color-ink-soft)" }}>{p.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <hr className="section-divider" style={{ margin: "var(--space-4xl) 0" }} />

        {/* ═══════════════════════════════════════════════
            SECTION 5.5 — VALORES NUCLEARES
        ═══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}>
          
          <SectionLabel>Nuestra Filosofía ⚡</SectionLabel>
          <SectionTitle>VALORES NUCLEARES</SectionTitle>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "var(--space-2xl)", marginBottom: "var(--space-4xl)"
          }}>
            {[
              { num: "I", title: "INNOVACIÓN SOSTENIBLE", text: "Desafiamos el status quo. Creamos soluciones digitales que no solo se ven bien, sino que rinden excepcionalmente, reduciendo el peso de la página y optimizando cada carga." },
              { num: "II", title: "IDENTIDAD CULTURAL", text: "Llevamos lo ecuatoriano en nuestro ADN. Desde la inspiración de nuestras paletas hasta las metáforas visuales. El diseño global debe tener raíces locales." },
              { num: "III", title: "EXCELENCIA TÉCNICA", text: "El código es arte. Escribimos interfaces escalables, componentes modulares y mantenemos una estructura impecable. Somos artesanos del front-end." }
            ].map((v) => (
              <motion.div key={v.num}
                whileHover={{ scale: 1.02, borderColor: "var(--color-volt)" }}
                transition={{ duration: 0.4, ease }}
                style={{
                  padding: "var(--space-2xl)", backgroundColor: "var(--color-canvas)",
                  border: "1px solid var(--color-ink-muted)",
                  borderTop: "4px solid var(--color-ink)",
                  display: "flex", flexDirection: "column", gap: "var(--space-md)",
                }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", fontWeight: 700, color: "var(--color-volt)", WebkitTextStroke: "1px var(--color-ink)" }}>{v.num}</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, color: "var(--color-ink)" }}>{v.title}</h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body)", lineHeight: 1.6, color: "var(--color-ink-soft)" }}>{v.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <hr className="section-divider" style={{ margin: "var(--space-4xl) 0" }} />

        {/* ═══════════════════════════════════════════════
            SECTION 5.6 — TIPOGRAFÍA Y ESCALAS
        ═══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}>
          
          <SectionLabel>Manual de Marca 📏</SectionLabel>
          <SectionTitle>TIPOGRAFÍA Y ESCALAS</SectionTitle>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3xl)", marginBottom: "var(--space-2xl)" }} className="about-grid">
            <div style={{ padding: "var(--space-xl)", backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-ink-muted)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "var(--space-md)" }}>Tipografía Primaria (Display)</p>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", lineHeight: 1.1, fontWeight: 700, color: "var(--color-ink)", marginBottom: "var(--space-sm)" }}>Bebas Neue / Archivo Black</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body-sm)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>Utilizada exclusivamente para titulares de gran impacto, manifiestos y números. Aporta brutalidad, peso e inspiración en el streetwear urbano.</p>
            </div>
            <div style={{ padding: "var(--space-xl)", backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-ink-muted)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "var(--space-md)" }}>Tipografía Secundaria (Body)</p>
              <h3 style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-h2)", lineHeight: 1.1, fontWeight: 400, color: "var(--color-ink)", marginBottom: "var(--space-sm)" }}>Inter / Helvetica Neue</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body-sm)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>Garantiza máxima legibilidad en descripciones de productos, metadata y UI. Neutra, grotesca y diseñada para interfaces modernas.</p>
            </div>
          </div>

          <div style={{ padding: "var(--space-xl)", backgroundColor: "var(--color-canvas-alt)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
             <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", textTransform: "uppercase", color: "var(--color-ink)" }}>La Escala de 8px</h4>
             <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body-sm)", color: "var(--color-ink-soft)" }}>El ritmo vertical y horizontal del proyecto está estrictamente atado a incrementos de 8px (8, 16, 24, 32, 48, 64, etc.). Esto crea una tensión matemática perfecta entre los bloques de contenido y el espacio vacío.</p>
             <div style={{ display: "flex", gap: "8px", marginTop: "var(--space-sm)", alignItems: "flex-end" }}>
               {[8, 16, 24, 32, 48].map(size => (
                 <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                   <div style={{ width: `${size}px`, height: `${size}px`, backgroundColor: "var(--color-volt)", border: "1px solid var(--color-ink)" }} />
                   <span style={{ fontSize: "10px", fontFamily: "var(--font-body)", color: "var(--color-ink-soft)" }}>{size}</span>
                 </div>
               ))}
             </div>
          </div>
        </motion.div>

        <hr className="section-divider" style={{ margin: "var(--space-4xl) 0" }} />

        {/* ═══════════════════════════════════════════════
            SECTION 5.7 — JUSTIFICACIÓN CROMÁTICA
        ═══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}>
          
          <SectionLabel>Manual de Marca 🎨</SectionLabel>
          <SectionTitle>¿POR QUÉ ESTOS COLORES?</SectionTitle>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-xl)" }}>
            <div style={{ borderLeft: "4px solid #FFFFFF", paddingLeft: "var(--space-md)" }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body-lg)", textTransform: "uppercase", fontWeight: 700, marginBottom: "var(--space-2xs)" }}>Espacio en Blanco (62%)</h4>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body-sm)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>El minimalismo no es ausencia de diseño, es diseño con propósito. El blanco masivo simula la pulcritud de una galería de arte, permitiendo que las prendas hablen por sí solas sin ruido visual.</p>
            </div>
            <div style={{ borderLeft: "4px solid #CEFF00", paddingLeft: "var(--space-md)" }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body-lg)", textTransform: "uppercase", fontWeight: 700, marginBottom: "var(--space-2xs)" }}>Volt / Energía (5%)</h4>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body-sm)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>Inspirado en el dinamismo del streetwear global y el deporte. Se usa con extremada restricción matemática para guiar el ojo del usuario únicamente hacia donde debe interactuar.</p>
            </div>
            <div style={{ borderLeft: "4px solid #FF6600", paddingLeft: "var(--space-md)" }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body-lg)", textTransform: "uppercase", fontWeight: 700, marginBottom: "var(--space-2xs)" }}>Orange Heritage (3%)</h4>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body-sm)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>Un tributo directo al volcán Cotopaxi, la calidez de la Costa y los atardeceres andinos. Aparece como un susurro en la interfaz para recordar el origen ecuatoriano del proyecto.</p>
            </div>
          </div>
        </motion.div>

        <hr className="section-divider" style={{ margin: "var(--space-4xl) 0" }} />

        {/* ═══════════════════════════════════════════════
            SECTION 5.8 — ESTILOS DE ANIMACIÓN
        ═══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}>
          
          <SectionLabel>Interacción y Motion 🎬</SectionLabel>
          <SectionTitle>CURVAS DE INERCIA Y FLUJO</SectionTitle>

          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body-lg)", color: "var(--color-ink-soft)", lineHeight: 1.7, maxWidth: "800px", marginBottom: "var(--space-2xl)" }}>
            El movimiento en <strong>Nike Legado</strong> no es decorativo; es comunicativo. Hemos descartado cualquier transición lineal por considerarla "robótica" y hemos adoptado un estilo de animación basado en físicas reales de tensión e inercia.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-lg)" }}>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ ease: [0, 0, 0.2, 1], duration: 0.4 }} style={{ padding: "var(--space-xl)", backgroundColor: "var(--color-canvas-alt)", display: "flex", flexDirection: "column", gap: "var(--space-sm)", border: "1px dashed var(--color-ink-muted)" }}>
              <span style={{ fontSize: "2rem" }}>🎢</span>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body-lg)", textTransform: "uppercase", fontWeight: 700 }}>Bézier [0, 0, 0.2, 1]</h4>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>Nuestra curva principal. Comienza con una aceleración casi instantánea y desacelera suavemente (Ease-Out), transmitiendo agilidad extrema sin marear al usuario.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -8 }} transition={{ ease: [0, 0, 0.2, 1], duration: 0.4 }} style={{ padding: "var(--space-xl)", backgroundColor: "var(--color-canvas-alt)", display: "flex", flexDirection: "column", gap: "var(--space-sm)", border: "1px dashed var(--color-ink-muted)" }}>
              <span style={{ fontSize: "2rem" }}>🕴️</span>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body-lg)", textTransform: "uppercase", fontWeight: 700 }}>Levitación (Hover)</h4>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>Los productos no cambian de color bruscamente, se elevan en el eje Y. Esto dota a las tarjetas de una cualidad táctil, invitando a la interacción física.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} style={{ padding: "var(--space-xl)", backgroundColor: "var(--color-canvas-alt)", display: "flex", flexDirection: "column", gap: "var(--space-sm)", border: "1px dashed var(--color-ink-muted)" }}>
              <span style={{ fontSize: "2rem" }}>🪄</span>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body-lg)", textTransform: "uppercase", fontWeight: 700 }}>Staggering (Cascada)</h4>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>Los elementos de galerías no aparecen al unísono. Entran en escena con un ligero retraso de 0.05s entre sí, guiando la mirada verticalmente.</p>
            </motion.div>
          </div>
        </motion.div>

        <hr className="section-divider" style={{ margin: "var(--space-4xl) 0" }} />

        {/* ═══════════════════════════════════════════════
            SECTION 5.9 — TECNOLOGÍAS
        ═══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}>
          
          <SectionLabel>Desarrollo y Stack 💻</SectionLabel>
          <SectionTitle>TECNOLOGÍAS USADAS</SectionTitle>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-md)", marginBottom: "var(--space-2xl)" }}>
            {[
              { tech: "React 18", desc: "Motor central de la arquitectura basada en componentes web." },
              { tech: "Vite", desc: "Build tool ultrarrápido para HMR instantáneo y empaquetado optimizado." },
              { tech: "Framer Motion", desc: "Librería declarativa para coreografías y físicas de animación complejas." },
              { tech: "Vanilla CSS", desc: "Estilos crudos y directos. Cero frameworks CSS pesados para mantener control total de variables." },
              { tech: "React Router", desc: "Enrutamiento SPA para transiciones de página sin fricción." }
            ].map((t, i) => (
              <motion.div key={t.tech} 
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4, ease }}
                style={{ flex: "1 1 200px", padding: "var(--space-lg)", backgroundColor: "var(--color-ink)", color: "var(--color-canvas)" }}>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body-lg)", textTransform: "uppercase", color: "var(--color-volt)", marginBottom: "var(--space-xs)" }}>{t.tech}</h4>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-caption)", color: "#A0A0A0", lineHeight: 1.5 }}>{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <hr className="section-divider" style={{ margin: "var(--space-4xl) 0" }} />

        {/* ═══════════════════════════════════════════════
            SECTION 5.95 — TIMELINE DEL PROYECTO
        ═══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}>
          
          <SectionLabel>Roadmap 🗺️</SectionLabel>
          <SectionTitle>FASES DEL PROYECTO</SectionTitle>

          <VerticalTimeline />
        </motion.div>

        <hr className="section-divider" style={{ margin: "var(--space-4xl) 0" }} />

        {/* ═══════════════════════════════════════════════
            SECTION 6 — CONTEXTO ACADÉMICO
        ═══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}
          style={{ maxWidth: "720px" }}>

          <SectionLabel>Contexto Académico 🎓</SectionLabel>
          <SectionTitle style={{ marginBottom: "var(--space-lg)" }}>UNIVERSIDAD ESTATAL DE MILAGRO</SectionTitle>

          <p style={{
            fontFamily: "var(--font-body)", fontSize: "var(--type-body)",
            lineHeight: 1.8, color: "var(--color-ink-soft)", marginBottom: "var(--space-lg)",
          }}>
            Este proyecto fue desarrollado como parte del programa académico de la
            carrera de <strong style={{ color: "var(--color-ink)" }}>Multimedia y Producción Audiovisual</strong> de
            la <strong style={{ color: "var(--color-ink)" }}>UNEMI</strong>. Representa la convergencia entre
            desarrollo web moderno, diseño de identidad visual y narrativa cultural ecuatoriana.
          </p>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)",
          }}>
            {[
              { label: "Universidad", value: "UNEMI" },
              { label: "Carrera", value: "Multimedia & Producción Audiovisual" },
              { label: "Equipo", value: "Grupo FRENM Studios" },
              { label: "Proyecto", value: "Nike Legado — Streetwear EC" },
            ].map((item) => (
              <div key={item.label} style={{
                padding: "var(--space-md)", backgroundColor: "var(--color-canvas-alt)",
              }}>
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: "var(--type-micro)",
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  color: "var(--color-ink-soft)", marginBottom: "var(--space-2xs)",
                }}>{item.label}</p>
                <p style={{
                  fontFamily: "var(--font-display)", fontSize: "var(--type-body-sm)",
                  fontWeight: 600, textTransform: "uppercase", color: "var(--color-ink)",
                }}>{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 767px) {
          .nosotros-chart-grid { grid-template-columns: 1fr !important; gap: var(--space-xl) !important; }
          .nosotros-chart-grid > div:first-child { justify-self: center; }
          .about-grid { grid-template-columns: 1fr !important; }
          .team-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .team-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
    </>
  );
}
