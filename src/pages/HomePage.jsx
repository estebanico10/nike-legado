import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useProducts } from "../context/ProductContext";
import { useSite } from "../context/SiteContext";
import { resolveAsset } from "../utils/resolveAsset";
import { useUIStore } from "../store/useStore";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import ProductQuickView from "../components/ProductQuickView";
import NewsTicker from "../components/NewsTicker";
import StatsCounter from "../components/StatsCounter";
import TestimonialsSection from "../components/TestimonialsSection";
import ShopTheLook from "../components/ShopTheLook";
import MagneticButton from "../components/MagneticButton";
import CTASection from "../components/CTASection";

export default function HomePage() {
  const { openLuckyWheel } = useUIStore();
  const { productos } = useProducts();
  const { homeSections } = useSite();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  /* Show only products that are offers or new, up to 6 */
  const featured = productos.filter(p => p.enOferta || p.esNuevo).slice(0, 6);

const LookbookSection = ({ section, resolveAsset }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  const transforms = [y1, y2, y3];

  return (
    <section ref={containerRef} key={section.id} style={{ padding: "var(--space-4xl) 0", backgroundColor: "var(--color-canvas)", overflow: "hidden" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          style={{ marginBottom: "var(--space-3xl)" }}
        >
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", lineHeight: "var(--lh-h2)",
            fontWeight: 700, letterSpacing: "var(--tracking-tight)", textTransform: "uppercase",
            color: "var(--color-ink)"
          }}>{section.title}</h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "var(--type-body-lg)", color: "var(--color-ink-soft)",
            marginTop: "var(--space-xs)", maxWidth: "600px"
          }}>{section.description}</p>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "var(--space-md)",
          alignItems: "center"
        }}>
          {section.images?.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover="hover"
              style={{
                position: "relative",
                aspectRatio: i % 2 === 0 ? "3/4" : "4/5",
                overflow: "hidden",
                backgroundColor: "var(--color-canvas-alt)",
                cursor: "pointer",
                y: transforms[i % transforms.length]
              }}
            >
              <motion.img
                src={resolveAsset(img.src)}
                alt={img.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                variants={{
                  hover: { scale: 1.08, filter: "brightness(0.6) blur(2px)" }
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.div
                variants={{
                  hover: { opacity: 1, y: 0 }
                }}
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column", justifyContent: "flex-end",
                  padding: "var(--space-2xl)",
                  background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                  color: "white"
                }}
              >
                {/* CTA Buttons */}
                <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", justifyContent: "center" }}>
                  <Link to="/tienda" className="btn btn--volt">
                    Comprar Ahora
                  </Link>
                  <MagneticButton>
                    <button onClick={openLuckyWheel} className="btn btn--secondary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 22h20L12 2z"/></svg>
                      Jugar Ruleta y Ganar
                    </button>
                  </MagneticButton>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-caption)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "var(--space-xs)", color: "var(--color-volt)" }}>{img.subtitle}</p>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", fontWeight: 700, letterSpacing: "0.02em" }}>{img.title}</h3>
                
                <motion.div
                  variants={{
                    hover: { opacity: 1, scale: 1 }
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  style={{
                    marginTop: "var(--space-md)", display: "inline-flex", alignItems: "center", gap: "var(--space-xs)",
                    padding: "var(--space-sm) var(--space-md)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px",
                    backdropFilter: "blur(4px)", alignSelf: "flex-start"
                  }}
                >
                  <span style={{ fontSize: "var(--type-micro)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Explorar Colección</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

  // Helper to render Destacados
  const renderDestacados = (section) => (
    <section key={section.id} id="coleccion" style={{ padding: "var(--space-4xl) 0" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "var(--space-2xl)",
            flexWrap: "wrap",
            gap: "var(--space-md)",
          }}
        >
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: {}
            }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--type-h2)",
              lineHeight: "var(--lh-h2)",
              fontWeight: 700,
              letterSpacing: "var(--tracking-tight)",
              textTransform: "uppercase",
              color: "var(--color-ink)",
              display: "flex",
              overflow: "hidden"
            }}
          >
            {Array.from(section.title.toUpperCase()).map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { y: "100%", opacity: 0 },
                  visible: { y: "0%", opacity: 1, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } }
                }}
                whileHover={{ color: "var(--color-volt)", y: -5 }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--type-body-sm)",
              color: "var(--color-ink-soft)",
            }}
          >
            {featured.length} productos
          </p>
        </motion.div>

        <div className="product-grid">
          {featured.map((producto, i) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              index={i}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <>
      {[...homeSections].sort((a, b) => a.order - b.order).map((section) => {
        if (!section.visible) return null;

        return (
        <div key={section.id}>
            {/* Ticker between Hero → Destacados */}
            {section.type === "destacados" && section.visible && (
              <>
                <NewsTicker variant="dark" />
                <StatsCounter />
              </>
            )}
            {/* Volt ticker before Lookbook */}
            {section.type === "lookbook" && section.visible && <NewsTicker variant="volt" />}

            {section.type === "hero" && <HeroSection key={`hero-${section.id}`} />}
            {section.type === "lookbook" && (
              <>
                <LookbookSection key={section.id} section={section} resolveAsset={resolveAsset} />
                <TestimonialsSection />
              </>
            )}
            {section.type === "destacados" && renderDestacados(section)}
          </div>
        );
      })}

      <ShopTheLook />
      <CTASection />

      {/* QuickView Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <ProductQuickView
            producto={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
