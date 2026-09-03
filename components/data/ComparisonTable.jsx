import React from "react";

function Mark({ yes }) {
  return yes
    ? <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="var(--green)" /><path d="M6 10.2l2.6 2.6L14 7.4" fill="none" stroke="var(--white)" strokeWidth="1.8" strokeLinecap="round" /></svg>
    : <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.5" fill="none" stroke="var(--lilac)" strokeWidth="1.2" /></svg>;
}
export function ComparisonTable({ columns = [], rows = [], highlight = 0 }) {
  return (
    <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border-hairline-anchor)", borderRadius: "var(--radius-card)", padding: "var(--space-5)", overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: "min(460px, 100%)", margin: "0 auto", fontFamily: "var(--font-sans)", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: "40%" }}></th>
            {columns.map((c, i) => (
              <th key={c} style={{ padding: "0 8px 16px", fontSize: "var(--text-fine-size)", fontWeight: 500, letterSpacing: ".04em", color: i === highlight ? "var(--white)" : "var(--lilac)", background: i === highlight ? "var(--purple-light)" : "transparent", borderRadius: i === highlight ? "8px 8px 0 0" : 0, paddingTop: 12 }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={r.label}>
              <td style={{ padding: "14px 12px 14px 0", fontSize: "var(--text-small)", color: "var(--white)", textWrap: "pretty", borderTop: "1px solid var(--border-hairline-anchor)" }}>{r.label}</td>
              {r.values.map((v, i) => (
                <td key={i} style={{ textAlign: "center", padding: "14px 8px", borderTop: "1px solid var(--border-hairline-anchor)", background: i === highlight ? "var(--purple-light)" : "transparent", borderRadius: i === highlight && ri === rows.length - 1 ? "0 0 8px 8px" : 0 }}><Mark yes={v} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
