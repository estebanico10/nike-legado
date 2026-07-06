import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useCartStore, useUIStore, useWishlistStore } from "../store/useStore";
import SearchOverlay from "./SearchOverlay";

const navLinks = [
  { to: "/inicio", label: "Inicio" },
  { to: "/tienda", label: "Tienda" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  
  const { scrollY } = useScroll();
  const cartCount = useCartStore((state) => state.getCartCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { openCart, openSearch } = useUIStore();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 50 && latest > previous) {
      setHidden(true);
      setMenuOpen(false); // Close menu on scroll down
    } else {
      setHidden(false);
    }
    setScrolled(latest > 20);
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: scrolled ? "var(--color-canvas-nav)" : "var(--color-canvas)",
        backdropFilter: scrolled ? "blur(12px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px) saturate(180%)" : "none",
        borderBottom: `1px solid ${scrolled ? "var(--color-ink-muted)" : "var(--color-ink-muted)"}`,
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.08)" : "none",
        transition: "background-color var(--duration-std) var(--ease-std), backdrop-filter var(--duration-std) var(--ease-std), box-shadow var(--duration-std) var(--ease-std)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link to="/inicio" style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "48px", height: "auto", color: "var(--color-ink)" }}
            aria-label="Nike Legado"
          >
            <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z" />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--type-body-sm)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-ink)",
            }}
          >
            Legado
          </span>
        </Link>

        {/* Desktop Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-xl)",
          }}
          className="nav-desktop"
        >
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--type-body-sm)",
                  fontWeight: isActive ? 600 : 400,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: isActive ? "var(--color-ink)" : "var(--color-ink-soft)",
                  position: "relative",
                  paddingBottom: "var(--space-2xs)",
                  transition: "color var(--duration-micro) var(--ease-out)",
                }}
              >
                {label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "var(--color-ink)",
                    }}
                    transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Theme + Cart + Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <ThemeToggle />

          {/* Admin Link */}
          <Link to="/admin" style={{ display: "flex", alignItems: "center", color: "var(--color-ink)", padding: "var(--space-xs)" }} aria-label="Admin Panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </Link>

          {/* Search Icon */}
          <button 
            onClick={openSearch}
            style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--color-ink)", padding: "var(--space-xs)" }} 
            aria-label="Buscar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {/* Wishlist Icon */}
          <Link to="/favoritos" style={{ position: "relative", display: "flex", alignItems: "center", color: "var(--color-ink)", padding: "var(--space-xs)" }} aria-label="Favoritos">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} style={{ position: "absolute", top: 0, right: 0, backgroundColor: "var(--color-ink)", color: "var(--color-canvas)", fontSize: "10px", fontWeight: "bold", width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transform: "translate(25%, -25%)" }}>
                  {wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* User Icon */}
          <Link to="/perfil" style={{ display: "flex", alignItems: "center", color: "var(--color-ink)", padding: "var(--space-xs)" }} aria-label="Mi Cuenta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          {/* Cart Icon */}
          <button onClick={openCart} style={{ position: "relative", display: "flex", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-ink)", padding: "var(--space-xs)" }} aria-label="Carrito">
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
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "var(--color-volt)",
                    color: "#111",
                    fontSize: "10px",
                    fontWeight: "bold",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "translate(25%, -25%)"
                  }}
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
            className="nav-hamburger"
            style={{
              display: "none",
              flexDirection: "column",
              gap: "5px",
              padding: "var(--space-xs)",
            }}
          >
            <span
              style={{
                display: "block",
                width: "20px",
                height: "2px",
                backgroundColor: "var(--color-ink)",
                transition: "transform var(--duration-micro) var(--ease-out)",
                transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: "20px",
                height: "2px",
                backgroundColor: "var(--color-ink)",
                transition: "opacity var(--duration-micro) var(--ease-out)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: "20px",
                height: "2px",
                backgroundColor: "var(--color-ink)",
                transition: "transform var(--duration-micro) var(--ease-out)",
                transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
            style={{
              overflow: "hidden",
              borderTop: "1px solid var(--color-ink-muted)",
              backgroundColor: "var(--color-canvas)",
            }}
            className="nav-mobile-menu"
          >
            <div
              className="container"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "var(--space-xl) var(--space-md) var(--space-4xl) var(--space-md)",
                gap: "var(--space-xl)",
                minHeight: "100vh"
              }}
            >
              {navLinks.map(({ to, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Link
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2.5rem, 8vw, 4rem)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color:
                        location.pathname === to
                          ? "var(--color-ink)"
                          : "var(--color-ink-soft)",
                      textDecoration: "none"
                    }}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1, duration: 0.4 }}
              >
                <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2rem, 6vw, 3rem)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: "var(--color-volt)",
                      marginTop: "var(--space-2xl)",
                      display: "block",
                      textDecoration: "none"
                    }}
                  >
                    ADMIN PANEL
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menú y Overlays ya manejados por Zustand desde App.jsx, pero dejamos Search si se prefiere aquí */}
      <SearchOverlay isOpen={useUIStore((state) => state.isSearchOpen)} onClose={useUIStore((state) => state.closeSearch)} />

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 768px) {
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>
    </motion.nav>
  );
}
