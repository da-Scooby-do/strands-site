import React from "react";
import { Icon } from "./Icon.jsx";
export function IconButton({ name, label, onClick, size = 40, tone = "ink", badge }) {
  const [hot, setHot] = React.useState(false);
  const color = tone === "onAnchor" ? "var(--white)" : "var(--ink)";
  return (
    <button type="button" aria-label={label} onClick={onClick}
      onMouseEnter={() => setHot(true)} onMouseLeave={() => setHot(false)}
      style={{ position: "relative", width: size, height: size, display: "grid", placeItems: "center", background: hot ? (tone === "onAnchor" ? "rgba(255,255,255,.1)" : "var(--purple-tint)") : "transparent", border: "none", borderRadius: "var(--radius-control)", color, cursor: "pointer", transition: "background var(--dur) var(--ease)" }}>
      <Icon name={name} size={18} />
      {badge != null && (
        <span style={{ position: "absolute", top: 2, right: 2, minWidth: 16, height: 16, padding: "0 4px", borderRadius: "var(--radius-pill)", background: "var(--green)", color: "var(--white)", fontSize: 10, lineHeight: "16px", fontFamily: "var(--font-numeric)" }}>{badge}</span>
      )}
    </button>
  );
}
