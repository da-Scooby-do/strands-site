import React from "react";

/* Placeholder roundel: thin outline circle, lilac damask ground, ornate S in green.
   The real monogram artwork was not supplied — the S here is plain display serif. */
export function Monogram({ size = 72, ground = "var(--lilac)" }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "var(--radius-pill)", border: "1px solid var(--green)", background: ground, backgroundImage: "var(--damask-tile)", backgroundSize: size * 3, backgroundPosition: "center", display: "grid", placeItems: "center", overflow: "hidden" }}>
      <span style={{ fontFamily: "var(--font-display)", fontSize: size * 0.52, color: "var(--green)", lineHeight: 1 }}>S</span>
    </div>
  );
}
