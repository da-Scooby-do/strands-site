const { PageHeader, Button, Card, Input, Textarea, Checkbox, Switch, InlineAlert } = window.StrandsDesignSystem_6d0a65;
function Field({ children }) { const phone = window.useIsPhone(); return <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "var(--space-4)" }}>{children}</div>; }
function Product() {
  const phone = window.useIsPhone();
  const [price, setPrice] = React.useState("380");
  const [stock, setStock] = React.useState("88");
  const [onSale, setOnSale] = React.useState(true);
  const [saved, setSaved] = React.useState(null);
  const [bundles, setBundles] = React.useState([
    { jars: 1, en: "1 jar", ar: "برطمان واحد", price: "380", saving: "—", badge: "", on: true },
    { jars: 2, en: "2 jars", ar: "برطمانين", price: "710", saving: "Save 50 EGP", badge: "MOST PICKED", on: true },
    { jars: 3, en: "3 jars", ar: "٣ برطمانات", price: "1020", saving: "Save 120 EGP", badge: "", on: false },
  ]);
  const setB = (i, k, v) => setBundles((b) => b.map((x, n) => (n === i ? { ...x, [k]: v } : x)));
  const save = () => {
    if (!/^\d+$/.test(stock)) return setSaved({ ok: false, msg: "Nothing was saved — jars in stock must be a whole number." });
    if (!(Number(price) > 0)) return setSaved({ ok: false, msg: "Nothing was saved — the price must be a number above zero." });
    setSaved({ ok: true, msg: "Saved. The shop is showing the new details." });
  };
  return (
    <div>
      <PageHeader label="Product & bundles" title="What the shop is selling." action={<Button size="sm" onClick={save}>Save changes</Button>} />
      <div style={{ display: "grid", gap: "var(--space-5)" }}>
        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
          <h2 style={{ fontSize: 22 }}>Price and stock.</h2>
          <Field>
            <Input label="Price (EGP)" value={price} onChange={(v) => { setPrice(v); setSaved(null); }} />
            <Input label="Jars in stock" value={stock} onChange={(v) => { setStock(v); setSaved(null); }} />
          </Field>
          <Checkbox checked={onSale} onChange={setOnSale} label="Available to order" />
          {saved && <InlineAlert tone={saved.ok ? "ok" : "error"}>{saved.msg}</InlineAlert>}
        </Card>
        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
          <h2 style={{ fontSize: 22 }}>Name and copy.</h2>
          <Field>
            <Input label="Name (EN)" value="Velvet Touch Masque" onChange={() => {}} />
            <Input label="Name (AR)" value="ماسك فيلفيت تاتش" onChange={() => {}} />
          </Field>
          <Field>
            <Input label="Subtitle (EN)" value="For soft, fluffy and hydrated hair" onChange={() => {}} />
            <Input label="Subtitle (AR)" value="لشعر ناعم ومنفوش ومرطب" onChange={() => {}} />
          </Field>
          <Field>
            <Textarea label="Ingredients (EN)" rows={3} value="Mango butter · Jojoba oil · Safflower oil · Flaxseed gel · Hibiscus extract · Vitamin E · Panthenol · Fragrance oil · Preservative" onChange={() => {}} />
            <Textarea label="Ingredients (AR)" rows={3} dir="rtl" value="زبدة المانجو · زيت الجوجوبا · زيت القرطم · جل بذور الكتان · منقوع الكركديه · فيتامين هـ · بانثينول · زيت عطري · مادة حافظة" onChange={() => {}} />
          </Field>
        </Card>
        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
          <h2 style={{ fontSize: 22 }}>The three bundles.</h2>
          {bundles.map((b, i) => (
            <div key={b.jars} style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr 100px 130px 130px auto"), gap: "var(--space-3)", alignItems: "end", paddingTop: i ? "var(--space-4)" : 0, borderTop: i ? "1px solid var(--rule)" : "none" }}>
              <Input label={i === 0 ? "Label (EN)" : ""} value={b.en} onChange={(v) => setB(i, "en", v)} />
              <Input label={i === 0 ? "Label (AR)" : ""} value={b.ar} onChange={(v) => setB(i, "ar", v)} />
              <Input label={i === 0 ? "Price" : ""} value={b.price} onChange={(v) => setB(i, "price", v)} />
              <Input label={i === 0 ? "Saving shown" : ""} value={b.saving} onChange={(v) => setB(i, "saving", v)} />
              <Input label={i === 0 ? "Badge" : ""} value={b.badge} onChange={(v) => setB(i, "badge", v)} />
              <div style={{ height: "var(--input-h)", display: "grid", alignItems: "center" }}><Switch checked={b.on} onChange={(v) => setB(i, "on", v)} label="Active" /></div>
            </div>
          ))}
        </Card>
        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
          <h2 style={{ fontSize: 22 }}>Shipping.</h2>
          <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "var(--space-4)" }}>
            <Input label="Flat rate (EGP)" value="60" onChange={() => {}} />
            <Input label="Free shipping over (EGP)" value="600" onChange={() => {}} />
          </div>
          <Field>
            <Input label="Delivery estimate (EN)" value="Cash on delivery, 2–4 days" onChange={() => {}} />
            <Input label="Delivery estimate (AR)" value="الدفع عند الاستلام، من ٢ إلى ٤ أيام" onChange={() => {}} />
          </Field>
        </Card>
      </div>
    </div>
  );
}
Object.assign(window, { DashProduct: Product });
