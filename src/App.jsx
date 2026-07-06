import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
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
import LoadingScreen from "./components/LoadingScreen";
import PageTransition from "./components/PageTransition";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import { useState } from "react";
import CustomCursor from "./components/CustomCursor";

function AppRoutes() {
  const location = useLocation();

  /* Admin and Portal page have their own layouts — no navbar/footer */
  if (location.pathname === "/admin" || location.pathname === "/") {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition transitionKey="portal"><PortalPage /></PageTransition>} />
          <Route path="/admin" element={<PageTransition transitionKey="admin"><AdminPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/inicio" element={<PageTransition transitionKey="inicio"><HomePage /></PageTransition>} />
          <Route path="/tienda" element={<PageTransition transitionKey="tienda"><TiendaPage /></PageTransition>} />
          <Route path="/nosotros" element={<PageTransition transitionKey="nosotros"><NosotrosPage /></PageTransition>} />
          <Route path="/contacto" element={<PageTransition transitionKey="contacto"><ContactoPage /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition transitionKey="checkout"><CheckoutPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <hr className="section-divider" />
      <Footer />
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <HashRouter>
      <ProductProvider>
        <SiteProvider>
          <ScrollProgress />
          <CustomCursor />
          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingScreen key="loading" onComplete={() => setLoading(false)} />
            ) : (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <AppRoutes />
                <BackToTop />
              </motion.div>
            )}
          </AnimatePresence>
        </SiteProvider>
      </ProductProvider>
    </HashRouter>
  );
}
