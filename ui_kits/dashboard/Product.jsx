/* Product & bundles — the owner's price control panel. Reads the live product,
   its variants, and shipping from Supabase; Save writes them straight back
   (admin RLS enforces who may write). Whatever is saved here is what the shop
   shows, because the storefront reads the same rows. */
const { PageHeader, Button, Card, Input, Textarea, Checkbox, Switch, InlineAlert } = window.StrandsDesignSystem_6d0a65;
function Field({ children }) { const phone = window.useIsPhone(); return <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "var(--space-4)" }}>{children}</div>; }
function numOk(v) { return /^\d+$/.test(String(v).trim()); }

function Product() {
  const phone = window.useIsPhone();
  const [product, setProduct] = React.useState(null);
  const [variants, setVariants] = React.useState([]);
  const [ship, setShip] = React.useState({ flat_egp: "", free_over_egp: "", eta_en: "", eta_ar: "" });
  const [saved, setSaved] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => { load(); }, []);
  async function load() {
    if (!window.SB_READY) return;
    const [p, v, s] = await Promise.all([
      window.sb.from("products").select("*").order("created_at").limit(1).maybeSingle(),
      window.sb.from("product_variants").select("*").order("sort"),
      window.sb.from("settings").select("value").eq("key", "shipping").maybeSingle(),
    ]);
    if (p.data) setProduct(p.data);
    if (v.data) setVariants(v.data);
    if (s.data && s.data.value) setShip({ flat_egp: s.data.value.flat_egp ?? "", free_over_egp: s.data.value.free_over_egp ?? "", eta_en: s.data.value.eta_en || "", eta_ar: s.data.value.eta_ar || "" });
  }

  const setP = (k, v) => { setProduct((p) => ({ ...p, [k]: v })); setSaved(null); };
  const setV = (i, k, v) => { setVariants((a) => a.map((x, n) => (n === i ? { ...x, [k]: v } : x))); setSaved(null); };
  const setS = (k, v) => { setShip((s) => ({ ...s, [k]: v })); setSaved(null); };

  async function save() {
    setSaved(null);
    if (!numOk(product.price_egp)) return setSaved({ ok: false, msg: "Nothing saved — the price must be a whole number." });
    if (!numOk(product.stock)) return setSaved({ ok: false, msg: "Nothing saved — jars in stock must be a whole number." });
    for (const v of variants) { if (!numOk(v.price_egp)) return setSaved({ ok: false, msg: "Nothing saved — every bundle price must be a whole number." }); }
    if (ship.flat_egp !== "" && !numOk(ship.flat_egp)) return setSaved({ ok: false, msg: "Nothing saved — the shipping flat rate must be a whole number." });

    setBusy(true);
    try {
      const pUpd = await window.sb.from("products").update({
        name_en: product.name_en, name_ar: product.name_ar,
        subtitle_en: product.subtitle_en, subtitle_ar: product.subtitle_ar,
        tagline_en: product.tagline_en, tagline_ar: product.tagline_ar,
        ingredients_en: product.ingredients_en, ingredients_ar: product.ingredients_ar,
        price_egp: Number(product.price_egp), size_ml: product.size_ml ? Number(product.size_ml) : null,
        stock: Number(product.stock), in_stock: !!product.in_stock,
      }).eq("id", product.id);
      if (pUpd.error) return setSaved({ ok: false, msg: "Nothing saved — " + pUpd.error.message + ". Are you signed in as the owner?" });

      for (const v of variants) {
        const vUpd = await window.sb.from("product_variants").update({
          label_en: v.label_en, label_ar: v.label_ar,
          price_egp: Number(v.price_egp), save_egp: Number(v.save_egp || 0),
          badge_en: v.badge_en || null, badge_ar: v.badge_ar || null, active: !!v.active,
        }).eq("id", v.id);
        if (vUpd.error) return setSaved({ ok: false, msg: "Nothing saved — " + vUpd.error.message });
      }

      const sUpd = await window.sb.from("settings").update({
        value: { flat_egp: Number(ship.flat_egp || 0), free_over_egp: Number(ship.free_over_egp || 0), eta_en: ship.eta_en, eta_ar: ship.eta_ar },
      }).eq("key", "shipping");
      if (sUpd.error) return setSaved({ ok: false, msg: "Nothing saved — " + sUpd.error.message });

      setSaved({ ok: true, msg: "Saved. The shop is showing the new prices." });
    } finally { setBusy(false); }
  }

  if (!product) return <div style={{ color: "var(--ink-2)" }}>Loading the product…</div>;

  return (
    <div>
      <PageHeader label="Product & bundles" title="What the shop is selling." action={<Button size="sm" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>} />
      <div style={{ display: "grid", gap: "var(--space-5)" }}>
        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
          <h2 style={{ fontSize: 22 }}>Price and stock.</h2>
          <Field>
            <Input label="Price (EGP)" value={String(product.price_egp ?? "")} onChange={(v) => setP("price_egp", v)} />
            <Input label="Jars in stock" value={String(product.stock ?? "")} onChange={(v) => setP("stock", v)} />
          </Field>
          <Checkbox checked={!!product.in_stock} onChange={(v) => setP("in_stock", v)} label="Available to order" />
          {saved && <InlineAlert tone={saved.ok ? "ok" : "error"}>{saved.msg}</InlineAlert>}
        </Card>

        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
          <h2 style={{ fontSize: 22 }}>Name and copy.</h2>
          <Field>
            <Input label="Name (EN)" value={product.name_en || ""} onChange={(v) => setP("name_en", v)} />
            <Input label="Name (AR)" value={product.name_ar || ""} onChange={(v) => setP("name_ar", v)} />
          </Field>
          <Field>
            <Input label="Subtitle (EN)" value={product.subtitle_en || ""} onChange={(v) => setP("subtitle_en", v)} />
            <Input label="Subtitle (AR)" value={product.subtitle_ar || ""} onChange={(v) => setP("subtitle_ar", v)} />
          </Field>
          <Field>
            <Input label="Tagline (EN)" value={product.tagline_en || ""} onChange={(v) => setP("tagline_en", v)} />
            <Input label="Tagline (AR)" value={product.tagline_ar || ""} onChange={(v) => setP("tagline_ar", v)} />
          </Field>
          <Field>
            <Textarea label="Ingredients (EN)" rows={3} value={product.ingredients_en || ""} onChange={(v) => setP("ingredients_en", v)} />
            <Textarea label="Ingredients (AR)" rows={3} dir="rtl" value={product.ingredients_ar || ""} onChange={(v) => setP("ingredients_ar", v)} />
          </Field>
        </Card>

        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
          <h2 style={{ fontSize: 22 }}>The three bundles.</h2>
          {variants.map((b, i) => (
            <div key={b.id} style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr 100px 130px 130px auto"), gap: "var(--space-3)", alignItems: "end", paddingTop: i ? "var(--space-4)" : 0, borderTop: i ? "1px solid var(--rule)" : "none" }}>
              <Input label={i === 0 ? "Label (EN)" : ""} value={b.label_en || ""} onChange={(v) => setV(i, "label_en", v)} />
              <Input label={i === 0 ? "Label (AR)" : ""} value={b.label_ar || ""} onChange={(v) => setV(i, "label_ar", v)} />
              <Input label={i === 0 ? "Price" : ""} value={String(b.price_egp ?? "")} onChange={(v) => setV(i, "price_egp", v)} />
              <Input label={i === 0 ? "Saving (EGP)" : ""} value={String(b.save_egp ?? "0")} onChange={(v) => setV(i, "save_egp", v)} />
              <Input label={i === 0 ? "Badge" : ""} value={b.badge_en || ""} onChange={(v) => setV(i, "badge_en", v)} />
              <div style={{ height: "var(--input-h)", display: "grid", alignItems: "center" }}><Switch checked={!!b.active} onChange={(v) => setV(i, "active", v)} label="Active" /></div>
            </div>
          ))}
        </Card>

        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
          <h2 style={{ fontSize: 22 }}>Shipping.</h2>
          <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "var(--space-4)" }}>
            <Input label="Flat rate (EGP)" value={String(ship.flat_egp ?? "")} onChange={(v) => setS("flat_egp", v)} />
            <Input label="Free shipping over (EGP)" value={String(ship.free_over_egp ?? "")} onChange={(v) => setS("free_over_egp", v)} />
          </div>
          <Field>
            <Input label="Delivery estimate (EN)" value={ship.eta_en || ""} onChange={(v) => setS("eta_en", v)} />
            <Input label="Delivery estimate (AR)" value={ship.eta_ar || ""} onChange={(v) => setS("eta_ar", v)} />
          </Field>
        </Card>
      </div>
    </div>
  );
}
Object.assign(window, { DashProduct: Product });
