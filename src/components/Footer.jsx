import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-black text-white py-16 mt-auto relative overflow-hidden"
    >
      <div className="max-w-global mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="font-display text-2xl mb-4 uppercase tracking-wider font-bold">Legado</h4>
            <p className="text-gray-400 text-sm font-sans max-w-xs leading-relaxed">
              Diseñado en los Andes.<br />
              Hecho para el mundo.
            </p>
          </div>
          
          {/* Navigation Column */}
          <div>
            <h4 className="font-display text-sm mb-6 uppercase tracking-widest font-bold">Navegación</h4>
            <ul className="flex flex-col gap-3 font-sans text-sm">
              <li><Link to="/inicio" className="text-gray-400 hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/tienda" className="text-gray-400 hover:text-white transition-colors">Tienda</Link></li>
              <li><Link to="/nosotros" className="text-gray-400 hover:text-white transition-colors">Nuestra Historia</Link></li>
            </ul>
          </div>

          {/* Subpages / Features Column */}
          <div>
            <h4 className="font-display text-sm mb-6 uppercase tracking-widest font-bold">Explora</h4>
            <ul className="flex flex-col gap-3 font-sans text-sm">
              <li><Link to="/customizer" className="text-gray-400 hover:text-white transition-colors">Nike By You</Link></li>
              <li><Link to="/drops" className="text-gray-400 hover:text-white transition-colors">SNKRS Drops</Link></li>
              <li><Link to="/comunidad" className="text-gray-400 hover:text-white transition-colors">Comunidad OOTD</Link></li>
              <li><Link to="/club" className="text-gray-400 hover:text-white transition-colors">Nike Club</Link></li>
            </ul>
          </div>
          
          {/* Legal Column */}
          <div>
            <h4 className="font-display text-sm mb-6 uppercase tracking-widest font-bold">Legal</h4>
            <ul className="flex flex-col gap-3 font-sans text-sm">
              <li><Link to="/contacto" className="text-gray-400 hover:text-white transition-colors">Contacto y Soporte</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</a></li>
            </ul>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-sans">
          <p>&copy; {new Date().getFullYear()} Nike Legado. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2">
            <span>Quito, Ecuador</span>
            <span role="img" aria-label="Ecuador">🇪🇨</span>
          </p>
        </div>
      </div>
      
      {/* Background decoration */}
      <div 
        className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(206, 255, 0, 0.05) 0%, rgba(0,0,0,0) 70%)"
        }}
      />
    </motion.footer>
  );
}
