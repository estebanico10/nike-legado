import { useState } from "react";
import { motion } from "framer-motion";
import {
  useLoyaltyStore,
  useCustomerStore,
  defaultThresholds,
  defaultRewards,
  defaultBadgesCatalog
} from "../../store/useStore";

export default function LoyaltyAdmin() {
  const points = useLoyaltyStore((state) => state.points ?? 350);
  const level = useLoyaltyStore((state) => state.level || "Rookie");
  const badges = useLoyaltyStore((state) => state.badges || ["rookie"]);
  const history = useLoyaltyStore((state) => state.history || []);
  const thresholds = useLoyaltyStore((state) => state.thresholds || defaultThresholds);
  const rewards = useLoyaltyStore((state) => state.rewards || defaultRewards);
  const badgesCatalog = useLoyaltyStore((state) => state.badgesCatalog || defaultBadgesCatalog);
  const updateThresholds = useLoyaltyStore((state) => state.updateThresholds);
  const awardBonus = useLoyaltyStore((state) => state.awardBonus);
  const addReward = useLoyaltyStore((state) => state.addReward);
  const deleteReward = useLoyaltyStore((state) => state.deleteReward);

  const customers = useCustomerStore((state) => state.customers || []);

  const [activeTab, setActiveTab] = useState("summary"); // 'summary', 'thresholds', 'bonus', 'rewards'

  // Thresholds state
  const [threshForm, setThreshForm] = useState({
    rookie: thresholds.rookie ?? 0,
    sneakerhead: thresholds.sneakerhead ?? 500,
    vip: thresholds.vip ?? 1500,
  });
  const [threshMessage, setThreshMessage] = useState(null);

  // Bonus form state
  const [bonusForm, setBonusForm] = useState({
    targetUser: "Carlos Gómez (Cuenta Demo - Mi Perfil)",
    amount: "250",
    reason: "Ganador del Reto OOTD Neón Volt",
  });
  const [bonusMessage, setBonusMessage] = useState(null);

  // New reward form state
  const [rewardForm, setRewardForm] = useState({
    title: "",
    description: "",
    cost: "400",
    icon: "⚡",
    isCoupon: false,
    couponCode: "",
  });
  const [rewardMessage, setRewardMessage] = useState(null);

  const handleSaveThresholds = (e) => {
    e.preventDefault();
    if (updateThresholds) {
      updateThresholds({
        rookie: Number(threshForm.rookie),
        sneakerhead: Number(threshForm.sneakerhead),
        vip: Number(threshForm.vip),
      });
    }
    setThreshMessage({ type: "success", text: "✅ Umbrales de rango actualizados correctamente. Niveles recalculados." });
    setTimeout(() => setThreshMessage(null), 4000);
  };

  const handleAwardBonus = (e) => {
    e.preventDefault();
    if (!bonusForm.amount || Number(bonusForm.amount) <= 0) return;

    if (awardBonus) {
      awardBonus(bonusForm.targetUser, Number(bonusForm.amount), bonusForm.reason || "Bono Especial de Comunidad");
    } else {
      useLoyaltyStore.getState().addPoints(Number(bonusForm.amount), `Bono Admin: ${bonusForm.reason} (${bonusForm.targetUser})`);
    }

    setBonusMessage({
      type: "success",
      text: `⚡ ¡Bono de +${bonusForm.amount} PTS acreditado exitosamente a ${bonusForm.targetUser}!`
    });
    setBonusForm({ ...bonusForm, amount: "150", reason: "Participación en Evento de Barrio" });
    setTimeout(() => setBonusMessage(null), 5000);
  };

  const handleAddReward = (e) => {
    e.preventDefault();
    if (!rewardForm.title || !rewardForm.cost) return;

    if (addReward) {
      addReward({
        title: rewardForm.title,
        description: rewardForm.description || "Recompensa especial del Club Legado",
        cost: Number(rewardForm.cost),
        icon: rewardForm.icon || "🎁",
        isCoupon: rewardForm.isCoupon,
        couponCode: rewardForm.isCoupon ? (rewardForm.couponCode || "EXTRA10").toUpperCase() : null,
      });
    }
    setRewardMessage({ type: "success", text: "🎁 Nueva recompensa agregada al catálogo de canje." });
    setRewardForm({ title: "", description: "", cost: "400", icon: "⚡", isCoupon: false, couponCode: "" });
    setTimeout(() => setRewardMessage(null), 4000);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="admin-card-title" style={{ fontSize: "28px", margin: 0 }}>
            Club Nike Legado & Street Cred
          </h2>
          <p style={{ color: "#888888", fontSize: "14px", margin: "4px 0 0 0" }}>
            Administra el programa de fidelización, umbrales de puntos, recompensas y bonificaciones manuales.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "28px", borderBottom: "1px solid #222222", paddingBottom: "16px" }}>
        <button
          onClick={() => setActiveTab("summary")}
          style={{
            padding: "10px 18px",
            background: activeTab === "summary" ? "var(--color-volt)" : "#141414",
            color: activeTab === "summary" ? "#000000" : "#AAAAAA",
            border: activeTab === "summary" ? "1px solid var(--color-volt)" : "1px solid #2B2B2B",
            borderRadius: "6px",
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          📊 Resumen & KPIs
        </button>
        <button
          onClick={() => setActiveTab("thresholds")}
          style={{
            padding: "10px 18px",
            background: activeTab === "thresholds" ? "var(--color-volt)" : "#141414",
            color: activeTab === "thresholds" ? "#000000" : "#AAAAAA",
            border: activeTab === "thresholds" ? "1px solid var(--color-volt)" : "1px solid #2B2B2B",
            borderRadius: "6px",
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          ⚙️ Ajustar Umbrales (Thresholds)
        </button>
        <button
          onClick={() => setActiveTab("bonus")}
          style={{
            padding: "10px 18px",
            background: activeTab === "bonus" ? "var(--color-volt)" : "#141414",
            color: activeTab === "bonus" ? "#000000" : "#AAAAAA",
            border: activeTab === "bonus" ? "1px solid var(--color-volt)" : "1px solid #2B2B2B",
            borderRadius: "6px",
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          ⚡ Otorgar Bono Street Cred
        </button>
        <button
          onClick={() => setActiveTab("rewards")}
          style={{
            padding: "10px 18px",
            background: activeTab === "rewards" ? "var(--color-volt)" : "#141414",
            color: activeTab === "rewards" ? "#000000" : "#AAAAAA",
            border: activeTab === "rewards" ? "1px solid var(--color-volt)" : "1px solid #2B2B2B",
            borderRadius: "6px",
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          🎁 Catálogo de Recompensas
        </button>
      </div>

      {/* TAB 1: SUMMARY & KPIS */}
      {activeTab === "summary" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "28px" }}>
            <div className="admin-card" style={{ borderLeft: "4px solid var(--color-volt)" }}>
              <div style={{ fontSize: "12px", color: "#A0A0A0", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
                Puntos en Circulación (Demo)
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 700, color: "var(--color-volt)" }}>
                {points.toLocaleString()} PTS
              </div>
              <div style={{ fontSize: "12px", color: "#2ecc71", marginTop: "6px" }}>
                ↑ Activo en tiempo real
              </div>
            </div>

            <div className="admin-card" style={{ borderLeft: "4px solid #FF9F43" }}>
              <div style={{ fontSize: "12px", color: "#A0A0A0", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
                Rango Actual (Usuario Demo)
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 700, color: "#FFFFFF" }}>
                {level}
              </div>
              <div style={{ fontSize: "12px", color: "#AAAAAA", marginTop: "6px" }}>
                Siguiente: {level === "VIP Legado" ? "MÁXIMO" : level === "Sneakerhead" ? "VIP Legado" : "Sneakerhead"}
              </div>
            </div>

            <div className="admin-card" style={{ borderLeft: "4px solid #70A1FF" }}>
              <div style={{ fontSize: "12px", color: "#A0A0A0", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
                Insignias Desbloqueadas
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 700, color: "#FFFFFF" }}>
                {badges.length} <span style={{ fontSize: "20px", color: "#666" }}>/ {badgesCatalog.length}</span>
              </div>
              <div style={{ fontSize: "12px", color: "#AAAAAA", marginTop: "6px" }}>
                Vitrina oficial activa
              </div>
            </div>

            <div className="admin-card" style={{ borderLeft: "4px solid #2ECC71" }}>
              <div style={{ fontSize: "12px", color: "#A0A0A0", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
                Transacciones Registradas
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 700, color: "#FFFFFF" }}>
                {history.length}
              </div>
              <div style={{ fontSize: "12px", color: "#AAAAAA", marginTop: "6px" }}>
                Historial auditado
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="admin-card-title" style={{ color: "var(--color-volt)", marginBottom: "16px" }}>
              Últimas Actividades y Canjes Registrados
            </h3>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Actividad / Acción</th>
                    <th>Fecha</th>
                    <th>Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 8).map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td><span className="badge info">{item.id || `TX-${idx}`}</span></td>
                      <td style={{ fontWeight: 600 }}>{item.action}</td>
                      <td>{item.date || "Hoy"}</td>
                      <td style={{ fontWeight: 700, color: item.points >= 0 ? "var(--color-volt)" : "#FF6600" }}>
                        {item.points >= 0 ? `+${item.points}` : item.points} PTS
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: THRESHOLDS */}
      {activeTab === "thresholds" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="admin-card" style={{ maxWidth: "700px" }}>
            <h3 className="admin-card-title" style={{ color: "var(--color-volt)" }}>
              Configurar Umbrales de Puntos Street Cred
            </h3>
            <p style={{ color: "#A0A0A0", fontSize: "14px", marginBottom: "20px" }}>
              Modifica la cantidad mínima de Puntos Street Cred requeridos para que los usuarios alcancen cada categoría VIP en el Club.
            </p>

            {threshMessage && (
              <div style={{ padding: "12px 16px", background: "rgba(46, 204, 113, 0.15)", border: "1px solid #2ecc71", borderRadius: "6px", color: "#2ecc71", fontWeight: 600, marginBottom: "20px" }}>
                {threshMessage.text}
              </div>
            )}

            <form onSubmit={handleSaveThresholds} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#CCCCCC", marginBottom: "6px" }}>
                  🌱 Rango Rookie (Umbral Inicial)
                </label>
                <input
                  type="number"
                  value={threshForm.rookie}
                  onChange={(e) => setThreshForm({ ...threshForm, rookie: e.target.value })}
                  style={{ width: "100%", padding: "12px", background: "#0A0A0A", border: "1px solid #333333", color: "#FFFFFF", borderRadius: "6px", fontFamily: "var(--font-display)", fontSize: "16px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#CCCCCC", marginBottom: "6px" }}>
                  👟 Rango Sneakerhead (Umbral Intermedio)
                </label>
                <input
                  type="number"
                  value={threshForm.sneakerhead}
                  onChange={(e) => setThreshForm({ ...threshForm, sneakerhead: e.target.value })}
                  style={{ width: "100%", padding: "12px", background: "#0A0A0A", border: "1px solid #333333", color: "#FFFFFF", borderRadius: "6px", fontFamily: "var(--font-display)", fontSize: "16px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--color-volt)", marginBottom: "6px" }}>
                  👑 Rango VIP Legado (Umbral Máximo)
                </label>
                <input
                  type="number"
                  value={threshForm.vip}
                  onChange={(e) => setThreshForm({ ...threshForm, vip: e.target.value })}
                  style={{ width: "100%", padding: "12px", background: "#0A0A0A", border: "1px solid #333333", color: "#FFFFFF", borderRadius: "6px", fontFamily: "var(--font-display)", fontSize: "16px" }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: "14px 24px",
                  background: "var(--color-volt)",
                  color: "#000000",
                  border: "none",
                  borderRadius: "6px",
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  marginTop: "8px"
                }}
              >
                Guardar y Recalcular Niveles
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* TAB 3: BONUS MANUAL */}
      {activeTab === "bonus" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="admin-card" style={{ maxWidth: "700px" }}>
            <h3 className="admin-card-title" style={{ color: "var(--color-volt)" }}>
              Otorgar Puntos Street Cred (Bono Manual)
            </h3>
            <p style={{ color: "#A0A0A0", fontSize: "14px", marginBottom: "20px" }}>
              Recompensa directamente a ganadores de retos en el Muro OOTD, campeones de torneos de fútbol callejero o clientes destacados.
            </p>

            {bonusMessage && (
              <div style={{ padding: "12px 16px", background: "rgba(206, 255, 0, 0.15)", border: "1px solid var(--color-volt)", borderRadius: "6px", color: "var(--color-volt)", fontWeight: 600, marginBottom: "20px" }}>
                {bonusMessage.text}
              </div>
            )}

            <form onSubmit={handleAwardBonus} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#CCCCCC", marginBottom: "6px" }}>
                  👤 Usuario Destinatario
                </label>
                <select
                  value={bonusForm.targetUser}
                  onChange={(e) => setBonusForm({ ...bonusForm, targetUser: e.target.value })}
                  style={{ width: "100%", padding: "12px", background: "#0A0A0A", border: "1px solid #333333", color: "#FFFFFF", borderRadius: "6px", fontSize: "15px" }}
                >
                  <option value="Carlos Gómez (Cuenta Demo - Mi Perfil)">Carlos Gómez (Cuenta Demo - Mi Perfil) — Activo</option>
                  {customers.map((c) => (
                    <option key={c.id} value={`${c.name} (${c.email})`}>
                      {c.name} ({c.email}) — Tier: {c.tier}
                    </option>
                  ))}
                  <option value="Comunidad Global (Todos los Miembros activos)">🎉 Todos los Miembros activos (Bono Global)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#CCCCCC", marginBottom: "6px" }}>
                  ⚡ Cantidad de Puntos a Otorgar (+PTS)
                </label>
                <input
                  type="number"
                  value={bonusForm.amount}
                  onChange={(e) => setBonusForm({ ...bonusForm, amount: e.target.value })}
                  placeholder="Ej. 250"
                  min="1"
                  max="5000"
                  style={{ width: "100%", padding: "12px", background: "#0A0A0A", border: "1px solid #333333", color: "var(--color-volt)", borderRadius: "6px", fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#CCCCCC", marginBottom: "6px" }}>
                  🏆 Motivo / Razón de la Recompensa
                </label>
                <input
                  type="text"
                  value={bonusForm.reason}
                  onChange={(e) => setBonusForm({ ...bonusForm, reason: e.target.value })}
                  placeholder="Ej. Ganador del Torneo de Fútbol de Barrio / Reto Neón"
                  style={{ width: "100%", padding: "12px", background: "#0A0A0A", border: "1px solid #333333", color: "#FFFFFF", borderRadius: "6px", fontSize: "15px" }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: "14px 24px",
                  background: "var(--color-volt)",
                  color: "#000000",
                  border: "none",
                  borderRadius: "6px",
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  marginTop: "8px"
                }}
              >
                Acreditar Bono Street Cred
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* TAB 4: REWARDS CATALOG */}
      {activeTab === "rewards" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ color: "var(--color-volt)", marginBottom: "16px" }}>
                Añadir Nueva Recompensa al Catálogo
              </h3>
              {rewardMessage && (
                <div style={{ padding: "10px 14px", background: "rgba(46, 204, 113, 0.15)", border: "1px solid #2ecc71", borderRadius: "6px", color: "#2ecc71", fontWeight: 600, marginBottom: "16px" }}>
                  {rewardMessage.text}
                </div>
              )}
              <form onSubmit={handleAddReward} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", alignItems: "end" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#A0A0A0", marginBottom: "4px" }}>Título</label>
                  <input
                    type="text"
                    value={rewardForm.title}
                    onChange={(e) => setRewardForm({ ...rewardForm, title: e.target.value })}
                    placeholder="Ej. Gorra Streetwear Gratis"
                    style={{ width: "100%", padding: "10px", background: "#0A0A0A", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#A0A0A0", marginBottom: "4px" }}>Costo (PTS)</label>
                  <input
                    type="number"
                    value={rewardForm.cost}
                    onChange={(e) => setRewardForm({ ...rewardForm, cost: e.target.value })}
                    placeholder="400"
                    style={{ width: "100%", padding: "10px", background: "#0A0A0A", border: "1px solid #333", color: "var(--color-volt)", borderRadius: "6px", fontWeight: 700 }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#A0A0A0", marginBottom: "4px" }}>Ícono / Emoji</label>
                  <input
                    type="text"
                    value={rewardForm.icon}
                    onChange={(e) => setRewardForm({ ...rewardForm, icon: e.target.value })}
                    placeholder="🧢"
                    style={{ width: "100%", padding: "10px", background: "#0A0A0A", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#A0A0A0", marginBottom: "4px" }}>¿Es Cupón de Descuento?</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", height: "38px" }}>
                    <input
                      type="checkbox"
                      checked={rewardForm.isCoupon}
                      onChange={(e) => setRewardForm({ ...rewardForm, isCoupon: e.target.checked })}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span style={{ fontSize: "13px" }}>Sí, genera cupón</span>
                  </div>
                </div>
                {rewardForm.isCoupon && (
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#A0A0A0", marginBottom: "4px" }}>Código del Cupón</label>
                    <input
                      type="text"
                      value={rewardForm.couponCode}
                      onChange={(e) => setRewardForm({ ...rewardForm, couponCode: e.target.value })}
                      placeholder="Ej. GORRA100"
                      style={{ width: "100%", padding: "10px", background: "#0A0A0A", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                    />
                  </div>
                )}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#A0A0A0", marginBottom: "4px" }}>Descripción del Beneficio</label>
                  <input
                    type="text"
                    value={rewardForm.description}
                    onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                    placeholder="Ej. Canjeable en tu próxima compra de calzado o accesorios sin costo adicional."
                    style={{ width: "100%", padding: "10px", background: "#0A0A0A", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>
                <div>
                  <button type="submit" style={{ padding: "11px 20px", background: "var(--color-volt)", color: "#000", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>
                    + Agregar Recompensa
                  </button>
                </div>
              </form>
            </div>

            <div className="admin-card">
              <h3 className="admin-card-title" style={{ color: "#FFFFFF", marginBottom: "16px" }}>
                Recompensas Activas en el Club ({rewards.length})
              </h3>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ícono</th>
                      <th>Título</th>
                      <th>Descripción</th>
                      <th>Costo</th>
                      <th>Tipo</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewards.map((r) => (
                      <tr key={r.id}>
                        <td style={{ fontSize: "24px" }}>{r.icon || "🎁"}</td>
                        <td style={{ fontWeight: 700, color: "#fff" }}>{r.title}</td>
                        <td style={{ color: "#AAA", maxWidth: "320px" }}>{r.description}</td>
                        <td><span className="badge volt" style={{ fontSize: "13px" }}>{r.cost} PTS</span></td>
                        <td>
                          {r.isCoupon ? (
                            <span className="badge warning">Cupón ({r.couponCode})</span>
                          ) : (
                            <span className="badge info">Beneficio Físico/VIP</span>
                          )}
                        </td>
                        <td>
                          {deleteReward && (
                            <button
                              onClick={() => deleteReward(r.id)}
                              style={{ background: "rgba(211,0,5,0.2)", color: "#ff4757", border: "1px solid rgba(211,0,5,0.4)", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}
                            >
                              Eliminar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
