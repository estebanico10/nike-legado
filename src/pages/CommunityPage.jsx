import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Award, PlusCircle, Flame, MapPin, Tag } from "../components/community/CommunityIcons";
import SEO from "../components/SEO";
import OutfitCard from "../components/community/OutfitCard";
import UploadOutfitModal from "../components/community/UploadOutfitModal";
import { useCommunityStore, useLoyaltyStore } from "../store/useStore";
import { useI18nStore } from "../store/useI18nStore";
import { useToast } from "../context/ToastContext";
import { resolveAsset } from "../utils/resolveAsset";

const CATEGORY_TABS = [
  "Todos",
  "Air Max",
  "Dunks",
  "Running",
  "Destacados 🔥"
];

export default function CommunityPage() {
  const posts = useCommunityStore((state) => state.posts);
  const { points, level, rewards, redeemReward } = useLoyaltyStore();
  const [activeTab, setActiveTab] = useState("Todos");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "swipe"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const { t } = useI18nStore();
  const { addToast } = useToast();

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

  const spotlightPost = useMemo(() => {
    return posts.find((p) => p.featured && p.approved !== false) || posts[0];
  }, [posts]);

  const handleRedeem = (reward) => {
    const res = redeemReward(reward.id, reward.cost);
    if (res && res.success) {
      if (addToast) addToast(`¡Canjeaste: ${reward.title}! Código en tu historial`, "success");
    } else {
      if (addToast) addToast(res?.message || "Puntos insuficientes para este beneficio", "error");
    }
  };

  return (
    <div className="relative min-h-screen pb-32 bg-[#060606] text-white overflow-hidden font-body selection:bg-[var(--color-volt)] selection:text-black">
      <SEO 
        title="Comunidad & Street Style" 
        description="Comparte cómo combinas tus zapatillas Nike Legado. Gana Street Cred e inspírate en el barrio." 
      />

      {/* Fondo urbano oscuro con grilla high-tech y luces neón */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-[radial-gradient(circle,rgba(206,255,0,0.11)_0%,rgba(0,0,0,0)_70%)] blur-[90px]" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(4,49,116,0.14)_0%,rgba(0,0,0,0)_70%)] blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Hero Banner del Muro */}
      <section className="relative pt-32 pb-12 border-b border-white/10 z-10">
        <div className="container px-6 mx-auto max-w-[1350px]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Texto Hero */}
            <div className="flex-1 text-center lg:text-left max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-[#141414] text-[var(--color-volt-text)] border border-[rgba(206,255,0,0.35)] px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-[1.5px] mb-6 shadow-[0_4px_16px_rgba(206,255,0,0.12)]"
              >
                <Sparkles size={15} /> {t("COMUNIDAD ECUADOR & LATAM")}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-[clamp(2.4rem,6vw,4.2rem)] font-black uppercase tracking-tight leading-[1.02] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] mb-6"
              >
                {t("EL MURO DEL BARRIO")} <br />
                <span className="text-[var(--color-volt)]">{t("STREET STYLE OOTD")}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[#bbb] text-base md:text-lg leading-[1.65] mb-8 font-body max-w-xl"
              >
                {t("Aquí el estilo no se dicta en pasarelas, se construye en la calle. Comparte tu outfit, vota por los mejores looks y acumula")} <strong className="text-white">Street Cred</strong> {t("para canjear beneficios exclusivos en la tienda.")}
              </motion.p>

              {/* Botones de Acción principal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center justify-center lg:justify-start flex-wrap gap-4"
              >
                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  whileHover={{ scale: 1.04, boxShadow: "0 14px 36px rgba(206, 255, 0, 0.35)" }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-[var(--color-volt)] text-black border-none px-8 py-4 rounded-full font-display text-base font-black uppercase tracking-[0.5px] cursor-pointer flex items-center gap-2.5 shadow-[0_8px_24px_rgba(206,255,0,0.25)] transition-transform"
                >
                  <Upload size={20} strokeWidth={2.5} /> {t("SUBIR MI OUTFIT (+150 PTS)")}
                </motion.button>

                <button
                  onClick={() => setShowRewards(!showRewards)}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-4 rounded-full font-display text-sm font-bold uppercase tracking-[0.5px] cursor-pointer transition-all flex items-center gap-2"
                >
                  <Award size={18} className="text-[var(--color-volt-text)]" />
                  {showRewards ? t("Ocultar Recompensas") : t("Ver Beneficios Street Cred")}
                </button>
              </motion.div>
            </div>

            {/* Panel de Gamificación y Puntos del Usuario */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="w-full lg:w-[420px] bg-[#111111]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-volt)] text-black font-display font-black text-xl flex items-center justify-center shadow-[0_4px_12px_rgba(206,255,0,0.3)]">
                    ⚡
                  </div>
                  <div>
                    <span className="text-[11px] text-[#888] font-bold uppercase tracking-wider block">
                      {t("Tu Rango Street Cred")}
                    </span>
                    <span className="font-display text-xl font-black text-white uppercase tracking-wide">
                      {level || "Rookie"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#888] font-bold uppercase tracking-wider block">
                    {t("Puntos Acumulados")}
                  </span>
                  <span className="font-display text-2xl font-black text-[var(--color-volt-text)]">
                    {points || 0} PTS
                  </span>
                </div>
              </div>

              {/* Mini Barra de Progreso */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-[#aaa] font-semibold mb-1.5">
                  <span>Progreso al siguiente nivel</span>
                  <span>{points} / 500 PTS</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--color-volt)] to-emerald-400 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, ((points || 0) / 500) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Acciones para ganar puntos */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl flex items-center gap-2">
                  <span className="text-emerald-400 font-black">+150</span>
                  <span className="text-[#ccc] leading-tight">{t("Por subir tu look")}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl flex items-center gap-2">
                  <span className="text-[var(--color-volt-text)] font-black">+10</span>
                  <span className="text-[#ccc] leading-tight">{t("Por cada Like que des")}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sección Desplegable de Recompensas */}
          <AnimatePresence>
            {showRewards && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden mt-8"
              >
                <div className="bg-[#121212] border border-[rgba(206,255,0,0.3)] rounded-3xl p-6 md:p-8 shadow-2xl">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="font-display text-2xl font-black uppercase text-white m-0 flex items-center gap-2">
                        🎁 {t("Canjea Beneficios Exclusivos con tus Puntos")}
                      </h3>
                      <p className="text-sm text-[#aaa] m-0 mt-1">
                        {t("Usa tus Street Cred para desbloquear descuentos en la tienda o acceso VIP.")}
                      </p>
                    </div>
                    <div className="bg-[rgba(206,255,0,0.15)] text-[var(--color-volt-text)] px-4 py-2 rounded-full font-bold text-sm border border-[var(--color-volt)]">
                      Tienes: {points || 0} PTS
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(rewards || []).map((reward) => {
                      const canRedeem = (points || 0) >= reward.cost;
                      return (
                        <div key={reward.id} className="bg-[#181818] border border-white/10 hover:border-white/25 rounded-2xl p-5 flex flex-col justify-between transition-all">
                          <div>
                            <div className="text-3xl mb-3">{reward.icon || "🏷️"}</div>
                            <h4 className="font-display font-bold text-lg text-white mb-1 leading-snug">
                              {reward.title}
                            </h4>
                            <p className="text-xs text-[#999] leading-relaxed mb-4">
                              {reward.description}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                            <span className="font-display font-extrabold text-base text-[var(--color-volt-text)]">
                              {reward.cost} PTS
                            </span>
                            <button
                              onClick={() => handleRedeem(reward)}
                              disabled={!canRedeem}
                              className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wide transition-all ${
                                canRedeem
                                  ? "bg-[var(--color-volt)] text-black hover:bg-[#bce600] cursor-pointer shadow-[0_4px_12px_rgba(206,255,0,0.25)]"
                                  : "bg-white/10 text-[#666] cursor-not-allowed"
                              }`}
                            >
                              {canRedeem ? t("Canjea Ahora") : t("Puntos Insuficientes")}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Spotlight Look del Día (Hero Card) */}
      {spotlightPost && activeTab === "Todos" && (
        <section className="py-12 border-b border-white/10 bg-gradient-to-b from-[#0a0a0a] to-[#060606] relative z-10">
          <div className="container px-6 mx-auto max-w-[1350px]">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[1.5px] text-[var(--color-volt-text)] mb-6">
              <Flame size={16} fill="var(--color-volt)" /> {t("LOOK DESTACADO DEL DÍA EN EL BARRIO")}
            </div>

            <div className="bg-[#111111] border border-[rgba(206,255,0,0.35)] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Imagen principal Spotlight */}
              <div className="lg:col-span-7 relative min-h-[420px] bg-[#0c0c0c]">
                <img
                  src={resolveAsset(spotlightPost.imageUrl || spotlightPost.image || "/instagram/post 1.jpeg")}
                  alt={spotlightPost.author}
                  className="w-full h-full object-cover block max-h-[560px] lg:max-h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden" />
                {spotlightPost.shoe && (
                  <div className="absolute bottom-4 left-4 flex items-center">
                    <div className="bg-black/85 backdrop-blur-md border border-[var(--color-volt)] px-4 py-2 rounded-full flex items-center gap-2 text-white text-sm font-semibold shadow-lg">
                      <Tag size={14} className="text-[var(--color-volt-text)]" />
                      <span className="text-[#ccc]">{t("Zapa Llevada:")}</span>
                      <span className="text-[var(--color-volt-text)] font-bold">{spotlightPost.shoe}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Info y comentarios de Spotlight */}
              <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-[#111]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-volt)] to-[#222] text-black font-extrabold text-base flex items-center justify-center border-2 border-[var(--color-volt)]">
                        {(spotlightPost.author || "@user").replace("@", "").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-display font-bold text-lg text-white flex items-center gap-1.5">
                          {spotlightPost.author}
                          <Sparkles size={16} className="text-[var(--color-volt-text)]" />
                        </div>
                        {spotlightPost.location && (
                          <div className="flex items-center gap-1 text-[#999] text-xs mt-0.5">
                            <MapPin size={12} className="text-[var(--color-volt-text)]" />
                            <span>{spotlightPost.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="bg-[rgba(206,255,0,0.15)] text-[var(--color-volt-text)] border border-[var(--color-volt)] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                      🔥 Top Look
                    </span>
                  </div>

                  <p className="text-[#eee] text-base leading-relaxed font-body mb-6">
                    "{spotlightPost.description}"
                  </p>
                </div>

                {/* Resumen de interacción y botón */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm font-bold text-white">
                    <span className="flex items-center gap-1.5 text-[var(--color-volt-text)] bg-[rgba(206,255,0,0.1)] px-3.5 py-2 rounded-full border border-[rgba(206,255,0,0.3)]">
                      🔥 {spotlightPost.likes || 0} {t("Likes")}
                    </span>
                    <span className="text-[#bbb]">
                      💬 {(spotlightPost.comments || []).length} {t("Comentarios")}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      useCommunityStore.getState().toggleLike(spotlightPost.id);
                      addToast("+10 PTS ganados en Look Destacado 🔥", "success");
                    }}
                    className="bg-white hover:bg-[var(--color-volt)] hover:text-black text-black font-display font-extrabold uppercase tracking-wide text-xs px-5 py-2.5 rounded-full transition-colors shadow-md"
                  >
                    {t("Dar Like (+10 PTS)")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Navegación, Filtros y Switcher de Modo de Vista */}
      <section className="py-10 relative z-10">
        <div className="container px-6 mx-auto max-w-[1350px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/10">
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
                    className={`px-5 py-2.5 rounded-full font-display text-sm font-extrabold uppercase tracking-[0.5px] cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-[var(--color-volt)] text-black border border-[var(--color-volt)] shadow-[0_6px_20px_rgba(206,255,0,0.25)]' 
                        : 'bg-white/5 text-[#ccc] border border-white/10 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    {t(tab)}
                  </motion.button>
                );
              })}
            </div>

            {/* Controles de Vista: Grid vs Swipe */}
            <div className="flex items-center justify-between md:justify-end gap-4">
              <div className="text-[#999] text-sm font-semibold">
                {t("Mostrando")} <strong className="text-white">{filteredPosts.length}</strong> {t("looks en el muro")}
              </div>

              <div className="bg-[#141414] border border-white/15 p-1 rounded-full flex items-center">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-1.5 rounded-full font-display text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    viewMode === "grid" ? "bg-white text-black shadow-sm" : "text-[#888] hover:text-white"
                  }`}
                >
                  🧱 Grid
                </button>
                <button
                  onClick={() => setViewMode("swipe")}
                  className={`px-4 py-1.5 rounded-full font-display text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === "swipe" ? "bg-[var(--color-volt)] text-black shadow-sm" : "text-[#888] hover:text-white"
                  }`}
                >
                  🔥 Swipe
                </button>
              </div>
            </div>
          </div>

          {/* MODO 1: GRID DE BARRIO (MASONRY/COLUMNAS RESPONSIVAS) */}
          {viewMode === "grid" ? (
            <div>
              {filteredPosts.length === 0 ? (
                <div className="bg-[#121212] border border-dashed border-white/15 rounded-3xl p-12 text-center max-w-xl mx-auto my-12">
                  <div className="w-16 h-16 rounded-full bg-white/10 text-[var(--color-volt-text)] flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="font-display text-2xl font-extrabold uppercase text-white mb-2">
                    {t("No hay looks en")} "{t(activeTab)}" {t("aún")}
                  </h3>
                  <p className="text-[#888] text-sm mb-8">
                    {t("¡Sé el pionero del barrio en esta categoría y gana +150 PTS instantáneos!")}
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-[var(--color-volt)] text-black font-display font-black uppercase tracking-wide text-sm px-8 py-3.5 rounded-full hover:bg-[#bce600] transition-colors"
                  >
                    <PlusCircle size={18} /> {t("Subir mi look ahora")}
                  </button>
                </div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                  <AnimatePresence>
                    {filteredPosts.map((post) => (
                      <OutfitCard key={post.id} post={post} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          ) : (
            /* MODO 2: SWIPEABLE STACK (TINDER MODE) */
            <div className="relative w-full max-w-md mx-auto min-h-[760px] mt-8 flex justify-center perspective-[1000px]">
              <AnimatePresence>
                {filteredPosts.length === 0 ? (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 bg-[#141414] border border-dashed border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto mb-6">
                      <Sparkles size={30} />
                    </div>
                    <h3 className="font-display text-[22px] font-extrabold uppercase text-white m-0 mb-2.5">
                      {t("No hay looks en")} "{t(activeTab)}"
                    </h3>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-6 inline-flex items-center gap-2 bg-[var(--color-volt)] text-black font-display font-extrabold uppercase px-6 py-3 rounded-full hover:bg-white transition-colors"
                    >
                      <PlusCircle size={18} /> {t("Subir outfit")}
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
                              useLoyaltyStore.getState().addPoints(10, "Swipe Like en Muro");
                              if (addToast) addToast("+10 PTS por tu Like en Swipe 🔥", "success");
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
                        whileDrag={{ scale: 1.04, rotate: 4 }}
                      >
                        <OutfitCard post={post} />
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          )}
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
