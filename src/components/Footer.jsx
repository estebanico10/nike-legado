import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useI18nStore } from "../store/useI18nStore";

export default function Footer() {
  const { currency, setCurrency, lang, setLang } = useI18nStore();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-[var(--color-ink)] text-[var(--color-canvas)] py-16 mt-auto relative overflow-hidden"
    >
      <div className="max-w-global mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="font-display text-2xl mb-4 uppercase tracking-wider font-bold">Legado</h4>
            <p className="text-[var(--color-canvas-alt)] text-sm font-sans max-w-xs leading-relaxed opacity-70">
              Diseñado en los Andes.<br />
              Hecho para el mundo.
            </p>
            
            <div className="flex gap-4 mt-8">
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent border border-[var(--color-ink-muted)] text-[var(--color-canvas)] py-1.5 px-3 rounded font-sans text-xs cursor-pointer focus:outline-none focus:border-[var(--color-volt)] transition-colors hover:border-[var(--color-canvas)]"
              >
                <option value="USD" className="text-black bg-white">USD</option>
                <option value="MXN" className="text-black bg-white">MXN</option>
                <option value="EUR" className="text-black bg-white">EUR</option>
              </select>

              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent border border-[var(--color-ink-muted)] text-[var(--color-canvas)] py-1.5 px-3 rounded font-sans text-xs cursor-pointer focus:outline-none focus:border-[var(--color-volt)] transition-colors hover:border-[var(--color-canvas)]"
              >
                <option value="es" className="text-black bg-white">ES</option>
                <option value="en" className="text-black bg-white">EN</option>
              </select>
            </div>
          </div>
          
          {/* Navigation Column */}
          <div>
            <h4 className="font-display text-sm mb-6 uppercase tracking-widest font-bold">Navegación</h4>
            <ul className="flex flex-col gap-3 font-sans text-sm">
              <li><Link to="/inicio" className="text-[var(--color-canvas)] opacity-60 hover:opacity-100 hover:text-[var(--color-volt)] transition-all">Inicio</Link></li>
              <li><Link to="/tienda" className="text-[var(--color-canvas)] opacity-60 hover:opacity-100 hover:text-[var(--color-volt)] transition-all">Tienda</Link></li>
              <li><Link to="/nosotros" className="text-[var(--color-canvas)] opacity-60 hover:opacity-100 hover:text-[var(--color-volt)] transition-all">Nuestra Historia</Link></li>
            </ul>
          </div>

          {/* Subpages / Features Column */}
          <div>
            <h4 className="font-display text-sm mb-6 uppercase tracking-widest font-bold">Explora</h4>
            <ul className="flex flex-col gap-3 font-sans text-sm">
              <li><Link to="/customizer" className="text-[var(--color-canvas)] opacity-60 hover:opacity-100 hover:text-[var(--color-volt)] transition-all">Nike By You</Link></li>
              <li><Link to="/drops" className="text-[var(--color-canvas)] opacity-60 hover:opacity-100 hover:text-[var(--color-volt)] transition-all">SNKRS Drops</Link></li>
              <li><Link to="/comunidad" className="text-[var(--color-canvas)] opacity-60 hover:opacity-100 hover:text-[var(--color-volt)] transition-all">Comunidad OOTD</Link></li>
              <li><Link to="/club" className="text-[var(--color-canvas)] opacity-60 hover:opacity-100 hover:text-[var(--color-volt)] transition-all">Nike Club</Link></li>
            </ul>
          </div>
          
          {/* Legal Column */}
          <div>
            <h4 className="font-display text-sm mb-6 uppercase tracking-widest font-bold">Legal</h4>
            <ul className="flex flex-col gap-3 font-sans text-sm">
              <li><Link to="/contacto" className="text-[var(--color-canvas)] opacity-60 hover:opacity-100 hover:text-[var(--color-volt)] transition-all">Contacto y Soporte</Link></li>
              <li><a href="#" className="text-[var(--color-canvas)] opacity-60 hover:opacity-100 hover:text-[var(--color-volt)] transition-all">Términos y Condiciones</a></li>
              <li><a href="#" className="text-[var(--color-canvas)] opacity-60 hover:opacity-100 hover:text-[var(--color-volt)] transition-all">Política de Privacidad</a></li>
            </ul>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-[var(--color-ink-muted)] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--color-canvas)] opacity-50 font-sans">
          <p>&copy; {new Date().getFullYear()} Nike Legado. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2">
            <span>Quito, Ecuador</span>
            <span role="img" aria-label="Ecuador">🇪🇨</span>
          </p>
        </div>
      </div>
      
      {/* Background decoration */}
      <div 
        className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] pointer-events-none z-0 opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, var(--color-volt) 0%, transparent 70%)"
        }}
      />
    </motion.footer>
  );
}
