/* Record an offline order (WhatsApp / Instagram / phone). Admin-only RPC
   create_manual_order. Opens as a modal from the Orders screen. */
const { Button, Input, Select, InlineAlert, Icon } = window.StrandsDesignSystem_6d0a65;
const SOURCES = [{ value: "whatsapp", label: "WhatsApp" }, { value: "instagram", label: "Instagram" }, { value: "phone", label: "Phone" }, { value: "other", label: "Other" }];
const STATUSES = [{ value: "confirmed", label: "Confirmed" }, { value: "placed", label: "Placed" }, { value: "packed", label: "Packed" }, { value: "with_courier", label: "With courier" }, { value: "delivered", label: "Delivered" }];
function egp(n) { return (n | 0).toLocaleString("en-US") + " EGP"; }

function NewOrder({ open, onClose, onCreated }) {
  const phone = window.useIsPhone();
  const [variants, setVariants] = React.useState([]);
  const [f, setF] = React.useState({ source: "whatsapp", status: "confirmed", full_name: "", phone: "", email: "", governorate: "", area: "", street: "", landmark: "", shipping: "", discount: "", note: "" });
  const [items, setItems] = React.useState([{ variant_key: "", qty: 1 }]);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    if (!open || !window.SB_READY) return;
    window.sb.from("product_variants").select("key,label_en,price_egp,active").eq("active", true).order("sort").then(({ data }) => {
      if (data) { setVariants(data); setItems((it) => it.map((x) => ({ ...x, variant_key: x.variant_key || (data[0] && data[0].key) || "" }))); }
    });
  }, [open]);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const setItem = (i, k, v) => setItems((a) => a.map((x, n) => (n === i ? { ...x, [k]: v } : x)));
  const priceOf = (key) => { const v = variants.find((x) => x.key === key); return v ? v.price_egp : 0; };
  const subtotal = items.reduce((a, it) => a + priceOf(it.variant_key) * (Number(it.qty) || 0), 0);
  const total = Math.max(0, subtotal - (Number(f.discount) || 0)) + (Number(f.shipping) || 0);

  async function save() {
    if (busy) return; setErr("");
    if (!f.full_name.trim()) return setErr("Enter the customer’s name.");
    if (!f.phone.trim()) return setErr("Enter the customer’s phone.");
    if (!items.some((it) => it.variant_key && Number(it.qty) > 0)) return setErr("Add at least one item.");
    setBusy(true);
    try {
      const payload = {
        source: f.source, status: f.status, full_name: f.full_name, phone: f.phone, email: f.email,
        governorate: f.governorate, area: f.area, street: f.street, landmark: f.landmark,
        shipping: Number(f.shipping) || 0, discount: Number(f.discount) || 0, note: f.note,
        items: items.filter((it) => it.variant_key && Number(it.qty) > 0).map((it) => ({ variant_key: it.variant_key, qty: Number(it.qty) })),
      };
      const r = await window.sbRpc("create_manual_order", { payload });
      if (r && r.ok) { if (onCreated) onCreated(r); onClose(); }
      else setErr((r && r.error) ? ("Could not save — " + r.error) : "Could not save the order.");
    } finally { setBusy(false); }
  }

  if (!open) return null;
  const lbl = { fontSize: "var(--text-fine-size)", color: "var(--ink-2)" };
  const two = { display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "var(--space-3)" };

  return (
    <div>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(30,24,20,.45)", zIndex: 59 }} />
      <aside role="dialog" aria-label="New order" style={{ position: "fixed", top: 0, bottom: 0, insetInlineEnd: 0, width: "min(520px,100vw)", background: "var(--cream)", zIndex: 60, overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,.16)" }}>
        <header style={{ position: "sticky", top: 0, background: "var(--cream)", borderBottom: "1px solid var(--rule)", padding: "var(--space-4) var(--space-5)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1 }}>
          <strong style={{ fontSize: 18 }}>Record an order</strong>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)" }}><Icon name="x" size={20} /></button>
        </header>
        <div style={{ padding: "var(--space-5)", display: "grid", gap: "var(--space-5)" }}>
          <div style={two}>
            <Select label="Came from" value={f.source} onChange={(v) => set("source", v)} options={SOURCES} />
            <Select label="Status" value={f.status} onChange={(v) => set("status", v)} options={STATUSES} />
          </div>

          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <span style={lbl}>Customer</span>
            <Input label="Full name" value={f.full_name} onChange={(v) => set("full_name", v)} />
            <div style={two}>
              <Input label="Phone" type="tel" value={f.phone} onChange={(v) => set("phone", v)} />
              <Input label="Email (optional)" type="email" value={f.email} onChange={(v) => set("email", v)} />
            </div>
            <div style={two}>
              <Input label="Street" value={f.street} onChange={(v) => set("street", v)} />
              <Select label="Governorate" value={f.governorate} onChange={(v) => set("governorate", v)} options={[{ value: "", label: "Choose…" }].concat((window.EG_GOVERNORATES || []).map((g) => ({ value: g[0], label: g[0] })))} />
            </div>
            <div style={two}>
              <Input label="Area (optional)" value={f.area} onChange={(v) => set("area", v)} />
              <Input label="Landmark (optional)" value={f.landmark} onChange={(v) => set("landmark", v)} />
            </div>
          </div>

          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <span style={lbl}>Items</span>
            {items.map((it, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px auto auto", gap: "var(--space-2)", alignItems: "end" }}>
                <Select label={i === 0 ? "Product" : ""} value={it.variant_key} onChange={(v) => setItem(i, "variant_key", v)} options={variants.map((v) => ({ value: v.key, label: v.label_en + " — " + egp(v.price_egp) }))} />
                <Input label={i === 0 ? "Qty" : ""} value={String(it.qty)} onChange={(v) => setItem(i, "qty", v.replace(/[^0-9]/g, ""))} />
                <div style={{ fontFamily: "var(--font-numeric)", height: "var(--input-h)", display: "grid", alignItems: "center", minWidth: 70 }}>{egp(priceOf(it.variant_key) * (Number(it.qty) || 0))}</div>
                <div style={{ height: "var(--input-h)", display: "grid", alignItems: "center" }}>
                  {items.length > 1 && <button type="button" onClick={() => setItems((a) => a.filter((_, n) => n !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)" }}><Icon name="x" size={16} /></button>}
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setItems((a) => [...a, { variant_key: (variants[0] && variants[0].key) || "", qty: 1 }])} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", cursor: "pointer", color: "var(--green)", fontSize: "var(--text-small)", justifySelf: "start" }}>+ Add another item</button>
          </div>

          <div style={two}>
            <Input label="Shipping (EGP)" value={String(f.shipping)} onChange={(v) => set("shipping", v.replace(/[^0-9]/g, ""))} placeholder="0" />
            <Input label="Discount (EGP)" value={String(f.discount)} onChange={(v) => set("discount", v.replace(/[^0-9]/g, ""))} placeholder="0" />
          </div>
          <Input label="Note (optional)" value={f.note} onChange={(v) => set("note", v)} />

          <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: "var(--space-4)", display: "grid", gap: 6, fontSize: "var(--text-small)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--ink-2)" }}>Subtotal</span><span style={{ fontFamily: "var(--font-numeric)" }}>{egp(subtotal)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--rule)", paddingTop: 6, fontWeight: 700 }}><span>Total</span><span style={{ fontFamily: "var(--font-numeric)" }}>{egp(total)}</span></div>
          </div>

          {err && <InlineAlert tone="error">{err}</InlineAlert>}
          <Button fullWidth onClick={save} disabled={busy}>{busy ? "Saving…" : "Save order"}</Button>
        </div>
      </aside>
    </div>
  );
}
Object.assign(window, { DashNewOrder: NewOrder });
