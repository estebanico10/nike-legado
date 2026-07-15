export function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)", fontSize: "var(--type-caption)", fontWeight: 500,
      textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-ink-soft)",
      marginBottom: "var(--space-md)",
    }}>{children}</p>
  );
}

export function SectionTitle({ children, style }) {
  return (
    <h2 style={{
      fontFamily: "var(--font-display)", fontSize: "var(--type-h2)", lineHeight: "var(--lh-h2)",
      fontWeight: 700, letterSpacing: "var(--tracking-tight)", textTransform: "uppercase",
      color: "var(--color-ink)", marginBottom: "var(--space-2xl)", ...style,
    }}>{children}</h2>
  );
}
