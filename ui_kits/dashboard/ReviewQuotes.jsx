const { PageHeader, Button, Card, Input, Textarea, Switch, InlineAlert } = window.StrandsDesignSystem_6d0a65;
function Reviews() {
  const phone = window.useIsPhone();
  const [list, setList] = React.useState(window.DASH.QUOTES);
  const [msg, setMsg] = React.useState(null);
  const set = (id, k, v) => setList((l) => l.map((q) => (q.id === id ? { ...q, [k]: v } : q)));
  const add = () => setList([...list, { id: Date.now(), en: "", ar: "", byEn: "Customer · ", byAr: "عميلة · ", order: list.length + 1, published: false }]);
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
              <Textarea label="Quote (EN)" rows={2} value={q.en} onChange={(v) => set(q.id, "en", v)} />
              <Textarea label="Quote (AR)" rows={2} dir="rtl" value={q.ar} onChange={(v) => set(q.id, "ar", v)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr 90px auto"), gap: "var(--space-4)", alignItems: "end" }}>
              <Input label="Attribution (EN)" value={q.byEn} onChange={(v) => set(q.id, "byEn", v)} />
              <Input label="Attribution (AR)" value={q.byAr} onChange={(v) => set(q.id, "byAr", v)} />
              <Input label="Sort order" value={String(q.order)} onChange={(v) => set(q.id, "order", v)} />
              <div style={{ height: "var(--input-h)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                <Switch checked={q.published} onChange={(v) => { set(q.id, "published", v); setMsg({ ok: true, msg: v ? "Published. It is on the shop now." : "Unpublished. It is off the shop now." }); }} label="Published" />
                <Button size="sm" variant="text" onClick={() => setList((l) => l.filter((x) => x.id !== q.id))}>Remove</Button>
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
