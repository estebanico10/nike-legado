import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const IG_POSTS = [
  { id: 1, url: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80", tag: "@nikelegado" },
  { id: 2, url: "https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&w=600&q=80", tag: "@streetculture" },
  { id: 3, url: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=600&q=80", tag: "@urbanstyle.ec" },
  { id: 4, url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80", tag: "@nikelegado" }
];

export default function ShopTheLook() {
  return (
    <section style={{
      padding: "var(--space-5xl) 0",
      backgroundColor: "var(--color-canvas)",
      borderTop: "1px solid var(--color-ink-muted)"
    }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "var(--space-4xl)" }}
        >
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--type-h2)",
            fontWeight: 700,
            color: "var(--color-ink)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-tight)",
            marginBottom: "var(--space-sm)"
          }}>
            Shop The Look
          </h2>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--color-ink-soft)", fontSize: "var(--type-body-sm)" }}>
            Usa el hashtag #NikeLegadoEC para aparecer en nuestro feed
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-sm)" }}>
          {IG_POSTS.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ position: "relative", aspectRatio: "1", overflow: "hidden", backgroundColor: "var(--color-canvas-alt)", cursor: "pointer", group: "true" }}
              className="ig-post"
            >
              <img src={post.url} alt="Instagram Post" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} />
              
              <div 
                className="ig-overlay"
                style={{ 
                  position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", 
                  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                  opacity: 0, transition: "opacity 0.3s ease"
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "var(--space-sm)" }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span style={{ color: "#fff", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--type-caption)" }}>{post.tag}</span>
                <Link to="/tienda" className="btn btn--secondary" style={{ marginTop: "var(--space-md)", padding: "8px 16px", backgroundColor: "#fff", color: "#111", border: "none" }}>Comprar</Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "var(--space-3xl)" }}>
           <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn btn--secondary" style={{ borderRadius: "100px", padding: "12px 24px" }}>
             Ver más en Instagram
           </a>
        </div>
      </div>
      <style>{`
        .ig-post:hover img {
          transform: scale(1.05);
        }
        .ig-post:hover .ig-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
