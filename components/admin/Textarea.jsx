import React from "react";

export function Textarea({ label, value, onChange, rows = 4, placeholder, dir, style }) {
  const uid = React.useId();
  return (
    <div style={{ display: "grid", gap: 6, ...style }}>
      {label && <label htmlFor={uid} style={{ fontSize: "var(--text-fine-size)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-2)" }}>{label}</label>}
      <textarea id={uid} rows={rows} value={value} placeholder={placeholder} dir={dir}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{ font: "inherit", fontFamily: dir === "rtl" ? "var(--font-arabic)" : "var(--font-sans)", fontSize: "var(--text-small)", lineHeight: 1.6, padding: "10px 14px", background: "var(--white)", color: "var(--ink)", border: "1px solid var(--rule)", borderRadius: "var(--radius-control)", resize: "vertical" }} />
    </div>
  );
}
