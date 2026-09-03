import React from "react";

export function DataTable({ columns = [], rows = [], onRowClick, empty = "Nothing here yet." }) {
  return (
    <div style={{ background: "var(--white)", border: "var(--border-card)", borderRadius: "var(--radius-card)", overflow: "hidden", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse", fontFamily: "var(--font-sans)" }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: c.align === "end" ? "end" : "start", padding: "12px 16px", fontSize: "var(--text-eyebrow-size)", letterSpacing: "var(--track-eyebrow)", textTransform: "uppercase", color: "var(--ink-2)", fontWeight: 500, borderBottom: "1px solid var(--rule)", background: "var(--cream)" }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || i} onClick={() => onRowClick && onRowClick(r)}
              style={{ cursor: onRowClick ? "pointer" : "default", background: "var(--white)" }}
              onMouseEnter={(e) => { if (onRowClick) e.currentTarget.style.background = "var(--cream)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--white)"; }}>
              {columns.map((c) => (
                <td key={c.key} style={{ padding: "14px 16px", fontSize: "var(--text-small)", color: "var(--ink)", borderTop: i ? "1px solid var(--rule)" : "none", textAlign: c.align === "end" ? "end" : "start", fontVariantNumeric: c.numeric ? "tabular-nums" : "normal", fontFamily: c.numeric ? "var(--font-numeric)" : "inherit", whiteSpace: c.wrap ? "normal" : "nowrap", maxWidth: c.maxWidth || "none", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={columns.length} style={{ padding: "var(--space-7)", textAlign: "center", fontSize: "var(--text-small)", color: "var(--ink-2)" }}>{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
