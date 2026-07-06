import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../../context/ProductContext";
import { resolveAsset } from "../../utils/resolveAsset";
import ProductForm from "./ProductForm";

export default function InventoryTable() {
  const { productos, addProducto, updateProducto, removeProducto, categorias, tiposProducto } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

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
    <>
      {/* Header and Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xl)" }}>
        <h2 style={{ fontSize: "var(--type-h3)", fontFamily: "var(--font-display)", color: "#F5F5F5", textTransform: "uppercase" }}>Inventario</h2>
        {!showForm && (
          <button className="btn btn--volt" onClick={() => { setEditing(null); setShowForm(true); }}>
            + Nuevo Producto
          </button>
        )}
      </div>

      {/* KPI Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-sm)", marginBottom: "var(--space-xl)" }}>
        {[
          { label: "Total Productos", val: productos.length },
          { label: "En Oferta", val: productos.filter((p) => p.enOferta).length },
          { label: "Nuevos", val: productos.filter((p) => p.esNuevo).length },
          { label: "Valor Inventario", val: `$${productos.reduce((s, p) => s + (p.precio || 0), 0).toFixed(0)}` },
        ].map((kpi) => (
          <div key={kpi.label} style={{ padding: "var(--space-md)", backgroundColor: "#111111", border: "1px solid #222", borderRadius: "var(--radius-md)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", fontWeight: 700, color: "var(--color-volt)" }}>{kpi.val}</span>
            <p style={{ fontSize: "var(--type-micro)", fontWeight: 500, textTransform: "uppercase", color: "#757575", marginTop: "var(--space-2xs)" }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <AnimatePresence mode="wait">
        {showForm && (
          <div style={{ marginBottom: "var(--space-xl)" }}>
            <p style={{ fontSize: "var(--type-caption)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "#757575", marginBottom: "var(--space-md)" }}>
              {editing ? `Editando: ${editing.nombre}` : "Nuevo Producto"}
            </p>
            <ProductForm key={editing?.id || "new"} initial={editing} categorias={categorias} tiposProducto={tiposProducto} onSave={handleSave} onCancel={handleCancel} />
          </div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #222", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "48px 2fr 1fr 1fr 80px 80px 120px", gap: "var(--space-md)", padding: "var(--space-sm) var(--space-md)", backgroundColor: "#0D0D0D", borderBottom: "1px solid #222", alignItems: "center" }}>
          {["", "Producto", "Categoría", "Precio", "Stock", "Estado", "Acciones"].map((h) => (
            <span key={h} style={{ fontSize: "var(--type-micro)", fontWeight: 600, textTransform: "uppercase", color: "#555" }}>{h}</span>
          ))}
        </div>

        {productos.length === 0 && (
          <div style={{ padding: "var(--space-3xl)", textAlign: "center", color: "#555" }}>
            <p style={{ fontSize: "var(--type-body)" }}>No hay productos en el inventario.</p>
          </div>
        )}

        {productos.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            style={{ display: "grid", gridTemplateColumns: "48px 2fr 1fr 1fr 80px 80px 120px", gap: "var(--space-md)", padding: "var(--space-sm) var(--space-md)", borderBottom: "1px solid #1A1A1A", alignItems: "center" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1A1A1A")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {/* Thumb */}
            <div style={{ width: "40px", height: "40px", backgroundColor: "#1A1A1A", overflow: "hidden" }}>
              <img src={resolveAsset(p.imagenes[0])} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} />
            </div>

            {/* Name */}
            <div>
              <p style={{ fontSize: "var(--type-body-sm)", fontWeight: 500, color: "#F5F5F5", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nombre}</p>
              {p.tipo && <span style={{ fontSize: "var(--type-micro)", color: "#555" }}>{p.tipo}</span>}
            </div>

            {/* Cat */}
            <span style={{ fontSize: "var(--type-caption)", color: "#A0A0A0" }}>{p.categoria}</span>

            {/* Price */}
            <span style={{ fontSize: "var(--type-body-sm)", fontWeight: 500, color: p.enOferta ? "#D30005" : "#F5F5F5" }}>
              ${(p.precioOferta || p.precio).toFixed(2)}
              {p.enOferta && p.precioOferta && <span style={{ marginLeft: "var(--space-xs)", textDecoration: "line-through", color: "#555", fontSize: "var(--type-caption)" }}>${p.precio.toFixed(2)}</span>}
            </span>

            {/* Stock */}
            <span style={{ fontSize: "var(--type-caption)", color: p.stock !== undefined ? (p.stock > 0 ? "#128A09" : "#D30005") : "#555" }}>
              {p.stock !== undefined ? p.stock : "—"}
            </span>

            {/* Status */}
            <div style={{ display: "flex", gap: "var(--space-2xs)" }}>
              {p.esNuevo && <span style={{ fontSize: "var(--type-micro)", fontWeight: 600, padding: "1px 4px", backgroundColor: "#F5F5F5", color: "#111111", textTransform: "uppercase" }}>New</span>}
              {p.enOferta && <span style={{ fontSize: "var(--type-micro)", fontWeight: 600, padding: "1px 4px", backgroundColor: "#D30005", color: "#FFF", textTransform: "uppercase" }}>Sale</span>}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "var(--space-xs)" }}>
              <button className="btn btn--secondary btn--sm" onClick={() => handleEdit(p)} style={{ color: "var(--color-volt)", borderColor: "#333", padding: "4px 8px", fontSize: "var(--type-micro)" }}>Editar</button>
              <button className="btn btn--danger btn--sm" onClick={() => removeProducto(p.id)} style={{ padding: "4px 8px", fontSize: "var(--type-micro)" }}>Quitar</button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
