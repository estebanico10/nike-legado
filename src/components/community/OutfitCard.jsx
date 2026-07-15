import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, MapPin, Flame, Send, Sparkles, Tag } from "./CommunityIcons";
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
      style={{
        backgroundColor: "rgba(18, 18, 18, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: post.featured ? "1px solid rgba(212, 255, 0, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: post.featured 
          ? "0 12px 36px rgba(212, 255, 0, 0.08), 0 4px 12px rgba(0,0,0,0.4)" 
          : "0 10px 30px rgba(0,0,0,0.3)",
        position: "relative",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease"
      }}
      whileHover={{
        y: -4,
        borderColor: post.featured ? "rgba(212, 255, 0, 0.7)" : "rgba(255, 255, 255, 0.2)"
      }}
    >
      {/* Header del Post */}
      <div style={{
        padding: "var(--space-md) var(--space-lg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: post.featured 
              ? "linear-gradient(135deg, var(--color-volt), #111)" 
              : "linear-gradient(135deg, #333, #1a1a1a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: post.featured ? "#000" : "#fff",
            fontWeight: 800,
            fontSize: "14px",
            border: post.featured ? "2px solid var(--color-volt)" : "1px solid rgba(255,255,255,0.15)"
          }}>
            {authorName.replace("@", "").charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <span style={{ fontWeight: 700, color: "#fff", fontSize: "14px", letterSpacing: "0.3px" }}>
                {authorName}
              </span>
              {post.featured && (
                <span title="Destacado por Nike Legado" style={{ color: "var(--color-volt)", display: "flex" }}>
                  <Sparkles size={14} />
                </span>
              )}
            </div>
            {post.location && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "#999",
                fontSize: "12px",
                marginTop: "2px"
              }}>
                <MapPin size={12} style={{ color: "var(--color-volt)" }} />
                <span>{post.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Badge Destacado */}
        {post.featured && (
          <span style={{
            backgroundColor: "rgba(212, 255, 0, 0.15)",
            color: "var(--color-volt)",
            border: "1px solid var(--color-volt)",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "10px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}>
            <Flame size={12} fill="var(--color-volt)" /> Destacado
          </span>
        )}
      </div>

      {/* Imagen del Look */}
      <div style={{
        position: "relative",
        width: "100%",
        paddingTop: "115%",
        backgroundColor: "#0d0d0d",
        overflow: "hidden"
      }}>
        <motion.img
          src={resolveAsset(imageSrc)}
          alt={`Look de ${authorName} - ${post.shoe || "Nike Style"}`}
          loading="lazy"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block"
          }}
        />

        {/* Gradiente inferior en imagen */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
          pointerEvents: "none"
        }} />

        {/* Zapatilla Nike Llevada Tag */}
        {post.shoe && (
          <div style={{
            position: "absolute",
            bottom: "14px",
            left: "14px",
            right: "14px",
            display: "flex",
            alignItems: "center"
          }}>
            <div style={{
              backgroundColor: "rgba(10, 10, 10, 0.85)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              padding: "6px 12px",
              borderRadius: "30px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
            }}>
              <Tag size={12} style={{ color: "var(--color-volt)" }} />
              <span style={{ color: "#ccc", fontWeight: 400 }}>Zapa:</span>
              <span style={{ color: "var(--color-volt)", fontWeight: 700 }}>{post.shoe}</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenido / Descripción */}
      <div style={{ padding: "var(--space-lg)", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{
          color: "#ddd",
          fontSize: "14px",
          lineHeight: "1.5",
          margin: "0 0 var(--space-md) 0",
          fontFamily: "var(--font-body)"
        }}>
          {post.description}
        </p>

        {/* Action Bar (Likes, Comentarios, Compartir) */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "var(--space-sm)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          marginTop: "auto"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Botón Like */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleLikeClick}
              style={{
                background: isLiked ? "rgba(212, 255, 0, 0.15)" : "rgba(255, 255, 255, 0.04)",
                border: isLiked ? "1px solid var(--color-volt)" : "1px solid rgba(255, 255, 255, 0.1)",
                color: isLiked ? "var(--color-volt)" : "#ccc",
                padding: "8px 14px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "13px",
                transition: "all 0.2s ease"
              }}
            >
              <Flame size={16} fill={isLiked ? "var(--color-volt)" : "none"} />
              <span>{likesCount}</span>
              <span style={{ fontSize: "11px", opacity: 0.8 }}>🔥</span>
            </motion.button>

            {/* Botón Comentarios */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowComments(!showComments)}
              style={{
                background: showComments ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.04)",
                border: showComments ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)",
                color: showComments ? "#fff" : "#ccc",
                padding: "8px 14px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
                transition: "all 0.2s ease"
              }}
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
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#999",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
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
              style={{ overflow: "hidden" }}
            >
              <div style={{
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px dashed rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <h5 style={{
                  margin: 0,
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#aaa",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Comentarios del Barrio ({commentsList.length})
                </h5>

                {/* Lista de comentarios */}
                <div style={{
                  maxHeight: "180px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  paddingRight: "4px"
                }}>
                  {commentsList.length === 0 ? (
                    <p style={{ margin: 0, fontSize: "12px", color: "#666", fontStyle: "italic" }}>
                      Sé el primero en comentar sobre este outfit 🔥
                    </p>
                  ) : (
                    commentsList.map((c) => (
                      <div key={c.id} style={{
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        borderLeft: c.author === "Tú" ? "2px solid var(--color-volt)" : "2px solid rgba(255,255,255,0.2)"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                          <span style={{
                            fontWeight: 700,
                            fontSize: "12px",
                            color: c.author === "Tú" ? "var(--color-volt)" : "#fff"
                          }}>
                            {c.author}
                          </span>
                          <span style={{ fontSize: "10px", color: "#777" }}>
                            {c.date || "Ahora"}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: "13px", color: "#ddd", lineHeight: "1.4" }}>
                          {c.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Input de Comentario */}
                <form onSubmit={handleCommentSubmit} style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <input
                    type="text"
                    placeholder="Escribe tu comentario en el barrio..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    style={{
                      flex: 1,
                      backgroundColor: "#161616",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "20px",
                      padding: "8px 14px",
                      color: "#fff",
                      fontSize: "13px",
                      outline: "none"
                    }}
                  />
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.9 }}
                    disabled={!commentText.trim()}
                    style={{
                      backgroundColor: commentText.trim() ? "var(--color-volt)" : "#333",
                      color: commentText.trim() ? "#000" : "#666",
                      border: "none",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: commentText.trim() ? "pointer" : "not-allowed",
                      transition: "all 0.2s ease"
                    }}
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
