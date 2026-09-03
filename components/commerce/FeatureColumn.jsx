import React from "react";
import { Icon } from "../core/Icon.jsx";
export function FeatureColumn({ icon, title, children, tone = "dark", align = "start" }) {
  const onDark = tone === "dark";
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", justifyItems: align === "center" ? "center" : "start", textAlign: align === "center" ? "center" : "start" }}>
      <span style={{ width: 44, height: 44, borderRadius: "var(--radius-pill)", border: "1.75px solid " + (onDark ? "var(--icon-on-anchor)" : "var(--icon-on-light)"), display: "grid", placeItems: "center", color: onDark ? "var(--icon-on-anchor)" : "var(--icon-on-light)" }}>
        <Icon name={icon} size={20} stroke={2.75} />
      </span>
      <span style={{ fontSize: "var(--text-small)", fontWeight: 600, color: onDark ? "var(--white)" : "var(--ink)" }}>{title}</span>
      <p style={{ fontSize: "var(--text-small)", lineHeight: 1.6, color: onDark ? "var(--lilac)" : "var(--ink-2)", maxWidth: "30ch" }}>{children}</p>
    </div>
  );
}
