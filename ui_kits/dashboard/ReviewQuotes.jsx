/* Reviews — live against public.reviews (admin RLS). Customer-submitted reviews
   land here unpublished for approval; the owner can also add their own quotes.
   Only published reviews show on the shop. */
const { PageHeader, Button, Card, Input, Textarea, Switch, InlineAlert } = window.StrandsDesignSystem_6d0a65;
function Reviews() {
  const phone = window.useIsPhone();
  const [list, setList] = React.useState([]);
  const [msg, setMsg] = React.useState(null);

  React.useEffect(() => { load(); }, []);
  async function load() {
    if (!window.SB_READY) return;
    // pending (unpublished) first, newest first, so new customer reviews are on top
    const { data } = await window.sb.from("reviews").select("*").order("published", { ascending: true }).order("created_at", { ascending: false });
    if (data) setList(data);
  }
  const setLocal = (id, k, v) => setList((l) => l.map((q) => (q.id === id ? { ...q, [k]: v } : q)));

  async function add() {
    const { error } = await window.sb.from("reviews").insert({ quote_en: "", quote_ar: "", city_en: "Customer · ", city_ar: "عميلة · ", rating: 5, sort: list.length + 1, published: false });
    if (error) setMsg({ ok: false, msg: error.message + " — are you signed in as the owner?" }); else load();
  }
  function fields(q) { return { quote_en: q.quote_en, quote_ar: q.quote_ar, city_en: q.city_en, city_ar: q.city_ar, rating: Number(q.rating) || 5, sort: Number(q.sort) || 0 }; }
  async function saveOne(q) {
    const { error } = await window.sb.from("reviews").update(fields(q)).eq("id", q.id);
    setMsg(error ? { ok: false, msg: error.message } : { ok: true, msg: "Saved." });
  }
  async function togglePublish(q, v) {
    setLocal(q.id, "published", v);
    const { error } = await window.sb.from("reviews").update({ ...fields(q), published: v }).eq("id", q.id);
    setMsg(error ? { ok: false, msg: error.message } : { ok: true, msg: v ? "Approved. It is on the shop now." : "Hidden. It is off the shop now." });
  }
  async function remove(q) { const { error } = await window.sb.from("reviews").delete().eq("id", q.id); if (!error) load(); else setMsg({ ok: false, msg: error.message }); }

  const pendingCount = list.filter((q) => q.submitted && !q.published).length;

  return (
    <div>
      <PageHeader label="Reviews" title="Customer reviews & quotes." action={<Button size="sm" onClick={add}>Add a quote</Button>} />
      <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", marginBottom: "var(--space-5)", maxWidth: "var(--measure)" }}>
        Customers submit star reviews from the shop — they wait here until you approve them. You can also add your own quotes. {pendingCount > 0 ? <strong style={{ color: "var(--green)" }}>{pendingCount} waiting for approval.</strong> : ""}
      </p>
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        {list.map((q) => {
          const pending = q.submitted && !q.published;
          const pill = pending
            ? { t: "★ New customer review — approve to show", bg: "#FBEFD8", fg: "#7A5200" }
            : q.published ? { t: "● On the shop", bg: "#EDF0E7", fg: "#4C6531" } : { t: "○ Hidden — not on the shop", bg: "var(--purple-tint)", fg: "var(--ink-2)" };
          return (
            <Card key={q.id} pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)", border: pending ? "1px solid #E7C98A" : undefined }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" aria-label={n + " stars"} onClick={() => setLocal(q.id, "rating", n)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--green)", padding: 0, fontSize: 18, lineHeight: 1 }}>{n <= (q.rating || 5) ? "★" : "☆"}</button>
                  ))}
                  {q.submitted && q.author_name && <span style={{ marginInlineStart: 8, fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>from {q.author_name}</span>}
                </div>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: "var(--radius-pill)", fontFamily: "var(--font-sans)", background: pill.bg, color: pill.fg }}>{pill.t}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "var(--space-4)" }}>
                <Textarea label="Quote (EN)" rows={2} value={q.quote_en || ""} onChange={(v) => setLocal(q.id, "quote_en", v)} />
                <Textarea label="Quote (AR)" rows={2} dir="rtl" value={q.quote_ar || ""} onChange={(v) => setLocal(q.id, "quote_ar", v)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr 90px auto"), gap: "var(--space-4)", alignItems: "end" }}>
                <Input label="Attribution (EN)" value={q.city_en || ""} onChange={(v) => setLocal(q.id, "city_en", v)} />
                <Input label="Attribution (AR)" value={q.city_ar || ""} onChange={(v) => setLocal(q.id, "city_ar", v)} />
                <Input label="Sort order" value={String(q.sort ?? "")} onChange={(v) => setLocal(q.id, "sort", v)} />
                <div style={{ height: "var(--input-h)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <Switch checked={!!q.published} onChange={(v) => togglePublish(q, v)} label={pending ? "Approve" : "Published"} />
                  <Button size="sm" variant="quiet" onClick={() => saveOne(q)}>Save</Button>
                  <Button size="sm" variant="text" onClick={() => remove(q)}>Remove</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {msg && <div style={{ marginTop: "var(--space-4)" }}><InlineAlert tone={msg.ok ? "ok" : "error"}>{msg.msg}</InlineAlert></div>}
    </div>
  );
}
Object.assign(window, { DashReviews: Reviews });
