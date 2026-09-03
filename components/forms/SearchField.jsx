import React from "react";
import { Icon } from "../core/Icon.jsx";
export function SearchField({ value, onChange, placeholder = "Search reviews", style }) {
  return (
    <div style={{ position: "relative", ...style }}>
      <span style={{ position: "absolute", left: 14, top: 0, bottom: 0, display: "grid", alignItems: "center", color: "var(--ink-2)" }}><Icon name="search" size={16} /></span>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange && onChange(e.target.value)}
        style={{ font: "inherit", fontFamily: "var(--font-sans)", fontSize: "var(--text-small)", width: "100%", height: "var(--input-h)", padding: "0 14px 0 40px", background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-control)", color: "var(--ink)" }} />
    </div>
  );
}
