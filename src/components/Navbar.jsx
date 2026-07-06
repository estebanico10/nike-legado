import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useProducts } from "../context/ProductContext";

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
  const { cart } = useProducts();

  const cartItemsCount = cart.reduce((total, item) => total + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
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

          {/* Cart Icon */}
          <Link to="/checkout" style={{ position: "relative", display: "flex", alignItems: "center", color: "var(--color-ink)", padding: "var(--space-xs)" }} aria-label="Carrito">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <AnimatePresence>
              {cartItemsCount > 0 && (
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
                  {cartItemsCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

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
                padding: "var(--space-lg) var(--space-md)",
                gap: "var(--space-lg)",
              }}
            >
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--type-h3)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color:
                      location.pathname === to
                        ? "var(--color-ink)"
                        : "var(--color-ink-soft)",
                  }}
                >
                  {label}
                </Link>
              ))}
              <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--type-h3)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "var(--color-volt)",
                    marginTop: "var(--space-md)"
                  }}
                >
                  ADMIN PANEL
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
