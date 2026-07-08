import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

export default function PresentationPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3001/presentationSections")
      .then(res => res.json())
      .then(data => {
        // Sort by order and filter visible only
        const sorted = data
          .filter(s => s.visible !== false)
          .sort((a, b) => a.order - b.order);
        setSections(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading presentation:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const currentIndex = Math.round(scrollY / vh);
      setActiveSection(currentIndex);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ backgroundColor: "var(--color-canvas)", color: "var(--color-ink)", scrollSnapType: "y mandatory", height: "100vh", overflowY: "scroll", scrollBehavior: "smooth" }}>
      
      {/* Presentation Header / Navigation */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", padding: "var(--space-md)", display: "flex", justifyContent: "space-between", zIndex: 50, pointerEvents: "none" }}>
        <Link to="/" style={{ pointerEvents: "auto", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--type-h4)", textTransform: "uppercase" }}>
          NIKE <span style={{ color: "var(--color-volt)" }}>LEGADO</span>
        </Link>
        <div style={{ display: "flex", gap: "8px", pointerEvents: "auto" }}>
          {sections.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const section = document.getElementById(`section-${i}`);
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                width: "12px", height: "12px", borderRadius: "50%",
                backgroundColor: i === activeSection ? "var(--color-volt)" : "var(--color-ink-muted)",
                transition: "background-color 0.3s ease",
                border: "none", cursor: "pointer"
              }}
              aria-label={`Ir a la sección ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={`section-${index}`}
            style={{
              scrollSnapAlign: "start",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "var(--space-4xl)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Background elements based on order */}
            {index === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 0.05, scale: 1 }}
                transition={{ duration: 1 }}
                style={{ position: "absolute", zIndex: 0, fontSize: "40vw", fontFamily: "var(--font-display)", fontWeight: 900, whiteSpace: "nowrap", color: "var(--color-ink)" }}
              >
                LEGADO
              </motion.div>
            )}

            <div style={{ position: "relative", zIndex: 10, maxWidth: "800px", textAlign: "center", width: "100%" }}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Title */}
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: index === 0 ? "clamp(3rem, 8vw, 6rem)" : "clamp(2rem, 5vw, 4rem)",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  marginBottom: "var(--space-lg)",
                  lineHeight: 1,
                  color: "var(--color-ink)"
                }}>
                  {section.title}
                </h2>

                {/* Content */}
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1rem, 2vw, 1.25rem)",
                  color: "var(--color-ink-soft)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                  textAlign: index === 1 ? "left" : "center" // Specific style for lists
                }}>
                  {section.content}
                </div>
              </motion.div>

              {/* Optional Images */}
              {section.images && section.images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ display: "flex", gap: "var(--space-md)", justifyContent: "center", marginTop: "var(--space-2xl)", flexWrap: "wrap" }}
                >
                  {section.images.map((img, i) => (
                    <img key={i} src={img} alt={`Imagen ${i} de ${section.title}`} style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "var(--radius-md)" }} />
                  ))}
                </motion.div>
              )}
            </div>
            
            {/* Next section indicator */}
            {index < sections.length - 1 && (
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ position: "absolute", bottom: "var(--space-xl)", zIndex: 10 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="var(--color-ink-soft)"><path d="M6 9l6 6 6-6"/></svg>
              </motion.div>
            )}
          </section>
        ))}
      </AnimatePresence>
    </div>
  );
}
