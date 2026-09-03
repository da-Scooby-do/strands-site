import React from "react";
import { Icon } from "./Icon.jsx";
export function Pagination({ page = 1, pages = 5, onChange }) {
  const go = (p) => onChange && onChange(Math.min(pages, Math.max(1, p)));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontFamily: "var(--font-numeric)", fontSize: "var(--text-small)" }}>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} type="button" onClick={() => go(p)}
          style={{ font: "inherit", width: 32, height: 32, borderRadius: "var(--radius-control)", cursor: "pointer", border: "1px solid " + (p === page ? "var(--purple)" : "transparent"), background: p === page ? "var(--purple)" : "transparent", color: p === page ? "var(--white)" : "var(--ink-2)" }}>{p}</button>
      ))}
      <button type="button" onClick={() => go(page + 1)} aria-label="Next"
        style={{ width: 32, height: 32, display: "grid", placeItems: "center", border: "1px solid var(--rule)", borderRadius: "var(--radius-control)", background: "transparent", cursor: "pointer", color: "var(--ink)" }}>
        <Icon name="chevron-right" size={15} />
      </button>
    </div>
  );
}
