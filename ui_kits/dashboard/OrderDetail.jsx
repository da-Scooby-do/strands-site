const { PageHeader, Button, StatusPill, Card, Textarea, InlineAlert, Icon } = window.StrandsDesignSystem_6d0a65;
function Row({ k, v }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(90px,110px) 1fr", gap: "var(--space-4)", padding: "10px 0", borderTop: "1px solid var(--rule)", fontSize: "var(--text-small)" }}>
      <span style={{ color: "var(--ink-2)" }}>{k}</span><span>{v || "—"}</span>
    </div>
  );
}
function OrderDetail({ order, onBack, onAdvance, onCancel, onSaveNote }) {
  const phone = window.useIsPhone();
  const { FLOW, NEXT_LABEL, HISTORY } = window.DASH;
  const [note, setNote] = React.useState(order.note || "");
  const [saved, setSaved] = React.useState(false);
  const sub = order.items.reduce((a, i) => a + i.p * i.q, 0);
  const done = order.status === "Delivered" || order.status === "Cancelled";
  const history = (order.events && order.events.length ? order.events : (HISTORY[order.id] || [{ s: "Placed", t: order.placed + " 10:00", mail: { ok: true, to: order.email } }]));
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
              <Button size="sm" variant="quiet">WhatsApp customer</Button>
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
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--rule)", fontSize: "var(--text-small)", color: "var(--ink-2)" }}><span>Shipping</span><span style={{ fontFamily: "var(--font-numeric)" }}>{order.shipping ? order.shipping + " EGP" : "Free"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", borderTop: "1px solid var(--rule)", fontSize: "var(--text-body-size)", fontWeight: 500 }}><span>Total to collect</span><span style={{ fontFamily: "var(--font-numeric)" }}>{(sub + order.shipping).toLocaleString("en-US")} EGP</span></div>
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
            <Row k="Email" v={order.email} />
          </Card>
          <Card pad="var(--space-5)">
            <h2 style={{ fontSize: 22, marginBottom: "var(--space-4)" }}>History.</h2>
            <div style={{ display: "grid", gap: "var(--space-4)" }}>
              {history.map((h) => (
                <div key={h.s} style={{ display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)", fontSize: "var(--text-small)" }}>
                    <span style={{ fontWeight: 500 }}>{h.s}</span>
                    <span style={{ fontFamily: "var(--font-numeric)", fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>{h.t}</span>
                  </div>
                  {h.mail.ok
                    ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "var(--text-fine-size)", color: "var(--green)" }}><Icon name="check" size={12} />Emailed {h.mail.to}</span>
                    : <span style={{ fontSize: "var(--text-fine-size)", color: "#8A2B2B", lineHeight: 1.5 }}>{h.mail.why}</span>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { DashOrderDetail: OrderDetail });
