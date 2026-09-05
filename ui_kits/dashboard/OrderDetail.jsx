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
  let d = String(n || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.slice(0, 2) === "20") return d;
  if (d[0] === "0") return "20" + d.slice(1);
  if (d.length <= 10) return "20" + d;
  return d;
}
function OrderDetail({ order, onBack, onAdvance, onCancel, onSaveNote }) {
  const phone = window.useIsPhone();
  const { FLOW, NEXT_LABEL, HISTORY } = window.DASH;
  const [note, setNote] = React.useState(order.note || "");
  const [saved, setSaved] = React.useState(false);
  const sub = order.items.reduce((a, i) => a + i.p * i.q, 0);
  const done = order.status === "Delivered" || order.status === "Cancelled";
  const waNum = waNumber(order.whatsapp || order.phone);
  const history =(order.events && order.events.length ? order.events : (HISTORY[order.id] || [{ s: "Placed", t: order.placed + " 10:00", mail: { ok: true, to: order.email } }]));
  return (
    <div>
      <button type="button" onClick={onBack} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", padding: 0, color: "var(--green)", cursor: "pointer", fontSize: "var(--text-small)", marginBottom: "var(--space-4)" }}>← All orders</button>
      <PageHeader label={"Order " + order.id} title={order.customer} action={<StatusPill status={order.status} />} />
      <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1.2fr 1fr"), gap: "var(--space-5)", alignItems: "start" }}>
        <div style={{ display: "grid", gap: "var(--space-5)" }}>
          <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
            <h2 style={{ fontSize: 22 }}>Move this order along.</h2>
            <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)" }}>Each step emails the customer at {order.email}.</p>
            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
              {!done && <Button size="sm" onClick={onAdvance}>{NEXT_LABEL[order.status]}</Button>}
              {waNum
                ? <a href={"https://wa.me/" + waNum} target="_blank" rel="noopener noreferrer" style={{ borderBottom: "none" }}><Button size="sm" variant="quiet">WhatsApp customer</Button></a>
                : <Button size="sm" variant="quiet" disabled>No WhatsApp number</Button>}
              {!done && <Button size="sm" variant="text" onClick={onCancel}>Cancel order</Button>}
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
                  <span>{i.n} × {i.q}</span><span style={{ fontFamily: "var(--font-numeric)" }}>{(i.p * i.q).toLocaleString("en-US")} EGP</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--rule)", fontSize: "var(--text-small)", color: "var(--ink-2)" }}><span>Subtotal</span><span style={{ fontFamily: "var(--font-numeric)" }}>{sub.toLocaleString("en-US")} EGP</span></div>
              {order.discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--rule)", fontSize: "var(--text-small)", color: "var(--green)" }}><span>Discount{order.promo ? " · " + order.promo : ""}</span><span style={{ fontFamily: "var(--font-numeric)" }}>– {order.discount.toLocaleString("en-US")} EGP</span></div>}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--rule)", fontSize: "var(--text-small)", color: "var(--ink-2)" }}><span>Shipping</span><span style={{ fontFamily: "var(--font-numeric)" }}>{order.shipping ? order.shipping + " EGP" : "Free"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", borderTop: "1px solid var(--rule)", fontSize: "var(--text-body-size)", fontWeight: 500 }}><span>Total to collect</span><span style={{ fontFamily: "var(--font-numeric)" }}>{(sub - (order.discount || 0) + order.shipping).toLocaleString("en-US")} EGP</span></div>
            </div>
            <Textarea label="Internal note" value={note} onChange={(v) => { setNote(v); setSaved(false); }} placeholder="Courier said the flat was empty, calling back tomorrow." />
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <Button size="sm" variant="quiet" onClick={() => { if (onSaveNote) onSaveNote(note); setSaved(true); }}>Save note</Button>
              {saved && <InlineAlert>Note saved.</InlineAlert>}
            </div>
          </Card>
        </div>
        <div style={{ display: "grid", gap: "var(--space-5)" }}>
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
