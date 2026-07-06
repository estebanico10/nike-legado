import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ currentProduct }) {
  const { productos } = useProducts();
  
  if (!currentProduct) return null;

  // Filter products in the same category, excluding the current one
  const related = productos
    .filter(p => p.categoria === currentProduct.categoria && p.id !== currentProduct.id)
    .slice(0, 6);

  if (related.length === 0) return null;

  return (
    <section style={{ padding: "var(--space-4xl) 0" }}>
      <div className="container">
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", textTransform: "uppercase", marginBottom: "var(--space-2xl)" }}>
          También te podría interesar
        </h2>
        
        <div style={{ 
          display: "flex", 
          gap: "var(--space-md)", 
          overflowX: "auto", 
          paddingBottom: "var(--space-md)",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory"
        }}>
          {related.map(producto => (
            <div key={producto.id} style={{ minWidth: "280px", maxWidth: "320px", flex: "0 0 auto", scrollSnapAlign: "start" }}>
              <ProductCard producto={producto} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
