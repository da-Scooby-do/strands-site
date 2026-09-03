import React from "react";

export function IngredientCard({ name, children, arabic, image, figureLabel = "Ingredient diagram" }) {
  return (
    <div style={{ background: "var(--white)", border: "var(--border-card)", borderRadius: "var(--radius-card)", overflow: "hidden", display: "grid" }}>
      <div style={{ position: "relative", aspectRatio: "16 / 10", background: "var(--green-tint)", overflow: "hidden" }}>
        {image
          ? <img src={image} alt={name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 50%", display: "block" }} />
          : <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--green)", fontFamily: "var(--font-sans)" }}>{figureLabel}</span>}
      </div>
      <div style={{ padding: "var(--space-4)", display: "grid", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--ink)" }}>{name}</span>
        {arabic && <span dir="rtl" style={{ fontFamily: "var(--font-arabic)", fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>{arabic}</span>}
        <p style={{ fontSize: "var(--text-small)", lineHeight: 1.6, color: "var(--ink-2)" }}>{children}</p>
      </div>
    </div>
  );
}
