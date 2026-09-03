import React from "react";
import { Icon } from "../core/Icon.jsx";
export function InlineAlert({ tone = "ok", children }) {
  const t = tone === "error"
    ? { color: "#8A2B2B", icon: "alert-circle" }
    : { color: "var(--green)", icon: "check" };
  return (
    <p style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-small)", color: t.color }}>
      <Icon name={t.icon} size={15} />{children}
    </p>
  );
}
