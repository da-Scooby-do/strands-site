/* Record an offline order (WhatsApp / Instagram / phone). Admin-only RPC
   create_manual_order. Opens as a modal from the Orders screen. */
const { Button, Input, Select, InlineAlert, Icon } = window.StrandsDesignSystem_6d0a65;
const NEW_ORDER_SOURCES = [{ value: "whatsapp", label: "WhatsApp" }, { value: "instagram", label: "Instagram" }, { value: "phone", label: "Phone" }, { value: "other", label: "Other" }];
const NEW_ORDER_STATUSES = [{ value: "confirmed", label: "Confirmed" }, { value: "placed", label: "Placed" }, { value: "packed", label: "Packed" }, { value: "with_courier", label: "With courier" }, { value: "delivered", label: "Delivered" }];
function NewOrder({ open, onClose, onCreated, country, markets }) {
  const phone = window.useIsPhone();
  const [variants, setVariants] = React.useState([]);
  const [mv, setMv] = React.useState([]);  // market_variants: prices outside Egypt
  const [cc, setCc] = React.useState(country && country !== "ALL" ? country : "EG");
  React.useEffect(() => { if (open) setCc(country && country !== "ALL" ? country : "EG"); }, [open, country]);
  const mInfo = (markets || []).find((m) => m.code === cc) || { code: "EG", name_en: "Egypt", currency: "EGP" };
  const cur = mInfo.currency;
  const egp = (n) => window.fmtMoney(n, cur);
  const regions = ((window.MARKET_INFO || {})[cc] || {}).regions || window.EG_GOVERNORATES || [];
  const regionLabel = (((window.MARKET_INFO || {})[cc] || {}).region || ["Governorate"])[0];
  const [f, setF] = React.useState({ source: "whatsapp", status: "confirmed", full_name: "", phone: "", phone2: "", email: "", governorate: "", area: "", street: "", landmark: "", shipping: "", discount: "", note: "" });
  const [items, setItems] = React.useState([{ variant_key: "", qty: 1 }]);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    if (!open || !window.SB_READY) return;
    window.sb.from("product_variants").select("key,label_en,size_ml,price_egp,active").order("sort").then(({ data }) => {
      if (data) { setVariants(data); setItems((it) => it.map((x) => ({ ...x, variant_key: x.variant_key || (data[0] && data[0].key) || "" }))); }
    });
    window.sb.from("market_variants").select("market,variant_key,price").then(({ data }) => { if (data) setMv(data); }, () => {});
  }, [open]);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const setItem = (i, k, v) => setItems((a) => a.map((x, n) => (n === i ? { ...x, [k]: v } : x)));
  // Egypt: the shop price. Elsewhere: that country's price (null = not sold there).
  const priceOf = (key) => { if (cc === "EG") { const v = variants.find((x) => x.key === key && x.active); return v ? v.price_egp : null; } const m = mv.find((x) => x.market === cc && x.variant_key === key); return m && m.price != null ? m.price : null; };
  const offered = variants.filter((v) => priceOf(v.key) != null);
  React.useEffect(() => { setItems((it) => it.map((x) => (offered.some((v) => v.key === x.variant_key) ? x : { ...x, variant_key: (offered[0] && offered[0].key) || "" }))); set("governorate", ""); /* eslint-disable-next-line */ }, [cc, mv.length, variants.length]);
  const subtotal = items.reduce((a, it) => a + (priceOf(it.variant_key) || 0) * (Number(it.qty) || 0), 0);
  const total = Math.max(0, subtotal - (Number(f.discount) || 0)) + (Number(f.shipping) || 0);

  async function save() {
    if (busy) return; setErr("");
    if (!f.full_name.trim()) return setErr("Enter the customer’s name.");
    if (!f.phone.trim()) return setErr("Enter the customer’s phone.");
    if (f.email.trim() && window.emailOk && !window.emailOk(f.email.trim())) return setErr("That email doesn’t look right — fix it or leave it blank (no emails go to a wrong address).");
    if (!items.some((it) => it.variant_key && Number(it.qty) > 0)) return setErr(offered.length ? "Add at least one item." : "No prices set for " + mInfo.name_en + " yet — add them on the Countries page.");
    setBusy(true);
    try {
      const payload = {
        country: cc, source: f.source, status: f.status, full_name: f.full_name, phone: f.phone, phone2: f.phone2, email: f.email,
        governorate: f.governorate, area: f.area, street: f.street, landmark: f.landmark,
        shipping: Number(f.shipping) || 0, discount: Number(f.discount) || 0, note: f.note,
        items: items.filter((it) => it.variant_key && Number(it.qty) > 0).map((it) => ({ variant_key: it.variant_key, qty: Number(it.qty) })),
      };
      const r = await window.sbRpc("create_manual_order", { payload });
      if (r && r.ok) { if (onCreated) onCreated(r); onClose(); }
      else setErr(r && r.error === "no_price_for_country" ? "That product has no price in " + mInfo.name_en + " — set it on the Countries page." : (r && r.error) ? ("Could not save — " + r.error) : "Could not save the order.");
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
          {(markets || []).length > 1 && <Select label="Country" value={cc} onChange={setCc} options={(markets || []).map((m) => ({ value: m.code, label: window.marketFlag(m.code) + " " + m.name_en + " (" + m.currency + ")" }))} />}
          <div style={two}>
            <Select label="Came from" value={f.source} onChange={(v) => set("source", v)} options={NEW_ORDER_SOURCES} />
            <Select label="Status" value={f.status} onChange={(v) => set("status", v)} options={NEW_ORDER_STATUSES} />
          </div>

          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <span style={lbl}>Customer</span>
            <Input label="Full name" value={f.full_name} onChange={(v) => set("full_name", v)} />
            <div style={two}>
              <Input label="Phone" type="tel" value={f.phone} onChange={(v) => set("phone", v)} />
              <Input label="WhatsApp (optional)" type="tel" value={f.phone2} onChange={(v) => set("phone2", v)} />
            </div>
            <Input label="Email (optional)" type="email" value={f.email} onChange={(v) => set("email", v)} />
            <div style={two}>
              <Input label="Street" value={f.street} onChange={(v) => set("street", v)} />
              <Select label={regionLabel} value={f.governorate} onChange={(v) => set("governorate", v)} options={[{ value: "", label: "Choose…" }].concat(regions.map((g) => ({ value: g[0], label: g[0] })))} />
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
                <Select label={i === 0 ? "Product" : ""} value={it.variant_key} onChange={(v) => setItem(i, "variant_key", v)} options={offered.map((v) => ({ value: v.key, label: (v.size_ml ? v.size_ml + " ml · " : "") + v.label_en + " — " + egp(priceOf(v.key)) }))} />
                <Input label={i === 0 ? "Qty" : ""} value={String(it.qty)} onChange={(v) => setItem(i, "qty", v.replace(/[^0-9]/g, ""))} />
                <div style={{ fontFamily: "var(--font-numeric)", height: "var(--input-h)", display: "grid", alignItems: "center", minWidth: 70 }}>{egp((priceOf(it.variant_key) || 0) * (Number(it.qty) || 0))}</div>
                <div style={{ height: "var(--input-h)", display: "grid", alignItems: "center" }}>
                  {items.length > 1 && <button type="button" onClick={() => setItems((a) => a.filter((_, n) => n !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)" }}><Icon name="x" size={16} /></button>}
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setItems((a) => [...a, { variant_key: (offered[0] && offered[0].key) || "", qty: 1 }])} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", cursor: "pointer", color: "var(--green)", fontSize: "var(--text-small)", justifySelf: "start" }}>+ Add another item</button>
          </div>

          <div style={two}>
            <Input label={"Shipping (" + cur + ")"} value={String(f.shipping)} onChange={(v) => set("shipping", v.replace(/[^0-9]/g, ""))} placeholder="0" />
            <Input label={"Discount (" + cur + ")"} value={String(f.discount)} onChange={(v) => set("discount", v.replace(/[^0-9]/g, ""))} placeholder="0" />
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
