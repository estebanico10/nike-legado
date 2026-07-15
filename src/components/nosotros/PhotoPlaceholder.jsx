import { useState } from "react";
import { resolveAsset } from "../../utils/resolveAsset";

export default function PhotoPlaceholder({ src, width, height, label, style }) {
  const [error, setError] = useState(!src);

  if (!error && src) {
    return (
      <img
        src={resolveAsset(src)}
        alt={label || "Photo"}
        style={{ width, height, objectFit: "cover", display: "block", ...style }}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div style={{
      width, height, backgroundColor: "var(--color-canvas-alt)",
      border: "2px dashed var(--color-ink-muted)", display: "flex", alignItems: "center",
      justifyContent: "center", flexDirection: "column", gap: "12px",
      color: "var(--color-ink-soft)", fontFamily: "var(--font-body)",
      fontSize: "var(--type-caption)", textTransform: "uppercase", letterSpacing: "0.08em",
      overflow: "hidden", ...style,
    }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span>{label}</span>
    </div>
  );
}
