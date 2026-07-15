import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Flame, Sparkles, Trash2, Search, MapPin, Tag, User, AlertCircle } from "../community/CommunityIcons";
import { useCommunityStore } from "../../store/useStore";
import { resolveAsset } from "../../utils/resolveAsset";

export default function CommunityAdmin() {
  const { posts, toggleApprove, toggleFeatured, deletePost } = useCommunityStore();
  const [filterType, setFilterType] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const isApproved = post.approved !== false;
      const matchesFilter =
        filterType === "todos" ||
        (filterType === "aprobados" && isApproved) ||
        (filterType === "pendientes" && !isApproved) ||
        (filterType === "destacados" && post.featured);

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        (post.author || "").toLowerCase().includes(query) ||
        (post.shoe || "").toLowerCase().includes(query) ||
        (post.description || "").toLowerCase().includes(query) ||
        (post.location || "").toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [posts, filterType, searchQuery]);

  const stats = useMemo(() => {
    const total = posts.length;
    const aprobados = posts.filter(p => p.approved !== false).length;
    const pendientes = posts.filter(p => p.approved === false).length;
    const destacados = posts.filter(p => p.featured).length;
    return { total, aprobados, pendientes, destacados };
  }, [posts]);

  const handleDelete = (id, authorName) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el outfit de ${authorName}?`)) {
      deletePost(id);
    }
  };

  return (
    <div>
      {/* Header Admin */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "var(--space-lg)",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <h2 className="admin-card-title" style={{ margin: 0, fontSize: "24px" }}>
            Moderación: Muro de Comunidad & Street Style
          </h2>
          <p style={{ color: "#A0A0A0", fontSize: "13px", margin: "4px 0 0 0" }}>
            Aprueba, rechaza, destaca en cabecera o elimina publicaciones OOTD de la comunidad.
          </p>
        </div>

        {/* Stats del Muro */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <div style={{
            backgroundColor: "#111",
            border: "1px solid #222",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#ccc"
          }}>
            Total: <strong style={{ color: "#fff" }}>{stats.total}</strong>
          </div>
          <div style={{
            backgroundColor: "#111",
            border: "1px solid rgba(212, 255, 0, 0.3)",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            color: "var(--color-volt)"
          }}>
            Aprobados: <strong>{stats.aprobados}</strong>
          </div>
          <div style={{
            backgroundColor: "#111",
            border: "1px solid #FFA500",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#FFA500"
          }}>
            Pendientes: <strong>{stats.pendientes}</strong>
          </div>
          <div style={{
            backgroundColor: "#111",
            border: "1px solid #222",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}>
            <Flame size={14} fill="var(--color-volt)" style={{ color: "var(--color-volt)" }} />
            Destacados: <strong>{stats.destacados}</strong>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div style={{
        backgroundColor: "#111",
        border: "1px solid #222",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "var(--space-xl)",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* Buscador */}
        <div style={{ position: "relative", flex: "1 1 280px" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
          <input
            type="text"
            placeholder="Buscar por alias, zapatilla, barrio o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              backgroundColor: "#181818",
              border: "1px solid #333",
              borderRadius: "6px",
              padding: "10px 14px 10px 36px",
              color: "#FFF",
              fontSize: "13px",
              outline: "none"
            }}
          />
        </div>

        {/* Botones de Filtro */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["todos", "aprobados", "pendientes", "destacados"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "8px 14px",
                borderRadius: "20px",
                border: filterType === type ? "1px solid var(--color-volt)" : "1px solid #333",
                color: filterType === type ? "var(--color-volt)" : "#A0A0A0",
                backgroundColor: filterType === type ? "rgba(212, 255, 0, 0.08)" : "transparent",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Publicaciones en el Muro */}
      <div style={{ display: "grid", gap: "16px" }}>
        <AnimatePresence>
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                backgroundColor: "#111",
                border: "1px dashed #333",
                padding: "32px",
                textAlign: "center",
                borderRadius: "8px",
                color: "#757575"
              }}
            >
              <AlertCircle size={32} style={{ margin: "0 auto 10px", color: "#555" }} />
              No se encontraron looks con los filtros seleccionados.
            </motion.div>
          ) : (
            filteredPosts.map((post) => {
              const isApproved = post.approved !== false;
              const authorName = post.author || post.alias || "@anon_street";
              const imageSrc = post.imageUrl || post.image || "/instagram/post 1.jpeg";

              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr auto",
                    gap: "20px",
                    alignItems: "center",
                    backgroundColor: "#111",
                    borderLeft: post.featured 
                      ? "4px solid var(--color-volt)" 
                      : isApproved 
                        ? "4px solid #333" 
                        : "4px solid #FFA500",
                    border: "1px solid #222",
                    padding: "16px 20px",
                    borderRadius: "6px"
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: "100px",
                    height: "110px",
                    borderRadius: "6px",
                    overflow: "hidden",
                    backgroundColor: "#1c1c1c",
                    position: "relative"
                  }}>
                    <img
                      src={resolveAsset(imageSrc)}
                      alt={authorName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                    {post.featured && (
                      <div style={{
                        position: "absolute",
                        top: "4px",
                        left: "4px",
                        background: "var(--color-volt)",
                        color: "#000",
                        padding: "2px 5px",
                        borderRadius: "4px",
                        fontSize: "9px",
                        fontWeight: 800
                      }}>
                        🔥
                      </div>
                    )}
                  </div>

                  {/* Info del Post */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                      <span style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>{authorName}</span>
                      <span style={{ fontSize: "12px", color: "#888", display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={12} style={{ color: "var(--color-volt)" }} /> {post.location || "Ecuador"}
                      </span>
                      <span style={{
                        fontSize: "11px",
                        backgroundColor: "#1c1c1c",
                        border: "1px solid #333",
                        color: "#aaa",
                        padding: "2px 8px",
                        borderRadius: "12px"
                      }}>
                        {post.category || "Todos"}
                      </span>

                      {/* Estado */}
                      <span style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "12px",
                        backgroundColor: isApproved ? "rgba(212, 255, 0, 0.1)" : "rgba(255, 165, 0, 0.15)",
                        color: isApproved ? "var(--color-volt)" : "#FFA500",
                        border: isApproved ? "1px solid var(--color-volt)" : "1px solid #FFA500"
                      }}>
                        {isApproved ? "Aprobado" : "Pendiente de revisión"}
                      </span>

                      {post.featured && (
                        <span style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "12px",
                          backgroundColor: "rgba(212, 255, 0, 0.2)",
                          color: "var(--color-volt)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          <Sparkles size={11} /> DESTACADO EN CABECERA
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: "13px", color: "var(--color-volt)", fontWeight: 600, marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Tag size={13} /> Zapatilla: {post.shoe || "Nike Style"}
                    </div>

                    <p style={{
                      margin: "0 0 8px 0",
                      fontSize: "13px",
                      color: "#ccc",
                      lineHeight: "1.4",
                      maxWidth: "640px"
                    }}>
                      "{post.description}"
                    </p>

                    <div style={{ fontSize: "11px", color: "#666", display: "flex", gap: "14px" }}>
                      <span>Likes: <strong>{post.likes || 0} 🔥</strong></span>
                      <span>Comentarios: <strong>{(post.comments || []).length}</strong></span>
                      <span>ID: #{post.id}</span>
                    </div>
                  </div>

                  {/* Botones de Moderación */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
                    {/* Botón Aprobar / Rechazar */}
                    <button
                      onClick={() => toggleApprove(post.id)}
                      style={{
                        backgroundColor: isApproved ? "#222" : "var(--color-volt)",
                        color: isApproved ? "#fff" : "#000",
                        border: isApproved ? "1px solid #444" : "none",
                        padding: "8px 14px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "all 0.2s"
                      }}
                    >
                      {isApproved ? (
                        <>
                          <X size={14} /> Ocultar / Rechazar
                        </>
                      ) : (
                        <>
                          <Check size={14} /> Aprobar en Muro
                        </>
                      )}
                    </button>

                    {/* Botón Destacar */}
                    <button
                      onClick={() => toggleFeatured(post.id)}
                      disabled={!isApproved}
                      style={{
                        backgroundColor: post.featured ? "rgba(212, 255, 0, 0.15)" : "transparent",
                        color: post.featured ? "var(--color-volt)" : "#aaa",
                        border: post.featured ? "1px solid var(--color-volt)" : "1px solid #333",
                        padding: "8px 14px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: isApproved ? "pointer" : "not-allowed",
                        opacity: isApproved ? 1 : 0.4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "all 0.2s"
                      }}
                    >
                      <Flame size={14} fill={post.featured ? "var(--color-volt)" : "none"} />
                      {post.featured ? "Quitar Destacado" : "Destacar en Muro"}
                    </button>

                    {/* Botón Eliminar */}
                    <button
                      onClick={() => handleDelete(post.id, authorName)}
                      style={{
                        backgroundColor: "transparent",
                        color: "#ff4d4f",
                        border: "1px solid rgba(255, 77, 79, 0.3)",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "all 0.2s"
                      }}
                    >
                      <Trash2 size={13} /> Eliminar
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
