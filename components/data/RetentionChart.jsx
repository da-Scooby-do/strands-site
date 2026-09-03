import React from "react";

export function RetentionChart({ series = [], flat = [], marks = [], xLabel = "Hours after washing", yLabel = "Moisture retained", height = 300 }) {
  const W = 900, H = height, pad = { t: 24, r: 24, b: 42, l: 44 };
  const maxX = Math.max(...series.map((p) => p[0]), 1);
  const x = (v) => pad.l + (v / maxX) * (W - pad.l - pad.r);
  const y = (v) => H - pad.b - (v / 100) * (H - pad.t - pad.b);
  const line = (pts) => pts.map((p, i) => (i ? "L" : "M") + x(p[0]) + " " + y(p[1])).join(" ");
  const area = series.length ? line(series) + " L" + x(maxX) + " " + y(0) + " L" + x(0) + " " + y(0) + " Z" : "";
  return (
    <svg viewBox={"0 0 " + W + " " + H} width="100%" role="img" aria-label={yLabel + " over " + xLabel} style={{ fontFamily: "var(--font-numeric)" }}>
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="var(--rule)" strokeWidth="1" />
          <text x={pad.l - 10} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--ink-2)">{t}</text>
        </g>
      ))}
      {area && <path d={area} fill="var(--green)" opacity="0.25" />}
      {flat.length > 0 && <path d={line(flat)} fill="none" stroke="var(--data-flat)" strokeWidth="1.6" />}
      {series.length > 0 && <path d={line(series)} fill="none" stroke="var(--green)" strokeWidth="2" />}
      {marks.map((m) => (
        <g key={m.label}>
          <line x1={x(m.x)} x2={x(m.x)} y1={y(0)} y2={y(0) + 6} stroke="var(--ink-2)" strokeWidth="1" />
          <text x={x(m.x)} y={y(0) + 22} textAnchor="middle" fontSize="11" fill="var(--ink-2)">{m.label}</text>
        </g>
      ))}
      <text x={W - pad.r} y={H - 6} textAnchor="end" fontSize="11" fill="var(--ink-2)">{xLabel}</text>
      {series.length > 0 && <text x={x(series[Math.floor(series.length / 2)][0]) + 8} y={y(series[Math.floor(series.length / 2)][1]) - 10} fontSize="12" fill="var(--green)">With the masque</text>}
      {flat.length > 0 && <text x={x(flat[Math.floor(flat.length / 2)][0]) + 8} y={y(flat[Math.floor(flat.length / 2)][1]) + 18} fontSize="12" fill="var(--ink-2)">Untreated hair</text>}
    </svg>
  );
}
