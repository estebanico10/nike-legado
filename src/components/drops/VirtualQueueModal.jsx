import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../../store/useStore";
import { useToast } from "../../context/ToastContext";
import { resolveAsset } from "../../utils/resolveAsset";

const SIZES = ["US 7", "US 7.5", "US 8", "US 8.5", "US 9", "US 9.5", "US 10", "US 10.5", "US 11", "US 12"];

export default function VirtualQueueModal({ isOpen, onClose, drop }) {
  const [queueStatus, setQueueStatus] = useState("checking"); // 'checking' | 'granted' | 'expired'
  const [checkingProgress, setCheckingProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [selectedSize, setSelectedSize] = useState("US 9");
  const { addToCart } = useCartStore();
  const { addToast } = useToast();

  // Reset or start checking sequence when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setQueueStatus("checking");
    setCheckingProgress(0);
    setTimeLeft(600);

    // Progress bar animation during 2.5s check
    const progressInterval = setInterval(() => {
      setCheckingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4; // reaches 100 in ~2.5s at 100ms interval
      });
    }, 100);

    const timer = setTimeout(() => {
      clearInterval(progressInterval);
      setCheckingProgress(100);
      setQueueStatus("granted");
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [isOpen]);

  // 10-minute exclusive purchase countdown
  useEffect(() => {
    if (queueStatus !== "granted" || !isOpen) return;

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setQueueStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [queueStatus, isOpen]);

  if (!isOpen || !drop) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")} : ${s.toString().padStart(2, "0")}`;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      addToast("Por favor selecciona una talla para continuar.", "warning");
      return;
    }

    const priceNum = typeof drop.price === "number" ? drop.price : parseFloat(drop.price) || 199.99;

    const productForCart = {
      id: drop.id || `drop-${drop.title.toLowerCase().replace(/\s+/g, "-")}`,
      nombre: drop.title,
      precio: priceNum,
      imagenes: [drop.image || ""],
      categoria: "SNKRS Drop Exclusivo",
    };

    addToCart(productForCart, selectedSize, 1);
    addToast("¡Zapatillas reservadas en tu carrito! Completa la compra antes de que expire el tiempo.", "success");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 100000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-md)",
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(5, 5, 5, 0.85)",
              backdropFilter: "blur(14px)",
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "580px",
              backgroundColor: "#111111",
              border: "1px solid rgba(206, 255, 0, 0.4)",
              borderRadius: "12px",
              boxShadow: "0 0 50px rgba(206, 255, 0, 0.15), 0 20px 40px rgba(0,0,0,0.8)",
              overflow: "hidden",
              color: "#FFFFFF",
              zIndex: 1,
            }}
          >
            {/* Top Bar with Status / Close Button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: queueStatus === "checking" ? "#FF6600" : queueStatus === "granted" ? "#CEFF00" : "#D30005",
                    boxShadow: `0 0 10px ${queueStatus === "checking" ? "#FF6600" : queueStatus === "granted" ? "#CEFF00" : "#D30005"}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--type-caption)",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 600,
                  }}
                >
                  SNKRS VIRTUAL QUEUE SYSTEM
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#AAAAAA",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Cerrar modal de fila virtual"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "28px 24px" }}>
              {/* STATE 1: CHECKING QUEUE SPOT (2.5 Seconds) */}
              {queueStatus === "checking" && (
                <div style={{ textAlign: "center", padding: "32px 12px" }}>
                  {/* Spinning Radar Loader */}
                  <div style={{ position: "relative", width: "90px", height: "90px", margin: "0 auto 28px" }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "3px solid rgba(206, 255, 0, 0.15)",
                        borderTopColor: "var(--color-volt)",
                        borderRadius: "50%",
                      }}
                    />
                    <motion.div
                      animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        position: "absolute",
                        top: "15%",
                        left: "15%",
                        width: "70%",
                        height: "70%",
                        borderRadius: "50%",
                        backgroundColor: "rgba(206, 255, 0, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-volt)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                    </motion.div>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--type-h3)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "10px",
                      color: "#FFFFFF",
                    }}
                  >
                    COMPROBANDO SUERTE / ASIGNANDO LUGAR EN FILA
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--type-body-sm)",
                      color: "var(--color-ink-soft)",
                      maxWidth: "420px",
                      margin: "0 auto 24px",
                      lineHeight: 1.6,
                    }}
                  >
                    Verificando disponibilidad anti-bots y conectando con los servidores seguros de Nike Legado para asignarte un lugar de acceso prioritario...
                  </p>

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "380px",
                      height: "6px",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: "3px",
                      overflow: "hidden",
                      margin: "0 auto 12px",
                    }}
                  >
                    <motion.div
                      style={{
                        height: "100%",
                        width: `${checkingProgress}%`,
                        backgroundColor: "var(--color-volt)",
                        boxShadow: "0 0 10px var(--color-volt)",
                        transition: "width 0.1s linear",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--type-caption)",
                      color: "var(--color-volt)",
                      letterSpacing: "1px",
                      fontWeight: 700,
                    }}
                  >
                    {checkingProgress}% COMPLETADO
                  </span>
                </div>
              )}

              {/* STATE 2: GRANTED ACCESS */}
              {queueStatus === "granted" && (
                <div>
                  {/* Access Granted Badge & Timer Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                      padding: "14px 16px",
                      backgroundColor: "rgba(206, 255, 0, 0.1)",
                      border: "1px solid var(--color-volt)",
                      borderRadius: "8px",
                      marginBottom: "24px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "20px" }}>⚡</span>
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "var(--type-body-sm)",
                            fontWeight: 700,
                            color: "var(--color-volt)",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                          }}
                        >
                          ¡ESTÁS EN LA FILA / ACCESO CONCEDIDO!
                        </div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
                          Tu lugar está reservado por tiempo limitado.
                        </div>
                      </div>
                    </div>

                    {/* 10-Minute Timer Box */}
                    <div
                      style={{
                        backgroundColor: timeLeft < 60 ? "rgba(211, 0, 5, 0.25)" : "rgba(0, 0, 0, 0.6)",
                        border: `1px solid ${timeLeft < 60 ? "#D30005" : "var(--color-volt)"}`,
                        padding: "6px 12px",
                        borderRadius: "6px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          textTransform: "uppercase",
                          color: timeLeft < 60 ? "#FF6B6B" : "rgba(255,255,255,0.6)",
                          letterSpacing: "1px",
                          marginBottom: "2px",
                        }}
                      >
                        Expira En:
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--type-h4)",
                          fontWeight: 700,
                          color: timeLeft < 60 ? "#FF4444" : "var(--color-volt)",
                          letterSpacing: "2px",
                        }}
                      >
                        {formatTime(timeLeft)}
                      </div>
                    </div>
                  </div>

                  {/* Drop Product Info */}
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                      backgroundColor: "rgba(255,255,255,0.03)",
                      padding: "16px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      marginBottom: "24px",
                    }}
                  >
                    <div
                      style={{
                        width: "110px",
                        height: "110px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: "#1A1A1A",
                        flexShrink: 0,
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <img
                        src={resolveAsset(drop.image)}
                        alt={drop.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: "var(--color-volt)",
                          letterSpacing: "1px",
                          marginBottom: "4px",
                        }}
                      >
                        EDICIÓN EXCLUSIVA SNKRS
                      </span>
                      <h4
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--type-h4)",
                          fontWeight: 700,
                          color: "#FFFFFF",
                          textTransform: "uppercase",
                          marginBottom: "6px",
                          lineHeight: 1.2,
                        }}
                      >
                        {drop.title}
                      </h4>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--type-h3)",
                          fontWeight: 700,
                          color: "#FFFFFF",
                        }}
                      >
                        ${typeof drop.price === "number" ? drop.price.toFixed(2) : drop.price || "199.99"}
                      </div>
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div style={{ marginBottom: "26px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <label
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--type-body-sm)",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          color: "#CCCCCC",
                          fontWeight: 600,
                        }}
                      >
                        SELECCIONA TU TALLA (US)
                      </label>
                      <span style={{ fontSize: "12px", color: "var(--color-volt)" }}>
                        {selectedSize ? `Seleccionado: ${selectedSize}` : "Elige una talla"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: "8px",
                      }}
                    >
                      {SIZES.map((size) => {
                        const isSelected = selectedSize === size;
                        return (
                          <motion.button
                            key={size}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedSize(size)}
                            style={{
                              padding: "10px 4px",
                              backgroundColor: isSelected ? "var(--color-volt)" : "rgba(255, 255, 255, 0.05)",
                              border: isSelected ? "1px solid var(--color-volt)" : "1px solid rgba(255, 255, 255, 0.15)",
                              borderRadius: "6px",
                              color: isSelected ? "#111111" : "#FFFFFF",
                              fontFamily: "var(--font-display)",
                              fontSize: "13px",
                              fontWeight: isSelected ? 800 : 500,
                              cursor: "pointer",
                              transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
                              boxShadow: isSelected ? "0 0 12px rgba(206, 255, 0, 0.4)" : "none",
                            }}
                          >
                            {size}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      style={{
                        width: "100%",
                        padding: "16px",
                        backgroundColor: "var(--color-volt)",
                        color: "#111111",
                        border: "none",
                        borderRadius: "8px",
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--type-body)",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "1.5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        boxShadow: "0 0 25px rgba(206, 255, 0, 0.4)",
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      COMPRAR AHORA / AÑADIR AL CARRITO
                    </motion.button>

                    <button
                      onClick={onClose}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--color-ink-soft)",
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: "8px",
                      }}
                    >
                      Renunciar a mi lugar en la fila virtual
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 3: EXPIRED */}
              {queueStatus === "expired" && (
                <div style={{ textAlign: "center", padding: "32px 12px" }}>
                  <div
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(211, 0, 5, 0.15)",
                      border: "2px solid #D30005",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D30005" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--type-h3)",
                      textTransform: "uppercase",
                      color: "#D30005",
                      marginBottom: "12px",
                    }}
                  >
                    TIEMPO DE COMPRA EXPIRADO
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--type-body-sm)",
                      color: "var(--color-ink-soft)",
                      maxWidth: "400px",
                      margin: "0 auto 24px",
                      lineHeight: 1.6,
                    }}
                  >
                    Los 10 minutos exclusivos para completar tu compra han finalizado y tu lugar fue reasignado al siguiente usuario en la fila virtual.
                  </p>
                  <button
                    onClick={() => setQueueStatus("checking")}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "var(--color-volt)",
                      color: "#111111",
                      border: "none",
                      borderRadius: "6px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      cursor: "pointer",
                      marginRight: "12px",
                    }}
                  >
                    Volver a intentar en la fila
                  </button>
                  <button
                    onClick={onClose}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "6px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      cursor: "pointer",
                    }}
                  >
                    Cerrar ventana
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
