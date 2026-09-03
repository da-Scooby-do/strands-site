import React from "react";

const TONES = {
  Placed: { bg: "var(--purple-tint)", fg: "var(--purple)" },
  Confirmed: { bg: "var(--purple-tint)", fg: "var(--purple)" },
  Packed: { bg: "var(--green-tint)", fg: "var(--green)" },
  "With courier": { bg: "var(--green-tint)", fg: "var(--green)" },
  Delivered: { bg: "var(--green)", fg: "var(--white)" },
  Cancelled: { bg: "transparent", fg: "var(--ink-2)" },
};
export function StatusPill({ status = "Placed", quiet = false, active = false, onClick }) {
  const t = TONES[status] || TONES.Placed;
  const style = quiet
    ? { background: active ? "var(--purple)" : "transparent", color: active ? "var(--white)" : "var(--ink-2)", border: "1px solid " + (active ? "var(--purple)" : "var(--rule)") }
    : { background: t.bg, color: t.fg, border: "1px solid " + (status === "Cancelled" ? "var(--rule)" : "transparent") };
  const Tag = onClick ? "button" : "span";
  return (
    <Tag onClick={onClick} type={onClick ? "button" : undefined}
      style={{ font: "inherit", fontFamily: "var(--font-sans)", display: "inline-flex", alignItems: "center", height: 24, padding: "0 10px", borderRadius: "var(--radius-pill)", fontSize: "var(--text-fine-size)", letterSpacing: ".03em", whiteSpace: "nowrap", cursor: onClick ? "pointer" : "default", ...style }}>{status}</Tag>
  );
}
