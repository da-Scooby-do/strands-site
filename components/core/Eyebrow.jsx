import React from "react";

export function Eyebrow({ children, tone = "green", style }) {
  return (
    <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-eyebrow-size)", letterSpacing: "var(--track-eyebrow)", textTransform: "uppercase", color: tone === "lilac" ? "var(--lilac)" : "var(--green)", fontWeight: 500, ...style }}>{children}</div>
  );
}
