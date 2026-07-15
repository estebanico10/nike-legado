import { useState } from "react";
import { motion } from "framer-motion";
import { resolveAsset } from "../../utils/resolveAsset";

export default function TeamMemberPhoto({ member }) {
  const [error, setError] = useState(!member.photo);

  if (!error && member.photo) {
    return (
      <div style={{ overflow: "hidden", width: "160px", height: "160px", backgroundColor: "var(--color-canvas-alt)" }}>
        <motion.img
          src={resolveAsset(member.photo)}
          alt={member.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: member.objectPosition || "center center", display: "block", filter: "grayscale(100%)" }}
          whileHover={{ scale: 1.05, filter: "grayscale(0%)" }}
          transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
          onError={() => setError(true)}
        />
      </div>
    );
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.05, borderColor: "var(--color-volt)" }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      style={{
        width: "160px", height: "160px", backgroundColor: "var(--color-canvas-alt)",
        border: "2px dashed var(--color-ink-muted)", display: "flex",
        alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px",
      }}>
      <span style={{
        fontFamily: "var(--font-display)", fontSize: "var(--type-h2)",
        fontWeight: 700, color: "var(--color-ink-muted)", letterSpacing: "0.02em",
      }}>{member.initials}</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-muted)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    </motion.div>
  );
}
