import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useCartStore, useUIStore, useWishlistStore } from "../store/useStore";
import SearchOverlay from "./SearchOverlay";
import { useI18nStore } from "../store/useI18nStore";

const navStructure = [
  { to: "/inicio", label: "Inicio", type: "link" },
  { 
    label: "Tienda", 
    type: "dropdown",
    to: "/tienda",
    children: [
      { to: "/tienda", label: "Catálogo Completo", desc: "Explora toda la colección." },
      { to: "/customizer", label: "Nike By You", desc: "Personaliza tus sneakers 3D." },
      { to: "/drops", label: "SNKRS Drops", desc: "Lanzamientos exclusivos." },
    ]
  },
  { 
    label: "Nosotros", 
    type: "dropdown",
    to: "/nosotros",
    children: [
      { to: "/nosotros", label: "Nuestra Historia", desc: "Conoce el legado de Nike." },
      { to: "/comunidad", label: "Comunidad OOTD", desc: "Inspírate con otros usuarios." },
      { to: "/club", label: "Nike Club", desc: "Recompensas y beneficios." },
      { to: "/contacto", label: "Contacto", desc: "Asistencia y tiendas." },
    ]
  }
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const { scrollY } = useScroll();
  const cartCount = useCartStore((state) => state.getCartCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { openCart, openSearch } = useUIStore();
  const { currency, setCurrency, lang, setLang } = useI18nStore();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 50 && latest > previous) {
      setHidden(true);
      setMenuOpen(false);
      setActiveDropdown(null);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 20);
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);

  return (
    <>
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? "h-16 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200"
          : "h-20 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-global mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* Mobile Left: Hamburger */}
        <div className="flex md:hidden items-center flex-1">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
            className="p-2 -ml-2 text-black hover:opacity-70 transition-opacity"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span className={`h-0.5 bg-current transition-transform duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`h-0.5 bg-current transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`h-0.5 bg-current transition-transform duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>

        {/* Logo (Center on mobile, Left on desktop) */}
        <div className="flex justify-center md:justify-start flex-1 md:flex-none">
          <Link to="/inicio" className="flex items-center gap-2 group">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 md:w-12 h-auto text-black group-hover:scale-105 transition-transform duration-300"
              aria-label="Nike Legado"
            >
              <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z" />
            </svg>
            <span className="hidden sm:block font-display text-sm font-bold tracking-[0.12em] uppercase text-black">
              Legado
            </span>
          </Link>
        </div>

        {/* Desktop Links (Center) */}
        <div className="hidden md:flex items-center justify-center flex-1 gap-8 px-4 h-full">
          {navStructure.map((item, idx) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <div 
                key={idx} 
                className="relative h-full flex items-center group"
                onMouseEnter={() => item.type === "dropdown" && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.to}
                  className={`relative font-sans text-xs lg:text-sm font-medium uppercase tracking-wide py-2 transition-colors duration-200 flex items-center gap-1 ${
                    isActive ? "text-black" : "text-gray-600 hover:text-black"
                  }`}
                >
                  {item.label}
                  {item.type === "dropdown" && (
                    <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-[-16px] left-0 right-0 h-[2px] bg-black"
                      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
                    />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.type === "dropdown" && (
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-100"
                      >
                        <div className="py-2 flex flex-col">
                          {item.children.map((child, i) => (
                            <Link
                              key={i}
                              to={child.to}
                              className="px-5 py-3 hover:bg-gray-50 flex flex-col transition-colors group/link"
                            >
                              <span className="font-display font-medium uppercase text-sm text-black group-hover/link:text-volt transition-colors">
                                {child.label}
                              </span>
                              <span className="font-sans text-xs text-gray-500 mt-1">
                                {child.desc}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Utils (Cart on Mobile, Everything on Desktop) */}
        <div className="flex items-center justify-end flex-1 gap-1 md:gap-4">
          
          <div className="hidden lg:flex items-center gap-2">
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent border border-gray-200 text-black py-1 px-2 rounded font-sans text-xs cursor-pointer focus:outline-none hover:border-gray-400 transition-colors"
            >
              <option value="USD">USD</option>
              <option value="MXN">MXN</option>
              <option value="EUR">EUR</option>
            </select>

            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent border border-gray-200 text-black py-1 px-2 rounded font-sans text-xs cursor-pointer focus:outline-none hover:border-gray-400 transition-colors"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
          </div>

          {/* Admin Link (Desktop) */}
          <Link to="/admin" className="hidden md:flex p-2 text-black hover:opacity-70 transition-opacity" aria-label="Admin Panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </Link>

          {/* Search Icon (Desktop) */}
          <button 
            onClick={openSearch}
            className="hidden md:flex p-2 text-black hover:opacity-70 transition-opacity items-center gap-1"
            aria-label="Buscar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className="hidden xl:block text-[10px] text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">Ctrl+K</span>
          </button>

          {/* Wishlist Icon (Desktop) */}
          <Link to="/favoritos" className="hidden md:flex relative p-2 text-black hover:opacity-70 transition-opacity" aria-label="Favoritos">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  exit={{ scale: 0 }} 
                  className="absolute top-1 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* User Icon (Desktop) */}
          <Link to="/perfil" className="hidden md:flex p-2 text-black hover:opacity-70 transition-opacity" aria-label="Mi Cuenta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          {/* Cart Icon (Mobile & Desktop) */}
          <button onClick={openCart} className="relative p-2 text-black hover:opacity-70 transition-opacity flex items-center" aria-label="Carrito">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-0 right-0 bg-volt text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1/4"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.nav>

    {/* Off-Canvas Menu (Mobile) */}
    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[400px] bg-white z-[70] shadow-2xl md:hidden overflow-y-auto flex flex-col"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <span className="font-display text-xl font-bold uppercase tracking-widest text-black">
                Menú
              </span>
              <button onClick={() => setMenuOpen(false)} className="p-2 text-gray-500 hover:text-black">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col p-6 gap-6 flex-1">
              {navStructure.map((item, i) => (
                <div key={i}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                  >
                    <Link
                      to={item.to}
                      onClick={item.type === "link" ? () => setMenuOpen(false) : undefined}
                      className={`font-display text-3xl font-bold uppercase tracking-wide transition-colors ${
                        location.pathname.startsWith(item.to) ? "text-black" : "text-gray-400 hover:text-black"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                  
                  {item.type === "dropdown" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                      className="flex flex-col ml-4 mt-4 gap-4 border-l-2 border-gray-100 pl-4"
                    >
                      {item.children.map((child, j) => (
                        <Link
                          key={j}
                          to={child.to}
                          onClick={() => setMenuOpen(false)}
                          className={`font-sans text-lg font-medium transition-colors ${
                            location.pathname === child.to ? "text-black" : "text-gray-500 hover:text-black"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Menu Utils (Mobile Footer) */}
            <div className="p-6 bg-gray-50 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-black">
                  <button onClick={() => { openSearch(); setMenuOpen(false); }} className="p-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                  <Link to="/favoritos" onClick={() => setMenuOpen(false)} className="p-2 relative">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {wishlistCount > 0 && (
                      <span className="absolute top-1 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/perfil" onClick={() => setMenuOpen(false)} className="p-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="flex gap-4">
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-white border border-gray-200 text-black py-2 px-3 rounded flex-1 font-sans text-sm"
                >
                  <option value="USD">USD</option>
                  <option value="MXN">MXN</option>
                  <option value="EUR">EUR</option>
                </select>
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-white border border-gray-200 text-black py-2 px-3 rounded flex-1 font-sans text-sm"
                >
                  <option value="es">ESPAÑOL</option>
                  <option value="en">ENGLISH</option>
                </select>
              </div>
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-volt font-bold font-display uppercase tracking-wider text-center py-2 bg-black rounded-lg mt-2">
                Admin Panel
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    <SearchOverlay isOpen={useUIStore((state) => state.isSearchOpen)} onClose={useUIStore((state) => state.closeSearch)} />
    </>
  );
}
