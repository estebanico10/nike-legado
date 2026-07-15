import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useProducts } from "../context/ProductContext";
import { useSite } from "../context/SiteContext";
import { resolveAsset } from "../utils/resolveAsset";
import { useUIStore } from "../store/useStore";
import SEO from "../components/SEO";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import ProductQuickView from "../components/ProductQuickView";
import NewsTicker from "../components/NewsTicker";
import StatsCounter from "../components/StatsCounter";
import TestimonialsSection from "../components/TestimonialsSection";
import ShopTheLook from "../components/ShopTheLook";
import MagneticButton from "../components/MagneticButton";
import CTASection from "../components/CTASection";
import InstagramFeed from "../components/InstagramFeed";
import DropsCalendar from "../components/DropsCalendar";
import BentoGridCategories from "../components/BentoGridCategories";

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
      <section ref={containerRef} key={section.id} className="py-32 bg-white overflow-hidden">
        <div className="max-w-global mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
            className="mb-24 text-center"
          >
            <h2 className="font-sans text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase text-gray-900 leading-none">
              {section.title}
            </h2>
            <p className="font-sans text-lg md:text-2xl text-gray-500 mt-6 max-w-3xl mx-auto">
              {section.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
            {section.images?.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover="hover"
                className={`relative overflow-hidden bg-gray-100 cursor-pointer group ${i % 2 === 0 ? "aspect-[3/4]" : "aspect-[4/5]"}`}
                style={{ y: transforms[i % transforms.length] }}
              >
                <motion.img
                  src={resolveAsset(img.src)}
                  alt={img.title}
                  className="w-full h-full object-cover block transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
                <motion.div
                  variants={{ hover: { opacity: 1, y: 0 } }}
                  initial={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white"
                >
                  <div className="flex gap-4 flex-wrap justify-center mb-6">
                    <Link to="/tienda" className="bg-[#ceff00] text-black font-extrabold uppercase tracking-widest py-4 px-8 rounded-full hover:bg-white transition-colors duration-300">
                      Comprar Ahora
                    </Link>
                    <MagneticButton>
                      <button onClick={openLuckyWheel} className="bg-white text-black font-extrabold uppercase tracking-widest py-4 px-8 rounded-full flex items-center gap-2 hover:bg-gray-200 transition-colors duration-300">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 22h20L12 2z"/></svg>
                        Jugar y Ganar
                      </button>
                    </MagneticButton>
                  </div>
                  <p className="font-sans text-sm uppercase tracking-widest mb-2 text-[#ceff00]">{img.subtitle}</p>
                  <h3 className="font-sans text-4xl font-bold tracking-tight">{img.title}</h3>
                  
                  <motion.div
                    variants={{ hover: { opacity: 1, scale: 1 } }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    className="mt-6 inline-flex items-center gap-2 py-3 px-6 border border-white/30 rounded-full backdrop-blur-md self-start"
                  >
                    <span className="text-xs uppercase tracking-widest font-bold">Explorar Colección</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderDestacados = (section) => (
    <section key={section.id} id="coleccion" className="py-32 bg-white">
      <div className="max-w-global mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          className="flex items-baseline justify-between mb-16 flex-wrap gap-4"
        >
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: {}
            }}
            className="font-sans text-6xl md:text-8xl font-black tracking-tighter uppercase text-gray-900 flex overflow-hidden leading-none"
          >
            {Array.from(section.title.toUpperCase()).map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { y: "100%", opacity: 0 },
                  visible: { y: "0%", opacity: 1, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } }
                }}
                whileHover={{ color: "#ceff00", y: -5 }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h2>
          <p className="font-sans text-lg text-gray-500 font-medium">
            {featured.length} productos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                <LookbookSection section={section} resolveAsset={resolveAsset} />
                <BentoGridCategories />
                <TestimonialsSection />
              </>
            )}
            {section.type === "destacados" && renderDestacados(section)}
          </div>
        );
      })}

      <DropsCalendar />
      <InstagramFeed />
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
