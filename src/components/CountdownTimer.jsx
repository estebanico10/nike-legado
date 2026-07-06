import { useState, useEffect } from "react";

export default function CountdownTimer({ hours = 24 }) {
  const [timeLeft, setTimeLeft] = useState(hours * 3600);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  if (timeLeft <= 0) return null;

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      backgroundColor: "rgba(211, 0, 5, 0.1)",
      color: "#D30005",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "var(--type-micro)",
      fontWeight: 700,
      textTransform: "uppercase"
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      Termina en: {formatTime(timeLeft)}
    </div>
  );
}
