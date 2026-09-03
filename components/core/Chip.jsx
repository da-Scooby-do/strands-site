import React from "react";

export function Chip({ children, selected = false, onClick, tone = "ink" }) {
  const interactive = typeof onClick === "function";
  return (
    <button type="button" onClick={onClick} disabled={!interactive}
      style={{ font: "inherit", fontFamily: "var(--font-sans)", fontSize: "var(--text-small)", height: 32, padding: "0 14px", borderRadius: "var(--radius-pill)", cursor: interactive ? "pointer" : "default", transition: "all var(--dur) var(--ease)",
        background: selected ? "var(--purple)" : tone === "green" ? "var(--green-tint)" : "transparent",
        color: selected ? "var(--white)" : tone === "green" ? "var(--green)" : "var(--ink-2)",
        border: "1px solid " + (selected ? "var(--purple)" : "var(--rule)") }}>{children}</button>
  );
}
