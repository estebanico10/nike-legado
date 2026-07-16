import { motion } from "framer-motion";

export default function BadgeCard({ badge, isUnlocked }) {
  if (!badge) return null;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        position: "relative",
        background: isUnlocked
          ? "linear-gradient(135deg, rgba(206, 255, 0, 0.1) 0%, rgba(17, 17, 17, 0.92) 100%)"
          : "rgba(17, 17, 17, 0.65)",
        border: isUnlocked ? "1.5px solid var(--color-volt)" : "1px dashed #333333",
        boxShadow: isUnlocked ? "0 8px 24px rgba(206, 255, 0, 0.18)" : "none",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-lg)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "var(--space-md)",
        overflow: "hidden",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Decorative background glow for unlocked badge */}
      {isUnlocked && (
        <div
          style={{
            position: "absolute",
            top: "-30%",
            right: "-30%",
            width: "120px",
            height: "120px",
            background: "radial-gradient(circle, rgba(206, 255, 0, 0.2) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      {/* Top Section: Icon & Status Chip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            background: isUnlocked
              ? "rgba(206, 255, 0, 0.15)"
              : "rgba(255, 255, 255, 0.05)",
            border: isUnlocked
              ? "1px solid rgba(206, 255, 0, 0.4)"
              : "1px solid #262626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            filter: isUnlocked ? "none" : "grayscale(100%) opacity(0.4)",
            transition: "transform 0.3s ease",
          }}
        >
          {badge.icon || "🏆"}
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            borderRadius: "999px",
            fontSize: "var(--type-micro)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            backgroundColor: isUnlocked
              ? "rgba(206, 255, 0, 0.15)"
              : "rgba(255, 255, 255, 0.06)",
            color: isUnlocked ? "var(--color-volt)" : "#888888",
            border: isUnlocked
              ? "1px solid rgba(206, 255, 0, 0.35)"
              : "1px solid #333333",
          }}
        >
          {isUnlocked ? (
            <>
              DESBLOQUEADO
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-volt)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </>
          ) : (
            <>
              🔒 BLOQUEADO
            </>
          )}
        </span>
      </div>

      {/* Middle Section: Title & Description */}
      <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--type-h4)",
            fontWeight: 700,
            color: isUnlocked ? "#FFFFFF" : "#888888",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: "0 0 8px 0",
            lineHeight: 1.2,
          }}
        >
          {badge.title || "Insignia Legado"}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--type-body-sm)",
            color: isUnlocked ? "#CCCCCC" : "#666666",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {badge.description || "Acumula puntos y completa desafíos en el ecosistema Nike Legado."}
        </p>
      </div>

      {/* Bottom Section: Condition / Status */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          paddingTop: "var(--space-sm)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {isUnlocked ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              fontWeight: 600,
              color: "#2ecc71",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#2ecc71", display: "inline-block" }} />
            Activa en tu vitrina oficial
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              fontWeight: 600,
              color: "#FFB800",
              backgroundColor: "rgba(255, 184, 0, 0.08)",
              padding: "6px 10px",
              borderRadius: "4px",
              border: "1px solid rgba(255, 184, 0, 0.2)",
              width: "100%",
            }}
          >
            <span>🔒</span>
            <span>REQUISITO: {badge.condition || "Puntos Street Cred"}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
