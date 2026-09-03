import React from "react";
import { StarRating } from "./StarRating.jsx";
import { Badge } from "../core/Badge.jsx";
import { Icon } from "../core/Icon.jsx";
export function ReviewCard({ name, initials, rating = 5, date, title, children, helpful = 0, notHelpful = 0, verified = true }) {
  return (
    <article style={{ borderTop: "1px solid var(--rule)", padding: "var(--space-5) 0", display: "grid", gap: "var(--space-3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <span style={{ width: 36, height: 36, borderRadius: "var(--radius-pill)", background: "var(--purple-tint)", color: "var(--purple)", display: "grid", placeItems: "center", fontSize: "var(--text-fine-size)", letterSpacing: ".04em" }}>{initials || (name || "").slice(0, 2).toUpperCase()}</span>
        <div style={{ display: "grid", gap: 2 }}>
          <span style={{ fontSize: "var(--text-small)", fontWeight: 500 }}>{name}</span>
          {verified && <span><Badge icon="check">Verified buyer</Badge></span>}
        </div>
        <div style={{ marginInlineStart: "auto", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <StarRating value={rating} size={13} />
          <span style={{ fontFamily: "var(--font-numeric)", fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>{date}</span>
        </div>
      </div>
      <div style={{ display: "grid", gap: 4, maxWidth: "var(--measure)" }}>
        <span style={{ fontSize: "var(--text-body-size)", fontWeight: 500 }}>{title}</span>
        <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", lineHeight: "var(--body-lh)" }}>{children}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>
        <span>Was this review helpful?</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="thumbs-up" size={13} />{helpful}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="thumbs-down" size={13} />{notHelpful}</span>
      </div>
    </article>
  );
}
