import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../context/ProductContext";
import TeamAdmin from "../components/admin/TeamAdmin";
import HomeAdmin from "../components/admin/HomeAdmin";
import SalesDashboard from "../components/admin/SalesDashboard";
import { resolveAsset } from "../utils/resolveAsset";

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

function ProductForm({ initial, categorias, tiposProducto, onSave, onCancel }) {
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
      {/* Nombre — full width */}
      <div style={{ gridColumn: "1 / -1" }}>
        <label className="admin-label">Nombre del Producto</label>
        <input
          className="admin-input"
          type="text"
          value={form.nombre}
          onChange={(e) => set("nombre", e.target.value)}
          placeholder="HOODIE PIXEL QUITO 16-BIT"
          required
        />
      </div>

      {/* Categoría */}
      <div>
        <label className="admin-label">Categoría</label>
        <select
          className="admin-select"
          value={form.categoria}
          onChange={(e) => set("categoria", e.target.value)}
        >
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Tipo */}
      <div>
        <label className="admin-label">Tipo de Producto</label>
        <select
          className="admin-select"
          value={form.tipo}
          onChange={(e) => set("tipo", e.target.value)}
        >
          {tiposProducto.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Precio */}
      <div>
        <label className="admin-label">Precio Regular ($)</label>
        <input
          className="admin-input"
          type="number"
          min="0"
          step="0.01"
          value={form.precio}
          onChange={(e) => set("precio", e.target.value)}
        />
      </div>

      {/* Stock */}
      <div>
        <label className="admin-label">Stock Disponible</label>
        <input
          className="admin-input"
          type="number"
          min="0"
          value={form.stock}
          onChange={(e) => set("stock", e.target.value)}
        />
      </div>

      {/* En Oferta + Precio Oferta */}
      <div style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
          <input
            className="admin-checkbox"
            type="checkbox"
            id="enOferta"
            checked={form.enOferta}
            onChange={(e) => set("enOferta", e.target.checked)}
          />
          <label htmlFor="enOferta" style={{ fontSize: "var(--type-body-sm)", color: "#F5F5F5", cursor: "pointer" }}>
            En Oferta
          </label>
        </div>

        <AnimatePresence>
          {form.enOferta && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
              style={{ overflow: "hidden" }}
            >
              <label className="admin-label" style={{ marginTop: "var(--space-sm)" }}>
                Precio de Oferta ($)
              </label>
              <input
                className="admin-input"
                type="number"
                min="0"
                step="0.01"
                value={form.precioOferta}
                onChange={(e) => set("precioOferta", e.target.value)}
                style={{ maxWidth: "240px" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Es Nuevo */}
      <div style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
          <input
            className="admin-checkbox"
            type="checkbox"
            id="esNuevo"
            checked={form.esNuevo}
            onChange={(e) => set("esNuevo", e.target.checked)}
          />
          <label htmlFor="esNuevo" style={{ fontSize: "var(--type-body-sm)", color: "#F5F5F5", cursor: "pointer" }}>
            Marcar como Nuevo
          </label>
        </div>
      </div>

      {/* Descripción */}
      <div style={{ gridColumn: "1 / -1" }}>
        <label className="admin-label">Descripción</label>
        <textarea
          className="admin-textarea"
          value={form.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
          placeholder="Descripción detallada del producto..."
        />
      </div>

      {/* Colores */}
      <div style={{ gridColumn: "1 / -1" }}>
        <label className="admin-label">Colores Disponibles</label>
        <div style={{ display: "flex", gap: "var(--space-xs)", flexWrap: "wrap", marginBottom: "var(--space-sm)" }}>
          {form.colores.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-xs)",
                padding: "var(--space-2xs) var(--space-sm)",
                backgroundColor: "#1A1A1A",
                border: "1px solid #333",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: c,
                  border: "1px solid #555",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontFamily: "monospace", fontSize: "var(--type-caption)", color: "#A0A0A0" }}>
                {c}
              </span>
              <button
                type="button"
                onClick={() => removeColor(c)}
                style={{ fontSize: "var(--type-body-sm)", color: "#D30005", padding: "0 4px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "var(--space-xs)", alignItems: "center" }}>
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            style={{
              width: "36px",
              height: "36px",
              padding: "2px",
              backgroundColor: "#1A1A1A",
              border: "1px solid #333",
              cursor: "pointer",
            }}
          />
          <input
            className="admin-input"
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            style={{ maxWidth: "120px", fontFamily: "monospace" }}
          />
          <button type="button" className="btn btn--secondary btn--sm" onClick={addColor}
            style={{ color: "#F5F5F5", borderColor: "#555" }}>
            + Color
          </button>
        </div>
      </div>

      {/* Imágenes */}
      <div style={{ gridColumn: "1 / -1" }}>
        <label className="admin-label">
          Imágenes
          <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: "normal", marginLeft: "var(--space-xs)" }}>
            — La primera imagen se asigna como portada
          </span>
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", marginBottom: "var(--space-sm)" }}>
          {form.imagenes.map((img, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-sm)",
                padding: "var(--space-xs) var(--space-sm)",
                backgroundColor: "#1A1A1A",
                border: i === 0 ? "1px solid var(--color-volt)" : "1px solid #333",
                borderRadius: "var(--radius-md)",
              }}
            >
              {i === 0 && (
                <span
                  style={{
                    fontSize: "var(--type-micro)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "2px 6px",
                    backgroundColor: "var(--color-volt)",
                    color: "#111111",
                    flexShrink: 0,
                  }}
                >
                  Portada
                </span>
              )}
              <span style={{ flex: 1, fontSize: "var(--type-caption)", color: "#A0A0A0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {img}
              </span>
              <div style={{ display: "flex", gap: "var(--space-2xs)" }}>
                <button type="button" onClick={() => moveImage(i, i - 1)} disabled={i === 0}
                  style={{ fontSize: "var(--type-body-sm)", color: i === 0 ? "#333" : "#A0A0A0", cursor: i === 0 ? "default" : "pointer" }}>
                  ↑
                </button>
                <button type="button" onClick={() => moveImage(i, i + 1)} disabled={i === form.imagenes.length - 1}
                  style={{ fontSize: "var(--type-body-sm)", color: i === form.imagenes.length - 1 ? "#333" : "#A0A0A0", cursor: i === form.imagenes.length - 1 ? "default" : "pointer" }}>
                  ↓
                </button>
                <button type="button" onClick={() => removeImage(i)}
                  style={{ fontSize: "var(--type-body-sm)", color: "#D30005", cursor: "pointer" }}>
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "var(--space-xs)" }}>
          <input
            className="admin-input"
            type="text"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="/assets/products/nombre-imagen.webp"
          />
          <button type="button" className="btn btn--secondary btn--sm" onClick={addImage}
            style={{ color: "#F5F5F5", borderColor: "#555", whiteSpace: "nowrap" }}>
            + Imagen
          </button>
        </div>
      </div>

      {/* Actions */}
      <div style={{ gridColumn: "1 / -1", display: "flex", gap: "var(--space-md)", justifyContent: "flex-end", paddingTop: "var(--space-md)", borderTop: "1px solid #222" }}>
        <button type="button" className="btn btn--secondary btn--sm" onClick={onCancel}
          style={{ color: "#A0A0A0", borderColor: "#333" }}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--volt btn--sm">
          {initial ? "Guardar Cambios" : "Crear Producto"}
        </button>
      </div>

      <style>{`
        @media (max-width: 599px) {
          .admin-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.form>
  );
}

export default function AdminPage() {
  const { 
    productos, addProducto, updateProducto, removeProducto,
    categorias, addCategoria, removeCategoria,
    tiposProducto, addTipoProducto, removeTipoProducto
  } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState("inventario");

  const handleSave = (product) => {
    if (editing) {
      updateProducto(editing.id, product);
    } else {
      addProducto(product);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = (p) => {
    setEditing(p);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A0A0A",
        color: "#F5F5F5",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-lg)",
          margin: "0 auto",
          padding: "var(--space-xl) var(--space-lg)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--space-2xl)",
            flexWrap: "wrap",
            gap: "var(--space-md)",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "var(--type-caption)",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#757575",
                marginBottom: "var(--space-xs)",
              }}
            >
              Panel de Administración
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--type-h2)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-tight)",
                color: "#F5F5F5",
              }}
            >
              Administración (CMS)
            </h1>
          </div>

          {(!showForm && activeTab === "inventario") && (
            <button
              className="btn btn--volt"
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
            >
              + Nuevo Producto
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-xl)", borderBottom: "1px solid #222", paddingBottom: "var(--space-sm)", overflowX: "auto" }}>
          {["inventario", "equipo", "inicio", "ventas"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: "none", border: "none", color: activeTab === tab ? "var(--color-volt)" : "#A0A0A0", cursor: "pointer", textTransform: "uppercase", fontWeight: 600, fontSize: "var(--type-body-sm)", letterSpacing: "0.05em", padding: "var(--space-xs) 0", borderBottom: activeTab === tab ? "2px solid var(--color-volt)" : "2px solid transparent", whiteSpace: "nowrap" }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'inventario' && (
          <>
        {/* KPI Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "var(--space-xs)",
            marginBottom: "var(--space-xl)",
          }}
        >
          {[
            { label: "Total Productos", val: productos.length },
            { label: "En Oferta", val: productos.filter((p) => p.enOferta).length },
            { label: "Nuevos", val: productos.filter((p) => p.esNuevo).length },
            {
              label: "Valor Inventario",
              val: `$${productos.reduce((s, p) => s + (p.precio || 0), 0).toFixed(0)}`,
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              style={{
                padding: "var(--space-md)",
                backgroundColor: "#111111",
                border: "1px solid #222",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-h3)",
                  fontWeight: 700,
                  color: "var(--color-volt)",
                }}
              >
                {kpi.val}
              </span>
              <p
                style={{
                  fontSize: "var(--type-micro)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#757575",
                  marginTop: "var(--space-2xs)",
                }}
              >
                {kpi.label}
              </p>
            </div>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {showForm && (
            <div style={{ marginBottom: "var(--space-xl)" }}>
              <p
                style={{
                  fontSize: "var(--type-caption)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#757575",
                  marginBottom: "var(--space-md)",
                }}
              >
                {editing ? `Editando: ${editing.nombre}` : "Nuevo Producto"}
              </p>
              <ProductForm
                key={editing?.id || "new"}
                initial={editing}
                categorias={categorias}
                tiposProducto={tiposProducto}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Product Table */}
        <div
          style={{
            backgroundColor: "#111111",
            border: "1px solid #222",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "48px 2fr 1fr 1fr 80px 80px 120px",
              gap: "var(--space-md)",
              padding: "var(--space-sm) var(--space-md)",
              backgroundColor: "#0D0D0D",
              borderBottom: "1px solid #222",
              alignItems: "center",
            }}
            className="admin-table-header"
          >
            {["", "Producto", "Categoría", "Precio", "Stock", "Estado", "Acciones"].map(
              (h) => (
                <span
                  key={h}
                  style={{
                    fontSize: "var(--type-micro)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#555",
                  }}
                >
                  {h}
                </span>
              )
            )}
          </div>

          {/* Rows */}
          {productos.length === 0 && (
            <div
              style={{
                padding: "var(--space-3xl)",
                textAlign: "center",
                color: "#555",
              }}
            >
              <p style={{ fontSize: "var(--type-body)" }}>
                No hay productos en el inventario.
              </p>
              <p style={{ fontSize: "var(--type-caption)", marginTop: "var(--space-xs)" }}>
                Crea tu primer producto con el botón "+ Nuevo Producto".
              </p>
            </div>
          )}

          {productos.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04, duration: 0.3, ease: [0, 0, 0.2, 1] }}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 2fr 1fr 1fr 80px 80px 120px",
                gap: "var(--space-md)",
                padding: "var(--space-sm) var(--space-md)",
                borderBottom: "1px solid #1A1A1A",
                alignItems: "center",
                transition: "background-color var(--duration-micro) var(--ease-out)",
              }}
              className="admin-table-row"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1A1A1A")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {/* Thumb */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#1A1A1A",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src={resolveAsset(p.imagenes[0])}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>

              {/* Name */}
              <div>
                <p
                  style={{
                    fontSize: "var(--type-body-sm)",
                    fontWeight: 500,
                    color: "#F5F5F5",
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.nombre}
                </p>
                {p.tipo && (
                  <span style={{ fontSize: "var(--type-micro)", color: "#555" }}>
                    {p.tipo}
                  </span>
                )}
              </div>

              {/* Cat */}
              <span style={{ fontSize: "var(--type-caption)", color: "#A0A0A0" }}>
                {p.categoria}
              </span>

              {/* Price */}
              <span
                style={{
                  fontSize: "var(--type-body-sm)",
                  fontWeight: 500,
                  color: p.enOferta ? "#D30005" : "#F5F5F5",
                }}
              >
                ${(p.precioOferta || p.precio).toFixed(2)}
                {p.enOferta && p.precioOferta && (
                  <span
                    style={{
                      marginLeft: "var(--space-xs)",
                      textDecoration: "line-through",
                      color: "#555",
                      fontSize: "var(--type-caption)",
                    }}
                  >
                    ${p.precio.toFixed(2)}
                  </span>
                )}
              </span>

              {/* Stock */}
              <span
                style={{
                  fontSize: "var(--type-caption)",
                  color:
                    p.stock !== undefined
                      ? p.stock > 0
                        ? "#128A09"
                        : "#D30005"
                      : "#555",
                }}
              >
                {p.stock !== undefined ? p.stock : "—"}
              </span>

              {/* Status */}
              <div style={{ display: "flex", gap: "var(--space-2xs)" }}>
                {p.esNuevo && (
                  <span
                    style={{
                      fontSize: "var(--type-micro)",
                      fontWeight: 600,
                      padding: "1px 4px",
                      backgroundColor: "#F5F5F5",
                      color: "#111111",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    New
                  </span>
                )}
                {p.enOferta && (
                  <span
                    style={{
                      fontSize: "var(--type-micro)",
                      fontWeight: 600,
                      padding: "1px 4px",
                      backgroundColor: "#D30005",
                      color: "#FFF",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Sale
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "var(--space-xs)" }}>
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => handleEdit(p)}
                  style={{ color: "var(--color-volt)", borderColor: "#333", padding: "4px 8px", fontSize: "var(--type-micro)" }}
                >
                  Editar
                </button>
                <button
                  className="btn btn--danger btn--sm"
                  onClick={() => removeProducto(p.id)}
                  style={{ padding: "4px 8px", fontSize: "var(--type-micro)" }}
                >
                  Quitar
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CMS Configuration Section */}
        <div style={{ marginTop: "var(--space-3xl)" }}>
          <h2 style={{ fontSize: "var(--type-h3)", fontFamily: "var(--font-display)", color: "#F5F5F5", marginBottom: "var(--space-md)", textTransform: "uppercase" }}>Configuración de Tienda</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-lg)" }}>
            {/* Categorías */}
            <div style={{ backgroundColor: "#111111", border: "1px solid #222", borderRadius: "var(--radius-md)", padding: "var(--space-md)" }}>
              <h3 style={{ fontSize: "var(--type-body)", color: "var(--color-volt)", marginBottom: "var(--space-sm)" }}>Categorías</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)", marginBottom: "var(--space-md)" }}>
                {categorias.map(cat => (
                  <span key={cat} style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", padding: "4px 8px", backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "4px", fontSize: "var(--type-caption)", color: "#F5F5F5" }}>
                    {cat}
                    <button onClick={() => removeCategoria(cat)} style={{ color: "#D30005", cursor: "pointer", fontSize: "var(--type-body-sm)" }}>×</button>
                  </span>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); const val = e.target.elements.newCat.value.trim(); if(val) { addCategoria(val); e.target.reset(); } }} style={{ display: "flex", gap: "var(--space-xs)" }}>
                <input name="newCat" type="text" className="admin-input" placeholder="Nueva Categoría" style={{ flex: 1 }} />
                <button type="submit" className="btn btn--secondary btn--sm" style={{ color: "#F5F5F5", borderColor: "#555" }}>Agregar</button>
              </form>
            </div>

            {/* Tipos de Producto */}
            <div style={{ backgroundColor: "#111111", border: "1px solid #222", borderRadius: "var(--radius-md)", padding: "var(--space-md)" }}>
              <h3 style={{ fontSize: "var(--type-body)", color: "var(--color-volt)", marginBottom: "var(--space-sm)" }}>Tipos de Producto</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)", marginBottom: "var(--space-md)" }}>
                {tiposProducto.map(tipo => (
                  <span key={tipo} style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", padding: "4px 8px", backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "4px", fontSize: "var(--type-caption)", color: "#F5F5F5" }}>
                    {tipo}
                    <button onClick={() => removeTipoProducto(tipo)} style={{ color: "#D30005", cursor: "pointer", fontSize: "var(--type-body-sm)" }}>×</button>
                  </span>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); const val = e.target.elements.newTipo.value.trim(); if(val) { addTipoProducto(val.toLowerCase()); e.target.reset(); } }} style={{ display: "flex", gap: "var(--space-xs)" }}>
                <input name="newTipo" type="text" className="admin-input" placeholder="Nuevo Tipo" style={{ flex: 1 }} />
                <button type="submit" className="btn btn--secondary btn--sm" style={{ color: "#F5F5F5", borderColor: "#555" }}>Agregar</button>
              </form>
            </div>
          </div>
        </div>
        </>
        )}

        {activeTab === 'equipo' && <TeamAdmin />}
        {activeTab === 'inicio' && <HomeAdmin />}
        {activeTab === 'ventas' && <SalesDashboard />}
      </div>

      {/* Responsive: collapse table on mobile */}
      <style>{`
        @media (max-width: 899px) {
          .admin-table-header { display: none !important; }
          .admin-table-row {
            grid-template-columns: 48px 1fr !important;
            grid-template-rows: auto auto;
            gap: var(--space-xs) !important;
            padding: var(--space-md) !important;
          }
        }
      `}</style>
    </div>
  );
}
