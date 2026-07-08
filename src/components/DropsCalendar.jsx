import { motion } from "framer-motion";
import { useState } from "react";
import OptimizedImage from "./OptimizedImage";

const drops = [
  { id: 1, name: "Air Jordan 4 Retro 'Bred'", date: "2024-03-15", time: "10:00 AM", status: "upcoming", image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&q=80" },
  { id: 2, name: "Nike SB Dunk Low 'Travis Scott'", date: "2024-03-22", time: "10:00 AM", status: "upcoming", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80" },
  { id: 3, name: "Air Max 1 '86 Big Bubble'", date: "2024-03-26", time: "10:00 AM", status: "upcoming", image: "https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&q=80" },
];

export default function DropsCalendar() {
  const [notifiedDrops, setNotifiedDrops] = useState([]);

  const handleNotify = (id) => {
    if (notifiedDrops.includes(id)) {
      setNotifiedDrops(notifiedDrops.filter(d => d !== id));
    } else {
      setNotifiedDrops([...notifiedDrops, id]);
    }
  };

  return (
    <section style={{ padding: "var(--space-2xl) 0" }}>
      <div className="container">
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", textTransform: "uppercase", marginBottom: "var(--space-xl)", textAlign: "center" }}>
          Próximos Lanzamientos
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-lg)" }}>
          {drops.map((drop, idx) => (
            <motion.div 
              key={drop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              style={{ backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--color-ink-muted)" }}
            >
              <div style={{ position: "relative", aspectRatio: "4/3" }}>
                <OptimizedImage src={drop.image} alt={drop.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: "var(--color-volt)", color: "var(--color-ink)", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>
                  SNKRS
                </div>
              </div>
              <div style={{ padding: "var(--space-md)" }}>
                <p style={{ color: "var(--color-ink-soft)", fontSize: "14px", marginBottom: "4px" }}>{new Date(drop.date).toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })} a las {drop.time}</p>
                <h3 style={{ fontSize: "18px", fontFamily: "var(--font-display)", textTransform: "uppercase", marginBottom: "16px" }}>{drop.name}</h3>
                
                <button 
                  onClick={() => handleNotify(drop.id)}
                  style={{ 
                    width: "100%", padding: "12px", 
                    backgroundColor: notifiedDrops.includes(drop.id) ? "transparent" : "var(--color-ink)", 
                    color: notifiedDrops.includes(drop.id) ? "var(--color-ink)" : "var(--color-canvas)",
                    border: notifiedDrops.includes(drop.id) ? "1px solid var(--color-ink)" : "none",
                    borderRadius: "100px", textTransform: "uppercase", fontWeight: "bold", cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {notifiedDrops.includes(drop.id) ? "Notificación Activada" : "Recordarme"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
