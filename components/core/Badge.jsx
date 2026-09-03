import React from "react";
import { Icon } from "./Icon.jsx";
export function Badge({ children, icon, tone = "green" }) {
  const t = tone === "green"
    ? { background: "var(--green-tint)", color: "var(--green)", border: "1px solid rgba(87,117,55,.2)" }
    : { background: "var(--purple-tint)", color: "var(--purple)", border: "1px solid rgba(101,52,103,.18)" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", fontSize: "var(--text-fine-size)", letterSpacing: ".04em", padding: "3px 8px", borderRadius: "var(--radius-control)", ...t }}>
      {icon && <Icon name={icon} size={12} />}{children}
    </span>
  );
}
