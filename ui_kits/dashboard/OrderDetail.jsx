const { PageHeader, Button, StatusPill, Card, Textarea, InlineAlert, Icon } = window.StrandsDesignSystem_6d0a65;
function Row({ k, v }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(90px,110px) 1fr", gap: "var(--space-4)", padding: "10px 0", borderTop: "1px solid var(--rule)", fontSize: "var(--text-small)" }}>
      <span style={{ color: "var(--ink-2)" }}>{k}</span><span>{v || "—"}</span>
    </div>
  );
}
// Egyptian numbers to wa.me international format (drop leading 0, add 20).
function waNumber(n) {
  if (String(n || "").trim()[0] === "+") return String(n).replace(/\D/g, "");  // already international (+966…, +249…)
  let d = String(n || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.slice(0, 2) === "20") return d;
  if (d[0] === "0") return "20" + d.slice(1);
  if (d.length <= 10) return "20" + d;
  return d;
}
// Flextock (warehouse + delivery): where this order stands there, and what can be done.
function FlextockCard({ order, fxCfg, onFlextock }) {
  const [busy, setBusy] = React.useState(null);
  const [msg, setMsg] = React.useState(null);
  const fx = order.fx || {};
  const egypt = order.country === "EG";
  if (!fxCfg || (!fxCfg.enabled && !fx.state) || !egypt) return null;
  const finished = ["Delivered", "Cancelled", "Returned"].includes(order.status);
  const run = async (action) => {
    setBusy(action); setMsg(null);
    const r = (await onFlextock(action)) || {};
    setBusy(null);
    if (action === "send") setMsg(r.sent ? { ok: true, t: "Sent to Flextock." } : r.state === "waiting_payment" ? { ok: false, t: "Waiting for payment — press Mark as paid first." } : { ok: false, t: r.error || r.skipped || "Not sent." });
    else if (action === "cancel") setMsg(r.ok ? { ok: true, t: r.pending ? "Flextock is cancelling it at the warehouse." : "Cancelled at Flextock." } : { ok: false, t: r.error || "Couldn’t cancel at Flextock." });
  };
  const LABEL = { sent: "Sent", failed: "Not sent — failed", waiting_payment: "Waiting for payment", cancelled: "Cancelled at Flextock" };
  const canSend = !finished && fx.state !== "sent" && fx.state !== "cancelled";
  const canCancel = fx.state === "sent";
  return (
    <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-3)" }}>
      <h2 style={{ fontSize: 22 }}>Flextock.</h2>
      <Row k="At Flextock" v={LABEL[fx.state] || "Not sent yet"} />
      {fx.status && <Row k="Their status" v={fx.status} />}
      {fx.courier && <Row k="Courier" v={fx.courier} />}
      {fx.tracking && <Row k="Tracking" v={fx.trackingUrl ? <a href={fx.trackingUrl} target="_blank" rel="noopener noreferrer">{fx.tracking}</a> : fx.tracking} />}
      {!fx.tracking && fx.trackingUrl && <Row k="Tracking" v={<a href={fx.trackingUrl} target="_blank" rel="noopener noreferrer">Open tracking</a>} />}
      {fx.sentAt && <Row k="Sent" v={fx.sentAt} />}
      {fx.syncedAt && <Row k="Last checked" v={fx.syncedAt} />}
      {fx.error && <InlineAlert tone="error">{fx.error}</InlineAlert>}
      {order.status === "Cancelled" && fx.state === "sent" && <InlineAlert tone="error">This order is cancelled here but still active at Flextock — cancel it there too, or it may be delivered.</InlineAlert>}
      {msg && <InlineAlert tone={msg.ok ? "ok" : "error"}>{msg.t}</InlineAlert>}
      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
        {canSend && <Button size="sm" variant="quiet" disabled={!!busy} onClick={() => run("send")}>{busy === "send" ? "Sending…" : fx.state === "failed" ? "Try sending again" : "Send to Flextock"}</Button>}
        {canCancel && <Button size="sm" variant="text" disabled={!!busy} onClick={() => { if (window.confirm("Cancel " + order.id + " at Flextock?")) run("cancel"); }}>{busy === "cancel" ? "Cancelling…" : "Cancel at Flextock"}</Button>}
      </div>
    </Card>
  );
}
function OrderDetail({ order, onBack, onAdvance, onJump, onCancel, onReturned, onSaveNote, onSetPaid, fxCfg, onFlextock }) {
  const phone = window.useIsPhone();
  const { FLOW, NEXT_LABEL, HISTORY } = window.DASH;
  const STEP_LABEL = { Confirmed: "Mark confirmed", "With courier": "Mark out for delivery", Delivered: "Mark delivered" };
  const [note, setNote] = React.useState(order.note || "");
  const [saved, setSaved] = React.useState(false);
  const sub = order.items.reduce((a, i) => a + i.p * i.q, 0);
  const done = ["Delivered", "Cancelled", "Returned"].includes(order.status);
  const waNum = waNumber(order.whatsapp || order.phone);
  const history =(order.events && order.events.length ? order.events : (HISTORY[order.id] || [{ s: "Placed", t: order.placed + " 10:00", mail: { ok: true, to: order.email } }]));
  return (
    <div>
      <button type="button" onClick={onBack} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", padding: 0, color: "var(--green)", cursor: "pointer", fontSize: "var(--text-small)", marginBottom: "var(--space-4)" }}>← All orders</button>
      <PageHeader label={"Order " + order.id + " · " + window.marketFlag(order.country) + " " + order.country} title={order.customer} action={<StatusPill status={order.status} />} />
      <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1.2fr 1fr"), gap: "var(--space-5)", alignItems: "start" }}>
        <div style={{ display: "grid", gap: "var(--space-5)" }}>
          <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
            <h2 style={{ fontSize: 22 }}>Move this order along.</h2>
            <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)" }}>Jump to any step. Only the step you choose emails the customer at {order.email} — skipped steps don't send.</p>
            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
              {!done && FLOW.slice(FLOW.indexOf(order.status) + 1).map((s) => (
                <Button key={s} size="sm" variant="quiet" onClick={() => onJump(s)}>{STEP_LABEL[s] || ("Mark " + s.toLowerCase())}</Button>
              ))}
              {waNum
                ? <a href={"https://wa.me/" + waNum} target="_blank" rel="noopener noreferrer" style={{ borderBottom: "none" }}><Button size="sm" variant="quiet">WhatsApp customer</Button></a>
                : <Button size="sm" variant="quiet" disabled>No WhatsApp number</Button>}
              {!done && <Button size="sm" variant="text" onClick={onCancel}>Cancel order</Button>}
              {!["Returned", "Cancelled"].includes(order.status) && <Button size="sm" variant="quiet" onClick={() => onReturned && onReturned()}>Mark returned</Button>}
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              {FLOW.map((s) => <StatusPill key={s} quiet status={s} active={s === order.status} />)}
            </div>
          </Card>
          <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
            <h2 style={{ fontSize: 22 }}>The order itself.</h2>
            <div>
              {order.items.map((i) => (
                <div key={i.n} style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-4)", padding: "10px 0", borderTop: "1px solid var(--rule)", fontSize: "var(--text-small)" }}>
                  <span>{i.n} × {i.q}</span><span style={{ fontFamily: "var(--font-numeric)" }}>{window.fmtMoney(i.p * i.q, order.currency)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--rule)", fontSize: "var(--text-small)", color: "var(--ink-2)" }}><span>Subtotal</span><span style={{ fontFamily: "var(--font-numeric)" }}>{window.fmtMoney(sub, order.currency)}</span></div>
              {order.discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--rule)", fontSize: "var(--text-small)", color: "var(--green)" }}><span>Discount{order.promo ? " · " + order.promo : ""}</span><span style={{ fontFamily: "var(--font-numeric)" }}>– {window.fmtMoney(order.discount, order.currency)}</span></div>}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--rule)", fontSize: "var(--text-small)", color: "var(--ink-2)" }}><span>Shipping{order.delivery ? " · " + window.deliveryName(order.country, order.delivery) : ""}</span><span style={{ fontFamily: "var(--font-numeric)" }}>{order.shipping ? window.fmtMoney(order.shipping, order.currency) : "Free"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", borderTop: "1px solid var(--rule)", fontSize: "var(--text-body-size)", fontWeight: 500 }}><span>{order.pay === "instapay" ? "Total (InstaPay)" : order.pay === "bank" ? "Total (bank transfer)" : "Total to collect"}</span><span style={{ fontFamily: "var(--font-numeric)" }}>{window.fmtMoney(sub - (order.discount || 0) + order.shipping, order.currency)}</span></div>
              {(order.pay === "instapay" || order.pay === "bank") && (order.paid
                ? <div style={{ marginTop: "var(--space-3)", padding: "10px 12px", borderRadius: "var(--radius-control)", background: "#E9F2E4", color: "#3C5A2C", fontSize: "var(--text-small)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="check" size={14} /> {order.pay === "bank" ? "Bank transfer" : "InstaPay payment"} confirmed</span>
                    <button type="button" onClick={() => onSetPaid && onSetPaid(false)} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", fontSize: "var(--text-fine-size)", textDecoration: "underline" }}>Mark unpaid</button>
                  </div>
                : <div style={{ marginTop: "var(--space-3)", padding: "10px 12px", borderRadius: "var(--radius-control)", background: "#FBEFD8", color: "#7A5200", fontSize: "var(--text-small)", display: "grid", gap: "var(--space-3)" }}>
                    <span style={{ lineHeight: 1.4 }}>Paid by <strong>{order.pay === "bank" ? "bank transfer" : "InstaPay"}</strong> — confirm the customer’s transfer screenshot (on WhatsApp) before shipping.</span>
                    <div><Button size="sm" onClick={() => onSetPaid && onSetPaid(true)}>Mark as paid</Button></div>
                  </div>)}
            </div>
            <Textarea label="Internal note" value={note} onChange={(v) => { setNote(v); setSaved(false); }} placeholder="Courier said the flat was empty, calling back tomorrow." />
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <Button size="sm" variant="quiet" onClick={() => { if (onSaveNote) onSaveNote(note); setSaved(true); }}>Save note</Button>
              {saved && <InlineAlert>Note saved.</InlineAlert>}
            </div>
          </Card>
        </div>
        <div style={{ display: "grid", gap: "var(--space-5)" }}>
          <FlextockCard order={order} fxCfg={fxCfg} onFlextock={onFlextock} />
          <Card pad="var(--space-5)">
            <h2 style={{ fontSize: 22, marginBottom: "var(--space-3)" }}>Deliver to.</h2>
            <Row k="Name" v={order.customer} />
            <Row k="Street" v={order.street} />
            <Row k="Area" v={order.area} />
            <Row k="Governorate" v={order.gov} />
            <Row k="Landmark" v={order.landmark} />
            <Row k="Phone" v={order.phone} />
            <Row k="WhatsApp" v={order.whatsapp || (waNum ? order.phone : null)} />
            <Row k="Email" v={order.email} />
          </Card>
          <Card pad="var(--space-5)">
            <h2 style={{ fontSize: 22, marginBottom: "var(--space-4)" }}>History.</h2>
            <div style={{ display: "grid", gap: "var(--space-4)" }}>
              {history.map((h, idx) => {
                const notify = ("notify" in h) ? h.notify : (h.mail ? (h.mail.ok ? "sent" : (h.mail.why || "failed")) : null);
                const to = h.to || (h.mail && h.mail.to);
                const es = window.emailStatusOf ? window.emailStatusOf(notify) : { label: notify || "Not sent", color: "var(--ink-2)", bg: "var(--purple-tint)" };
                return (
                  <div key={idx} style={{ display: "grid", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)", fontSize: "var(--text-small)" }}>
                      <span style={{ fontWeight: 500 }}>{h.s}</span>
                      <span style={{ fontFamily: "var(--font-numeric)", fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>{h.t}</span>
                    </div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "var(--text-fine-size)", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 9px", borderRadius: "var(--radius-pill)", background: es.bg, color: es.color, fontFamily: "var(--font-sans)" }}>
                        {notify === "sent" && <Icon name="check" size={11} />}{notify === "sent" ? "Emailed" : es.label}
                      </span>
                      {notify === "sent" && to && <span style={{ color: "var(--ink-2)" }}>{to}</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { DashOrderDetail: OrderDetail });
