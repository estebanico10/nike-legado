import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../context/ProductContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { resolveAsset } from "../utils/resolveAsset";

const InputField = ({ label, name, type = "text", placeholder, maxLength, formData, handleChange, errors }) => (
  <div style={{ marginBottom: "var(--space-md)" }}>
    <label style={{ display: "block", fontSize: "var(--type-caption)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-ink-soft)", marginBottom: "var(--space-xs)", fontWeight: 500 }}>
      {label}
    </label>
    <input 
      type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} maxLength={maxLength}
      style={{ 
        width: "100%", padding: "var(--space-sm) var(--space-md)", border: `1px solid ${errors[name] ? 'red' : 'var(--color-ink-muted)'}`, 
        backgroundColor: "var(--color-canvas)", fontFamily: "var(--font-body)", color: "var(--color-ink)",
        outline: "none", transition: "border-color 0.3s ease"
      }}
      onFocus={(e) => e.target.style.borderColor = "var(--color-ink)"}
      onBlur={(e) => e.target.style.borderColor = errors[name] ? 'red' : 'var(--color-ink-muted)'}
    />
    {errors[name] && <span style={{ color: "red", fontSize: "var(--type-micro)", marginTop: "4px", display: "block" }}>{errors[name]}</span>}
  </div>
);

const ease = [0, 0, 0.2, 1];

export default function CheckoutPage() {
  const { cart, clearCart } = useProducts();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card', 'transfer', 'deuna'
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

  const subtotal = cart.reduce((acc, item) => acc + (item.precioOferta || item.precio) * item.qty, 0);
  const total = subtotal;

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
      // Simular procesamiento de pago
      setTimeout(() => {
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
                <section style={{ ...glassStyle, opacity: currentStep >= 1 ? 1 : 0.5, pointerEvents: currentStep >= 1 ? "auto" : "none" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-tight)", borderBottom: "1px solid var(--color-ink)", paddingBottom: "var(--space-sm)", marginBottom: "var(--space-xl)" }}>
                    1. Información de Contacto
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0" }}>
                    <InputField formData={formData} handleChange={handleChange} errors={errors} label="Correo Electrónico" name="email" type="email" placeholder="correo@ejemplo.com" />
                    <InputField formData={formData} handleChange={handleChange} errors={errors} label="Nombre Completo" name="name" placeholder="Tu nombre" />
                  </div>
                  {currentStep === 1 && (
                    <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setCurrentStep(2)} className="btn btn--secondary" style={{ marginTop: "var(--space-md)" }}>Continuar a Envío</motion.button>
                  )}
                </section>

                {/* Envío */}
                <section style={{ ...glassStyle, opacity: currentStep >= 2 ? 1 : 0.5, pointerEvents: currentStep >= 2 ? "auto" : "none" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "var(--tracking-tight)", borderBottom: "1px solid var(--color-ink)", paddingBottom: "var(--space-sm)", marginBottom: "var(--space-xl)" }}>
                    2. Dirección de Envío
                  </h2>
                  <InputField formData={formData} handleChange={handleChange} errors={errors} label="Dirección Completa" name="address" placeholder="Av. Principal y Secundaria" />
                  <InputField formData={formData} handleChange={handleChange} errors={errors} label="Ciudad" name="city" placeholder="Guayaquil, Quito..." />
                  {currentStep === 2 && (
                    <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-md)" }}>
                      <motion.button type="button" onClick={() => setCurrentStep(1)} className="btn" style={{ border: "1px solid var(--color-ink-muted)", backgroundColor: "transparent" }}>Volver</motion.button>
                      <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setCurrentStep(3)} className="btn btn--secondary">Continuar a Pago</motion.button>
                    </div>
                  )}
                </section>

                {/* Método de Pago */}
                <section style={{ ...glassStyle, opacity: currentStep >= 3 ? 1 : 0.5, pointerEvents: currentStep >= 3 ? "auto" : "none", marginBottom: currentStep === 3 ? "var(--space-2xl)" : 0 }}>
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
                      >
                        <div style={{ backgroundColor: "var(--color-canvas-alt)", padding: "var(--space-xl)", border: "1px solid var(--color-ink-muted)" }}>
                          <p style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", marginBottom: "var(--space-md)", textTransform: "uppercase" }}>Aceptamos Visa y Mastercard</p>
                          <InputField formData={formData} handleChange={handleChange} errors={errors} label="Número de Tarjeta" name="cardNumber" placeholder="0000 0000 0000 0000" maxLength="19" />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                            <InputField formData={formData} handleChange={handleChange} errors={errors} label="Fecha de Expiración" name="cardExpiry" placeholder="MM/AA" maxLength="5" />
                            <InputField formData={formData} handleChange={handleChange} errors={errors} label="CVC" name="cardCVC" placeholder="123" maxLength="4" />
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
                  
                  {currentStep === 3 && (
                    <div style={{ marginTop: "var(--space-md)" }}>
                      <motion.button type="button" onClick={() => setCurrentStep(2)} className="btn" style={{ border: "1px solid var(--color-ink-muted)", backgroundColor: "transparent", marginBottom: "var(--space-xl)" }}>Volver</motion.button>
                    </div>
                  )}
                </section>

                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <button 
                      type="submit" 
                      className="btn btn--primary" 
                      disabled={isProcessing}
                      style={{ width: "100%", padding: "var(--space-lg)", fontSize: "var(--type-h4)", opacity: isProcessing ? 0.7 : 1 }}
                    >
                      {isProcessing ? "PROCESANDO..." : `CONFIRMAR ORDEN ($${total.toFixed(2)})`}
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
                          <span style={{ fontSize: "var(--type-caption)", color: "var(--color-ink-soft)", fontWeight: 500 }}>CANT: {item.qty}</span>
                          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>${((item.precioOferta || item.precio) * item.qty).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ backgroundColor: "var(--color-canvas-alt)", padding: "var(--space-xl)", border: "1px solid var(--color-ink-muted)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)", fontFamily: "var(--font-body)", color: "var(--color-ink)" }}>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-xl)", fontFamily: "var(--font-body)", color: "var(--color-ink-soft)" }}>
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "var(--space-md)", borderTop: "1px solid var(--color-ink-muted)" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h4)", fontWeight: 700, textTransform: "uppercase" }}>Total</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--type-h3)", fontWeight: 700, color: "var(--color-volt)", textShadow: "0 0 1px #000" }}>${total.toFixed(2)}</span>
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


