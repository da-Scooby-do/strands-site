import React from "react";

export function ProductGallery({ images = [], alt = "Strands Velvet Touch Masque", ratio = "4 / 5", fit = "cover" }) {
  const [i, setI] = React.useState(0);
  const active = images[i] || {};
  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      <div style={{ position: "relative", aspectRatio: ratio, background: active.ground || "var(--purple-tint)", borderRadius: "var(--radius-card)", overflow: "hidden" }}>
        {active.src
          ? <img src={active.src} alt={alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: fit, objectPosition: active.position || "center", display: "block" }} />
          : <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: "var(--font-sans)", fontSize: "var(--text-fine-size)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-2)" }}>{active.label || "Product photograph"}</span>}
        {(active.notes || []).map((n) => (
          <span key={n.text} style={{ position: "absolute", top: n.top, left: n.left, display: "flex", alignItems: "center", gap: 6, transform: "rotate(" + (n.tilt || 0) + "deg)", transformOrigin: "left center", pointerEvents: "none" }}>
            {n.flip && <svg width="58" height="28" viewBox="0 0 58 28" fill="none" aria-hidden="true" style={{ flex: "none", overflow: "visible" }}><path d="M56 6C42 6 24 10 6 24" stroke="var(--purple)" strokeWidth="2.2" strokeLinecap="round" /><path d="M18 25l-12 -1 3 -9" stroke="var(--purple)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            <span style={{ fontFamily: "var(--font-hand)", fontSize: n.size || 30, lineHeight: 1, color: "var(--purple)", whiteSpace: "nowrap" }}>{n.text}</span>
            {!n.flip && <svg width="58" height="28" viewBox="0 0 58 28" fill="none" aria-hidden="true" style={{ flex: "none", overflow: "visible" }}><path d="M2 6C16 6 34 10 52 24" stroke="var(--purple)" strokeWidth="2.2" strokeLinecap="round" /><path d="M40 25l12 -1 -3 -9" stroke="var(--purple)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        {images.map((im, n) => (
          <button key={n} type="button" onClick={() => setI(n)} aria-label={im.label}
            style={{ width: "var(--thumb)", height: "var(--thumb)", padding: 0, borderRadius: "var(--radius-control)", overflow: "hidden", cursor: "pointer", background: im.ground || "var(--purple-tint)", border: "1px solid " + (n === i ? "var(--purple)" : "var(--rule)") }}>
            {im.src ? <img src={im.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-2)", fontFamily: "var(--font-sans)" }}>{im.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
