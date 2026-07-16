import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, useUserStore, useOrderStore } from "../store/useStore";
import { useI18nStore } from "../store/useI18nStore";
import { Link } from "react-router-dom";
import { useState } from "react";
import { resolveAsset } from "../utils/resolveAsset";

const confettis = Array.from({ length: 50 }).map(() => ({
  x: Math.random() * 100,
  scale: Math.random() * 1.5 + 0.5,
  rotate: Math.random() * 360,
  duration: Math.random() * 2 + 2,
  repeatDelay: Math.random() * 2,
  bgColor: ["#D4FF00", "#FF4500", "#00E5FF", "#FFF"][Math.floor(Math.random() * 4)],
  borderRadius: Math.random() > 0.5 ? "50%" : "0%"
}));

const InputField = ({ label, name, type = "text", placeholder, maxLength, formData, handleChange, errors, isValid }) => (
  <div style={{ marginBottom: "var(--space-md)", position: "relative" }}>
    <label style={{ display: "block", fontSize: "var(--type-caption)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-ink-soft)", marginBottom: "var(--space-xs)", fontWeight: 500 }}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <input 
        type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} maxLength={maxLength}
        style={{ 
          width: "100%", padding: "var(--space-sm) var(--space-md)", paddingRight: isValid ? "40px" : "var(--space-md)", border: `1px solid ${errors[name] ? 'red' : isValid ? 'var(--color-volt)' : 'var(--color-ink-muted)'}`, 
          backgroundColor: "var(--color-canvas)", fontFamily: "var(--font-body)", color: "var(--color-ink)",
          outline: "none", transition: "all 0.3s ease"
        }}
        onFocus={(e) => e.target.style.borderColor = "var(--color-ink)"}
        onBlur={(e) => e.target.style.borderColor = errors[name] ? 'red' : isValid ? 'var(--color-volt)' : 'var(--color-ink-muted)'}
      />
      <AnimatePresence>
        {isValid && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-volt)", display: "flex" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    <AnimatePresence>
      {errors[name] && (
        <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ color: "red", fontSize: "var(--type-micro)", marginTop: "4px", display: "block" }}>
          {errors[name]}
        </motion.span>
      )}
    </AnimatePresence>
  </div>
);

const ease = [0, 0, 0.2, 1];

