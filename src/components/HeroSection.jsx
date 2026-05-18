import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function HeroSection() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize values -1 to 1
      x.set((e.clientX / window.innerWidth) * 2 - 1);
      y.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  // Transform background movement slightly opposite to mouse
  const bgX = useTransform(x, [-1, 1], ["-3%", "3%"]);
  const bgY = useTransform(y, [-1, 1], ["-3%", "3%"]);

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "var(--space-5xl) var(--space-lg)",
        minHeight: "80vh",
        gap: "var(--space-lg)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* AnimatedBackground component should be placed in App.jsx or individually on pages, not here. We remove the hardcoded orbs. */}

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--type-caption)",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--color-ink-soft)",
        }}
      >
        Streetwear × Herencia Ecuatoriana
      </motion.p>

      {/* Animated Staggered Title */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } },
          hidden: {}
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          overflow: "hidden",
          maxWidth: "900px",
        }}
      >
        {["N", "I", "K", "E", "\u00A0", "L", "E", "G", "A", "D", "O"].map((char, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { y: "100%", opacity: 0, rotateZ: 5 },
              visible: { y: "0%", opacity: 1, rotateZ: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] } }
            }}
            whileHover={{ y: -10, color: "var(--color-volt)", transition: { duration: 0.2 } }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--type-hero)",
              lineHeight: "var(--lh-hero)",
              fontWeight: 700,
              letterSpacing: "var(--tracking-tight)",
              textTransform: "uppercase",
              color: "var(--color-ink)",
              display: "inline-block",
              WebkitTextStroke: char !== "\u00A0" ? "2px var(--color-ink)" : "none",
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0, 0, 0.2, 1], delay: 0.8 }}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--type-body-lg)",
          lineHeight: 1.6,
          color: "var(--color-ink-soft)",
          maxWidth: "560px",
        }}
      >
        Pixel art de 16-bits. Cartografía ancestral. Prendas que narran
        territorio. Colección cápsula diseñada desde los Andes para las calles
        del mundo.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0, 0, 0.2, 1], delay: 1 }}
        style={{
          display: "flex",
          gap: "var(--space-md)",
          marginTop: "var(--space-lg)",
        }}
      >
        <a href="#coleccion" className="btn btn--primary">
          EXPLORAR COLECCIÓN
        </a>
        <a href="/nosotros" className="btn btn--secondary">
          NUESTRA HISTORIA
        </a>
      </motion.div>
    </section>
  );
}
