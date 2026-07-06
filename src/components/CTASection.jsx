import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section style={{
      position: "relative",
      padding: "var(--space-5xl) 0",
      backgroundColor: "var(--color-ink)",
      color: "var(--color-canvas)",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center"
    }}>
      {/* Animated Gradient Background */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity
        }}
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(270deg, var(--color-ink), var(--color-indoor-blue), var(--color-ink))",
          backgroundSize: "200% 200%",
          zIndex: 0,
          opacity: 0.6
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 800,
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-tight)",
            marginBottom: "var(--space-md)",
            color: "var(--color-canvas)"
          }}>
            ÚNETE AL <span className="text-gradient" style={{ backgroundImage: "linear-gradient(45deg, var(--color-volt), #fff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LEGADO</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--type-body-lg)",
            color: "rgba(255, 255, 255, 0.8)",
            maxWidth: "600px",
            margin: "0 auto var(--space-2xl)",
            lineHeight: 1.6
          }}>
            Sé parte de la cultura streetwear que está redefiniendo la calle en Ecuador. Ediciones limitadas, calidad superior.
          </p>
          <motion.a
            href="#/tienda"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn--volt"
            style={{
              padding: "var(--space-md) var(--space-xl)",
              fontSize: "var(--type-body-sm)",
              borderRadius: "100px",
              boxShadow: "0 10px 30px rgba(206, 255, 0, 0.3)"
            }}
          >
            EXPLORAR LA COLECCIÓN
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
