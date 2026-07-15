import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Flame, Award, MapPin, PlusCircle } from "../components/community/CommunityIcons";
import SEO from "../components/SEO";
import AnimatedBackground from "../components/AnimatedBackground";
import OutfitCard from "../components/community/OutfitCard";
import UploadOutfitModal from "../components/community/UploadOutfitModal";
import { useCommunityStore, useLoyaltyStore } from "../store/useStore";

const CATEGORY_TABS = [
  "Todos",
  "Air Max",
  "Dunks",
  "Running",
  "Destacados 🔥"
];

export default function CommunityPage() {
  const posts = useCommunityStore((state) => state.posts);
  const userPoints = useLoyaltyStore((state) => state.points);
  const [activeTab, setActiveTab] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrar posts aprobados y por categoría activa
  const filteredPosts = useMemo(() => {
    const approvedPosts = posts.filter((post) => post.approved !== false);

    if (activeTab === "Todos") {
      return approvedPosts;
    }
    if (activeTab === "Destacados 🔥") {
      return approvedPosts.filter((post) => post.featured);
    }
    return approvedPosts.filter((post) => {
      const matchCategory = post.category?.toLowerCase() === activeTab.toLowerCase();
      const matchShoe = post.shoe?.toLowerCase().includes(activeTab.toLowerCase());
      return matchCategory || matchShoe;
    });
  }, [posts, activeTab]);

  return (
    <div style={{ position: "relative", minHeight: "100vh", paddingBottom: "var(--space-4xl)" }}>
      <SEO 
        title="Comunidad & Street Style" 
        description="Comparte cómo combinas tus zapatillas Nike Legado. Gana Street Cred e inspírate en el barrio." 
      />
      <AnimatedBackground />

      {/* Hero Banner del Muro */}
      <section style={{
        position: "relative",
        padding: "var(--space-4xl) 0 var(--space-2xl)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        overflow: "hidden"
      }}>
        {/* Luces decorativas de fondo */}
        <div style={{
          position: "absolute",
          top: "-50%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "400px",
          background: "radial-gradient(circle, rgba(212, 255, 0, 0.08) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "840px",
            margin: "0 auto"
          }}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(212, 255, 0, 0.1)",
                color: "var(--color-volt)",
                border: "1px solid rgba(212, 255, 0, 0.4)",
                padding: "6px 16px",
                borderRadius: "30px",
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: "var(--space-md)"
              }}
            >
              <Sparkles size={15} /> COMUNIDAD ECUADOR & LATAM
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.8rem)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "-1px",
                lineHeight: "1.05",
                margin: "0 0 var(--space-md) 0",
                color: "#fff",
                textShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}
            >
              EL MURO DEL BARRIO — <span style={{ color: "var(--color-volt)" }}>STREET STYLE OOTD</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                color: "#bbb",
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                lineHeight: "1.6",
                margin: "0 0 var(--space-xl) 0",
                maxWidth: "680px",
                fontFamily: "var(--font-body)"
              }}
            >
              Aquí el estilo no se dicta en pasarelas, se construye en la calle. Comparte tu outfit, vota por los mejores looks y acumula <strong>Street Cred</strong> para canjear beneficios exclusivos en la tienda.
            </motion.p>

            {/* CTA y Stats del Usuario */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "var(--space-lg)"
              }}
            >
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.04, boxShadow: "0 12px 32px rgba(212, 255, 0, 0.4)" }}
                whileTap={{ scale: 0.96 }}
                style={{
                  backgroundColor: "var(--color-volt)",
                  color: "#000",
                  border: "none",
                  padding: "16px 32px",
                  borderRadius: "35px",
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 8px 24px rgba(212, 255, 0, 0.25)"
                }}
              >
                <Upload size={20} strokeWidth={2.5} /> SUBIR MI OUTFIT (+150 PTS)
              </motion.button>

              <div style={{
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "12px 20px",
                borderRadius: "30px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <Award size={22} style={{ color: "var(--color-volt)" }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", fontWeight: 700 }}>
                    Tu Street Cred actual
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>
                    {userPoints} PTS
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navegación y Filtros de Categorías */}
      <section style={{ padding: "var(--space-xl) 0" }}>
        <div className="container">
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "var(--space-xl)"
          }}>
            {/* Tabs de Filtro */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap"
            }}>
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: isActive 
                        ? "var(--color-volt)" 
                        : "rgba(255, 255, 255, 0.05)",
                      color: isActive ? "#000" : "#ccc",
                      border: isActive 
                        ? "1px solid var(--color-volt)" 
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      padding: "10px 20px",
                      borderRadius: "30px",
                      fontFamily: "var(--font-display)",
                      fontSize: "14px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: isActive ? "0 6px 20px rgba(212, 255, 0, 0.2)" : "none"
                    }}
                  >
                    {tab}
                  </motion.button>
                );
              })}
            </div>

            {/* Info de resultados */}
            <div style={{ color: "#888", fontSize: "13px", fontWeight: 600 }}>
              Mostrando <strong style={{ color: "#fff" }}>{filteredPosts.length}</strong> looks en el muro
            </div>
          </div>

          {/* Grid de Outfits */}
          <AnimatePresence mode="wait">
            {filteredPosts.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  backgroundColor: "rgba(18, 18, 18, 0.6)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px dashed rgba(255, 255, 255, 0.15)",
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--space-4xl) var(--space-xl)",
                  textAlign: "center",
                  maxWidth: "600px",
                  margin: "40px auto"
                }}
              >
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(212, 255, 0, 0.1)",
                  color: "var(--color-volt)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto var(--space-md)"
                }}>
                  <Sparkles size={30} />
                </div>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "#fff",
                  margin: "0 0 10px 0"
                }}>
                  No hay looks en "{activeTab}" aún
                </h3>
                <p style={{ color: "#999", fontSize: "14px", margin: "0 0 var(--space-lg) 0" }}>
                  ¡Sé el pionero del barrio en esta categoría y sé destacado en la cabecera del Muro!
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn--primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                  <PlusCircle size={18} /> Subir el primer outfit
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="grid-layout"
                layout
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "var(--space-xl)",
                  alignItems: "start"
                }}
              >
                {filteredPosts.map((post) => (
                  <OutfitCard key={post.id} post={post} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Modal de Subir Look */}
      <UploadOutfitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
