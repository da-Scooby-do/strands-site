/* Reviews — live against public.reviews (admin RLS). These are quotes the owner
   chooses to publish; the storefront shows only published ones. */
const { PageHeader, Button, Card, Input, Textarea, Switch, InlineAlert } = window.StrandsDesignSystem_6d0a65;
function Reviews() {
  const phone = window.useIsPhone();
  const [list, setList] = React.useState([]);
  const [msg, setMsg] = React.useState(null);

  React.useEffect(() => { load(); }, []);
  async function load() {
    if (!window.SB_READY) return;
    const { data } = await window.sb.from("reviews").select("*").order("sort");
    if (data) setList(data);
  }
  const setLocal = (id, k, v) => setList((l) => l.map((q) => (q.id === id ? { ...q, [k]: v } : q)));

  async function add() {
    const { error } = await window.sb.from("reviews").insert({ quote_en: "", quote_ar: "", city_en: "Customer · ", city_ar: "عميلة · ", sort: list.length + 1, published: false });
    if (error) setMsg({ ok: false, msg: error.message + " — are you signed in as the owner?" }); else load();
  }
  async function saveOne(q) {
    const { error } = await window.sb.from("reviews").update({
      quote_en: q.quote_en, quote_ar: q.quote_ar, city_en: q.city_en, city_ar: q.city_ar, sort: Number(q.sort) || 0, published: !!q.published,
    }).eq("id", q.id);
    setMsg(error ? { ok: false, msg: error.message } : { ok: true, msg: "Saved." });
  }
  async function togglePublish(q, v) {
    setLocal(q.id, "published", v);
    const { error } = await window.sb.from("reviews").update({ published: v, quote_en: q.quote_en, quote_ar: q.quote_ar, city_en: q.city_en, city_ar: q.city_ar, sort: Number(q.sort) || 0 }).eq("id", q.id);
    setMsg(error ? { ok: false, msg: error.message } : { ok: true, msg: v ? "Published. It is on the shop now." : "Unpublished. It is off the shop now." });
  }
  async function remove(q) { const { error } = await window.sb.from("reviews").delete().eq("id", q.id); if (!error) load(); else setMsg({ ok: false, msg: error.message }); }

  return (
    <div>
      <PageHeader label="Reviews" title="Quotes shown on the shop." action={<Button size="sm" onClick={add}>Add a quote</Button>} />
      <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", marginBottom: "var(--space-5)", maxWidth: "var(--measure)" }}>
        Nothing here is customer-submitted. These are quotes you choose to publish.
      </p>
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        {list.map((q) => (
          <Card key={q.id} pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
            <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "var(--space-4)" }}>
              <Textarea label="Quote (EN)" rows={2} value={q.quote_en || ""} onChange={(v) => setLocal(q.id, "quote_en", v)} />
              <Textarea label="Quote (AR)" rows={2} dir="rtl" value={q.quote_ar || ""} onChange={(v) => setLocal(q.id, "quote_ar", v)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr 90px auto"), gap: "var(--space-4)", alignItems: "end" }}>
              <Input label="Attribution (EN)" value={q.city_en || ""} onChange={(v) => setLocal(q.id, "city_en", v)} />
              <Input label="Attribution (AR)" value={q.city_ar || ""} onChange={(v) => setLocal(q.id, "city_ar", v)} />
              <Input label="Sort order" value={String(q.sort ?? "")} onChange={(v) => setLocal(q.id, "sort", v)} />
              <div style={{ height: "var(--input-h)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <Switch checked={!!q.published} onChange={(v) => togglePublish(q, v)} label="Published" />
                <Button size="sm" variant="quiet" onClick={() => saveOne(q)}>Save</Button>
                <Button size="sm" variant="text" onClick={() => remove(q)}>Remove</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {msg && <div style={{ marginTop: "var(--space-4)" }}><InlineAlert tone={msg.ok ? "ok" : "error"}>{msg.msg}</InlineAlert></div>}
    </div>
  );
}
Object.assign(window, { DashReviews: Reviews });
