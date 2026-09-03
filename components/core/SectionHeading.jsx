import React from "react";
import { Eyebrow } from "./Eyebrow.jsx";
export function SectionHeading({ eyebrow, title, sub, align = "start", tone = "light", size = "var(--display-2)", style }) {
  const onDark = tone === "dark";
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", textAlign: align === "center" ? "center" : "start", justifyItems: align === "center" ? "center" : "start", ...style }}>
      {eyebrow && <Eyebrow tone={onDark ? "lilac" : "green"}>{eyebrow}</Eyebrow>}
      <h2 style={{ fontSize: size, color: onDark ? "var(--white)" : "var(--text-heading)", maxWidth: "22ch" }}>{title}</h2>
      {sub && <p style={{ color: onDark ? "var(--lilac)" : "var(--text-muted)", maxWidth: "var(--measure)", fontSize: "var(--text-body-size)" }}>{sub}</p>}
    </div>
  );
}
