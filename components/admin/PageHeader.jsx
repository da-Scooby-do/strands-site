import React from "react";

export function PageHeader({ label, title, action }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "var(--space-4) var(--space-5)", paddingBottom: "var(--space-5)", borderBottom: "1px solid var(--rule)", marginBottom: "var(--space-6)" }}>
      <div style={{ display: "grid", gap: "var(--space-2)" }}>
        {label && <span style={{ fontSize: "var(--text-eyebrow-size)", letterSpacing: "var(--track-eyebrow)", textTransform: "uppercase", color: "var(--green)" }}>{label}</span>}
        <h1 style={{ fontSize: "var(--display-3)" }}>{title}</h1>
      </div>
      {action}
    </div>
  );
}
