/* Site text — the owner edits the storefront copy here. Reads and writes
   settings.content (a JSON of { "key": { en, ar } }). The storefront reads the
   same rows through window.copy(). A blank field falls back to the built-in
   default, so the owner only stores what they actually change. */
const { PageHeader, Button, Card, Input, Textarea, InlineAlert } = window.StrandsDesignSystem_6d0a65;

function SiteText() {
  const phone = window.useIsPhone();
  const [ov, setOv] = React.useState(null);       // overrides object { key: {en,ar} }
  const [saved, setSaved] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const schema = window.SITE_COPY_SCHEMA || [];

  React.useEffect(() => { (async () => {
    if (!window.SB_READY) { setOv({}); return; }
    const { data } = await window.sb.from("settings").select("value").eq("key", "content").maybeSingle();
    setOv((data && data.value) || {});
  })(); }, []);

  const get = (key, lang) => { const o = ov && ov[key]; return (o && o[lang]) || ""; };
  const set = (key, lang, val) => {
    setOv((p) => {
      const next = { ...(p || {}) };
      const cur = { ...(next[key] || {}) };
      if (val === "") delete cur[lang]; else cur[lang] = val;
      if (!cur.en && !cur.ar) delete next[key]; else next[key] = cur;
      return next;
    });
    setSaved(null);
  };

  async function save() {
    setBusy(true); setSaved(null);
    const { error } = await window.sb.from("settings").update({ value: ov }).eq("key", "content");
    setSaved(error ? { ok: false, msg: "Nothing saved — " + error.message + ". Are you signed in as the owner?" }
                   : { ok: true, msg: "Saved. The shop is showing your text." });
    setBusy(false);
  }

  if (!ov) return <div style={{ color: "var(--ink-2)" }}>Loading the site text…</div>;

  return (
    <div>
      <PageHeader label="Site text" title="The words on the shop." action={<Button size="sm" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>} />
      <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", maxWidth: "var(--measure)", marginBottom: "var(--space-5)" }}>
        Change any text on the storefront, in English and Arabic. Leave a box empty to keep the built-in wording. Product name, price and ingredients are edited in <strong>Product &amp; bundles</strong>.
      </p>
      {saved && <div style={{ marginBottom: "var(--space-4)" }}><InlineAlert tone={saved.ok ? "ok" : "error"}>{saved.msg}</InlineAlert></div>}

      <div style={{ display: "grid", gap: "var(--space-5)" }}>
        {schema.map((group) => (
          <Card key={group.section} pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
            <h2 style={{ fontSize: 20 }}>{group.section}</h2>
            {group.fields.map((f) => (
              <div key={f.key} style={{ display: "grid", gap: "var(--space-2)" }}>
                <span style={{ fontSize: "var(--text-small)", color: "var(--ink)", fontWeight: 500 }}>{f.label}</span>
                <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "minmax(0, 1fr) minmax(0, 1fr)"), gap: "var(--space-3)" }}>
                  {f.multiline
                    ? <Textarea label="English" rows={2} value={get(f.key, "en")} placeholder={f.en} onChange={(v) => set(f.key, "en", v)} />
                    : <Input label="English" value={get(f.key, "en")} placeholder={f.en} onChange={(v) => set(f.key, "en", v)} />}
                  {f.multiline
                    ? <Textarea label="العربية" rows={2} dir="rtl" value={get(f.key, "ar")} placeholder={f.ar} onChange={(v) => set(f.key, "ar", v)} />
                    : <Input label="العربية" dir="rtl" value={get(f.key, "ar")} placeholder={f.ar} onChange={(v) => set(f.key, "ar", v)} />}
                </div>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}
Object.assign(window, { DashSiteText: SiteText });
