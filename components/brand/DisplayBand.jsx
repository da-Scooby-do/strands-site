import React from "react";

export function DisplayBand({ children = "HAIR CARE", ground = "var(--purple)", stroke = "var(--lilac)", size = 200 }) {
  return (
    <div style={{ background: ground, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", padding: "var(--space-7) 0" }}>
      <span style={{ fontFamily: "var(--font-display)", fontSize: size, lineHeight: 0.9, letterSpacing: ".06em", whiteSpace: "nowrap", color: "transparent", WebkitTextStroke: "1.5px " + stroke, textIndent: ".06em" }}>{children}</span>
    </div>
  );
}
