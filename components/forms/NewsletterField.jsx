import React from "react";
import { Icon } from "../core/Icon.jsx";
export function NewsletterField({ placeholder = "Your email", onSubmit, tone = "onAnchor" }) {
  const [v, setV] = React.useState("");
  const onDark = tone === "onAnchor";
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(v); }} style={{ position: "relative", maxWidth: 340 }}>
      <input value={v} placeholder={placeholder} onChange={(e) => setV(e.target.value)}
        style={{ font: "inherit", fontFamily: "var(--font-sans)", fontSize: "var(--text-small)", width: "100%", height: "var(--input-h)", padding: "0 52px 0 14px", background: onDark ? "rgba(255,255,255,.08)" : "var(--white)", border: "1px solid " + (onDark ? "var(--border-hairline-anchor)" : "var(--rule)"), borderRadius: "var(--radius-control)", color: onDark ? "var(--white)" : "var(--ink)" }} />
      <button type="submit" aria-label="Subscribe"
        style={{ position: "absolute", right: 5, top: 5, width: 38, height: "calc(var(--input-h) - 10px)", display: "grid", placeItems: "center", background: onDark ? "var(--lilac)" : "var(--purple)", color: onDark ? "var(--purple)" : "var(--white)", border: "none", borderRadius: "var(--radius-control)", cursor: "pointer" }}>
        <Icon name="arrow-right" size={16} />
      </button>
    </form>
  );
}
