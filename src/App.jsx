import { HelmetProvider } from "react-helmet-async";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ProductProvider } from "./context/ProductContext";
import { SiteProvider } from "./context/SiteContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import { lazy, Suspense, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import PageTransition from "./components/PageTransition";
import PageLoadingIndicator from "./components/PageLoadingIndicator";

const HomePage = lazy(() => import("./pages/HomePage"));
const PortalPage = lazy(() => import("./pages/PortalPage"));
const TiendaPage = lazy(() => import("./pages/TiendaPage"));
const ProductoPage = lazy(() => import("./pages/ProductoPage"));
const NosotrosPage = lazy(() => import("./pages/NosotrosPage"));
const ContactoPage = lazy(() => import("./pages/ContactoPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const PresentationPage = lazy(() => import("./pages/PresentationPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const CustomizerPage = lazy(() => import("./pages/CustomizerPage"));
const DropsPage = lazy(() => import("./pages/DropsPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const ClubPage = lazy(() => import("./pages/ClubPage"));
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import { useState } from "react";
import WhatsAppFAB from "./components/WhatsAppFAB";
import CustomCursor from "./components/CustomCursor";
import ExitIntentPopup from "./components/ExitIntentPopup";
import LuckyWheel from "./components/LuckyWheel";
import CartDrawer from "./components/CartDrawer";
import AIPersonalShopper from "./components/AIPersonalShopper";
import { useUIStore, useThemeStore } from "./store/useStore";
import { useToast } from "./context/ToastContext";

function AppRoutes() {
  const location = useLocation();
  const { accentColor } = useThemeStore();

  useEffect(() => {
    document.documentElement.style.setProperty('--color-volt', accentColor);
  }, [accentColor]);

  /* Admin and Portal page have their own layouts — no navbar/footer */
  if (location.pathname === "/admin" || location.pathname === "/" || location.pathname === "/login" || location.pathname === "/perfil" || location.pathname === "/favoritos" || location.pathname === "/presentacion") {
    return (
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoadingIndicator />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition transitionKey="portal"><PortalPage /></PageTransition>} />
            <Route path="/presentacion" element={<PageTransition transitionKey="presentacion"><PresentationPage /></PageTransition>} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/favoritos" element={<WishlistPage />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    );
  }

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoadingIndicator />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/inicio" element={<PageTransition transitionKey="inicio"><HomePage /></PageTransition>} />
            <Route path="/tienda" element={<PageTransition transitionKey="tienda"><TiendaPage /></PageTransition>} />
            <Route path="/customizer" element={<PageTransition transitionKey="customizer"><CustomizerPage /></PageTransition>} />
            <Route path="/drops" element={<PageTransition transitionKey="drops"><DropsPage /></PageTransition>} />
            <Route path="/comunidad" element={<PageTransition transitionKey="comunidad"><CommunityPage /></PageTransition>} />
            <Route path="/club" element={<PageTransition transitionKey="club"><ClubPage /></PageTransition>} />
            <Route path="/producto/:id" element={<PageTransition transitionKey="producto"><ProductoPage /></PageTransition>} />
            <Route path="/nosotros" element={<PageTransition transitionKey="nosotros"><NosotrosPage /></PageTransition>} />
            <Route path="/contacto" element={<PageTransition transitionKey="contacto"><ContactoPage /></PageTransition>} />
            <Route path="/checkout" element={<PageTransition transitionKey="checkout"><CheckoutPage /></PageTransition>} />
            <Route path="*" element={<PageTransition transitionKey="404"><NotFoundPage /></PageTransition>} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      <hr className="section-divider" />
      <Footer />
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const { isLuckyWheelOpen, closeLuckyWheel } = useUIStore();
  const { addToast } = useToast();

  useEffect(() => {
    const handleOffline = () => addToast("Estás desconectado. Revisa tu conexión a internet.", "error");
    const handleOnline = () => addToast("Conexión restaurada.", "success");

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [addToast]);

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      
      {/* Skip Navigation Link (a11y) */}
      <a 
        href="#main-content" 
        style={{
          position: "absolute", top: "-40px", left: "0px", background: "var(--color-volt)", color: "#111", 
          padding: "8px", zIndex: 10000, transition: "top 0.2s"
        }}
        onFocus={(e) => e.target.style.top = "0px"}
        onBlur={(e) => e.target.style.top = "-40px"}
      >
        Saltar al contenido principal
      </a>

      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" onComplete={() => setLoading(false)} />
        ) : (
          <motion.div id="main-content" tabIndex="-1" key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ outline: 'none' }}>
            <AppRoutes />
            <BackToTop />
            <WhatsAppFAB />
            <AIPersonalShopper />
            <ExitIntentPopup />
            <CartDrawer />
            {isLuckyWheelOpen && <LuckyWheel onClose={closeLuckyWheel} />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
export default function AppWrapper() {
  return (
    <HelmetProvider>
      <HashRouter>
        <ProductProvider>
          <SiteProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </SiteProvider>
        </ProductProvider>
      </HashRouter>
    </HelmetProvider>
  );
}
