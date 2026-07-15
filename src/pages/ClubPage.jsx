import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import AnimatedBackground from "../components/AnimatedBackground";
import BadgeCard from "../components/loyalty/BadgeCard";
import RewardCard from "../components/loyalty/RewardCard";
import {
  useLoyaltyStore,
  useUserStore,
  defaultRewards,
  defaultBadgesCatalog,
  defaultThresholds
} from "../store/useStore";

export default function ClubPage() {
  const points = useLoyaltyStore((state) => state.points ?? 350);
  const level = useLoyaltyStore((state) => state.level || "Rookie");
  const badges = useLoyaltyStore((state) => state.badges || ["rookie"]);
  const history = useLoyaltyStore((state) => state.history || []);
  const rewards = useLoyaltyStore((state) => state.rewards || defaultRewards);
  const badgesCatalog = useLoyaltyStore((state) => state.badgesCatalog || defaultBadgesCatalog);
  const thresholds = useLoyaltyStore((state) => state.thresholds || defaultThresholds);

  const [badgeFilter, setBadgeFilter] = useState("all"); // 'all', 'unlocked', 'locked'
  const [showHowToEarn, setShowHowToEarn] = useState(false);

  // Calculate tier details and progress
  const rookieThresh = thresholds.rookie ?? 0;
  const sneakerheadThresh = thresholds.sneakerhead ?? 500;
  const vipThresh = thresholds.vip ?? 1500;

  let currentTierName = "Rookie";
  let nextTierName = "Sneakerhead";
  let nextTierTarget = sneakerheadThresh;
  let progressPercent = 0;
  let pointsRemaining = 0;

  if (points < sneakerheadThresh) {
    currentTierName = "Rookie";
    nextTierName = "Sneakerhead";
    nextTierTarget = sneakerheadThresh;
    progressPercent = Math.min(100, Math.round((points / sneakerheadThresh) * 100));
    pointsRemaining = sneakerheadThresh - points;
  } else if (points < vipThresh) {
    currentTierName = "Sneakerhead";
    nextTierName = "VIP Legado";
    nextTierTarget = vipThresh;
    const range = vipThresh - sneakerheadThresh;
    const pointsInTier = points - sneakerheadThresh;
    progressPercent = Math.min(100, Math.round((pointsInTier / range) * 100));
    pointsRemaining = vipThresh - points;
  } else {
    currentTierName = "VIP Legado";
    nextTierName = "Rango Máximo";
    nextTierTarget = points;
    progressPercent = 100;
    pointsRemaining = 0;
  }

  // Filtered badges for Section 2
  const unlockedCount = badgesCatalog.filter((b) => badges.includes(b.id)).length;
  const lockedCount = badgesCatalog.length - unlockedCount;

  const filteredBadges = badgesCatalog.filter((b) => {
    const isUnlocked = badges.includes(b.id);
    if (badgeFilter === "unlocked") return isUnlocked;
    if (badgeFilter === "locked") return !isUnlocked;
    return true;
  });

  const getTierIcon = (tier) => {
    if (tier.includes("VIP")) return "👑";
    if (tier.includes("Sneakerhead")) return "👟";
    return "🌱";
  };

  const getActionIcon = (actionText = "") => {
    const text = actionText.toLowerCase();
    if (text.includes("canje") || text.includes("recompensa")) return "🎁";
    if (text.includes("muro") || text.includes("ootd")) return "📸";
    if (text.includes("custom")) return "🎨";
    if (text.includes("tienda") || text.includes("compra")) return "🛍️";
    if (text.includes("bienvenida")) return "🔥";
    return "⚡";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "100px",
        paddingBottom: "var(--space-4xl)",
        position: "relative",
        color: "#FFFFFF",
      }}
    >
      <SEO
        title="Club Nike Legado — Street Cred"
        description="Acumula puntos Street Cred, desbloquea insignias callejeras y canjea cupones y beneficios exclusivos."
      />
      <AnimatedBackground />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 var(--space-xl)" }}>
        {/* Page Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "999px",
              backgroundColor: "rgba(206, 255, 0, 0.12)",
              color: "var(--color-volt)",
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "12px",
              border: "1px solid rgba(206, 255, 0, 0.3)",
            }}
          >
            Gamification & Street Cred Hub
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              margin: "0 0 12px 0",
              lineHeight: 1.1,
              background: "linear-gradient(135deg, #FFFFFF 0%, #CEFF00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CLUB NIKE LEGADO
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--type-body-lg)",
              color: "#A0A0A0",
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            El prestigio del barrio se gana en cada paso. Acumula puntos <strong style={{ color: "var(--color-volt)" }}>Street Cred</strong>, asciende de rango, colecciona insignias únicas y canjea tus beneficios.
          </p>
        </motion.div>

        {/* VIP Level Header Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            position: "relative",
            background: "linear-gradient(135deg, rgba(20, 20, 20, 0.88) 0%, rgba(10, 10, 10, 0.95) 100%)",
            border: "1.5px solid var(--color-volt)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-2xl)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(206, 255, 0, 0.15)",
            marginBottom: "var(--space-3xl)",
            overflow: "hidden",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Background Neon Graphic Effect */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              right: "-10%",
              width: "450px",
              height: "450px",
              background: "radial-gradient(circle, rgba(206, 255, 0, 0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "var(--space-2xl)",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Left Box: Points Display & Tier Badge */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 16px",
                    borderRadius: "999px",
                    background: currentTierName.includes("VIP")
                      ? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
                      : currentTierName.includes("Sneakerhead")
                      ? "linear-gradient(135deg, var(--color-volt) 0%, #88cc00 100%)"
                      : "rgba(255, 255, 255, 0.12)",
                    color: currentTierName === "Rookie" ? "#FFFFFF" : "#000000",
                    fontFamily: "var(--font-display)",
                    fontSize: "15px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                  }}
                >
                  <span>{getTierIcon(currentTierName)}</span>
                  <span>RANGO: {currentTierName}</span>
                </span>

                <button
                  onClick={() => setShowHowToEarn(!showHowToEarn)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#A0A0A0",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-volt)";
                    e.currentTarget.style.color = "var(--color-volt)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.color = "#A0A0A0";
                  }}
                >
                  ¿Cómo ganar más PTS? 💡
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(48px, 8vw, 76px)",
                    fontWeight: 700,
                    lineHeight: 1,
                    color: "var(--color-volt)",
                    textShadow: "0 0 25px rgba(206, 255, 0, 0.4)",
                  }}
                >
                  {points}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#CCCCCC",
                    letterSpacing: "0.1em",
                  }}
                >
                  PTS STREET CRED
                </span>
              </div>
            </div>

            {/* Right Box: Interactive Progress Bar to Next Tier */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-lg)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Progreso al rango: <span style={{ color: "var(--color-volt)" }}>{nextTierName}</span>
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "#AAAAAA" }}>
                  {progressPercent}%
                </div>
              </div>

              {/* Progress Bar Track */}
              <div
                style={{
                  width: "100%",
                  height: "14px",
                  backgroundColor: "#1C1C1C",
                  borderRadius: "999px",
                  padding: "2px",
                  overflow: "hidden",
                  border: "1px solid #333333",
                  marginBottom: "14px",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #99CC00 0%, var(--color-volt) 100%)",
                    borderRadius: "999px",
                    boxShadow: "0 0 15px var(--color-volt)",
                  }}
                />
              </div>

              {/* Progress Milestones Text */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#888888" }}>
                <span>{rookieThresh} PTS (Rookie)</span>
                <span>{sneakerheadThresh} PTS (Sneakerhead)</span>
                <span>{vipThresh}+ PTS (VIP Legado)</span>
              </div>

              {pointsRemaining > 0 ? (
                <div style={{ marginTop: "14px", fontSize: "13px", color: "#CCCCCC" }}>
                  🔥 Acumula <strong style={{ color: "var(--color-volt)" }}>{pointsRemaining} PTS más</strong> para desbloquear la insignia y privilegios de <strong style={{ color: "#FFFFFF" }}>{nextTierName}</strong>.
                </div>
              ) : (
                <div style={{ marginTop: "14px", fontSize: "13px", color: "var(--color-volt)", fontWeight: 600 }}>
                  👑 ¡Has alcanzado el rango máximo del Club! Tienes acceso VIP absoluto a todos los drops del barrio.
                </div>
              )}
            </div>
          </div>

          {/* Collapsible How To Earn Section */}
          <AnimatePresence>
            {showHowToEarn && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "var(--space-md)" }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                  <div style={{ background: "rgba(255,255,255,0.03)", padding: "14px", borderRadius: "8px", border: "1px solid #262626" }}>
                    <div style={{ fontSize: "18px", marginBottom: "6px" }}>🛍️ Comprar en Tienda</div>
                    <div style={{ fontSize: "13px", color: "#AAAAAA" }}>Recibe <strong style={{ color: "var(--color-volt)" }}>+10 PTS</strong> por cada $1 USD de compra completada.</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.03)", padding: "14px", borderRadius: "8px", border: "1px solid #262626" }}>
                    <div style={{ fontSize: "18px", marginBottom: "6px" }}>📸 Publicar en el Muro</div>
                    <div style={{ fontSize: "13px", color: "#AAAAAA" }}>Comparte tu outfit callejero en el Muro OOTD y gana <strong style={{ color: "var(--color-volt)" }}>+50 PTS</strong>.</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.03)", padding: "14px", borderRadius: "8px", border: "1px solid #262626" }}>
                    <div style={{ fontSize: "18px", marginBottom: "6px" }}>🎨 Diseñar en Customizer</div>
                    <div style={{ fontSize: "13px", color: "#AAAAAA" }}>Crea e interactúa con tus zapatillas 3D en el Customizer para ganar <strong style={{ color: "var(--color-volt)" }}>+100 PTS</strong>.</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.03)", padding: "14px", borderRadius: "8px", border: "1px solid #262626" }}>
                    <div style={{ fontSize: "18px", marginBottom: "6px" }}>🎉 Retos y Eventos</div>
                    <div style={{ fontSize: "13px", color: "#AAAAAA" }}>Participa en torneos de barrio o eventos para recibir bonos de hasta <strong style={{ color: "var(--color-volt)" }}>+500 PTS</strong>.</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* SECTION 1: CANJEAR RECOMPENSAS */}
        <section style={{ marginBottom: "var(--space-4xl)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: "var(--space-xl)",
              borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: "12px",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-h2)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span>🎁</span> CANJEAR RECOMPENSAS
              </h2>
              <p style={{ color: "#888888", fontSize: "14px", margin: "4px 0 0 0" }}>
                Intercambia tu Street Cred por cupones directos para el Checkout, pases de drops e ítems físicos.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "var(--space-lg)",
            }}
          >
            {rewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </section>

        {/* SECTION 2: VITRINA DE INSIGNIAS (BADGES) */}
        <section style={{ marginBottom: "var(--space-4xl)" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "var(--space-xl)",
              borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: "12px",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-h2)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span>🏆</span> VITRINA DE INSIGNIAS (BADGES)
              </h2>
              <p style={{ color: "#888888", fontSize: "14px", margin: "4px 0 0 0" }}>
                Colecciona trofeos del barrio. Tienes <strong style={{ color: "var(--color-volt)" }}>{unlockedCount} de {badgesCatalog.length}</strong> insignias desbloqueadas.
              </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "8px", background: "#111111", padding: "4px", borderRadius: "8px", border: "1px solid #262626" }}>
              <button
                onClick={() => setBadgeFilter("all")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: badgeFilter === "all" ? "var(--color-volt)" : "transparent",
                  color: badgeFilter === "all" ? "#000000" : "#AAAAAA",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                TODAS ({badgesCatalog.length})
              </button>
              <button
                onClick={() => setBadgeFilter("unlocked")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: badgeFilter === "unlocked" ? "var(--color-volt)" : "transparent",
                  color: badgeFilter === "unlocked" ? "#000000" : "#AAAAAA",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                DESBLOQUEADAS ({unlockedCount})
              </button>
              <button
                onClick={() => setBadgeFilter("locked")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: badgeFilter === "locked" ? "var(--color-volt)" : "transparent",
                  color: badgeFilter === "locked" ? "#000000" : "#AAAAAA",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                BLOQUEADAS ({lockedCount})
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "var(--space-lg)",
            }}
          >
            {filteredBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isUnlocked={badges.includes(badge.id)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 3: HISTORIAL DE STREET CRED */}
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: "var(--space-xl)",
              borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: "12px",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--type-h2)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span>📜</span> HISTORIAL DE STREET CRED
              </h2>
              <p style={{ color: "#888888", fontSize: "14px", margin: "4px 0 0 0" }}>
                Registro completo de todas las actividades, compras y canjes en tu cuenta.
              </p>
            </div>
          </div>

          {history.length === 0 ? (
            <div
              style={{
                background: "#111111",
                border: "1px dashed #333333",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-3xl)",
                textAlign: "center",
                color: "#777777",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔍</div>
              <p style={{ fontSize: "16px", margin: 0 }}>Aún no tienes movimientos registrados en tu historial de Street Cred.</p>
            </div>
          ) : (
            <div
              style={{
                background: "#111111",
                border: "1px solid #222222",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#0A0A0A", borderBottom: "1px solid #2B2B2B" }}>
                      <th style={{ padding: "16px 24px", fontFamily: "var(--font-display)", fontSize: "13px", color: "#A0A0A0", textTransform: "uppercase" }}>ACTIVIDAD</th>
                      <th style={{ padding: "16px 24px", fontFamily: "var(--font-display)", fontSize: "13px", color: "#A0A0A0", textTransform: "uppercase" }}>FECHA</th>
                      <th style={{ padding: "16px 24px", fontFamily: "var(--font-display)", fontSize: "13px", color: "#A0A0A0", textTransform: "uppercase", textAlign: "right" }}>VARIACIÓN PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, idx) => {
                      const isPositive = item.points >= 0;
                      return (
                        <tr
                          key={item.id || idx}
                          style={{
                            borderBottom: idx === history.length - 1 ? "none" : "1px solid #1C1C1C",
                            transition: "background-color 0.2s ease",
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)")}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <td style={{ padding: "18px 24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "10px",
                                  backgroundColor: isPositive ? "rgba(206, 255, 0, 0.1)" : "rgba(255, 102, 0, 0.1)",
                                  border: isPositive ? "1px solid rgba(206, 255, 0, 0.25)" : "1px solid rgba(255, 102, 0, 0.25)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "20px",
                                }}
                              >
                                {getActionIcon(item.action)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: "#FFFFFF", fontSize: "15px" }}>
                                  {item.action || "Movimiento Street Cred"}
                                </div>
                                <div style={{ fontSize: "12px", color: "#777777" }}>
                                  ID Transacción: #{item.id || `TX-${idx}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "18px 24px", color: "#AAAAAA", fontSize: "14px", whiteSpace: "nowrap" }}>
                            {item.date || "Hoy"}
                          </td>
                          <td
                            style={{
                              padding: "18px 24px",
                              textAlign: "right",
                              fontFamily: "var(--font-display)",
                              fontSize: "18px",
                              fontWeight: 700,
                              color: isPositive ? "var(--color-volt)" : "#FF6600",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {isPositive ? `+${item.points}` : item.points} PTS
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
