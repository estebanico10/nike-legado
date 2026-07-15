import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import AnimatedBackground from "../components/AnimatedBackground";
import DropCard from "../components/drops/DropCard";

const INITIAL_DROPS = [
  {
    id: "drop-barrio",
    title: 'Nike Air Max Plus "Barrio Drop"',
    price: 199.99,
    stock: 45,
    releaseDate: new Date(Date.now() - 5000).toISOString(), // Dropping right now (0s left)
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    description: "Edición exclusiva inspirada en el asfalto y la energía callejera del sur de Quito y Guayaquil. Detalles reflectantes 3M y cápsula Tuned Air en tono Volt.",
  },
  {
    id: "drop-inca",
    title: 'Nike Dunk High "Inca Heritage"',
    price: 189.99,
    stock: 30,
    releaseDate: new Date(Date.now() + 2 * 3600 * 1000).toISOString(), // Dropping in 2 hours
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    description: "Tributo textil andino con gamuza premium de primera flor, patrones precolombinos grabados con láser y suela de caucho reciclado de alta tracción.",
  },
  {
    id: "drop-cotopaxi",
    title: 'Air Jordan 4 Retro "Cotopaxi Eruption"',
    price: 229.99,
    stock: 25,
    releaseDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // Dropping tomorrow
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    description: "Inspirada en el coloso andino con nubuck gris ceniza, acentos en naranja magmático y malla balística. Una obra maestra de coleccionista.",
  },
];

export default function DropsPage() {
  const [drops, setDrops] = useState([]);

  const loadDrops = () => {
    try {
      const stored = localStorage.getItem("site_drops");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDrops(parsed);
          return;
        }
      }
      // If not stored or empty array, write initial defaults
      localStorage.setItem("site_drops", JSON.stringify(INITIAL_DROPS));
      setDrops(INITIAL_DROPS);
    } catch (err) {
      console.error("Error loading drops from localStorage:", err);
      setDrops(INITIAL_DROPS);
    }
  };

  useEffect(() => {
    loadDrops();

    // Listen for custom events or cross-tab storage changes
    const handleDropsUpdate = () => loadDrops();
    window.addEventListener("site_drops_updated", handleDropsUpdate);
    window.addEventListener("storage", handleDropsUpdate);

    return () => {
      window.removeEventListener("site_drops_updated", handleDropsUpdate);
      window.removeEventListener("storage", handleDropsUpdate);
    };
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", backgroundColor: "#0C0C0C", color: "#FFFFFF", paddingBottom: "var(--space-4xl)" }}>
      <SEO
        title="SNKRS Drops"
        description="Lanzamientos exclusivos, sorteos y fila virtual de zapatillas de edición limitada."
      />
      <AnimatedBackground />

      {/* Hero Header Section */}
      <section
        style={{
          position: "relative",
          padding: "110px 24px 60px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          background: "radial-gradient(circle at 50% 0%, rgba(206, 255, 0, 0.12) 0%, rgba(12, 12, 12, 0) 70%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "6px 14px",
                borderRadius: "30px",
                backgroundColor: "rgba(206, 255, 0, 0.1)",
                border: "1px solid var(--color-volt)",
                color: "var(--color-volt)",
                fontFamily: "var(--font-display)",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "16px",
              }}
            >
              NIKE LEGADO // EXCLUSIVE ACCESS
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 6vw, 68px)",
                fontWeight: 700,
                textTransform: "uppercase",
                lineHeight: 1.05,
                letterSpacing: "-1px",
                margin: "0 auto 16px",
                color: "#FFFFFF",
              }}
            >
              SNKRS DROPS <span style={{ color: "var(--color-volt)" }}>&</span> FILA VIRTUAL
            </h1>
            <p
              style={{
                fontSize: "var(--type-body-lg)",
                color: "rgba(255, 255, 255, 0.75)",
                maxWidth: "680px",
                margin: "0 auto 48px",
                lineHeight: 1.6,
              }}
            >
              El punto de encuentro entre la herencia streetwear y la innovación de Nike. Accede a lanzamientos limitados, activa recordatorios y participa en nuestra fila virtual anti-bots.
            </p>
          </motion.div>

          {/* How It Works Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              textAlign: "left",
              marginTop: "24px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "24px",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(206, 255, 0, 0.12)",
                  color: "var(--color-volt)",
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  border: "1px solid rgba(206, 255, 0, 0.3)",
                }}
              >
                01
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-h4)",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  color: "#FFFFFF",
                }}
              >
                Activa Recordatorios
              </h3>
              <p style={{ fontSize: "var(--type-body-sm)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>
                Explora el calendario y presiona el botón de recordatorio para recibir alertas instantáneas cuando el contador llegue a cero.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "24px",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(206, 255, 0, 0.12)",
                  color: "var(--color-volt)",
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  border: "1px solid rgba(206, 255, 0, 0.3)",
                }}
              >
                02
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-h4)",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  color: "#FFFFFF",
                }}
              >
                Fila Virtual Anti-Bots
              </h3>
              <p style={{ fontSize: "var(--type-body-sm)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>
                Al expirar el contador, haz clic en &ldquo;Entrar al Sorteo / Fila Virtual&rdquo; para pasar a la sala de espera aleatoria y asegurar justicia en cada par.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "24px",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(206, 255, 0, 0.12)",
                  color: "var(--color-volt)",
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  border: "1px solid rgba(206, 255, 0, 0.3)",
                }}
              >
                03
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-h4)",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  color: "#FFFFFF",
                }}
              >
                10 Minutos Exclusivos
              </h3>
              <p style={{ fontSize: "var(--type-body-sm)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>
                Si se te concede el acceso, se desbloquea un temporizador exclusivo de 10 minutos para seleccionar tu talla y finalizar la compra al precio oficial del drop.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Drops Grid Section */}
      <section style={{ maxWidth: "1280px", margin: "64px auto 0", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "36px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--type-h2)",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              LANZAMIENTOS Y DROPS ({drops.length})
            </h2>
            <span style={{ fontSize: "var(--type-body-sm)", color: "var(--color-ink-soft)" }}>
              Stock limitado en todas las ediciones · Precios oficiales garantizados
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 14px",
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: "13px",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-volt)", boxShadow: "0 0 8px var(--color-volt)" }} />
            Sistema Antibots Activo
          </div>
        </div>

        {drops.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.1)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "#CCCCCC", textTransform: "uppercase" }}>
              No hay Drops programados
            </h3>
            <p style={{ color: "var(--color-ink-soft)", marginTop: "8px" }}>
              Regresa pronto o consulta nuestras redes sociales para conocer las próximas fechas de lanzamiento.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "28px",
            }}
          >
            {drops.map((drop) => (
              <DropCard key={drop.id} drop={drop} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
