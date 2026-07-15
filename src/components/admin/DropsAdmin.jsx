import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveAsset } from "../../utils/resolveAsset";
import "../../admin.css";

const INITIAL_DROPS = [
  {
    id: "drop-barrio",
    title: 'Nike Air Max Plus "Barrio Drop"',
    price: 199.99,
    stock: 45,
    releaseDate: new Date(Date.now() - 5000).toISOString(),
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    description: "Edición exclusiva inspirada en el asfalto y la energía callejera del sur de Quito y Guayaquil. Detalles reflectantes 3M y cápsula Tuned Air en tono Volt.",
  },
  {
    id: "drop-inca",
    title: 'Nike Dunk High "Inca Heritage"',
    price: 189.99,
    stock: 30,
    releaseDate: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    description: "Tributo textil andino con gamuza premium de primera flor, patrones precolombinos grabados con láser y suela de caucho reciclado de alta tracción.",
  },
  {
    id: "drop-cotopaxi",
    title: 'Air Jordan 4 Retro "Cotopaxi Eruption"',
    price: 229.99,
    stock: 25,
    releaseDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    description: "Inspirada en el coloso andino con nubuck gris ceniza, acentos en naranja magmático y malla balística. Una obra maestra de coleccionista.",
  },
];

export default function DropsAdmin() {
  const { addToast } = useToast();
  const [drops, setDrops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    releaseDate: "",
    image: "",
    description: "",
  });

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
      localStorage.setItem("site_drops", JSON.stringify(INITIAL_DROPS));
      setDrops(INITIAL_DROPS);
    } catch (err) {
      console.error("Error loading drops:", err);
      setDrops(INITIAL_DROPS);
    }
  };

  useEffect(() => {
    loadDrops();
  }, []);

  const saveToLocalStorageAndSync = (updatedList) => {
    setDrops(updatedList);
    try {
      localStorage.setItem("site_drops", JSON.stringify(updatedList));
      window.dispatchEvent(new Event("site_drops_updated"));
    } catch (err) {
      console.error("Error saving drops:", err);
      addToast("Error al guardar en localStorage", "error");
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    const defaultDate = new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 16);
    setFormData({
      title: "",
      price: "199.99",
      stock: "50",
      releaseDate: defaultDate,
      image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      description: "Edición limitada especial de Nike Legado. Cuenta con tecnología avanzada y diseño streetwear exclusivo.",
    });
    setShowForm(true);
  };

  const handleEdit = (drop) => {
    setEditingId(drop.id);
    let dateStr = "";
    if (drop.releaseDate) {
      try {
        dateStr = new Date(drop.releaseDate).toISOString().slice(0, 16);
      } catch (e) {
        dateStr = new Date().toISOString().slice(0, 16);
      }
    } else {
      dateStr = new Date().toISOString().slice(0, 16);
    }

    setFormData({
      title: drop.title || "",
      price: drop.price !== undefined ? drop.price.toString() : "199.99",
      stock: drop.stock !== undefined ? drop.stock.toString() : "50",
      releaseDate: dateStr,
      image: drop.image || "",
      description: drop.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este SNKRS Drop?")) return;
    const updated = drops.filter((d) => d.id !== id);
    saveToLocalStorageAndSync(updated);
    addToast("Drop eliminado correctamente", "info");
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast("El título del drop es obligatorio", "warning");
      return;
    }

    const priceNum = parseFloat(formData.price) || 199.99;
    const stockNum = parseInt(formData.stock, 10) || 0;
    const isoDate = formData.releaseDate ? new Date(formData.releaseDate).toISOString() : new Date().toISOString();

    if (editingId) {
      const updated = drops.map((d) =>
        d.id === editingId
          ? {
              ...d,
              title: formData.title.trim(),
              price: priceNum,
              stock: stockNum,
              releaseDate: isoDate,
              image: formData.image.trim(),
              description: formData.description.trim(),
            }
          : d
      );
      saveToLocalStorageAndSync(updated);
      addToast("¡Drop actualizado con éxito!", "success");
    } else {
      const newDrop = {
        id: `drop-${Date.now()}`,
        title: formData.title.trim(),
        price: priceNum,
        stock: stockNum,
        releaseDate: isoDate,
        image: formData.image.trim(),
        description: formData.description.trim(),
      };
      saveToLocalStorageAndSync([newDrop, ...drops]);
      addToast("¡Nuevo SNKRS Drop creado!", "success");
    }

    setShowForm(false);
    setEditingId(null);
  };

  const handleQuickReleasePreset = (hoursOffset) => {
    const targetDate = new Date(Date.now() + hoursOffset * 3600 * 1000);
    setFormData((prev) => ({
      ...prev,
      releaseDate: targetDate.toISOString().slice(0, 16),
    }));
  };

  return (
    <div style={{ color: "#FFFFFF" }}>
      {/* Header and Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-xl)",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h2 className="admin-card-title" style={{ marginBottom: "4px" }}>
            SNKRS Drops & Fila Virtual
          </h2>
          <span style={{ fontSize: "13px", color: "var(--color-ink-soft)" }}>
            Administra lanzamientos exclusivos, temporizadores y sorteos en vivo
          </span>
        </div>
        {!showForm && (
          <button onClick={handleOpenNew} className="btn btn--volt">
            + Nuevo SNKRS Drop
          </button>
        )}
      </div>

      {/* Form Section */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginBottom: "32px" }}
          >
            <form
              onSubmit={handleSave}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(206, 255, 0, 0.3)",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", textTransform: "uppercase", color: "var(--color-volt)", margin: 0 }}>
                  {editingId ? "Editar SNKRS Drop" : "Crear Nuevo SNKRS Drop"}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ background: "transparent", border: "none", color: "#AAAAAA", cursor: "pointer" }}
                >
                  ✕ Cerrar
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px", color: "#CCCCCC" }}>
                    Título del Drop
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej. Nike Air Max Plus Barrio Drop"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      backgroundColor: "#161616",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "6px",
                      color: "#FFFFFF",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px", color: "#CCCCCC" }}>
                    Precio ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="199.99"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      backgroundColor: "#161616",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "6px",
                      color: "#FFFFFF",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px", color: "#CCCCCC" }}>
                    Stock Total (Pares)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="45"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      backgroundColor: "#161616",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "6px",
                      color: "#FFFFFF",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px", color: "#CCCCCC" }}>
                    Fecha y Hora de Apertura
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      backgroundColor: "#161616",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "6px",
                      color: "#FFFFFF",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => handleQuickReleasePreset(-0.01)}
                      style={{ padding: "4px 8px", fontSize: "11px", backgroundColor: "var(--color-volt)", color: "#111", border: "none", borderRadius: "4px", fontWeight: 700, cursor: "pointer" }}
                    >
                      🚀 Ahora (En Vivo)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickReleasePreset(2)}
                      style={{ padding: "4px 8px", fontSize: "11px", backgroundColor: "rgba(255,255,255,0.1)", color: "#FFF", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      ⏳ +2 Horas
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickReleasePreset(24)}
                      style={{ padding: "4px 8px", fontSize: "11px", backgroundColor: "rgba(255,255,255,0.1)", color: "#FFF", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      📅 Mañana (+24h)
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px", color: "#CCCCCC" }}>
                  URL de Imagen del Drop
                </label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    backgroundColor: "#161616",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "6px",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-body)",
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px", color: "#CCCCCC" }}>
                  Descripción de la Edición
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre materiales, inspiración e historia del drop..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    backgroundColor: "#161616",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "6px",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-body)",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button type="submit" className="btn btn--volt">
                  {editingId ? "Actualizar Drop" : "Guardar Nuevo Drop"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn--secondary"
                  style={{ borderColor: "rgba(255,255,255,0.2)", color: "#CCCCCC" }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drops Table / Cards List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {drops.map((drop) => {
          const targetTime = drop.releaseDate ? new Date(drop.releaseDate).getTime() : 0;
          const isLive = targetTime <= Date.now();

          return (
            <div
              key={drop.id}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: isLive ? "1px solid rgba(206, 255, 0, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", gap: "14px", marginBottom: "14px" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "6px",
                      overflow: "hidden",
                      backgroundColor: "#1A1A1A",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={resolveAsset(drop.image)}
                      alt={drop.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "3px 6px",
                          borderRadius: "4px",
                          backgroundColor: isLive ? "var(--color-volt)" : "rgba(255,255,255,0.1)",
                          color: isLive ? "#111111" : "#CCCCCC",
                        }}
                      >
                        {isLive ? "🔥 ACTIVO (EN VIVO)" : "⏳ PROGRAMADO"}
                      </span>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-volt)" }}>
                        ${typeof drop.price === "number" ? drop.price.toFixed(2) : drop.price || "199.99"}
                      </span>
                    </div>
                    <h4
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "16px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        margin: "6px 0 4px",
                        lineHeight: 1.2,
                      }}
                    >
                      {drop.title}
                    </h4>
                    <span style={{ fontSize: "12px", color: "var(--color-ink-soft)" }}>
                      Stock total: <strong style={{ color: "#FFF" }}>{drop.stock || 0} pares</strong>
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "8px 10px",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#CCCCCC",
                    marginBottom: "16px",
                  }}
                >
                  <strong>Fecha apertura:</strong>{" "}
                  {drop.releaseDate ? new Date(drop.releaseDate).toLocaleString() : "No especificada"}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
                <button
                  onClick={() => handleEdit(drop)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(drop.id)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "rgba(211, 0, 5, 0.2)",
                    color: "#FF6B6B",
                    border: "1px solid rgba(211,0,5,0.4)",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
