import React from "react";

export function DamaskPanel({ children, tone = "purple", pad = "var(--section-y) var(--gutter)", radius = 0, contrast, style }) {
  const ground = tone === "purple" ? "var(--purple)" : "var(--lilac)";
  return (
    <div style={{ position: "relative", background: ground, borderRadius: radius, overflow: "hidden", ...style }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "var(--damask-tile)", backgroundSize: "var(--damask-size)", opacity: contrast != null ? contrast : "var(--damask-opacity)", pointerEvents: "none" }} />
      <div style={{ position: "relative", padding: pad }}>{children}</div>
    </div>
  );
}
