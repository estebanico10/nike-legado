import { useState } from "react";
import { useProducts } from "../../context/ProductContext";

export default function StoreSettings() {
  const { categorias, addCategoria, removeCategoria, tiposProducto, addTipoProducto, removeTipoProducto } = useProducts();
  const [newCat, setNewCat] = useState("");
  const [newTipo, setNewTipo] = useState("");

  const handleAddCat = (e) => {
    e.preventDefault();
    if (newCat.trim()) {
      addCategoria(newCat.trim());
      setNewCat("");
    }
  };

  const handleAddTipo = (e) => {
    e.preventDefault();
    if (newTipo.trim()) {
      addTipoProducto(newTipo.trim());
      setNewTipo("");
    }
  };

  return (
    <div style={{ marginTop: "var(--space-md)" }}>
      <h2 style={{ fontSize: "var(--type-h3)", fontFamily: "var(--font-display)", color: "#F5F5F5", marginBottom: "var(--space-md)", textTransform: "uppercase" }}>Configuración de Tienda</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-lg)" }}>
        {/* Categorías */}
        <div style={{ backgroundColor: "#111111", border: "1px solid #222", borderRadius: "var(--radius-md)", padding: "var(--space-md)" }}>
          <h3 style={{ fontSize: "var(--type-body)", color: "var(--color-volt)", marginBottom: "var(--space-sm)" }}>Categorías</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)", marginBottom: "var(--space-md)" }}>
            {categorias.map(cat => (
              <span key={cat} style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", padding: "4px 8px", backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "4px", fontSize: "var(--type-caption)", color: "#F5F5F5" }}>
                {cat}
                <button onClick={() => removeCategoria(cat)} style={{ color: "#D30005", cursor: "pointer", fontSize: "var(--type-body-sm)", background: "none", border: "none" }}>×</button>
              </span>
            ))}
          </div>
          <form onSubmit={handleAddCat} style={{ display: "flex", gap: "var(--space-xs)" }}>
            <input
              type="text"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="Nueva categoría..."
              style={{ flex: 1, padding: "8px 12px", backgroundColor: "#0D0D0D", border: "1px solid #333", borderRadius: "4px", color: "#F5F5F5", fontSize: "var(--type-caption)" }}
            />
            <button type="submit" className="btn btn--secondary btn--sm" style={{ borderColor: "#333", color: "#F5F5F5" }}>Agregar</button>
          </form>
        </div>

        {/* Tipos de Producto */}
        <div style={{ backgroundColor: "#111111", border: "1px solid #222", borderRadius: "var(--radius-md)", padding: "var(--space-md)" }}>
          <h3 style={{ fontSize: "var(--type-body)", color: "var(--color-volt)", marginBottom: "var(--space-sm)" }}>Tipos de Producto</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)", marginBottom: "var(--space-md)" }}>
            {tiposProducto.map(tipo => (
              <span key={tipo} style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", padding: "4px 8px", backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "4px", fontSize: "var(--type-caption)", color: "#F5F5F5" }}>
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                <button onClick={() => removeTipoProducto(tipo)} style={{ color: "#D30005", cursor: "pointer", fontSize: "var(--type-body-sm)", background: "none", border: "none" }}>×</button>
              </span>
            ))}
          </div>
          <form onSubmit={handleAddTipo} style={{ display: "flex", gap: "var(--space-xs)" }}>
            <input
              type="text"
              value={newTipo}
              onChange={(e) => setNewTipo(e.target.value)}
              placeholder="Nuevo tipo..."
              style={{ flex: 1, padding: "8px 12px", backgroundColor: "#0D0D0D", border: "1px solid #333", borderRadius: "4px", color: "#F5F5F5", fontSize: "var(--type-caption)" }}
            />
            <button type="submit" className="btn btn--secondary btn--sm" style={{ borderColor: "#333", color: "#F5F5F5" }}>Agregar</button>
          </form>
        </div>

        {/* Gamificación (Lucky Wheel) */}
        <div style={{ backgroundColor: "#111111", border: "1px solid #222", borderRadius: "var(--radius-md)", padding: "var(--space-md)" }}>
          <h3 style={{ fontSize: "var(--type-body)", color: "var(--color-volt)", marginBottom: "var(--space-sm)" }}>Gamificación</h3>
          <p style={{ fontSize: "var(--type-caption)", color: "#A0A0A0", marginBottom: "var(--space-md)" }}>
            Ajustes para la Ruleta de la Suerte interactiva.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "4px" }}>
              <span style={{ fontSize: "var(--type-caption)", color: "#F5F5F5" }}>Estado de la Ruleta</span>
              <span style={{ fontSize: "var(--type-micro)", color: "#111", backgroundColor: "var(--color-volt)", padding: "2px 6px", fontWeight: "bold", borderRadius: "2px" }}>ACTIVO</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "4px" }}>
              <span style={{ fontSize: "var(--type-caption)", color: "#F5F5F5" }}>Descuento Máximo</span>
              <span style={{ fontSize: "var(--type-micro)", color: "#A0A0A0" }}>20% OFF</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: "4px" }}>
              <span style={{ fontSize: "var(--type-caption)", color: "#F5F5F5" }}>Correos Captados</span>
              <span style={{ fontSize: "var(--type-micro)", color: "#A0A0A0" }}>14</span>
            </div>
          </div>
          
          <button className="btn btn--secondary btn--sm" style={{ width: "100%", marginTop: "var(--space-md)", borderColor: "#333", color: "#F5F5F5" }}>
            Editar Premios
          </button>
        </div>
      </div>
    </div>
  );
}
