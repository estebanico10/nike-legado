import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveAsset } from "../../utils/resolveAsset";
import VirtualQueueModal from "./VirtualQueueModal";

export default function DropCard({ drop }) {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Calculate and update countdown every second
  useEffect(() => {
    const calculateRemaining = () => {
      if (drop.releaseDate) {
        const target = new Date(drop.releaseDate).getTime();
        const now = Date.now();
        const diffInSeconds = Math.floor((target - now) / 1000);
        return Math.max(0, diffInSeconds);
      }
      if (typeof drop.countdown === "number") {
        return Math.max(0, drop.countdown);
      }
      if (typeof drop.secondsLeft === "number") {
        return Math.max(0, drop.secondsLeft);
      }
      return 0;
    };

    setTimeLeft(calculateRemaining());

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (drop.releaseDate) {
          const target = new Date(drop.releaseDate).getTime();
          const now = Date.now();
          return Math.max(0, Math.floor((target - now) / 1000));
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [drop.releaseDate, drop.countdown, drop.secondsLeft]);

  const formatCountdown = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    parts.push(`${h.toString().padStart(2, "0")}h`);
    parts.push(`${m.toString().padStart(2, "0")}m`);
    parts.push(`${s.toString().padStart(2, "0")}s`);

    return parts.join(" : ");
  };

  const handleReminder = () => {
    addToast(`Recordatorio activado para "${drop.title}". Te notificaremos minutos antes de la apertura.`, "success");
  };

  const isLive = timeLeft <= 0;

  return (
    <>
      <motion.div
        whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          border: isLive ? "1px solid var(--color-volt)" : "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "14px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxShadow: isLive ? "0 0 30px rgba(206, 255, 0, 0.12)" : "none",
        }}
      >
        {/* Top Status Banner */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            zIndex: 10,
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              padding: "5px 10px",
              borderRadius: "20px",
              backgroundColor: isLive ? "var(--color-volt)" : "rgba(0, 0, 0, 0.75)",
              color: isLive ? "#111111" : "#FFFFFF",
              fontFamily: "var(--font-display)",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              border: isLive ? "none" : "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {isLive ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: "#111111",
                    boxShadow: "0 0 6px #111111",
                  }}
                />
                🔥 DROP ACTIVO — SORTEO ABIERTO
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                ⏳ PRÓXIMO LANZAMIENTO
              </>
            )}
          </span>
        </div>

        {/* Stock & Price Badges top right */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "6px",
          }}
        >
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "var(--color-volt)",
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              fontWeight: 700,
              backdropFilter: "blur(4px)",
            }}
          >
            ${typeof drop.price === "number" ? drop.price.toFixed(2) : drop.price || "199.99"}
          </span>
          {drop.stock !== undefined && (
            <span
              style={{
                padding: "3px 8px",
                borderRadius: "4px",
                backgroundColor: "rgba(211, 0, 5, 0.85)",
                color: "#FFFFFF",
                fontFamily: "var(--font-display)",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              ⚡ SOLO {drop.stock} PARES
            </span>
          )}
        </div>

        {/* Image Container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "280px",
            backgroundColor: "#161616",
            overflow: "hidden",
          }}
        >
          <img
            src={resolveAsset(drop.image)}
            alt={drop.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s cubic-bezier(0.2, 0, 0.2, 1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "60%",
              background: "linear-gradient(to top, rgba(17,17,17,1) 0%, rgba(17,17,17,0) 100%)",
            }}
          />
        </div>

        {/* Content Section */}
        <div
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          <div>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-display)",
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--color-ink-soft)",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: "6px",
              }}
            >
              SNKRS EXCLUSIVE EDITION
            </span>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--type-h3)",
                fontWeight: 700,
                color: "#FFFFFF",
                textTransform: "uppercase",
                lineHeight: 1.15,
                marginBottom: "12px",
              }}
            >
              {drop.title}
            </h3>
            <p
              style={{
                fontSize: "var(--type-body-sm)",
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 1.6,
                marginBottom: "20px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {drop.description}
            </p>
          </div>

          <div>
            {/* Live Countdown Display */}
            <div
              style={{
                backgroundColor: isLive ? "rgba(206, 255, 0, 0.08)" : "rgba(255, 255, 255, 0.05)",
                border: isLive ? "1px solid rgba(206, 255, 0, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isLive ? "var(--color-volt)" : "#AAAAAA"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: isLive ? "var(--color-volt)" : "rgba(255,255,255,0.6)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {isLive ? "ESTADO DEL SORTEO" : "APERTURA EN"}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: isLive ? "var(--color-volt)" : "#FFFFFF",
                  letterSpacing: "1px",
                }}
              >
                {isLive ? "ABIERTO AHORA" : formatCountdown(timeLeft)}
              </span>
            </div>

            {/* Action Button depending on Countdown */}
            {isLive ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
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
                  boxShadow: "0 0 20px rgba(206, 255, 0, 0.35)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                ENTRAR AL SORTEO / FILA VIRTUAL
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReminder}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-body-sm)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                PROGRAMAR RECORDATORIO
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Virtual Queue Modal instance for this card */}
      <VirtualQueueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} drop={drop} />
    </>
  );
}
