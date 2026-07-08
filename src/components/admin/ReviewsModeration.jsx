import { useState } from "react";
import { useReviewsStore } from "../../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewsModeration() {
  const { reviews, approveReview, deleteReview } = useReviewsStore();
  const [filterType, setFilterType] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReviews = reviews.filter(rev => {
    const matchesFilter = 
      filterType === "todos" ||
      (filterType === "aprobadas" && rev.approved) ||
      (filterType === "pendientes" && !rev.approved);
    
    const matchesSearch = 
      rev.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexWrap: "wrap", gap: "12px" }}>
        <h2 className="admin-card-title" style={{ margin: 0 }}>Moderación de Reseñas</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["todos", "aprobadas", "pendientes"].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className="btn btn--secondary"
              style={{
                fontSize: "var(--type-caption)",
                padding: "6px 12px",
                borderRadius: "20px",
                border: filterType === type ? "1px solid var(--color-volt)" : "1px solid #333",
                color: filterType === type ? "var(--color-volt)" : "#A0A0A0",
                backgroundColor: filterType === type ? "rgba(212, 255, 0, 0.05)" : "transparent"
              }}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "var(--space-md)" }}>
        <input 
          type="text" 
          placeholder="Buscar por producto, cliente o contenido de comentario..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            backgroundColor: "#111",
            border: "1px solid #222",
            borderRadius: "4px",
            padding: "10px 14px",
            color: "#FFF",
            outline: "none"
          }}
        />
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        <AnimatePresence>
          {filteredReviews.length === 0 ? (
            <div className="admin-card" style={{ padding: "24px", textAlign: "center", color: "#757575" }}>
              No se encontraron reseñas.
            </div>
          ) : (
            filteredReviews.map(rev => (
              <motion.div
                key={rev.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="admin-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  borderLeft: rev.approved ? "4px solid var(--color-volt)" : "4px solid #FFA500",
                  backgroundColor: "#111",
                  padding: "20px",
                  borderRadius: "4px",
                  border: "1px solid #222"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "16px", color: "#FFF", fontWeight: 600 }}>{rev.productName}</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px", fontSize: "12px", color: "#A0A0A0" }}>
                      <span>Por: <strong>{rev.customerName}</strong></span>
                      <span>•</span>
                      <span>Fecha: {rev.date}</span>
                    </div>
                  </div>
                  
                  {/* Rating Stars */}
                  <div style={{ display: "flex", gap: "2px", color: "var(--color-volt)" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={i < rev.rating ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>

                <p style={{ margin: "10px 0", color: "#E0E0E0", fontSize: "14px", lineHeight: 1.5 }}>
                  "{rev.comment}"
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", borderTop: "1px solid #1A1A1A", paddingTop: "12px" }}>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: rev.approved ? "var(--color-volt)" : "#FFA500",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: rev.approved ? "var(--color-volt)" : "#FFA500" }}></span>
                    {rev.approved ? "Aprobada" : "Pendiente de Moderación"}
                  </span>
                  
                  <div style={{ display: "flex", gap: "10px" }}>
                    {!rev.approved && (
                      <button
                        onClick={() => approveReview(rev.id)}
                        className="btn btn--secondary btn--sm"
                        style={{ borderColor: "var(--color-volt)", color: "var(--color-volt)", backgroundColor: "rgba(212,255,0,0.05)", fontSize: "12px" }}
                      >
                        Aprobar
                      </button>
                    )}
                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="btn btn--secondary btn--sm"
                      style={{ borderColor: "#D30005", color: "#FFF", backgroundColor: "rgba(211,0,5,0.15)", fontSize: "12px" }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
