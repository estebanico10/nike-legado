import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Sparkles, ImageIcon, MapPin, User, Tag, Check } from "./CommunityIcons";
import { useCommunityStore, useLoyaltyStore } from "../../store/useStore";
import { useToast } from "../../context/ToastContext";
import { resolveAsset } from "../../utils/resolveAsset";

const SAMPLE_IMAGES = [
  { label: "Campus Volt", url: "/instagram/post 1.jpeg" },
  { label: "Inca Heritage", url: "/instagram/post 2.jpeg" },
  { label: "Pegasus City", url: "/instagram/post 3.jpeg" },
  { label: "Air Max 90", url: "/instagram/post 4.jpeg" },
  { label: "Dunk Panda", url: "/instagram/post 5.jpeg" },
  { label: "Vaporfly Race", url: "/instagram/post 6.jpeg" },
  { label: "Urban Streetwear", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000" }
];

const CATEGORIES = ["Air Max", "Dunks", "Running", "Lifestyle", "Todos"];

export default function UploadOutfitModal({ isOpen, onClose }) {
  const [alias, setAlias] = useState("");
  const [barrio, setBarrio] = useState("");
  const [shoe, setShoe] = useState("");
  const [category, setCategory] = useState("Air Max");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("/instagram/post 1.jpeg");
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!alias.trim() || !shoe.trim() || !description.trim() || !imageUrl.trim()) {
      try {
        addToast("Por favor completa los campos principales", "warning");
      } catch {
        // ignore
      }
      return;
    }

    // 1. Agregar post al store
    useCommunityStore.getState().addPost({
      author: alias.startsWith("@") ? alias.trim() : `@${alias.trim()}`,
      location: barrio.trim() || "Ecuador — Street Style",
      shoe: shoe.trim(),
      category: category || "Todos",
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      date: "Ahora mismo"
    });

    // 2. Otorgar +150 Street Cred
    useLoyaltyStore.getState().addPoints(150, "Subir Look al Muro de Comunidad");

    // 3. Notificación de éxito
    try {
      addToast("+150 PTS Street Cred ganados por compartir tu look 🔥", "success");
    } catch {
      // ignore
    }

    // 4. Reset & Cerrar
    setAlias("");
    setBarrio("");
    setShoe("");
    setDescription("");
    setImageUrl("/instagram/post 1.jpeg");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-md)"
      }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.82)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)"
          }}
        />

        {/* Modal Contenido */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "560px",
            maxHeight: "90vh",
            overflowY: "auto",
            backgroundColor: "#111111",
            border: "1px solid rgba(212, 255, 0, 0.3)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-2xl)",
            boxShadow: "0 24px 64px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 255, 0, 0.08)",
            color: "#fff"
          }}
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#aaa",
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
            <X size={18} />
          </button>

          {/* Header */}
          <div style={{ marginBottom: "var(--space-xl)" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "rgba(212, 255, 0, 0.12)",
              color: "var(--color-volt)",
              border: "1px solid var(--color-volt)",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "12px"
            }}>
              <Sparkles size={14} /> Recompensa: +150 PTS Street Cred
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "-0.5px",
              margin: 0,
              color: "#fff"
            }}>
              SUBIR OUTFIT AL MURO
            </h2>
            <p style={{ color: "#aaa", fontSize: "13px", marginTop: "4px", marginBottom: 0 }}>
              Comparte tu estilo con la comunidad del barrio. Inspira y gana puntos canjeables en la tienda.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Alias / Nombre */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#ccc", textTransform: "uppercase", marginBottom: "6px" }}>
                <User size={14} style={{ color: "var(--color-volt)" }} /> Alias / Usuario Instagram *
              </label>
              <input
                type="text"
                placeholder="ej. @carlos_snkrs"
                required
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>

            {/* Barrio / Ciudad */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#ccc", textTransform: "uppercase", marginBottom: "6px" }}>
                <MapPin size={14} style={{ color: "var(--color-volt)" }} /> Barrio / Ciudad *
              </label>
              <input
                type="text"
                placeholder="ej. Quito Sur — UNEMI Campus"
                required
                value={barrio}
                onChange={(e) => setBarrio(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>

            {/* Zapatilla Nike y Categoría */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "12px" }}>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#ccc", textTransform: "uppercase", marginBottom: "6px" }}>
                  <Tag size={14} style={{ color: "var(--color-volt)" }} /> Zapatilla Nike llevada *
                </label>
                <input
                  type="text"
                  placeholder="ej. Air Max Pulse Volt"
                  required
                  value={shoe}
                  onChange={(e) => setShoe(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#ccc", textTransform: "uppercase", marginBottom: "6px" }}>
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    padding: "12px 10px",
                    color: "#fff",
                    fontSize: "13px",
                    outline: "none"
                  }}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descripción del Estilo */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#ccc", textTransform: "uppercase", marginBottom: "6px" }}>
                Descripción del Estilo *
              </label>
              <textarea
                rows={3}
                placeholder="OOTD universitario combinando la herencia urbana con cargo pants..."
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical"
                }}
              />
            </div>

            {/* Image URL Input */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#ccc", textTransform: "uppercase", marginBottom: "6px" }}>
                <ImageIcon size={14} style={{ color: "var(--color-volt)" }} /> URL o Ruta de Imagen de Look *
              </label>
              <input
                type="text"
                placeholder="ej. /instagram/post 1.jpeg o https://..."
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  color: "#fff",
                  fontSize: "13px",
                  outline: "none",
                  marginBottom: "8px"
                }}
              />

              {/* Quick Demo Selector */}
              <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>
                Selección rápida de demostración:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                {SAMPLE_IMAGES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(sample.url)}
                    style={{
                      background: imageUrl === sample.url ? "rgba(212, 255, 0, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      border: imageUrl === sample.url ? "1px solid var(--color-volt)" : "1px solid rgba(255, 255, 255, 0.1)",
                      color: imageUrl === sample.url ? "var(--color-volt)" : "#ccc",
                      padding: "5px 10px",
                      borderRadius: "15px",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {imageUrl === sample.url && <Check size={11} />}
                    {sample.label}
                  </button>
                ))}
              </div>

              {/* Preview de la imagen */}
              {imageUrl && (
                <div style={{
                  width: "100%",
                  height: "160px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #333",
                  position: "relative",
                  backgroundColor: "#080808"
                }}>
                  <img
                    src={resolveAsset(imageUrl)}
                    alt="Preview de Outfit"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: "6px",
                    right: "6px",
                    background: "rgba(0,0,0,0.7)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    color: "#fff"
                  }}>
                    Vista previa
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                marginTop: "8px",
                padding: "16px",
                backgroundColor: "var(--color-volt)",
                color: "#000",
                border: "none",
                borderRadius: "30px",
                fontFamily: "var(--font-display)",
                fontSize: "16px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 8px 24px rgba(212, 255, 0, 0.25)"
              }}
            >
              <Upload size={18} /> PUBLICAR EN EL MURO (+150 PTS)
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
