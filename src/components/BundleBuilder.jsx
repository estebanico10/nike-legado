import { useProducts } from "../context/ProductContext";
import { useCartStore } from "../store/useStore";
import { resolveAsset } from "../utils/resolveAsset";
import { useToast } from "../context/ToastContext";

export default function BundleBuilder({ mainProduct }) {
  const { productos } = useProducts();
  const { addToCart } = useCartStore();
  const { addToast } = useToast();
  
  // Find a matching accessory or clothing item
  const bundleItems = productos
    .filter(p => p.id !== mainProduct.id && (p.tipo === "accesorio" || p.tipo === "ropa"))
    .slice(0, 2);

  if (bundleItems.length === 0) return null;

  const handleAddBundle = () => {
    // Add main product
    addToCart({ ...mainProduct, size: mainProduct.tallas?.[0] || 'U', color: mainProduct.colores?.[0] || 'Default' });
    // Add bundle items
    bundleItems.forEach(item => {
      addToCart({ ...item, size: item.tallas?.[0] || 'U', color: item.colores?.[0] || 'Default' });
    });
    addToast("Look completo añadido al carrito 🎉", "success");
  };

  const totalPrice = (mainProduct.precioOferta || mainProduct.precio) + bundleItems.reduce((acc, item) => acc + (item.precioOferta || item.precio), 0);
  const bundleDiscount = totalPrice * 0.15; // 15% off for bundle
  const finalPrice = totalPrice - bundleDiscount;

  return (
    <div style={{ backgroundColor: "var(--color-canvas-alt)", border: "1px solid var(--color-ink-muted)", borderRadius: "var(--radius-sm)", padding: "var(--space-lg)", marginBottom: "var(--space-3xl)" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", textTransform: "uppercase", marginBottom: "var(--space-sm)", display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        Completa tu Look
      </h3>
      <p style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", marginBottom: "var(--space-lg)" }}>Lleva este conjunto con 15% de descuento.</p>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-lg)", flexWrap: "wrap" }}>
        {/* Main Item */}
        <div style={{ width: "60px", height: "60px", border: "1px solid var(--color-ink)", borderRadius: "4px", overflow: "hidden" }}>
          <img src={resolveAsset(mainProduct.imagenes[0])} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <span style={{ fontWeight: "bold", color: "var(--color-ink-muted)" }}>+</span>
        
        {/* Bundle Items */}
        {bundleItems.map((item, idx) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <div style={{ width: "60px", height: "60px", border: "1px solid var(--color-ink-muted)", borderRadius: "4px", overflow: "hidden" }}>
              <img src={resolveAsset(item.imagenes[0])} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            {idx < bundleItems.length - 1 && <span style={{ fontWeight: "bold", color: "var(--color-ink-muted)" }}>+</span>}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-ink-muted)", paddingTop: "var(--space-md)" }}>
        <div>
          <span style={{ display: "block", textDecoration: "line-through", color: "var(--color-ink-muted)", fontSize: "var(--type-micro)" }}>${totalPrice.toFixed(2)}</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, color: "var(--color-volt)" }}>${finalPrice.toFixed(2)}</span>
        </div>
        <button onClick={handleAddBundle} className="btn btn--primary btn--sm">
          Añadir Paquete
        </button>
      </div>
    </div>
  );
}
