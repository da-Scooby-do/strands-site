import React from "react";

export function Switch({ checked = false, onChange, label }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-3)", cursor: "pointer", fontSize: "var(--text-small)", color: "var(--ink)" }}>
      <span onClick={() => onChange && onChange(!checked)}
        style={{ width: 40, height: 22, borderRadius: "var(--radius-pill)", background: checked ? "var(--green)" : "var(--rule)", position: "relative", transition: "background var(--dur) var(--ease)", flex: "none" }}>
        <span style={{ position: "absolute", top: 3, left: checked ? 21 : 3, width: 16, height: 16, borderRadius: "var(--radius-pill)", background: "var(--white)", transition: "left var(--dur) var(--ease)" }} />
      </span>
      {label}
    </label>
  );
}
