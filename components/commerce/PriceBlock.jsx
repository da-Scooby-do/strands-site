import React from "react";

export function PriceBlock({ price, was, note, currency = "EGP" }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)" }}>
        <span style={{ fontFamily: "var(--font-numeric)", fontSize: 32, fontWeight: 500, color: "var(--ink)", letterSpacing: "-.01em" }}>{price} {currency}</span>
        {was && <span style={{ fontFamily: "var(--font-numeric)", fontSize: 16, color: "var(--ink-2)", textDecoration: "line-through" }}>{was} {currency}</span>}
      </div>
      {note && <span style={{ fontSize: "var(--text-small)", color: "var(--ink-2)" }}>{note}</span>}
    </div>
  );
}
