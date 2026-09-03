import React from "react";

export function Card({ children, tone = "white", pad = "var(--space-5)", radius = "var(--radius-card)", style }) {
  const grounds = { white: "var(--white)", green: "var(--green-tint)", purple: "var(--purple-tint)", cream: "var(--cream)" };
  return (
    <div style={{ background: grounds[tone] || grounds.white, border: "var(--border-card)", borderRadius: radius, padding: pad, boxShadow: "none", ...style }}>{children}</div>
  );
}
