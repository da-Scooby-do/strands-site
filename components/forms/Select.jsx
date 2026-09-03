import React from "react";
import { Icon } from "../core/Icon.jsx";
export function Select({ label, value, onChange, options = [], style }) {
  const uid = React.useId();
  return (
    <div style={{ display: "grid", gap: 6, ...style }}>
      {label && <label htmlFor={uid} style={{ fontSize: "var(--text-fine-size)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-2)" }}>{label}</label>}
      <div style={{ position: "relative", display: "inline-grid" }}>
        <select id={uid} value={value} onChange={(e) => onChange && onChange(e.target.value)}
          style={{ font: "inherit", fontFamily: "var(--font-sans)", fontSize: "var(--text-small)", height: "var(--input-h)", padding: "0 40px 0 14px", appearance: "none", background: "var(--white)", color: "var(--ink)", border: "1px solid var(--rule)", borderRadius: "var(--radius-control)" }}>
          {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
        <span style={{ position: "absolute", right: 12, top: 0, bottom: 0, display: "grid", alignItems: "center", pointerEvents: "none", color: "var(--ink-2)" }}><Icon name="chevron-down" size={15} /></span>
      </div>
    </div>
  );
}
