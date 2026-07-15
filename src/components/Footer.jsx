import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import NewsletterModal from "./NewsletterModal";

export default function Footer() {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  return (
    <footer className="relative bg-black text-white pt-24 overflow-hidden flex flex-col mt-auto">
      <div className="max-w-global mx-auto px-6 w-full relative z-10 pb-12">
        
        {/* Top Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          
          {/* Newsletter / Brand - 5 columns */}
          <div className="lg:col-span-5 flex flex-col max-w-lg">
            <h3 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase leading-none mb-6">
              Únete al <br /> Legado.
            </h3>
            <p className="text-gray-400 font-sans text-base mb-8 max-w-md leading-relaxed">
              Recibe acceso anticipado a los últimos lanzamientos, colaboraciones exclusivas y eventos privados.
            </p>
            <div className="flex border-b border-gray-700 pb-2 transition-colors focus-within:border-white">
              <button 
                onClick={() => setIsNewsletterOpen(true)}
                className="bg-transparent border-none outline-none text-white font-display text-sm tracking-widest flex-1 py-2 text-left cursor-text"
              >
                TU CORREO ELECTRÓNICO
              </button>
              <motion.button 
                whileHover={{ x: 5 }}
                onClick={() => setIsNewsletterOpen(true)}
                className="bg-transparent border-none text-white cursor-pointer flex items-center justify-center px-4"
                aria-label="Suscribirse"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>
          </div>
          
          {/* Spacer for large screens */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Columns - 6 columns total (2 each) */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Tienda */}
            <div className="flex flex-col">
              <h4 className="font-display text-xs uppercase tracking-[0.15em] text-gray-500 mb-6">Tienda</h4>
              <ul className="flex flex-col gap-4">
                {["Hombre", "Mujer", "Niños", "SNKRS", "Equipamiento"].map((item) => (
                  <li key={item}>
                    <Link to="/tienda" className="font-sans text-sm text-gray-300 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ayuda */}
            <div className="flex flex-col">
              <h4 className="font-display text-xs uppercase tracking-[0.15em] text-gray-500 mb-6">Ayuda</h4>
              <ul className="flex flex-col gap-4">
                {["Estado del pedido", "Envíos y entregas", "Devoluciones", "Opciones de pago", "Contacto"].map((item) => (
                  <li key={item}>
                    <Link to="/contacto" className="font-sans text-sm text-gray-300 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nosotros */}
            <div className="flex flex-col">
              <h4 className="font-display text-xs uppercase tracking-[0.15em] text-gray-500 mb-6">Nosotros</h4>
              <ul className="flex flex-col gap-4">
                {["Noticias", "Empleo", "Inversores", "Sostenibilidad"].map((item) => (
                  <li key={item}>
                    <Link to="/nosotros" className="font-sans text-sm text-gray-300 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Socials & Location Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          {/* Socials */}
          <div className="flex gap-6">
            <motion.a target="_blank" rel="noopener noreferrer" whileHover={{ y: -3 }} href="https://www.instagram.com/adnp.asion" className="text-white hover:text-gray-300 transition-colors" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </motion.a>
            <motion.a whileHover={{ y: -3 }} href="#" className="text-white hover:text-gray-300 transition-colors" aria-label="Twitter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
            </motion.a>
            <motion.a whileHover={{ y: -3 }} href="#" className="text-white hover:text-gray-300 transition-colors" aria-label="YouTube">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </motion.a>
          </div>
          
          <div className="flex items-center gap-2 text-white font-sans text-sm">
            <svg width="16" height="12" viewBox="0 0 3 2" className="mr-2">
              <rect width="3" height="2" fill="#ef3340"/>
              <rect width="3" height="1" y="0.5" fill="#0033a0"/>
              <rect width="3" height="0.5" fill="#ffcd00"/>
              <g transform="translate(1.5,1) scale(0.15)">
                <circle r="1" fill="#fff" opacity="0.8"/>
              </g>
            </svg>
            <span>Quito, Ecuador</span>
          </div>
        </div>
        
        {/* Bottom Legal Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-gray-500 font-sans">
          <p>&copy; {new Date().getFullYear()} Nike Legado. Todos los derechos reservados.</p>
          
          <ul className="flex flex-wrap gap-6">
            <li><a href="#" className="hover:text-white transition-colors">Términos de uso</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Términos de venta</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
          </ul>
        </div>
      </div>
      
      {/* Giant Background Text */}
      <div className="absolute bottom-0 left-0 right-0 font-display text-[15vw] font-black text-white opacity-5 leading-none text-center select-none pointer-events-none overflow-hidden translate-y-1/4">
        LEGADO
      </div>

      {/* Background decoration */}
      <div className="absolute -top-1/4 -right-10 w-1/2 h-[150%] bg-[radial-gradient(ellipse_at_center,_rgba(217,255,0,0.05)_0%,_rgba(0,0,0,0)_70%)] z-0 pointer-events-none" />
      
      <NewsletterModal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />
    </footer>
  );
}
