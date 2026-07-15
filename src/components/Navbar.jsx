import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useCartStore, useUIStore, useWishlistStore } from "../store/useStore";
import SearchOverlay from "./SearchOverlay";
import ThemeToggle from "./ThemeToggle";

const navStructure = [
  { to: "/inicio", label: "Inicio", type: "link" },
  { 
    label: "Colecciones", 
    type: "dropdown",
    to: "/tienda",
    children: [
      { to: "/tienda", label: "Tienda Oficial", desc: "Todo el catálogo." },
      { to: "/drops", label: "SNKRS Drops", desc: "Lanzamientos limitados." },
    ]
  },
  { 
    label: "Experiencias", 
    type: "dropdown",
    to: "/customizer",
    children: [
      { to: "/customizer", label: "Nike By You", desc: "Crea tu propio estilo 3D." },
      { to: "/comunidad", label: "OOTD Comunidad", desc: "Inspírate y comparte." },
      { to: "/club", label: "Nike Club", desc: "Beneficios exclusivos." },
    ]
  },
  { 
    label: "Conócenos", 
    type: "dropdown",
    to: "/nosotros",
    children: [
      { to: "/nosotros", label: "El Legado", desc: "Nuestra historia." },
      { to: "/contacto", label: "Contacto", desc: "Ayuda y tiendas." },
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
          ? "h-16 bg-[var(--color-canvas)]/90 backdrop-blur-md shadow-sm border-b border-[var(--color-ink-muted)]"
          : "h-20 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-global mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* Mobile Left: Hamburger */}
        <div className="flex xl:hidden items-center flex-1">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
            className="p-2 -ml-2 text-[var(--color-ink)] hover:opacity-70 transition-opacity"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span className={`h-0.5 bg-current transition-transform duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`h-0.5 bg-current transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`h-0.5 bg-current transition-transform duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>

        {/* Logo */}
        <div className="flex justify-center xl:justify-start flex-1 xl:flex-none">
          <Link to="/inicio" className="flex items-center gap-2 group">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 xl:w-12 h-auto text-[var(--color-ink)] group-hover:scale-105 transition-transform duration-300"
              aria-label="Nike Legado"
            >
              <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z" />
            </svg>
            <span className="hidden sm:block font-display text-sm font-bold tracking-[0.12em] uppercase text-[var(--color-ink)]">
              Legado
            </span>
          </Link>
        </div>

        {/* Desktop Links (Center) */}
        <div className="hidden xl:flex items-center justify-center flex-1 gap-8 px-4 h-full">
          {navStructure.map((item, idx) => {
            const isActive = location.pathname.startsWith(item.to) && item.to !== "/inicio";
            const isExactHome = location.pathname === "/inicio" && item.to === "/inicio";
            const isHighlighted = isActive || isExactHome;

            return (
              <div 
                key={idx} 
                className="relative h-full flex items-center group"
                onMouseEnter={() => item.type === "dropdown" && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.to}
                  className={`relative font-sans text-xs lg:text-sm font-semibold uppercase tracking-wider py-2 transition-colors duration-200 flex items-center gap-1.5 ${
                    isHighlighted ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {item.label}
                  {item.type === "dropdown" && (
                    <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180 text-[var(--color-volt)]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  {isHighlighted && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-[-16px] left-0 right-0 h-[2px] bg-[var(--color-volt)]"
                      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
                    />
                  )}
                </Link>

                {/* Desktop Dropdown Menu */}
                {item.type === "dropdown" && (
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[var(--color-canvas)] shadow-2xl rounded-xl overflow-hidden border border-[var(--color-ink-muted)] z-50"
                      >
                        <div className="py-2 flex flex-col">
                          {item.children.map((child, i) => (
                            <Link
                              key={i}
                              to={child.to}
                              className="px-5 py-3 hover:bg-[var(--color-canvas-alt)] flex flex-col transition-colors group/link"
                            >
                              <span className="font-display font-medium uppercase text-sm text-[var(--color-ink)] group-hover/link:text-[var(--color-volt)] transition-colors">
                                {child.label}
                              </span>
                              <span className="font-sans text-[11px] text-[var(--color-ink-muted)] mt-1 opacity-80">
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

        {/* Right Utils (Clean & Modern) */}
        <div className="flex items-center justify-end flex-1 gap-3 xl:gap-5">
          
          <div className="hidden xl:block">
            <ThemeToggle />
          </div>

          <button 
            onClick={openSearch}
            className="hidden xl:flex p-2 text-[var(--color-ink)] hover:opacity-70 transition-opacity items-center gap-1.5"
            aria-label="Buscar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <Link to="/favoritos" className="hidden xl:flex relative p-2 text-[var(--color-ink)] hover:opacity-70 transition-opacity" aria-label="Favoritos">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} 
                  className="absolute top-1 right-0 bg-[var(--color-volt)] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <Link to="/perfil" className="hidden xl:flex p-2 text-[var(--color-ink)] hover:opacity-70 transition-opacity" aria-label="Mi Cuenta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          <Link to="/admin" className="hidden xl:flex p-2 text-[var(--color-ink)] hover:text-[var(--color-volt)] transition-colors" aria-label="Admin Panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </Link>

          <button onClick={openCart} className="relative p-2 text-[var(--color-ink)] hover:opacity-70 transition-opacity flex items-center" aria-label="Carrito">
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
                  className="absolute top-0 right-0 bg-[var(--color-volt)] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1/4"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] xl:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[400px] bg-[var(--color-canvas)] z-[70] shadow-2xl xl:hidden overflow-y-auto flex flex-col"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-ink-muted)]">
              <span className="font-display text-xl font-bold uppercase tracking-widest text-[var(--color-ink)]">
                Menú
              </span>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <button onClick={() => setMenuOpen(false)} className="p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
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
                        (location.pathname.startsWith(item.to) && item.to !== '/inicio') || (location.pathname === '/inicio' && item.to === '/inicio') 
                        ? "text-[var(--color-ink)]" 
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
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
                      className="flex flex-col ml-4 mt-4 gap-4 border-l-2 border-[var(--color-ink-muted)] pl-4"
                    >
                      {item.children.map((child, j) => (
                        <Link
                          key={j}
                          to={child.to}
                          onClick={() => setMenuOpen(false)}
                          className={`font-sans text-lg font-medium transition-colors ${
                            location.pathname === child.to ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
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

            {/* Mobile Utils */}
            <div className="p-6 bg-[var(--color-canvas-alt)] flex flex-col gap-6">
              <div className="flex justify-around items-center text-[var(--color-ink)]">
                <button onClick={() => { openSearch(); setMenuOpen(false); }} className="p-3 bg-[var(--color-canvas)] rounded-full shadow-sm hover:scale-105 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
                <Link to="/favoritos" onClick={() => setMenuOpen(false)} className="p-3 bg-[var(--color-canvas)] rounded-full shadow-sm hover:scale-105 transition-transform relative">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  {wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 bg-[var(--color-volt)] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4">{wishlistCount}</span>
                  )}
                </Link>
                <Link to="/perfil" onClick={() => setMenuOpen(false)} className="p-3 bg-[var(--color-canvas)] rounded-full shadow-sm hover:scale-105 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </Link>
              </div>
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-black font-bold font-display uppercase tracking-wider text-center py-3 bg-[var(--color-volt)] rounded-lg hover:brightness-110 transition-all">
                Administración
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
