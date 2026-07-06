import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emptyProduct = {
  nombre: "",
  categoria: "Arcade",
  tipo: "camiseta",
  precio: 0,
  enOferta: false,
  precioOferta: 0,
  esNuevo: true,
  stock: 0,
  descripcion: "",
  colores: [],
  imagenes: [],
};

export default function ProductForm({ initial, categorias, tiposProducto, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { ...emptyProduct });
  const [newColor, setNewColor] = useState("#111111");
  const [newImage, setNewImage] = useState("");

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const addColor = () => {
    if (newColor && !form.colores.includes(newColor)) {
      set("colores", [...form.colores, newColor]);
      setNewColor("#111111");
    }
  };

  const removeColor = (c) => set("colores", form.colores.filter((x) => x !== c));

  const addImage = () => {
    if (newImage.trim()) {
      set("imagenes", [...form.imagenes, newImage.trim()]);
      setNewImage("");
    }
  };

  const removeImage = (i) =>
    set(
      "imagenes",
      form.imagenes.filter((_, idx) => idx !== i)
    );

  const moveImage = (from, to) => {
    if (to < 0 || to >= form.imagenes.length) return;
    const arr = [...form.imagenes];
    [arr[from], arr[to]] = [arr[to], arr[from]];
    set("imagenes", arr);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    onSave({
      ...form,
      precio: parseFloat(form.precio) || 0,
      precioOferta: form.enOferta ? parseFloat(form.precioOferta) || 0 : undefined,
      stock: parseInt(form.stock) || 0,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "var(--space-lg)",
        padding: "var(--space-xl)",
        backgroundColor: "#0D0D0D",
        border: "1px solid #222",
        borderRadius: "var(--radius-md)",
      }}
      className="admin-form-grid"
    >
      <div style={{ gridColumn: "1 / -1" }}>
        <label className="admin-label">Nombre del Producto</label>
        <input className="admin-input" type="text" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="HOODIE PIXEL QUITO 16-BIT" required />
      </div>

      <div>
        <label className="admin-label">Categoría</label>
        <select className="admin-select" value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
          {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="admin-label">Tipo de Producto</label>
        <select className="admin-select" value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>
          {tiposProducto.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
      </div>

      <div>
        <label className="admin-label">Precio Regular ($)</label>
        <input className="admin-input" type="number" min="0" step="0.01" value={form.precio} onChange={(e) => set("precio", e.target.value)} />
      </div>

      <div>
        <label className="admin-label">Stock Disponible</label>
        <input className="admin-input" type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
      </div>

      <div style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
          <input className="admin-checkbox" type="checkbox" id="enOferta" checked={form.enOferta} onChange={(e) => set("enOferta", e.target.checked)} />
          <label htmlFor="enOferta" style={{ fontSize: "var(--type-body-sm)", color: "#F5F5F5", cursor: "pointer" }}>En Oferta</label>
        </div>
        <AnimatePresence>
          {form.enOferta && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
              <label className="admin-label" style={{ marginTop: "var(--space-sm)" }}>Precio de Oferta ($)</label>
              <input className="admin-input" type="number" min="0" step="0.01" value={form.precioOferta} onChange={(e) => set("precioOferta", e.target.value)} style={{ maxWidth: "240px" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
          <input className="admin-checkbox" type="checkbox" id="esNuevo" checked={form.esNuevo} onChange={(e) => set("esNuevo", e.target.checked)} />
          <label htmlFor="esNuevo" style={{ fontSize: "var(--type-body-sm)", color: "#F5F5F5", cursor: "pointer" }}>Marcar como Nuevo</label>
        </div>
      </div>

      <div style={{ gridColumn: "1 / -1" }}>
        <label className="admin-label">Descripción</label>
        <textarea className="admin-textarea" value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} placeholder="Descripción detallada del producto..." />
      </div>

      <div style={{ gridColumn: "1 / -1" }}>
        <label className="admin-label">Colores Disponibles</label>
        <div style={{ display: "flex", gap: "var(--space-xs)", flexWrap: "wrap", marginBottom: "var(--space-sm)" }}>
          {form.colores.map((c) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", padding: "var(--space-2xs) var(--space-sm)", backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "var(--radius-md)" }}>
              <span style={{ width: "16px", height: "16px", backgroundColor: c, border: "1px solid #555" }} />
              <span style={{ fontFamily: "monospace", fontSize: "var(--type-caption)", color: "#A0A0A0" }}>{c}</span>
              <button type="button" onClick={() => removeColor(c)} style={{ fontSize: "var(--type-body-sm)", color: "#D30005", padding: "0 4px", cursor: "pointer" }}>×</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "var(--space-xs)", alignItems: "center" }}>
          <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} style={{ width: "36px", height: "36px", padding: "2px", backgroundColor: "#1A1A1A", border: "1px solid #333", cursor: "pointer" }} />
          <input className="admin-input" type="text" value={newColor} onChange={(e) => setNewColor(e.target.value)} style={{ maxWidth: "120px", fontFamily: "monospace" }} />
          <button type="button" className="btn btn--secondary btn--sm" onClick={addColor} style={{ color: "#F5F5F5", borderColor: "#555" }}>+ Color</button>
        </div>
      </div>

      <div style={{ gridColumn: "1 / -1" }}>
        <label className="admin-label">Imágenes <span style={{ fontWeight: 400, marginLeft: "var(--space-xs)" }}>— La primera imagen se asigna como portada</span></label>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", marginBottom: "var(--space-sm)" }}>
          {form.imagenes.map((img, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", padding: "var(--space-xs) var(--space-sm)", backgroundColor: "#1A1A1A", border: i === 0 ? "1px solid var(--color-volt)" : "1px solid #333", borderRadius: "var(--radius-md)" }}>
              {i === 0 && <span style={{ fontSize: "var(--type-micro)", fontWeight: 600, padding: "2px 6px", backgroundColor: "var(--color-volt)", color: "#111111", flexShrink: 0 }}>PORTADA</span>}
              <span style={{ flex: 1, fontSize: "var(--type-caption)", color: "#A0A0A0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img}</span>
              <div style={{ display: "flex", gap: "var(--space-2xs)" }}>
                <button type="button" onClick={() => moveImage(i, i - 1)} disabled={i === 0} style={{ color: i === 0 ? "#333" : "#A0A0A0", cursor: i === 0 ? "default" : "pointer" }}>↑</button>
                <button type="button" onClick={() => moveImage(i, i + 1)} disabled={i === form.imagenes.length - 1} style={{ color: i === form.imagenes.length - 1 ? "#333" : "#A0A0A0", cursor: i === form.imagenes.length - 1 ? "default" : "pointer" }}>↓</button>
                <button type="button" onClick={() => removeImage(i)} style={{ color: "#D30005", cursor: "pointer" }}>×</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "var(--space-xs)" }}>
          <input className="admin-input" type="text" value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="/assets/products/nombre-imagen.webp" />
          <button type="button" className="btn btn--secondary btn--sm" onClick={addImage} style={{ color: "#F5F5F5", borderColor: "#555", whiteSpace: "nowrap" }}>+ Imagen</button>
        </div>
      </div>

      <div style={{ gridColumn: "1 / -1", display: "flex", gap: "var(--space-md)", justifyContent: "flex-end", paddingTop: "var(--space-md)", borderTop: "1px solid #222" }}>
        <button type="button" className="btn btn--secondary btn--sm" onClick={onCancel} style={{ color: "#A0A0A0", borderColor: "#333" }}>Cancelar</button>
        <button type="submit" className="btn btn--volt btn--sm">{initial ? "Guardar Cambios" : "Crear Producto"}</button>
      </div>

      <style>{`@media (max-width: 599px) { .admin-form-grid { grid-template-columns: 1fr !important; } }`}</style>
    </motion.form>
  );
}
