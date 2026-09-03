import React from "react";
import { Button } from "../core/Button.jsx";
export function BundleCard({ title, saving, price, onAdd, thumbLabel = "2 jars" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", background: "var(--green-tint)", border: "1px solid rgba(87,117,55,.18)", borderRadius: "var(--radius-card)", padding: "var(--space-3)" }}>
      <div style={{ width: 56, height: 56, flex: "none", borderRadius: "var(--radius-control)", background: "var(--white)", border: "1px solid var(--rule)", display: "grid", placeItems: "center", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-2)", textAlign: "center" }}>{thumbLabel}</div>
      <div style={{ flex: 1, display: "grid", gap: 2 }}>
        <span style={{ fontSize: "var(--text-small)", fontWeight: 500, color: "var(--ink)" }}>{title}</span>
        {saving && <span style={{ fontSize: "var(--text-fine-size)", color: "var(--green)" }}>{saving}</span>}
      </div>
      <span style={{ fontFamily: "var(--font-numeric)", fontSize: "var(--text-small)", color: "var(--ink)" }}>{price}</span>
      <Button size="sm" variant="quiet" onClick={onAdd}>Add</Button>
    </div>
  );
}
