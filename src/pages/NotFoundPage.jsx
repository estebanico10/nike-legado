import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEOHead from "../components/common/SEOHead";

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "var(--color-bg)", color: "var(--color-ink)", textAlign: "center", padding: "var(--space-xl)" }}>
      <SEOHead title="404 - Página no encontrada | Nike" />
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: "var(--font-display)", fontSize: "clamp(6rem, 20vw, 12rem)", margin: 0, lineHeight: 1, color: "var(--color-volt)" }}
      >
        404
      </motion.h1>
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", textTransform: "uppercase", marginTop: "var(--space-md)", marginBottom: "var(--space-sm)" }}
      >
        FUERA DE LÍMITES
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ fontSize: "var(--type-body)", color: "var(--color-ink-soft)", maxWidth: "500px", marginBottom: "var(--space-xl)" }}
      >
        No pudimos encontrar la página que buscas. Puede que el producto ya no esté disponible o el enlace sea incorrecto.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link to="/inicio" className="btn btn--primary" style={{ display: "inline-block" }}>
          Volver al Inicio
        </Link>
      </motion.div>
    </div>
  );
}
