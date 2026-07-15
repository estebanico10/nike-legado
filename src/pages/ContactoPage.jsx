import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { useToast } from "../context/ToastContext";
import SEO from "../components/SEO";

const faqs = [
  { q: "¿Hacen envíos a todo el Ecuador?", a: "Sí, realizamos envíos a todas las provincias mediante Servientrega. El tiempo estimado de entrega es de 24-48 horas laborables." },
  { q: "¿Tienen tienda física?", a: "Por el momento operamos de forma 100% digital para llegar a todo el país, pero realizamos pop-ups estacionales. Suscríbete para novedades." },
  { q: "¿Cómo funcionan los cambios o devoluciones?", a: "Tienes 15 días desde la recepción de tu orden para solicitar un cambio. Las prendas deben estar sin uso y con sus etiquetas originales intactas." }
];

function FAQAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ marginTop: "var(--space-4xl)" }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", fontWeight: 700, textTransform: "uppercase", color: "var(--color-ink)", marginBottom: "var(--space-xl)" }}>
        PREGUNTAS FRECUENTES
      </p>
      <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--color-ink-muted)" }}>
        {faqs.map((faq, index) => (
          <div key={index} style={{ borderBottom: "1px solid var(--color-ink-muted)" }}>
            <button
              onClick={() => setOpen(open === index ? null : index)}
              style={{ width: "100%", textAlign: "left", padding: "var(--space-lg) 0", backgroundColor: "transparent", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", outline: "none" }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body-sm)", fontWeight: 600, color: "var(--color-ink)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {faq.q}
              </span>
              <motion.span animate={{ rotate: open === index ? 45 : 0 }} style={{ fontSize: "1.4rem", color: "var(--color-ink)", lineHeight: 1 }}>+</motion.span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: open === index ? "auto" : 0, opacity: open === index ? 1 : 0 }}
              style={{ overflow: "hidden" }}
              transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
            >
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-body)", color: "var(--color-ink-soft)", paddingBottom: "var(--space-lg)", lineHeight: 1.6, maxWidth: "600px" }}>
                {faq.a}
              </p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarqueeText() {
  return (
    <div style={{
      width: "100vw", marginLeft: "calc(-50vw + 50%)", overflow: "hidden", backgroundColor: "transparent",
      padding: "var(--space-lg) 0", borderTop: "1px solid var(--color-ink-muted)", borderBottom: "1px solid var(--color-ink-muted)",
      display: "flex", whiteSpace: "nowrap", alignItems: "center", marginBottom: "var(--space-5xl)"
    }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        style={{ display: "flex", gap: "var(--space-2xl)", paddingRight: "var(--space-2xl)" }}
      >
        {Array(8).fill("SOPORTE 24/7 ✦ WHOLESALE ✦ PRENSA ✦ COLABORACIONES ✦ ENVÍOS NACIONALES ✦ ").map((text, i) => (
          <span key={i} style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", color: "transparent", WebkitTextStroke: "1px var(--color-ink)" }}>{text}</span>
        ))}
      </motion.div>
    </div>
  );
}

export default function ContactoPage() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState({ name: false, email: false, message: false });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setIsSent(false), 3000);
    }, 1500);
  };

  const InputField = ({ name, label, type = "text", isTextArea = false }) => {
    const isFocused = focused[name];
    const hasValue = formState[name].length > 0;
    const isFloating = isFocused || hasValue;

    return (
      <div style={{ position: "relative", paddingTop: "var(--space-md)" }}>
        <label
          htmlFor={name}
          style={{
            position: "absolute",
            left: 0,
            top: isFloating ? 0 : "var(--space-md)",
            fontSize: isFloating ? "var(--type-micro)" : "var(--type-body)",
            fontWeight: isFloating ? 600 : 400,
            textTransform: isFloating ? "uppercase" : "none",
            letterSpacing: isFloating ? "0.06em" : "normal",
            color: isFocused ? "var(--color-volt)" : "var(--color-ink-soft)",
            transition: "all 0.2s ease-out",
            pointerEvents: "none",
          }}
        >
          {label}
        </label>
        {isTextArea ? (
          <textarea
            id={name}
            value={formState[name]}
            onChange={(e) => setFormState({ ...formState, [name]: e.target.value })}
            onFocus={() => setFocused({ ...focused, [name]: true })}
            onBlur={() => setFocused({ ...focused, [name]: false })}
            rows={4}
            style={{
              width: "100%",
              padding: "var(--space-sm) 0",
              border: "none",
              borderBottom: `1px solid ${isFocused ? "var(--color-volt)" : "var(--color-ink-muted)"}`,
              fontSize: "var(--type-body)",
              color: "var(--color-ink)",
              backgroundColor: "transparent",
              resize: "vertical",
              transition: "border-color var(--duration-micro) var(--ease-out)",
              outline: "none",
            }}
          />
        ) : (
          <input
            id={name}
            type={type}
            value={formState[name]}
            onChange={(e) => setFormState({ ...formState, [name]: e.target.value })}
            onFocus={() => setFocused({ ...focused, [name]: true })}
            onBlur={() => setFocused({ ...focused, [name]: false })}
            style={{
              width: "100%",
              padding: "var(--space-sm) 0",
              border: "none",
              borderBottom: `1px solid ${isFocused ? "var(--color-volt)" : "var(--color-ink-muted)"}`,
              fontSize: "var(--type-body)",
              color: "var(--color-ink)",
              backgroundColor: "transparent",
              transition: "border-color var(--duration-micro) var(--ease-out)",
              outline: "none",
            }}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <SEO title="Contacto" description="Contáctanos para dudas, sugerencias o colaboraciones." />
      <AnimatedBackground />
      <main style={{ paddingTop: "var(--space-4xl)", paddingBottom: "var(--space-5xl)", position: "relative", zIndex: 1 }}>
      <div className="container" style={{ maxWidth: "var(--container-md)" }}>
        
        <MarqueeText />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1], delay: 0.1 }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--type-caption)",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--color-ink-soft)",
              marginBottom: "var(--space-md)",
            }}
          >
            Contacto
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--type-hero)",
              lineHeight: "var(--lh-hero)",
              fontWeight: 700,
              letterSpacing: "var(--tracking-tight)",
              textTransform: "uppercase",
              color: "var(--color-ink)",
              marginBottom: "var(--space-3xl)",
            }}
          >
            HABLEMOS
          </h1>

          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4xl)", alignItems: "start" }}>
            
            {/* Form & Info Section */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--type-body-lg)",
                  lineHeight: 1.6,
                  color: "var(--color-ink-soft)",
                  marginBottom: "var(--space-2xl)",
                }}
              >
                Para colaboraciones, wholesale, prensa o consultas generales, 
                envíanos un mensaje y te responderemos dentro de 48 horas.
              </p>

              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)", marginBottom: "var(--space-3xl)" }}
              >
                {InputField({ name: "name", label: "Nombre Completo" })}
                {InputField({ name: "email", label: "Correo Electrónico", type: "email" })}
                {InputField({ name: "message", label: "Mensaje", isTextArea: true })}

                <motion.button 
                  className="btn btn--primary" 
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    alignSelf: "flex-start", 
                    marginTop: "var(--space-md)",
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: isSent ? "var(--color-success)" : (isSending ? "var(--color-ink-muted)" : undefined),
                    borderColor: isSent ? "var(--color-success)" : (isSending ? "var(--color-ink-muted)" : undefined),
                    color: (isSent || isSending) ? "var(--color-canvas)" : undefined,
                    pointerEvents: (isSending || isSent) ? "none" : "auto",
                    width: "200px"
                  }}
                >
                  <motion.span
                    initial={false}
                    animate={{ y: (isSending || isSent) ? -40 : 0, opacity: (isSending || isSent) ? 0 : 1 }}
                    style={{ display: "block" }}
                  >
                    Enviar Mensaje
                  </motion.span>
                  <motion.span
                    initial={false}
                    animate={{ y: isSending ? 0 : 40, opacity: isSending ? 1 : 0 }}
                    style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    Enviando...
                  </motion.span>
                  <motion.span
                    initial={false}
                    animate={{ y: isSent ? 0 : 40, opacity: isSent ? 1 : 0 }}
                    style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    ✓ Enviado
                  </motion.span>
                </motion.button>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", borderTop: "1px solid var(--color-ink-muted)", paddingTop: "var(--space-2xl)" }}>
                 <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, textTransform: "uppercase", color: "var(--color-ink)" }}>
                    Información Directa
                 </p>
                 <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", color: "var(--color-ink-soft)", fontFamily: "var(--font-body)", fontSize: "var(--type-body-sm)" }}>
                    <p><strong>Email:</strong> enicolam@unemi.edu.ec</p>
                    <p><strong>Teléfono:</strong> +593 99 999 9999</p>
                    <p><strong>Ubicación:</strong> Universidad Estatal de Milagro (UNEMI)<br/>Km. 1.5 vía km. 26, Milagro, Ecuador</p>
                 </div>
              </div>
            </div>

            {/* Map Section */}
            <div style={{ width: "100%", height: "100%", minHeight: "600px", position: "relative", backgroundColor: "var(--color-canvas-alt)", border: "1px solid var(--color-ink-muted)", overflow: "hidden" }}>
               <div style={{ position: "absolute", top: "var(--space-md)", left: "var(--space-md)", zIndex: 10, backgroundColor: "var(--color-ink)", color: "var(--color-canvas)", padding: "var(--space-xs) var(--space-sm)", fontFamily: "var(--font-display)", fontSize: "var(--type-caption)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                 HQ UNEMI
               </div>
               <iframe 
                  src="https://maps.google.com/maps?q=Universidad%20Estatal%20de%20Milagro%20UNEMI&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: "grayscale(1) contrast(1.2) opacity(0.8)", position: "absolute", top: 0, left: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa UNEMI"
               ></iframe>
            </div>
          </div>
          
          {/* Social Links Section */}
          <div style={{ marginTop: "var(--space-4xl)", borderTop: "1px solid var(--color-ink-muted)", paddingTop: "var(--space-3xl)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", fontWeight: 700, textTransform: "uppercase", color: "var(--color-ink)", marginBottom: "var(--space-xl)" }}>
              NUESTRAS REDES
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-md)" }}>
              {[
                { name: "INSTAGRAM", handle: "@nikelegado" },
                { name: "TIKTOK", handle: "@nikelegado.ec" },
                { name: "YOUTUBE", handle: "Nike Legado EC" },
                { name: "LINKEDIN", handle: "Grupo FRENM Studios" }
              ].map((social) => (
                <motion.a 
                  key={social.name}
                  href="#"
                  whileHover={{ y: -4, backgroundColor: "var(--color-ink)", color: "var(--color-canvas)" }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: "flex", flexDirection: "column", padding: "var(--space-xl)",
                    backgroundColor: "var(--color-canvas-alt)", border: "1px solid var(--color-ink-muted)",
                    textDecoration: "none", color: "var(--color-ink)", cursor: "pointer"
                  }}
                >
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, letterSpacing: "0.05em" }}>{social.name}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-caption)", color: "inherit", opacity: 0.7, marginTop: "var(--space-xs)" }}>{social.handle}</span>
                </motion.a>
              ))}
            </div>
          </div>
          
          <FAQAccordion />

        </motion.div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-grid > div:last-child {
            min-height: 400px !important;
          }
        }
      `}</style>
    </main>
    </>
  );
}
