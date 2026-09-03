import React from "react";
import { Icon } from "../core/Icon.jsx";
export function Checkbox({ checked = false, onChange, label }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-3)", cursor: "pointer", fontSize: "var(--text-small)", color: "var(--ink)" }}>
      <span onClick={() => onChange && onChange(!checked)}
        style={{ width: 20, height: 20, borderRadius: 4, border: "1px solid " + (checked ? "var(--green)" : "var(--rule)"), background: checked ? "var(--green)" : "var(--white)", color: "var(--white)", display: "grid", placeItems: "center", flex: "none" }}>
        {checked && <Icon name="check" size={13} />}
      </span>
      {label}
    </label>
  );
}
