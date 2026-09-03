import React from "react";

/* No logo files were supplied with the brand materials. The wordmark is set in
   the display serif; the swash A of the real logotype cannot be reproduced and
   is intentionally NOT approximated. Swap in the official SVG when available. */
export function Wordmark({ color = "var(--green)", size = 32, descriptor = true, align = "center" }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", gap: Math.max(4, size * 0.16), lineHeight: 1 }}>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: size, letterSpacing: "var(--logotype-tracking)", color, textIndent: "var(--logotype-tracking)" }}>STRANDS</span>
      {descriptor && (
        <span style={{ fontFamily: "var(--font-sans)", fontSize: Math.max(7, size * 0.24), letterSpacing: "var(--track-descriptor)", textTransform: "uppercase", color, textIndent: "var(--track-descriptor)" }}>Hair Care</span>
      )}
    </div>
  );
}
