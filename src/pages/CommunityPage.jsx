import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Award, PlusCircle } from "../components/community/CommunityIcons";
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
    <div className="relative min-h-screen pb-32">
      <SEO 
        title="Comunidad & Street Style" 
        description="Comparte cómo combinas tus zapatillas Nike Legado. Gana Street Cred e inspírate en el barrio." 
      />
      <AnimatedBackground />

      {/* Hero Banner del Muro */}
      <section className="relative pt-32 pb-16 border-b border-white/10 overflow-hidden">
        {/* Luces decorativas de fondo */}
        <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(circle,rgba(212,255,0,0.08)_0%,rgba(0,0,0,0)_70%)] blur-[60px] pointer-events-none z-0" />

        <div className="container relative z-10 px-6 mx-auto">
          <div className="flex flex-col items-center text-center max-w-[840px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[rgba(212,255,0,0.1)] text-[var(--color-volt-text)] border border-[rgba(212,255,0,0.4)] px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-[1.5px] mb-6"
            >
              <Sparkles size={15} /> COMUNIDAD ECUADOR & LATAM
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-[clamp(2rem,5vw,3.8rem)] font-black uppercase tracking-[-1px] leading-[1.05] m-0 mb-6 text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              EL MURO DEL BARRIO — <span className="text-[var(--color-volt-text)]">STREET STYLE OOTD</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#bbb] text-[clamp(1rem,2vw,1.2rem)] leading-[1.6] m-0 mb-10 max-w-[680px] font-body"
            >
              Aquí el estilo no se dicta en pasarelas, se construye en la calle. Comparte tu outfit, vota por los mejores looks y acumula <strong className="text-white">Street Cred</strong> para canjear beneficios exclusivos en la tienda.
            </motion.p>

            {/* CTA y Stats del Usuario */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center flex-wrap gap-6"
            >
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.04, boxShadow: "0 12px 32px rgba(212, 255, 0, 0.4)" }}
                whileTap={{ scale: 0.96 }}
                className="bg-[var(--color-volt)] text-black border-none px-8 py-4 rounded-[35px] font-display text-base font-black uppercase tracking-[0.5px] cursor-pointer flex items-center gap-2.5 shadow-[0_8px_24px_rgba(212,255,0,0.25)]"
              >
                <Upload size={20} strokeWidth={2.5} /> SUBIR MI OUTFIT (+150 PTS)
              </motion.button>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 px-5 py-3 rounded-[30px] flex items-center gap-3">
                <Award size={22} className="text-[var(--color-volt-text)]" />
                <div className="text-left">
                  <div className="text-[11px] text-[#888] uppercase font-bold">
                    Tu Street Cred actual
                  </div>
                  <div className="text-base font-extrabold text-white">
                    {userPoints} PTS
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navegación y Filtros de Categorías */}
      <section className="py-10">
        <div className="container px-6 mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
            {/* Tabs de Filtro */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`px-5 py-2.5 rounded-[30px] font-display text-sm font-extrabold uppercase tracking-[0.5px] cursor-pointer transition-all duration-250 flex items-center gap-1.5 ${isActive ? 'bg-[var(--color-volt)] text-black border border-[var(--color-volt)] shadow-[0_6px_20px_rgba(212,255,0,0.2)]' : 'bg-white/5 text-[#ccc] border border-white/10 hover:bg-white/10'}`}
                  >
                    {tab}
                  </motion.button>
                );
              })}
            </div>

            {/* Info de resultados */}
            <div className="text-[#888] text-[13px] font-semibold">
              Mostrando <strong className="text-white">{filteredPosts.length}</strong> looks en el muro
            </div>
          </div>

          {/* Grid de Outfits -> Transformado a Swipeable Stack */}
          <div className="relative w-full max-w-sm mx-auto min-h-[650px] mt-12 flex justify-center perspective-[1000px]">
            <AnimatePresence>
              {filteredPosts.length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 bg-white/60 backdrop-blur-md border border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 text-black flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={30} />
                  </div>
                  <h3 className="font-display text-[22px] font-extrabold uppercase text-black m-0 mb-2.5">
                    No hay looks en "{activeTab}" aún
                  </h3>
                  <p className="text-gray-500 text-sm m-0 mb-8">
                    ¡Sé el pionero del barrio en esta categoría!
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-black text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <PlusCircle size={18} /> Subir outfit
                  </button>
                </motion.div>
              ) : (
                filteredPosts.slice(0, 5).reverse().map((post, i) => {
                  const isTop = i === filteredPosts.slice(0, 5).length - 1;
                  return (
                    <motion.div
                      key={post.id}
                      className="absolute top-0 w-full"
                      drag={isTop ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(e, info) => {
                        if (Math.abs(info.offset.x) > 100) {
                          const swipeDirection = info.offset.x > 0 ? "right" : "left";
                          if (swipeDirection === "right") {
                            useLoyaltyStore.getState().addPoints(5, "Swipe Like");
                          }
                        }
                      }}
                      initial={{ scale: 0.8, y: 100, opacity: 0 }}
                      animate={{ 
                        scale: 1 - ((filteredPosts.slice(0, 5).length - 1 - i) * 0.05),
                        y: (filteredPosts.slice(0, 5).length - 1 - i) * 20,
                        opacity: 1,
                        zIndex: i
                      }}
                      exit={{ x: 300, opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      whileDrag={{ scale: 1.05, rotate: 5 }}
                    >
                      <OutfitCard post={post} />
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
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
