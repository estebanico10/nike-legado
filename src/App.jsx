import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ProductProvider } from "./context/ProductContext";
import { SiteProvider } from "./context/SiteContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import { lazy, Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";
import PageTransition from "./components/PageTransition";

const HomePage = lazy(() => import("./pages/HomePage"));
const PortalPage = lazy(() => import("./pages/PortalPage"));
const TiendaPage = lazy(() => import("./pages/TiendaPage"));
const ProductoPage = lazy(() => import("./pages/ProductoPage"));
const NosotrosPage = lazy(() => import("./pages/NosotrosPage"));
const ContactoPage = lazy(() => import("./pages/ContactoPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
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
        <Suspense fallback={<LoadingScreen key="lazy-loading-admin" />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition transitionKey="portal"><PortalPage /></PageTransition>} />
            <Route path="/admin" element={<PageTransition transitionKey="admin"><AdminPage /></PageTransition>} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    );
  }

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingScreen key="lazy-loading" />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/inicio" element={<PageTransition transitionKey="inicio"><HomePage /></PageTransition>} />
            <Route path="/tienda" element={<PageTransition transitionKey="tienda"><TiendaPage /></PageTransition>} />
            <Route path="/producto/:id" element={<PageTransition transitionKey="producto"><ProductoPage /></PageTransition>} />
            <Route path="/nosotros" element={<PageTransition transitionKey="nosotros"><NosotrosPage /></PageTransition>} />
            <Route path="/contacto" element={<PageTransition transitionKey="contacto"><ContactoPage /></PageTransition>} />
            <Route path="/checkout" element={<PageTransition transitionKey="checkout"><CheckoutPage /></PageTransition>} />
          </Routes>
        </Suspense>
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
          <ToastProvider>
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
          </ToastProvider>
        </SiteProvider>
      </ProductProvider>
    </HashRouter>
  );
}
