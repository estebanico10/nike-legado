import { motion } from "framer-motion";

const ease = [0, 0, 0.2, 1];

export default function DonutChart({ data, size = 260 }) {
  const cx = size / 2, cy = size / 2, radius = size * 0.38, strokeWidth = size * 0.18;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {data.map((item, i) => {
        const dashLength = (item.pct / 100) * circumference;
        const prevSum = data.slice(0, i).reduce((sum, curr) => sum + curr.pct, 0);
        const dashOffset = -(prevSum / 100) * circumference;
        return (
          <motion.circle key={item.name} cx={cx} cy={cy} r={radius} fill="none"
            stroke={item.hex} strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={dashOffset}
            style={{ transformOrigin: "center", transform: "rotate(-90deg)",
              filter: item.hex === "#FFFFFF" ? "drop-shadow(0 0 1px rgba(0,0,0,0.15))" : "none" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.12, duration: 0.5, ease }} />
        );
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="var(--color-ink)" fontFamily="var(--font-display)" fontSize="26" fontWeight="700">100%</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--color-ink-soft)" fontFamily="var(--font-body)" fontSize="10" letterSpacing="0.08em">DISTRIBUCIÓN</text>
    </svg>
  );
}
