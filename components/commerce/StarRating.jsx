import React from "react";

export function StarRating({ value = 5, size = 14, count, color = "var(--green)" }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ display: "inline-flex", gap: 2, color }} aria-label={value + " out of 5"}>
        {stars.map((s) => (
          <svg key={s} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.5L12 17.5 6.1 20.6l1.2-6.5L2.5 9.5l6.6-.9z"
              fill={s <= Math.round(value) ? color : "none"} stroke={color} strokeWidth="1.5" />
          </svg>
        ))}
      </span>
      {count != null && <span style={{ fontFamily: "var(--font-numeric)", fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>{count} reviews</span>}
    </span>
  );
}
