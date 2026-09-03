import React from "react";

const V = {
  filled: { background: "var(--action-fill)", color: "var(--action-fill-text)", border: "1px solid var(--action-fill)" },
  quiet: { background: "transparent", color: "var(--purple)", border: "1px solid var(--action-quiet-border)" },
  text: { background: "transparent", color: "var(--green)", border: "1px solid transparent" },
};
export function Button({ children, variant = "filled", size = "lg", fullWidth = false, disabled = false, onClick, type = "button", style }) {
  const [hot, setHot] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const base = V[variant] || V.filled;
  const hover = variant === "filled"
    ? { background: down ? "var(--action-fill-active)" : "var(--action-fill-hover)", borderColor: "transparent" }
    : { background: variant === "quiet" ? "var(--purple-tint)" : "transparent", color: down ? "var(--purple)" : base.color };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHot(true)} onMouseLeave={() => { setHot(false); setDown(false); }}
      onMouseDown={() => setDown(true)} onMouseUp={() => setDown(false)}
      style={{
        font: "inherit", fontFamily: "var(--font-sans)", fontWeight: 500,
        fontSize: size === "lg" ? 15 : 14, letterSpacing: ".02em",
        height: size === "lg" ? "var(--btn-h)" : "var(--btn-h-sm)",
        padding: size === "lg" ? "0 28px" : "0 18px",
        borderRadius: "var(--radius-control)", cursor: disabled ? "not-allowed" : "pointer",
        width: fullWidth ? "100%" : "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)",
        transition: "background var(--dur) var(--ease), color var(--dur) var(--ease), border-color var(--dur) var(--ease)",
        opacity: disabled ? 0.4 : 1, ...base, ...(hot && !disabled ? hover : null), ...style,
      }}>{children}</button>
  );
}