export default function CheckoutPage() {
  const { items: cart, clearCart, discountPercent, couponCode } = useCartStore();
  const { user, redeemCoins, addCoins } = useUserStore();
  const { addOrder } = useOrderStore();
  const { formatPrice } = useI18nStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [useCoins, setUseCoins] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderId] = useState(() => Math.floor(Math.random() * 10000));

  const glassStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "var(--space-2xl)",
    marginBottom: "var(--space-3xl)"
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.precioOferta || item.precio) * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const coinsDiscount = useCoins ? Math.min(user.coins / 100, subtotal - discountAmount) : 0;
  const total = subtotal - discountAmount - coinsDiscount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.includes("@")) newErrors.email = "Correo electrónico no válido";
    if (formData.name.trim().length < 3) newErrors.name = "El nombre es muy corto";
    if (formData.address.trim().length < 5) newErrors.address = "Ingresa una dirección completa";
    if (formData.city.trim().length < 3) newErrors.city = "Ingresa una ciudad válida";
    
    if (paymentMethod === "card") {
      if (formData.cardNumber.replace(/\s/g, '').length < 15) newErrors.cardNumber = "Número de tarjeta inválido";
      if (formData.cardExpiry.length !== 5) newErrors.cardExpiry = "Formato MM/AA";
      if (formData.cardCVC.length < 3) newErrors.cardCVC = "CVC inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    if (validateForm()) {
      setIsProcessing(true);
      setTimeout(() => {
        if (useCoins) {
          redeemCoins(Math.floor(coinsDiscount * 100));
        }
        const earnedCoins = Math.floor(total * 5);
        addCoins(earnedCoins);
        
        const newOrder = {
          id: `MX-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: formData.name,
          customerEmail: formData.email,
          date: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: "Procesando",
          total: total,
          items: cart.map(item => ({ nombre: item.nombre, quantity: item.quantity, precio: item.precioOferta || item.precio }))
        };
        addOrder(newOrder);
        
        setIsProcessing(false);
        setIsSuccess(true);
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 2000);
    }
  };

  if (isSuccess) {
    return (
      <main style={{ paddingTop: "var(--space-4xl)", paddingBottom: "var(--space-5xl)", minHeight: "80vh", display: "flex", alignItems: "center" }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 24 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}
          >
            <div style={{ 
              width: "80px", height: "80px", backgroundColor: "var(--color-volt)", 
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto var(--space-xl)", color: "#111"
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", pointerEvents: "none", overflow: "hidden" }}>
              {confettis.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ y: "-10vh", x: `${c.x}vw`, scale: 0, rotate: 0 }}
                  animate={{ 
                    y: "100vh", 
                    x: `${c.x}vw`,
                    scale: c.scale,
                    rotate: c.rotate
                  }}
                  transition={{ duration: c.duration, ease: "easeOut", repeat: Infinity, repeatDelay: c.repeatDelay }}
                  style={{
                    position: "absolute",
                    width: "10px", height: "10px",
                    backgroundColor: c.bgColor,
                    borderRadius: c.borderRadius
                  }}
                />
              ))}
            </div>

            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: "var(--type-h2)",
              fontWeight: 700, letterSpacing: "var(--tracking-tight)", textTransform: "uppercase",
              color: "var(--color-ink)", marginBottom: "var(--space-md)",
            }}>
              ORDEN CONFIRMADA
            </h1>
            
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "var(--type-body)",
              lineHeight: 1.7, color: "var(--color-ink-soft)", marginBottom: "var(--space-2xl)",
            }}>
              Gracias por tu compra, {formData.name.split(' ')[0]}. Hemos enviado los detalles de envío y el número de seguimiento a {formData.email}.
            </p>

            <Link to="/inicio" className="btn btn--primary" style={{ display: "inline-block" }}>
              Volver a la Tienda
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }



  return (
    <main style={{ paddingTop: "var(--space-4xl)", paddingBottom: "var(--space-5xl)" }}>
      <div className="container">
        
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "var(--type-caption)", fontWeight: 500,
            textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-ink-soft)",
            marginBottom: "var(--space-md)",
          }}>
            Checkout Seguro
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "var(--type-hero)",
            lineHeight: "var(--lh-hero)", fontWeight: 700,
            letterSpacing: "var(--tracking-tight)", textTransform: "uppercase",
            color: "var(--color-ink)", marginBottom: "var(--space-3xl)",
          }}>
            FINALIZAR PAGO
          </h1>
        </motion.div>

        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6, ease }}
            style={{ 
              padding: "var(--space-4xl) 0", textAlign: "center", borderTop: "1px solid var(--color-ink-muted)",
              borderBottom: "1px solid var(--color-ink-muted)"
            }}
          >
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "var(--type-body)",
              color: "var(--color-ink-soft)", marginBottom: "var(--space-xl)",
            }}>
              Tu carrito de compras está vacío.
            </p>
            <Link to="/inicio" className="btn btn--secondary" style={{ display: "inline-block" }}>
              Explorar Colección
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 450px", gap: "var(--space-4xl)" }} className="checkout-grid">
            
            {/* Formulario de Checkout */}
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6, ease }}>
              
              {/* Stepper Visual */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-3xl)", position: "relative" }}>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", backgroundColor: "var(--color-ink-muted)", zIndex: 0 }} />
                <div style={{ position: "absolute", top: "50%", left: 0, width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%", height: "2px", backgroundColor: "var(--color-ink)", zIndex: 0, transition: "width 0.4s ease-out" }} />
                
                {[
                  { step: 1, label: "Contacto" },
                  { step: 2, label: "Envío" },
                  { step: 3, label: "Pago" }
                ].map((s) => (
                  <div key={s.step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", position: "relative", zIndex: 1, backgroundColor: "var(--color-canvas)", padding: "0 var(--space-sm)" }}>
                    <div style={{ 
                      width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      backgroundColor: currentStep >= s.step ? "var(--color-ink)" : "var(--color-canvas)",
                      color: currentStep >= s.step ? "var(--color-canvas)" : "var(--color-ink-soft)",
                      border: `2px solid ${currentStep >= s.step ? "var(--color-ink)" : "var(--color-ink-muted)"}`,
                      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px",
                      transition: "all 0.3s ease-out"
                    }}>
                      {s.step}
                    </div>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--type-micro)", fontWeight: currentStep >= s.step ? 600 : 400, textTransform: "uppercase", letterSpacing: "0.05em", color: currentStep >= s.step ? "var(--color-ink)" : "var(--color-ink-soft)" }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCheckout}>
                
                {/* Contacto */}
                <motion.section layout style={{ ...glassStyle, opacity: currentStep >= 1 ? 1 : 0.5, pointerEvents: currentStep >= 1 ? "auto" : "none" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-tight)", borderBottom: "1px solid var(--color-ink)", paddingBottom: "var(--space-sm)", marginBottom: "var(--space-xl)" }}>
                    1. Información de Contacto
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0" }}>
                    <InputField formData={formData} handleChange={handleChange} errors={errors} label="Correo Electrónico" name="email" type="email" placeholder="correo@ejemplo.com" isValid={formData.email.includes("@") && formData.email.includes(".")} />
                    <InputField formData={formData} handleChange={handleChange} errors={errors} label="Nombre Completo" name="name" placeholder="Tu nombre" isValid={formData.name.trim().length >= 3} />
                  </div>
                  <AnimatePresence>
                    {currentStep === 1 && (
                      <motion.button layout type="button" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} onClick={() => setCurrentStep(2)} className="btn btn--secondary" style={{ marginTop: "var(--space-md)", overflow: "hidden" }}>Continuar a Envío</motion.button>
                    )}
                  </AnimatePresence>
                </motion.section>

                {/* Envío */}
                <motion.section layout style={{ ...glassStyle, opacity: currentStep >= 2 ? 1 : 0.5, pointerEvents: currentStep >= 2 ? "auto" : "none" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-tight)", borderBottom: "1px solid var(--color-ink)", paddingBottom: "var(--space-sm)", marginBottom: "var(--space-xl)" }}>
                    2. Dirección de Envío
                  </h2>
                  <InputField formData={formData} handleChange={handleChange} errors={errors} label="Dirección Completa" name="address" placeholder="Av. Principal y Secundaria" isValid={formData.address.trim().length >= 5} />
                  <InputField formData={formData} handleChange={handleChange} errors={errors} label="Ciudad" name="city" placeholder="Guayaquil, Quito..." isValid={formData.city.trim().length >= 3} />
                  <AnimatePresence>
                    {currentStep === 2 && (
                      <motion.div layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-md)", overflow: "hidden" }}>
                        <button type="button" onClick={() => setCurrentStep(1)} className="btn" style={{ border: "1px solid var(--color-ink-muted)", backgroundColor: "transparent" }}>Volver</button>
                        <button type="button" onClick={() => setCurrentStep(3)} className="btn btn--secondary">Continuar a Pago</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.section>

                {/* Método de Pago */}
                <motion.section layout style={{ ...glassStyle, opacity: currentStep >= 3 ? 1 : 0.5, pointerEvents: currentStep >= 3 ? "auto" : "none", marginBottom: currentStep === 3 ? "var(--space-2xl)" : 0 }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-tight)", borderBottom: "1px solid var(--color-ink)", paddingBottom: "var(--space-sm)", marginBottom: "var(--space-xl)" }}>
                    3. Método de Pago
                  </h2>
                  
                  <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-xl)", flexWrap: "wrap" }}>
                    {['card', 'transfer', 'deuna'].map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        style={{
                          flex: 1, minWidth: "120px",
                          padding: "var(--space-md) var(--space-sm)",
                          backgroundColor: paymentMethod === method ? "var(--color-ink)" : "transparent",
                          color: paymentMethod === method ? "var(--color-canvas)" : "var(--color-ink)",
                          border: `1px solid ${paymentMethod === method ? "var(--color-ink)" : "var(--color-ink-muted)"}`,
                          fontFamily: "var(--font-body)", fontSize: "var(--type-caption)", fontWeight: 600,
                          textTransform: "uppercase", cursor: "pointer",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {method === 'card' && "Tarjeta"}
                        {method === 'transfer' && "Transferencia"}
                        {method === 'deuna' && "De Una!"}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {paymentMethod === "card" && (
                      <motion.div
                        key="card"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ backgroundColor: "var(--color-canvas-alt)", padding: "var(--space-xl)", border: "1px solid var(--color-ink-muted)" }}>
                          <p style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", marginBottom: "var(--space-md)", textTransform: "uppercase" }}>Aceptamos Visa y Mastercard</p>
                          <InputField formData={formData} handleChange={handleChange} errors={errors} label="Número de Tarjeta" name="cardNumber" placeholder="0000 0000 0000 0000" maxLength="19" isValid={formData.cardNumber.replace(/\s/g, '').length >= 15} />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                            <InputField formData={formData} handleChange={handleChange} errors={errors} label="Fecha de Expiración" name="cardExpiry" placeholder="MM/AA" maxLength="5" isValid={formData.cardExpiry.length === 5} />
                            <InputField formData={formData} handleChange={handleChange} errors={errors} label="CVC" name="cardCVC" placeholder="123" maxLength="4" isValid={formData.cardCVC.length >= 3} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === "transfer" && (
                      <motion.div
                        key="transfer"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div style={{ backgroundColor: "var(--color-canvas-alt)", padding: "var(--space-xl)", border: "1px solid var(--color-ink-muted)" }}>
                          <p style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", marginBottom: "var(--space-md)", textTransform: "uppercase" }}>Deposita o transfiere a una de nuestras cuentas:</p>
                          
                          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-md)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-ink-muted)", paddingBottom: "var(--space-xs)" }}>
                              <span style={{ fontWeight: 600 }}>Banco Pichincha</span>
                              <span style={{ color: "var(--color-ink-soft)", fontSize: "var(--type-micro)" }}>Cta. Ahorros: 2200001111</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-ink-muted)", paddingBottom: "var(--space-xs)" }}>
                              <span style={{ fontWeight: 600 }}>Produbanco</span>
                              <span style={{ color: "var(--color-ink-soft)", fontSize: "var(--type-micro)" }}>Cta. Corriente: 100002222</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-ink-muted)", paddingBottom: "var(--space-xs)" }}>
                              <span style={{ fontWeight: 600 }}>Banco Guayaquil</span>
                              <span style={{ color: "var(--color-ink-soft)", fontSize: "var(--type-micro)" }}>Cta. Ahorros: 3300003333</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-ink-muted)", paddingBottom: "var(--space-xs)" }}>
                              <span style={{ fontWeight: 600 }}>Banco del Pacífico</span>
                              <span style={{ color: "var(--color-ink-soft)", fontSize: "var(--type-micro)" }}>Cta. Ahorros: 4400004444</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600 }}>Cooperativa JEP</span>
                              <span style={{ color: "var(--color-ink-soft)", fontSize: "var(--type-micro)" }}>Cta. Ahorros: 5500005555</span>
                            </div>
                          </div>
                          
                          <p style={{ fontSize: "var(--type-micro)", color: "var(--color-ink-muted)", marginTop: "var(--space-md)", lineHeight: 1.5 }}>
                            * Al procesar la orden, te enviaremos las instrucciones por correo. Tu orden será despachada una vez que confirmemos el depósito.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === "deuna" && (
                      <motion.div
                        key="deuna"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div style={{ backgroundColor: "var(--color-canvas-alt)", padding: "var(--space-xl)", border: "1px solid var(--color-ink-muted)", textAlign: "center" }}>
                          <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--type-h4)", color: "var(--color-ink)", marginBottom: "var(--space-sm)" }}>Paga con De Una!</h4>
                          <p style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", marginBottom: "var(--space-lg)" }}>Escanea este código desde la app De Una! en tu celular.</p>
                          
                          <div style={{ display: "inline-block", padding: "var(--space-sm)", backgroundColor: "#fff", border: "2px solid var(--color-ink)", borderRadius: "12px", marginBottom: "var(--space-md)" }}>
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=NikeLegado-Orden-${orderId}&bgcolor=ffffff&color=111111`} alt="QR De Una" style={{ display: "block" }} />
                          </div>
                          
                          <p style={{ fontSize: "var(--type-micro)", color: "var(--color-ink-muted)", lineHeight: 1.5 }}>
                            * Haz clic en Pagar cuando hayas completado el escaneo. Verificaremos el pago internamente.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <AnimatePresence>
                    {currentStep === 3 && (
                      <motion.div layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: "var(--space-md)", overflow: "hidden" }}>
                        <button type="button" onClick={() => setCurrentStep(2)} className="btn" style={{ border: "1px solid var(--color-ink-muted)", backgroundColor: "transparent", marginBottom: "var(--space-xl)" }}>Volver</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.section>

                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ position: "relative" }}>
                    <button 
                      type="submit" 
                      className="btn btn--primary" 
                      disabled={isProcessing}
                      style={{ width: "100%", padding: "var(--space-lg)", fontSize: "var(--type-h4)", opacity: isProcessing ? 0.7 : 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}
                    >
                      {isProcessing ? (
                        <>
                          <motion.svg animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></motion.svg>
                          PROCESANDO...
                        </>
                      ) : `CONFIRMAR ORDEN (${formatPrice(total)})`}
                    </button>
                    <p style={{ textAlign: "center", fontSize: "var(--type-micro)", color: "var(--color-ink-soft)", marginTop: "var(--space-sm)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Pago Seguro Encriptado (Simulación)
                    </p>
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Resumen de la Orden (Sidebar) */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6, ease }}>
              <div style={{ position: "sticky", top: "100px" }}>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "var(--tracking-tight)", color: "var(--color-ink)",
                  borderBottom: "1px solid var(--color-ink)", paddingBottom: "var(--space-sm)", marginBottom: "var(--space-xl)"
                }}>
                  TU CARRITO ({cart.length})
                </h2>
                
                <div style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "var(--space-sm)", marginBottom: "var(--space-xl)" }}>
                  {cart.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} style={{ 
                      display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-md)",
                      paddingBottom: "var(--space-md)", borderBottom: "1px solid var(--color-ink-muted)"
                    }}>
                      <div style={{ width: "80px", height: "80px", backgroundColor: "var(--color-canvas-alt)", flexShrink: 0 }}>
                        <img 
                          src={resolveAsset(item.imagenes[0])} 
                          alt={item.nombre} 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-body)", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>{item.nombre}</h4>
                          <p style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", margin: "4px 0 0 0", textTransform: "uppercase" }}>
                            Talla: {item.size} {item.color && `| Color: ${item.color}`}
                          </p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", fontWeight: 500 }}>CANT: {item.quantity}</span>
                          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>{formatPrice((item.precioOferta || item.precio) * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ backgroundColor: "var(--color-canvas-alt)", padding: "var(--space-xl)", border: "1px solid var(--color-ink-muted)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)", fontFamily: "var(--font-body)", color: "var(--color-ink)" }}>
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)", color: "#D30005", fontSize: "var(--type-body-sm)" }}>
                      <span>Cupón ({couponCode})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  {user.coins > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", padding: "var(--space-sm)", border: "1px solid var(--color-volt)", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(212, 255, 0, 0.05)" }}>
                      <div>
                        <span style={{ fontSize: "var(--type-caption)", fontWeight: 700, display: "block" }}>NikeCoins</span>
                        <span style={{ fontSize: "var(--type-micro)", color: "var(--color-ink-soft)" }}>Tienes {user.coins} disponibles ({formatPrice(user.coins/100)})</span>
                      </div>
                      <button 
                        onClick={() => setUseCoins(!useCoins)}
                        className={`btn ${useCoins ? 'btn--secondary' : 'btn--volt'} btn--sm`}
                        style={{ padding: "4px 12px" }}
                      >
                        {useCoins ? "Cancelar" : "Canjear"}
                      </button>
                    </div>
                  )}

                  {useCoins && coinsDiscount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)", color: "var(--color-volt)", fontSize: "var(--type-body-sm)" }}>
                      <span>Descuento Coins</span>
                      <span>-{formatPrice(coinsDiscount)}</span>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-xl)", fontFamily: "var(--font-body)", color: "var(--color-ink-soft)" }}>
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "var(--space-md)", borderTop: "1px solid var(--color-ink-muted)" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, textTransform: "uppercase" }}>Total</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", fontWeight: 700, color: "var(--color-volt)", textShadow: "0 0 1px #000" }}>{formatPrice(total)}</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}

        <style>{`
          @media (max-width: 900px) {
            .checkout-grid {
              grid-template-columns: 1fr !important;
              gap: var(--space-2xl) !important;
            }
          }
        `}</style>
      </div>
    </main>
  );
}


