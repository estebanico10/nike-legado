import { useState } from "react";
import { motion } from "framer-motion";
import { useLoyaltyStore } from "../../store/useStore";
import { useCouponStore } from "../../store/useCouponStore";
import { useToast } from "../../context/ToastContext";

export default function RewardCard({ reward }) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const points = useLoyaltyStore((state) => state.points);

  let addToast;
  try {
    const toastContext = useToast();
    addToast = toastContext?.addToast;
  } catch {
    addToast = (msg) => alert(msg);
  }

  if (!reward) return null;

  const canRedeem = points >= reward.cost;
  const progressPercent = Math.min(100, Math.round((points / reward.cost) * 100));
  const pointsNeeded = Math.max(0, reward.cost - points);

  const handleRedeem = () => {
    if (!canRedeem || isRedeeming) return;

    setIsRedeeming(true);
    setTimeout(() => {
      const res = useLoyaltyStore.getState().redeemReward(reward.id, reward.cost);
      if (res.success) {
        if (reward.isCoupon && reward.couponCode) {
          useCouponStore.getState().addCoupon({
            code: reward.couponCode,
            discountPercent: reward.discountPercent || 15,
            active: true,
            expiresAt: "2026-12-31"
          });
          addToast?.("¡Recompensa canjeada con éxito! Revisa tus cupones en el Checkout", "success");
        } else {
          addToast?.("¡Recompensa canjeada con éxito! Beneficio activado en tu cuenta del Club", "success");
        }
      } else {
        addToast?.(res.message || "No tienes suficientes Puntos Street Cred", "error");
      }
      setIsRedeeming(false);
    }, 400);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        background: canRedeem
          ? "linear-gradient(145deg, #141414 0%, #1A1A1A 100%)"
          : "rgba(17, 17, 17, 0.75)",
        border: canRedeem ? "1px solid #333333" : "1px solid #222222",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-lg)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "var(--space-md)",
        position: "relative",
        overflow: "hidden",
        boxShadow: canRedeem ? "0 10px 30px rgba(0, 0, 0, 0.4)" : "none",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Top Section: Icon, Tag & Cost Badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "12px",
              background: canRedeem ? "rgba(206, 255, 0, 0.12)" : "rgba(255, 255, 255, 0.04)",
              border: canRedeem ? "1px solid rgba(206, 255, 0, 0.3)" : "1px solid #262626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
            }}
          >
            {reward.icon || "🎁"}
          </div>
          <div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: reward.isCoupon ? "#FF6600" : "#70a1ff",
                background: reward.isCoupon ? "rgba(255, 102, 0, 0.12)" : "rgba(0, 102, 204, 0.12)",
                padding: "3px 8px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "4px",
              }}
            >
              {reward.isCoupon ? "Cupón de Descuento" : "Beneficio Exclusivo"}
            </span>
          </div>
        </div>

        <div
          style={{
            background: canRedeem ? "var(--color-volt)" : "#262626",
            color: canRedeem ? "#000000" : "#AAAAAA",
            padding: "6px 14px",
            borderRadius: "999px",
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            boxShadow: canRedeem ? "0 4px 15px rgba(206, 255, 0, 0.3)" : "none",
          }}
        >
          {reward.cost} PTS
        </div>
      </div>

      {/* Middle Section: Title & Description */}
      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--type-h4)",
            fontWeight: 700,
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            margin: "0 0 8px 0",
            lineHeight: 1.25,
          }}
        >
          {reward.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--type-body-sm)",
            color: "#A0A0A0",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {reward.description}
        </p>
      </div>

      {/* Progress toward Reward */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600 }}>
          <span style={{ color: canRedeem ? "var(--color-volt)" : "#888888" }}>
            {canRedeem ? "¡Listo para canjear!" : `Progreso de Street Cred`}
          </span>
          <span style={{ color: "#CCCCCC", fontFamily: "var(--font-display)" }}>
            {points} / {reward.cost} PTS ({progressPercent}%)
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "6px",
            backgroundColor: "#222222",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              height: "100%",
              backgroundColor: canRedeem ? "var(--color-volt)" : "#FF6600",
              borderRadius: "999px",
              boxShadow: canRedeem ? "0 0 10px var(--color-volt)" : "none",
            }}
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleRedeem}
        disabled={!canRedeem || isRedeeming}
        style={{
          width: "100%",
          padding: "13px 20px",
          borderRadius: "var(--radius-md)",
          fontFamily: "var(--font-display)",
          fontSize: "15px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          cursor: canRedeem ? "pointer" : "not-allowed",
          backgroundColor: canRedeem ? "var(--color-volt)" : "#1C1C1C",
          color: canRedeem ? "#000000" : "#666666",
          border: canRedeem ? "none" : "1px solid #2B2B2B",
          transition: "all 0.2s ease",
          boxShadow: canRedeem ? "0 4px 20px rgba(206, 255, 0, 0.25)" : "none",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseOver={(e) => {
          if (canRedeem && !isRedeeming) {
            e.currentTarget.style.backgroundColor = "#E0FF33";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        }}
        onMouseOut={(e) => {
          if (canRedeem && !isRedeeming) {
            e.currentTarget.style.backgroundColor = "var(--color-volt)";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }}
      >
        {isRedeeming ? (
          "Procesando Canje..."
        ) : canRedeem ? (
          "CANJEAR RECOMPENSA"
        ) : (
          `PUNTOS INSUFICIENTES (${pointsNeeded} PTS MÁS)`
        )}
      </button>
    </motion.div>
  );
}
