import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ProductProvider } from "./context/ProductContext";
import { SiteProvider } from "./context/SiteContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PortalPage from "./pages/PortalPage";
import TiendaPage from "./pages/TiendaPage";
import NosotrosPage from "./pages/NosotrosPage";
import ContactoPage from "./pages/ContactoPage";
import AdminPage from "./pages/AdminPage";
import CheckoutPage from "./pages/CheckoutPage";

function Footer() {
  const navLinks = [
    { label: "Inicio", href: "/inicio" },
    { label: "Tienda", href: "/tienda" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Contacto", href: "/contacto" },
  ];

  const legalLinks = [
    { label: "Privacidad", href: "#" },
    { label: "Términos", href: "#" },
    { label: "Cookies", href: "#" },
  ];

  const socials = [
    {
      label: "Instagram",
      href: "#",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      label: "TikTok",
      href: "#",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
        </svg>
      ),
    },
    {
      label: "Twitter / X",
      href: "#",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      style={{
        backgroundColor: "var(--color-canvas)",
        borderTop: "1px solid var(--color-ink-muted)",
        paddingTop: "var(--space-4xl)",
        paddingBottom: "var(--space-lg)",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--space-3xl)",
          marginBottom: "var(--space-3xl)",
        }}
      >
        {/* Brand Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{ width: "40px", height: "auto", color: "var(--color-ink)" }}
            aria-label="Nike"
          >
            <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z" />
          </svg>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--type-body-sm)",
              color: "var(--color-ink-soft)",
              lineHeight: 1.7,
              maxWidth: "260px",
            }}
          >
            Streetwear × Herencia Ecuatoriana. Colección cápsula diseñada desde los Andes para las calles del mundo.
          </p>
          <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-xs)" }}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                style={{
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-ink-soft)",
                  border: "1px solid var(--color-ink-muted)",
                  transition: "color 0.2s, border-color 0.2s, background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-ink)";
                  e.currentTarget.style.borderColor = "var(--color-ink)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-ink-soft)";
                  e.currentTarget.style.borderColor = "var(--color-ink-muted)";
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Nav Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          <h4
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--type-caption)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-ink)",
              marginBottom: "var(--space-xs)",
            }}
          >
            Explorar
          </h4>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--type-body-sm)",
                color: "var(--color-ink-soft)",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-ink-soft)")}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Newsletter Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <h4
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--type-caption)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-ink)",
            }}
          >
            Newsletter
          </h4>
          <p style={{ fontSize: "var(--type-body-sm)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>
            Sé el primero en conocer los lanzamientos de edición limitada.
          </p>
          <div style={{ display: "flex", gap: "var(--space-xs)" }}>
            <input
              type="email"
              placeholder="tu@email.com"
              style={{
                flex: 1,
                padding: "var(--space-sm) var(--space-md)",
                border: "1.5px solid var(--color-ink-muted)",
                backgroundColor: "transparent",
                fontFamily: "var(--font-body)",
                fontSize: "var(--type-body-sm)",
                color: "var(--color-ink)",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-ink)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-ink-muted)")}
            />
            <button
              className="btn btn--primary btn--sm"
              style={{ whiteSpace: "nowrap", borderRadius: 0 }}
              onClick={(e) => e.preventDefault()}
            >
              OK
            </button>
          </div>
        </div>
      </div>

      {/* Legal Bar */}
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-md)",
          paddingTop: "var(--space-lg)",
          borderTop: "1px solid var(--color-ink-muted)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--type-caption)",
            color: "var(--color-ink-soft)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          © 2026 Nike Legado — FRENM Studios · Hecho en Ecuador 🇪🇨
        </p>
        <div style={{ display: "flex", gap: "var(--space-lg)" }}>
          {legalLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--type-caption)",
                color: "var(--color-ink-soft)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-ink-soft)")}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

import CustomCursor from "./components/CustomCursor";

function AppRoutes() {
  const location = useLocation();

  /* Admin and Portal page have their own layouts — no navbar/footer */
  if (location.pathname === "/admin" || location.pathname === "/") {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PortalPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/tienda" element={<TiendaPage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </AnimatePresence>
      <hr className="section-divider" />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ProductProvider>
        <SiteProvider>
          <CustomCursor />
          <AppRoutes />
        </SiteProvider>
      </ProductProvider>
    </BrowserRouter>
  );
}
