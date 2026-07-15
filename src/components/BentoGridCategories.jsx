import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { resolveAsset } from "../utils/resolveAsset";

export default function BentoGridCategories() {
  const categories = [
    {
      id: "calzado",
      title: "Calzado",
      subtitle: "Para el asfalto",
      image: "/productos/zapato1.png",
      span: "col-span-12 md:col-span-8 row-span-2",
      link: "/tienda?categoria=zapatos"
    },
    {
      id: "ropa",
      title: "Ropa",
      subtitle: "Estilo Urbano",
      image: "/productos/camiseta1.jpeg",
      span: "col-span-12 md:col-span-4 row-span-1",
      link: "/tienda?categoria=ropa"
    },
    {
      id: "accesorios",
      title: "Accesorios",
      subtitle: "Complementos",
      image: "/productos/zapato3.jpg",
      span: "col-span-12 md:col-span-4 row-span-1",
      link: "/tienda?categoria=accesorios"
    }
  ];

  return (
    <section className="bento-section" style={{ padding: "var(--space-4xl) 0", backgroundColor: "var(--color-canvas)" }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ marginBottom: "var(--space-2xl)" }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", textTransform: "uppercase", fontWeight: 800 }}>
            Explora La <span style={{ color: "var(--color-volt)" }}>Calle</span>
          </h2>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "var(--space-md)",
          autoRows: "300px"
        }}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover="hover"
              className={cat.span}
              style={{
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "var(--color-canvas-alt)",
                cursor: "pointer",
                gridColumn: cat.span.includes("col-span-12") ? "span 12" : (cat.span.includes("col-span-8") ? "span 8" : "span 4"),
                gridRow: cat.span.includes("row-span-2") ? "span 2" : "span 1",
              }}
            >
              <Link to={cat.link} style={{ display: "block", width: "100%", height: "100%" }}>
                <motion.img
                  src={resolveAsset(cat.image)}
                  alt={cat.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  variants={{ hover: { scale: 1.05 } }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "var(--space-xl)"
                }}>
                  <p style={{ color: "var(--color-volt)", textTransform: "uppercase", letterSpacing: "2px", fontSize: "12px", marginBottom: "8px" }}>
                    {cat.subtitle}
                  </p>
                  <h3 style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 700, margin: 0 }}>
                    {cat.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
