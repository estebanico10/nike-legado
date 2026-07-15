import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Share2, MapPin, Flame, Send, Sparkles, Tag } from "./CommunityIcons";
import { useCommunityStore, useLoyaltyStore } from "../../store/useStore";
import { resolveAsset } from "../../utils/resolveAsset";
import { useToast } from "../../context/ToastContext";

export default function OutfitCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { addToast } = useToast();

  // Handle both possible property names just in case
  const authorName = post.author || post.alias || "@anon_street";
  const imageSrc = post.imageUrl || post.image || "/instagram/post 1.jpeg";
  const likesCount = post.likes !== undefined ? post.likes : 0;
  const isLiked = Boolean(post.likedByMe);
  const commentsList = post.comments || [];

  const handleLikeClick = () => {
    const wasLiked = isLiked;
    useCommunityStore.getState().toggleLike(post.id);
    
    if (!wasLiked) {
      useLoyaltyStore.getState().addPoints(10, "Like en Muro de Comunidad");
      try {
        addToast("+10 PTS Street Cred ganados 🔥", "success");
      } catch (e) {
        // Fallback if toast context not available
      }
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    useCommunityStore.getState().addComment(post.id, {
      text: commentText.trim(),
      author: "Tú",
      date: "Ahora"
    });

    setCommentText("");
    try {
      addToast("Comentario publicado en el Muro", "success");
    } catch (e) {
      // ignore
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      try {
        addToast("Enlace del look copiado al portapapeles", "info");
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-[#121212]/85 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col relative transition-all duration-300 group hover:-translate-y-1 ${post.featured ? 'border border-[rgba(212,255,0,0.4)] shadow-[0_12px_36px_rgba(212,255,0,0.08),0_4px_12px_rgba(0,0,0,0.4)] hover:border-[rgba(212,255,0,0.7)]' : 'border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-white/20'}`}
    >
      {/* Header del Post */}
      <div className="p-4 px-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm ${post.featured ? 'bg-gradient-to-br from-[var(--color-volt)] to-[#111] text-black border-2 border-[var(--color-volt)]' : 'bg-gradient-to-br from-[#333] to-[#1a1a1a] text-white border border-white/15'}`}>
            {authorName.replace("@", "").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm tracking-[0.3px]">
                {authorName}
              </span>
              {post.featured && (
                <span title="Destacado por Nike Legado" className="text-[var(--color-volt-text)] flex">
                  <Sparkles size={14} />
                </span>
              )}
            </div>
            {post.location && (
              <div className="flex items-center gap-1 text-[#999] text-xs mt-0.5">
                <MapPin size={12} className="text-[var(--color-volt-text)]" />
                <span>{post.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Badge Destacado */}
        {post.featured && (
          <span className="bg-[rgba(212,255,0,0.15)] text-[var(--color-volt-text)] border border-[var(--color-volt)] px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[1px] flex items-center gap-1">
            <Flame size={12} fill="var(--color-volt)" /> Destacado
          </span>
        )}
      </div>

      {/* Imagen del Look */}
      <div className="relative w-full pt-[115%] bg-[#0d0d0d] overflow-hidden">
        <motion.img
          src={resolveAsset(imageSrc)}
          alt={`Look de ${authorName} - ${post.shoe || "Nike Style"}`}
          loading="lazy"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover block"
        />

        {/* Gradiente inferior en imagen */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-black/85 to-transparent pointer-events-none" />

        {/* Zapatilla Nike Llevada Tag */}
        {post.shoe && (
          <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center">
            <div className="bg-[#0a0a0a]/85 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full inline-flex items-center gap-2 text-white text-xs font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              <Tag size={12} className="text-[var(--color-volt-text)]" />
              <span className="text-[#ccc] font-normal">Zapa:</span>
              <span className="text-[var(--color-volt-text)] font-bold">{post.shoe}</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenido / Descripción */}
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-[#ddd] text-sm leading-relaxed m-0 mb-4 font-body">
          {post.description}
        </p>

        {/* Action Bar (Likes, Comentarios, Compartir) */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-4">
            {/* Botón Like */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleLikeClick}
              className={`px-3.5 py-2 rounded-full flex items-center gap-2 cursor-pointer font-bold text-[13px] transition-all duration-200 ${isLiked ? 'bg-[rgba(212,255,0,0.15)] border border-[var(--color-volt)] text-[var(--color-volt-text)]' : 'bg-white/5 border border-white/10 text-[#ccc] hover:bg-white/10'}`}
            >
              <Flame size={16} fill={isLiked ? "var(--color-volt)" : "none"} />
              <span>{likesCount}</span>
              <span className="text-[11px] opacity-80">🔥</span>
            </motion.button>

            {/* Botón Comentarios */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowComments(!showComments)}
              className={`px-3.5 py-2 rounded-full flex items-center gap-1.5 cursor-pointer font-semibold text-[13px] transition-all duration-200 ${showComments ? 'bg-white/10 border border-white/30 text-white' : 'bg-white/5 border border-white/10 text-[#ccc] hover:bg-white/10'}`}
            >
              <MessageCircle size={16} />
              <span>{commentsList.length}</span>
            </motion.button>
          </div>

          {/* Compartir */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            title="Compartir look"
            className="bg-transparent border border-white/10 text-[#999] w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:text-white hover:border-white/30 hover:bg-white/5"
          >
            <Share2 size={15} />
          </motion.button>
        </div>

        {/* Sección Expandible de Comentarios */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-dashed border-white/10 flex flex-col gap-3">
                <h5 className="m-0 text-xs font-bold text-[#aaa] uppercase tracking-[0.5px]">
                  Comentarios del Barrio ({commentsList.length})
                </h5>

                {/* Lista de comentarios */}
                <div className="max-h-[180px] overflow-y-auto flex flex-col gap-2.5 pr-1 custom-scrollbar">
                  {commentsList.length === 0 ? (
                    <p className="m-0 text-xs text-[#666] italic">
                      Sé el primero en comentar sobre este outfit 🔥
                    </p>
                  ) : (
                    commentsList.map((c) => (
                      <div key={c.id} className={`bg-white/5 p-2 px-3 rounded-md border-l-2 ${c.author === "Tú" ? 'border-l-[var(--color-volt)]' : 'border-l-white/20'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-bold text-xs ${c.author === "Tú" ? 'text-[var(--color-volt-text)]' : 'text-white'}`}>
                            {c.author}
                          </span>
                          <span className="text-[10px] text-[#777]">
                            {c.date || "Ahora"}
                          </span>
                        </div>
                        <p className="m-0 text-[13px] text-[#ddd] leading-snug">
                          {c.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Input de Comentario */}
                <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="Escribe tu comentario en el barrio..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-[#161616] border border-white/15 rounded-full px-3.5 py-2 text-white text-[13px] outline-none focus:border-[var(--color-volt)] transition-colors"
                  />
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.9 }}
                    disabled={!commentText.trim()}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${commentText.trim() ? 'bg-[var(--color-volt)] text-black cursor-pointer' : 'bg-[#333] text-[#666] cursor-not-allowed'}`}
                  >
                    <Send size={15} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
