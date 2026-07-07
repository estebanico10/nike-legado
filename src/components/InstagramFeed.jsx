import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useSocialStore } from "../store/useStore";
import { resolveAsset } from "../utils/resolveAsset";

export default function InstagramFeed() {
  const { posts } = useSocialStore();
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  
  // Si no hay posts subidos desde el Admin, usamos mock data
  const feed = posts.length > 0 ? posts : [
    { id: 1, type: "image", src: "/assets/images/products/lifestyle-1.jpg", link: "https://instagram.com" },
    { id: 2, type: "image", src: "/assets/images/products/lifestyle-2.jpg", link: "https://instagram.com" },
    { id: 3, type: "image", src: "/assets/images/products/lifestyle-3.jpg", link: "https://instagram.com" },
    { id: 4, type: "image", src: "/assets/images/products/lifestyle-4.jpg", link: "https://instagram.com" },
    { id: 5, type: "image", src: "/assets/images/products/lifestyle-1.jpg", link: "https://instagram.com" },
    { id: 6, type: "image", src: "/assets/images/products/lifestyle-2.jpg", link: "https://instagram.com" },
  ];

  // Duplicar array para el efecto infinito
  const duplicatedFeed = [...feed, ...feed, ...feed];

  useAnimationFrame((t, delta) => {
    // Velocidad de movimiento
    let moveBy = 0.5 * (delta / 10);
    x.set(x.get() - moveBy);

    // Reiniciar posición si ha avanzado el tamaño del primer bloque
    // Esto es un acercamiento básico al reset del marquee
    if (containerRef.current) {
      const el = containerRef.current;
      const width = el.scrollWidth / 3; 
      if (-x.get() >= width) {
        x.set(0);
      }
    }
  });

  return (
    <section style={{ padding: "var(--space-4xl) 0", backgroundColor: "var(--color-canvas)", overflow: "hidden", position: "relative" }}>
      <div className="container" style={{ marginBottom: "var(--space-2xl)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-tight)" }}>
            Únete a la Comunidad
          </h2>
          <p style={{ color: "var(--color-ink-soft)", marginTop: "8px" }}>Síguenos en @Nike y comparte tu estilo con #NikeStyle</p>
        </div>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn btn--secondary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          Seguir
        </a>
      </div>

      {/* Contenedor Marquee */}
      <div style={{ position: "relative", width: "100%", paddingBottom: "24px" }}>
        <motion.div
          ref={containerRef}
          style={{ x, display: "flex", gap: "var(--space-md)", width: "max-content", paddingLeft: "var(--space-md)" }}
        >
          {duplicatedFeed.map((post, i) => (
            <motion.a
              key={i}
              href={post.link}
              target="_blank"
              rel="noreferrer"
              style={{
                position: "relative",
                width: "280px",
                height: "350px",
                borderRadius: "var(--radius-sm)",
                overflow: "hidden",
                display: "block",
                flexShrink: 0,
                backgroundColor: "#f5f5f5"
              }}
              whileHover="hover"
            >
              {post.type === "video" ? (
                <video src={resolveAsset(post.src)} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <img src={resolveAsset(post.src)} alt="Instagram Post" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              )}

              <motion.div
                variants={{
                  hover: { opacity: 1 }
                }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white"
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </motion.div>
            </motion.a>
          ))}
        </motion.div>

        {/* Gradientes a los lados para difuminar */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "100px", background: "linear-gradient(to right, var(--color-canvas), transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "100px", background: "linear-gradient(to left, var(--color-canvas), transparent)", pointerEvents: "none" }} />
      </div>
    </section>
  );
}
