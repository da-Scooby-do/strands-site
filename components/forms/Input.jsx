import React from "react";

export function Input({ label, value, onChange, placeholder, type = "text", hint, id, style }) {
  const uid = id || React.useId();
  return (
    <div style={{ display: "grid", gap: 6, ...style }}>
      {label && <label htmlFor={uid} style={{ fontSize: "var(--text-fine-size)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-2)" }}>{label}</label>}
      <input id={uid} type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{ font: "inherit", fontFamily: "var(--font-sans)", fontSize: "var(--text-small)", height: "var(--input-h)", padding: "0 14px", background: "var(--white)", color: "var(--ink)", border: "1px solid var(--rule)", borderRadius: "var(--radius-control)", outlineOffset: 2 }} />
      {hint && <span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>{hint}</span>}
    </div>
  );
}
