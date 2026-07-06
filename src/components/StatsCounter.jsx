import { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";

function CountUp({ from = 0, to, duration = 2 }) {
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && nodeRef.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = Math.round(value);
          }
        },
      });
      return () => controls.stop();
    }
  }, [from, to, duration, inView]);

  return <span ref={nodeRef}>{from}</span>;
}

export default function StatsCounter() {
  const stats = [
    { label: "Piezas Vendidas", value: 50, suffix: "+", icon: "📦" },
    { label: "Diseños Únicos", value: 15, suffix: "", icon: "🎨" },
    { label: "Horas Envío", value: 48, suffix: "h", icon: "⚡" },
    { label: "Ecuatoriano", value: 100, suffix: "%", icon: "🇪🇨" },
  ];

  return (
    <section style={{
      padding: "var(--space-4xl) 0",
      backgroundColor: "var(--color-canvas)",
      borderTop: "1px solid var(--color-ink-muted)",
      borderBottom: "1px solid var(--color-ink-muted)"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--space-2xl)",
          textAlign: "center"
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-sm)"
              }}
            >
              <div style={{
                fontSize: "2rem",
                marginBottom: "var(--space-xs)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "var(--color-canvas-alt)",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--type-h2)",
                fontWeight: 700,
                color: "var(--color-ink)",
                lineHeight: 1
              }}>
                <CountUp to={stat.value} />
                {stat.suffix}
              </div>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--type-body-sm)",
                color: "var(--color-ink-soft)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 500
              }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
