import { motion } from "framer-motion";
import AIPersonalShopper from "./AIPersonalShopper";
import BackToTop from "./BackToTop";
import WhatsAppFAB from "./WhatsAppFAB";

export default function FloatingActions() {
  return (
    <motion.div
      layout
      className="floating-actions-group"
      aria-label="Acciones flotantes rápidas"
    >
      <AIPersonalShopper />
      <BackToTop />
      <WhatsAppFAB />
    </motion.div>
  );
}
