import React from "react";

export function StatBox({ value, caption, tone = "ink" }) {
  return (
    <div style={{ background: "var(--white)", border: "var(--border-card)", borderRadius: "var(--radius-card)", padding: "var(--space-5)", display: "grid", gap: "var(--space-2)" }}>
      <span style={{ fontFamily: "var(--font-numeric)", fontSize: 40, fontWeight: 500, lineHeight: 1, color: tone === "green" ? "var(--green)" : "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
      <span style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", lineHeight: 1.5 }}>{caption}</span>
    </div>
  );
}
