const { Icon } = window.StrandsDesignSystem_6d0a65;
const FLOW = ["Placed", "Confirmed", "Packed", "With courier", "Delivered"];
function OrderTimeline({ status, dates = {} }) {
  const cancelled = status === "Cancelled";
  const at = cancelled ? -1 : FLOW.indexOf(status);
  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 0 }}>
      {FLOW.map((s, i) => {
        const done = i <= at;
        const now = i === at;
        return (
          <li key={s} style={{ display: "grid", gridTemplateColumns: "24px 1fr auto", gap: "var(--space-3)", alignItems: "start" }}>
            <span style={{ display: "grid", justifyItems: "center", gap: 0, height: "100%" }}>
              <span style={{ width: 18, height: 18, borderRadius: "var(--radius-pill)", border: "1.5px solid " + (done ? "var(--green)" : "var(--rule)"), background: done ? "var(--green)" : "transparent", color: "var(--white)", display: "grid", placeItems: "center" }}>
                {done && <Icon name="check" size={11} stroke={3} />}
              </span>
              {i < FLOW.length - 1 && <span style={{ width: 1.5, flex: 1, minHeight: 26, background: i < at ? "var(--green)" : "var(--rule)" }} />}
            </span>
            <span style={{ paddingBottom: "var(--space-4)", display: "grid", gap: 2 }}>
              <span style={{ fontSize: "var(--text-small)", fontWeight: now ? 600 : 400, color: done ? "var(--ink)" : "var(--ink-2)" }}>{s}</span>
              {now && <span style={{ fontSize: "var(--text-fine-size)", color: "var(--green)" }}>Where your order is now.</span>}
            </span>
            <span style={{ fontFamily: "var(--font-numeric)", fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>{dates[s] || ""}</span>
          </li>
        );
      })}
      {cancelled && <li style={{ paddingTop: "var(--space-3)", borderTop: "1px solid var(--rule)", fontSize: "var(--text-small)", color: "var(--ink-2)" }}>This order was cancelled. Nothing was collected.</li>}
    </ol>
  );
}
Object.assign(window, { StrandsOrderTimeline: OrderTimeline });
