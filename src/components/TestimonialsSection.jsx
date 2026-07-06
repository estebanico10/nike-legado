import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Carlos A.",
    handle: "@carlos.ec",
    text: "La calidad del hoodie Arcade es increíble. Se nota el grosor del algodón y el bordado está perfecto. El envío llegó al día siguiente a Guayaquil.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Carlos&backgroundColor=e5e5e5"
  },
  {
    id: 2,
    name: "Andrea V.",
    handle: "@andrea_v",
    text: "Por fin una marca ecuatoriana con streetwear de verdad. El fit oversize de la camiseta Cartografía es exactamente lo que buscaba.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Andrea&backgroundColor=e5e5e5"
  },
  {
    id: 3,
    name: "Mateo R.",
    handle: "@mateo.r",
    text: "El diseño de la gorra Heritage está brutal. Ya quiero que saquen la nueva colección. Excelente servicio al cliente.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mateo&backgroundColor=e5e5e5"
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section style={{
      padding: "var(--space-5xl) 0",
      backgroundColor: "var(--color-canvas-alt)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative Blobs */}
      <div style={{
        position: "absolute",
        top: "-10%",
        left: "-5%",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(206, 255, 0, 0.15) 0%, rgba(255,255,255,0) 70%)",
        filter: "blur(40px)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        bottom: "-10%",
        right: "-5%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(4, 49, 116, 0.1) 0%, rgba(255,255,255,0) 70%)",
        filter: "blur(40px)",
        pointerEvents: "none"
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "var(--space-3xl)" }}
        >
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--type-h2)",
            fontWeight: 700,
            color: "var(--color-ink)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-tight)"
          }}>
            Lo Que Dice El Barrio
          </h2>
        </motion.div>

        <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="glass-card"
              style={{
                padding: "var(--space-3xl)",
                borderRadius: "var(--radius-md)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-lg)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ display: "flex", gap: "4px", color: "#FFD700" }}>
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--type-h3)",
                lineHeight: 1.4,
                color: "var(--color-ink)",
                fontStyle: "italic"
              }}>
                "{testimonials[currentIndex].text}"
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginTop: "var(--space-sm)" }}>
                <img 
                  src={testimonials[currentIndex].avatar} 
                  alt={testimonials[currentIndex].name}
                  style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#fff" }}
                />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 600, color: "var(--color-ink)" }}>{testimonials[currentIndex].name}</div>
                  <div style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)" }}>{testimonials[currentIndex].handle}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-md)", marginTop: "var(--space-xl)" }}>
            <button onClick={prevTestimonial} className="btn btn--secondary" style={{ width: "40px", height: "40px", padding: 0, borderRadius: "50%" }}>
              ←
            </button>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {testimonials.map((_, idx) => (
                <div key={idx} style={{
                  width: idx === currentIndex ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: idx === currentIndex ? "var(--color-ink)" : "var(--color-ink-muted)",
                  transition: "all 0.3s ease"
                }} />
              ))}
            </div>
            <button onClick={nextTestimonial} className="btn btn--secondary" style={{ width: "40px", height: "40px", padding: 0, borderRadius: "50%" }}>
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
