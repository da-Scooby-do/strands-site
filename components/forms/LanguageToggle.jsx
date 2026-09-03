import React from "react";

export function LanguageToggle({ value = "EN", onChange, tone = "ink" }) {
  const langs = ["EN", "ع"];
  const color = tone === "onAnchor" ? "var(--white)" : "var(--ink)";
  return (
    <div style={{ display: "inline-flex", border: "1px solid " + (tone === "onAnchor" ? "var(--border-hairline-anchor)" : "var(--rule)"), borderRadius: "var(--radius-control)", overflow: "hidden" }}>
      {langs.map((l) => (
        <button key={l} type="button" onClick={() => onChange && onChange(l)}
          style={{ font: "inherit", fontFamily: l === "ع" ? "var(--font-arabic)" : "var(--font-sans)", fontSize: 12, letterSpacing: ".06em", height: 32, padding: "0 10px", border: "none", cursor: "pointer", background: value === l ? "var(--purple)" : "transparent", color: value === l ? "var(--white)" : color }}>{l}</button>
      ))}
    </div>
  );
}
