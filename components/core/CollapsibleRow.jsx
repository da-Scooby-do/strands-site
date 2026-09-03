import React from "react";
import { Icon } from "./Icon.jsx";
export function CollapsibleRow({ title, children, open, defaultOpen = false, onToggle, number }) {
  const [self, setSelf] = React.useState(defaultOpen);
  const isOpen = open != null ? open : self;
  const toggle = () => { if (onToggle) onToggle(!isOpen); if (open == null) setSelf(!isOpen); };
  return (
    <div style={{ borderTop: "1px solid var(--rule)" }}>
      <button type="button" onClick={toggle}
        style={{ font: "inherit", fontFamily: "var(--font-sans)", width: "100%", display: "flex", alignItems: "center", gap: "var(--space-3)", background: "none", border: "none", padding: "16px 0", cursor: "pointer", textAlign: "start", color: "var(--ink)" }}>
        {number != null && <span style={{ fontFamily: "var(--font-numeric)", fontSize: "var(--text-small)", color: "var(--green)", width: 22 }}>{String(number).padStart(2, "0")}</span>}
        <span style={{ flex: 1, fontSize: "var(--text-body-size)", fontWeight: 500 }}>{title}</span>
        <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={16} color="var(--ink-2)" />
      </button>
      {isOpen && <div style={{ padding: "0 0 20px", color: "var(--text-muted)", fontSize: "var(--text-small)", lineHeight: "var(--body-lh)", maxWidth: "var(--measure)" }}>{children}</div>}
    </div>
  );
}
