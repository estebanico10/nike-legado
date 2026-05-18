import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../context/ProductContext";
import { useSite } from "../context/SiteContext";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import ProductQuickView from "../components/ProductQuickView";
import NewsTicker from "../components/NewsTicker";

export default function HomePage() {
  const { productos } = useProducts();
  const { homeSections } = useSite();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  /* Show only products that are offers or new, up to 6 */
  const featured = productos.filter(p => p.enOferta || p.esNuevo).slice(0, 6);

  // Helper to render Lookbook
  const renderLookbook = (section) => (
    <section key={section.id} style={{ padding: "var(--space-4xl) 0", backgroundColor: "var(--color-canvas)" }}>
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
        }}>
          {section.images?.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0, 0, 0.2, 1] }}
              whileHover="hover"
              style={{
                position: "relative",
                aspectRatio: "3/4",
                overflow: "hidden",
                backgroundColor: "var(--color-canvas-alt)",
                cursor: "pointer"
              }}
            >
              <motion.img
                src={img.src}
                alt={img.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                variants={{
                  hover: { scale: 1.05, filter: "brightness(0.7)" }
                }}
                transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
              />
              <motion.div
                variants={{
                  hover: { opacity: 1, y: 0 }
                }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
                style={{
                  position: "absolute", bottom: 0, left: 0, width: "100%",
                  padding: "var(--space-xl)",
                  background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  color: "white"
                }}
              >
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-caption)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "var(--space-2xs)", color: "var(--color-volt)" }}>{img.subtitle}</p>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", fontWeight: 700, letterSpacing: "0.02em" }}>{img.title}</h3>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

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
      {[...homeSections].sort((a, b) => a.order - b.order).map((section, index) => {
        if (!section.visible) return null;

        const needsDivider = index > 0 && homeSections[index-1].visible;

        return (
        <div key={section.id}>
            {/* Ticker between Hero → Destacados */}
            {section.type === "destacados" && section.visible && <NewsTicker variant="dark" />}
            {/* Volt ticker before Lookbook */}
            {section.type === "lookbook" && section.visible && <NewsTicker variant="volt" />}

            {section.type === "hero" && <HeroSection key={`hero-${section.id}`} />}
            {section.type === "lookbook" && renderLookbook(section)}
            {section.type === "destacados" && renderDestacados(section)}
          </div>
        );
      })}

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
