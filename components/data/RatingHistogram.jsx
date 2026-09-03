import React from "react";

export function RatingHistogram({ counts = [0, 0, 0, 0, 0] }) {
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  return (
    <div style={{ display: "grid", gap: "var(--space-2)", minWidth: 220 }}>
      {[5, 4, 3, 2, 1].map((star) => {
        const c = counts[star - 1] || 0;
        return (
          <div key={star} style={{ display: "grid", gridTemplateColumns: "28px 1fr 28px", alignItems: "center", gap: "var(--space-3)" }}>
            <span style={{ fontFamily: "var(--font-numeric)", fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>{star}★</span>
            <span style={{ height: 6, background: "var(--rule)", borderRadius: "var(--radius-pill)", overflow: "hidden" }}>
              <span style={{ display: "block", width: (c / total) * 100 + "%", height: "100%", background: "var(--green)" }} />
            </span>
            <span style={{ fontFamily: "var(--font-numeric)", fontSize: "var(--text-fine-size)", color: "var(--ink-2)", textAlign: "end" }}>{c}</span>
          </div>
        );
      })}
    </div>
  );
}
