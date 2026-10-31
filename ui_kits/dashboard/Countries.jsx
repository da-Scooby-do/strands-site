/* Countries — Saudi Arabia, Sudan (and any later market). Each has its own prices
   and stock per size, delivery choices (or one fee), payment options and the
   WhatsApp number customers message to pay, in its own currency.
   A country appears on the shop only when "Open on the website" is on and at
   least one size has a price. Egypt stays on Product & bundles + Delivery. */
const { PageHeader, Button, Card, Input, Textarea, Checkbox, Switch, InlineAlert } = window.StrandsDesignSystem_6d0a65;
function cNum(v) { return /^\d+$/.test(String(v).trim()); }
const blank = (v) => v == null || String(v).trim() === "";

function MarketCard({ m, variants, rows, onChange, onRowChange, onSave, busy, msg }) {
  const phone = window.useIsPhone();
  const cur = m.currency;
  const two = { display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "var(--space-4)" };
  const opts = Array.isArray(m.delivery_options) ? m.delivery_options : [];
  const setOpt = (i, k, v) => onChange("delivery_options", opts.map((o, n) => (n === i ? { ...o, [k]: v } : o)));
  return (
    <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22 }}>{window.marketFlag(m.code)} {m.name_en}.</h2>
        <span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>Prices in {cur}</span>
        <div style={{ marginInlineStart: "auto" }}><Switch checked={!!m.enabled} onChange={(v) => onChange("enabled", v)} label="Open on the website" /></div>
      </div>

      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        <span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>Prices and stock — leave a price blank to not sell that option in {m.name_en}.</span>
        {variants.map((v, i) => {
          const r = rows[v.key] || {};
          return (
            <div key={v.key} style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1.4fr 1fr 1fr"), gap: "var(--space-3)", alignItems: "end" }}>
              <div style={{ height: "var(--input-h)", display: "grid", alignContent: "center", fontSize: "var(--text-small)" }}>
                <span>{(v.size_ml ? v.size_ml + " ml · " : "") + v.label_en}</span>
                {v.active === false && <span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>off in Egypt — still sold here if priced</span>}
              </div>
              <Input label={i === 0 ? "Price (" + cur + ")" : ""} value={r.price == null ? "" : String(r.price)} onChange={(x) => onRowChange(v.key, "price", x)} placeholder="not sold" />
              <Input label={i === 0 ? "Jars in stock" : ""} value={r.stock == null ? "" : String(r.stock)} onChange={(x) => onRowChange(v.key, "stock", x)} placeholder="0" />
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        <span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>Delivery choices the customer picks from at checkout, each with its own fee. With none, the one delivery fee below applies.</span>
        {m.code === "SD" && (opts.some((o) => /^wz_\d+$/.test(o.key))
          ? <InlineAlert tone="ok">Sudan’s cities and prices come from Weslat (Dashboard → Weslat) and refresh by themselves — changes made here are replaced on the next refresh.</InlineAlert>
          : <span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>Sudan: customers see <strong>Weslat’s own price</strong> (Dashboard → Weslat). These fees are only used when Weslat can’t give one.</span>)}
        {opts.map((o, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1.3fr 1.3fr 0.7fr auto"), gap: "var(--space-3)", alignItems: "end" }}>
            <Input label={i === 0 ? "Choice (EN)" : ""} value={o.name_en || ""} onChange={(v) => setOpt(i, "name_en", v)} placeholder="Nearest RedBox locker" />
            <Input label={i === 0 ? "Choice (AR)" : ""} value={o.name_ar || ""} onChange={(v) => setOpt(i, "name_ar", v)} placeholder="أقرب ريد بوكس لعنوانك" />
            <Input label={i === 0 ? "Fee (" + cur + ")" : ""} value={o.fee == null ? "" : String(o.fee)} onChange={(v) => setOpt(i, "fee", v)} placeholder="0" />
            <div style={{ height: "var(--input-h)", display: "grid", alignItems: "center" }}>
              <Button size="sm" variant="text" onClick={() => onChange("delivery_options", opts.filter((_, n) => n !== i))}>Remove</Button>
            </div>
          </div>
        ))}
        <div><Button size="sm" variant="quiet" onClick={() => onChange("delivery_options", opts.concat([{ key: "", name_en: "", name_ar: "", fee: "" }]))}>Add a delivery choice</Button></div>
      </div>
      <div style={two}>
        {!opts.length && <Input label={"Delivery fee (" + cur + ")"} value={m.shipping_fee == null ? "" : String(m.shipping_fee)} onChange={(v) => onChange("shipping_fee", v)} placeholder="0" />}
        <Input label={"Free delivery over (" + cur + ")"} value={m.free_over == null ? "" : String(m.free_over)} onChange={(v) => onChange("free_over", v)} placeholder="never" />
      </div>
      <div style={two}>
        <Input label="Delivery note (EN)" value={m.eta_en || ""} onChange={(v) => onChange("eta_en", v)} placeholder={"Delivery across " + m.name_en + " in 5–8 days."} />
        <Input label="Delivery note (AR)" value={m.eta_ar || ""} onChange={(v) => onChange("eta_ar", v)} placeholder="التوصيل من ٥ لـ ٨ أيام." />
      </div>

      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        <span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>How customers in {m.name_en} can pay</span>
        <div style={{ display: "flex", gap: "var(--space-5)", flexWrap: "wrap" }}>
          <Checkbox checked={!!m.pay_cod} onChange={(v) => onChange("pay_cod", v)} label="Cash on delivery" />
          <Checkbox checked={!!m.pay_bank} onChange={(v) => onChange("pay_bank", v)} label="Pay first by transfer" />
        </div>
        {m.pay_bank && <Input label="WhatsApp number customers message to pay (with country code)" value={m.whatsapp || ""} onChange={(v) => onChange("whatsapp", v)} placeholder="966 56 232 9121" />}
        {m.pay_bank && <Textarea label="Bank details shown after ordering (leave blank if customers get them on WhatsApp)" rows={4} value={m.bank_details || ""} onChange={(v) => onChange("bank_details", v)} />}
      </div>

      {msg && <InlineAlert tone={msg.ok ? "ok" : "error"}>{msg.msg}</InlineAlert>}
      <div><Button size="sm" onClick={onSave} disabled={busy}>{busy ? "Saving…" : "Save " + m.name_en}</Button></div>
    </Card>
  );
}

function Countries({ onSaved }) {
  const [markets, setMarkets] = React.useState(null);   // non-Egypt markets
  const [variants, setVariants] = React.useState([]);
  const [rows, setRows] = React.useState({});           // { SA: { "1jar": {price, stock} } }
  const [missing, setMissing] = React.useState(false);  // database not updated yet
  const [busy, setBusy] = React.useState(null);
  const [msg, setMsg] = React.useState({});

  React.useEffect(() => { load(); }, []);
  async function load() {
    if (!window.SB_READY) return;
    const [m, v, mv] = await Promise.all([
      window.sb.from("markets").select("*").order("sort"),
      window.sb.from("product_variants").select("key,label_en,size_ml,jars,sort,active").order("sort"),  // all sizes: the Egypt switch doesn't apply here
      window.sb.from("market_variants").select("*"),
    ]);
    if (m.error) { setMissing(true); setMarkets([]); return; }
    setMarkets((m.data || []).filter((x) => x.code !== "EG"));
    setVariants(v.data || []);
    const r = {};
    (mv.data || []).forEach((x) => { (r[x.market] = r[x.market] || {})[x.variant_key] = { price: x.price, stock: x.stock }; });
    setRows(r);
  }

  const setM = (code, k, v) => { setMarkets((a) => a.map((x) => (x.code === code ? { ...x, [k]: v } : x))); setMsg((s) => ({ ...s, [code]: null })); };
  const setRow = (code, key, k, v) => { setRows((r) => ({ ...r, [code]: { ...(r[code] || {}), [key]: { ...((r[code] || {})[key] || {}), [k]: v } } })); setMsg((s) => ({ ...s, [code]: null })); };

  async function save(m) {
    const fail = (t) => setMsg((s) => ({ ...s, [m.code]: { ok: false, msg: "Nothing saved — " + t } }));
    const r = rows[m.code] || {};
    for (const v of variants) {
      const x = r[v.key] || {};
      if (!blank(x.price) && !cNum(x.price)) return fail("every price must be a whole number (or blank).");
      if (!blank(x.stock) && !cNum(x.stock)) return fail("every stock must be a whole number.");
    }
    if (!blank(m.shipping_fee) && !cNum(m.shipping_fee)) return fail("the delivery fee must be a whole number.");
    if (!blank(m.free_over) && !cNum(m.free_over)) return fail("“free delivery over” must be a whole number, or blank for never.");
    if (!m.pay_cod && !m.pay_bank) return fail("choose at least one way to pay.");
    const wa = String(m.whatsapp || "").replace(/\D/g, "").replace(/^00/, "");
    if (!blank(m.whatsapp) && wa.length < 10) return fail("the WhatsApp number looks too short — include the country code, e.g. 966 56 232 9121.");
    if (m.pay_bank && blank(m.bank_details) && !wa) return fail("add the bank details, or a WhatsApp number customers message to pay.");
    const opts = (Array.isArray(m.delivery_options) ? m.delivery_options : []).filter((o) => !blank(o.name_en) || !blank(o.name_ar) || !blank(o.fee));
    for (const o of opts) {
      if (blank(o.name_en)) return fail("every delivery choice needs an English name.");
      if (!cNum(o.fee)) return fail("every delivery fee must be a whole number.");
    }
    // Each choice keeps its key (orders record it); new ones get one from their name.
    const used = new Set();
    const delivery_options = opts.map((o) => {
      let key = o.key || String(o.name_en).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "option";
      while (used.has(key)) key += "_2";
      used.add(key);
      return { key, name_en: o.name_en.trim(), name_ar: blank(o.name_ar) ? null : o.name_ar.trim(), fee: Number(o.fee) };
    });
    if (m.enabled && !variants.some((v) => !blank((r[v.key] || {}).price))) return fail("set at least one price before opening " + m.name_en + " on the website.");

    setBusy(m.code);
    try {
      const up = await window.sb.from("markets").update({
        enabled: !!m.enabled, shipping_fee: blank(m.shipping_fee) ? 0 : Number(m.shipping_fee),
        free_over: blank(m.free_over) ? null : Number(m.free_over),
        pay_cod: !!m.pay_cod, pay_bank: !!m.pay_bank, bank_details: blank(m.bank_details) ? null : m.bank_details,
        eta_en: blank(m.eta_en) ? null : m.eta_en, eta_ar: blank(m.eta_ar) ? null : m.eta_ar,
        delivery_options, whatsapp: wa || null,
      }).eq("code", m.code);
      if (up.error) return fail(up.error.message + ". Are you signed in as the owner?");
      const list = variants.map((v) => { const x = r[v.key] || {}; return { market: m.code, variant_key: v.key, price: blank(x.price) ? null : Number(x.price), stock: blank(x.stock) ? 0 : Number(x.stock) }; });
      const vu = await window.sb.from("market_variants").upsert(list, { onConflict: "market,variant_key" });
      if (vu.error) return fail(vu.error.message);
      await load();  // new delivery choices come back with their keys
      setMsg((s) => ({ ...s, [m.code]: { ok: true, msg: m.enabled ? "Saved. " + m.name_en + " is open on the website." : "Saved. " + m.name_en + " is hidden on the website until you switch it on." } }));
      if (onSaved) onSaved();
    } finally { setBusy(null); }
  }

  return (
    <div>
      <PageHeader label="Countries" title="Where the shop delivers." />
      <div style={{ display: "grid", gap: "var(--space-5)" }}>
        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-2)" }}>
          <h2 style={{ fontSize: 22 }}>{window.marketFlag("EG")} Egypt.</h2>
          <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", margin: 0 }}>Egypt’s prices and stock are on <strong>Product &amp; bundles</strong>, and delivery prices on <strong>Delivery</strong>. Promo codes apply to Egypt only.</p>
        </Card>
        {markets === null && <div style={{ color: "var(--ink-2)" }}>Loading countries…</div>}
        {missing && <InlineAlert tone="error">The database hasn’t been updated for countries yet. Run the “markets” update in Supabase, then refresh this page.</InlineAlert>}
        {(markets || []).map((m) => (
          <MarketCard key={m.code} m={m} variants={variants} rows={rows[m.code] || {}} busy={busy === m.code} msg={msg[m.code]}
            onChange={(k, v) => setM(m.code, k, v)} onRowChange={(key, k, v) => setRow(m.code, key, k, v)} onSave={() => save(m)} />
        ))}
      </div>
    </div>
  );
}
Object.assign(window, { DashCountries: Countries });
