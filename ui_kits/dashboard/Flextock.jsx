/* Flextock — the warehouse + delivery company (Egypt). Switch it on, check the
   login, set each size's Flextock SKU code, and map our governorates to
   Flextock's city names. New Egypt website orders are then sent automatically
   (InstaPay ones once marked paid) and statuses + tracking come back every 30 min. */
const { PageHeader, Button, Card, Input, Switch, InlineAlert } = window.StrandsDesignSystem_6d0a65;

function Flextock({ onSaved }) {
  const phone = window.useIsPhone();
  const [cfg, setCfg] = React.useState(null);
  const [sizes, setSizes] = React.useState([]);     // single-jar variants: one SKU code per size
  const [missing, setMissing] = React.useState(false);
  const [busy, setBusy] = React.useState(null);
  const [msg, setMsg] = React.useState(null);
  const [conn, setConn] = React.useState(null);

  React.useEffect(() => { load(); }, []);
  async function load() {
    if (!window.SB_READY) return;
    const [s, v] = await Promise.all([
      window.sb.from("settings").select("value").eq("key", "flextock").maybeSingle(),
      window.sb.from("product_variants").select("id,key,label_en,size_ml,jars,active,sku_code,sort").order("sort"),
    ]);
    if (v.error && /sku_code/.test(v.error.message || "")) { setMissing(true); setCfg({}); return; }
    setMissing(!s.data);
    setCfg((s.data && s.data.value) || { enabled: false, cities: {} });
    setSizes((v.data || []).filter((x) => (x.jars || 1) === 1));
  }

  const set = (k, v) => { setCfg((c) => ({ ...c, [k]: v })); setMsg(null); };
  const setCity = (gov, v) => { setCfg((c) => ({ ...c, cities: { ...(c.cities || {}), [gov]: v } })); setMsg(null); };
  const setSku = (id, v) => { setSizes((a) => a.map((x) => (x.id === id ? { ...x, sku_code: v } : x))); setMsg(null); };

  async function save(next) {
    const c = next || cfg;
    if (c.enabled && !sizes.some((x) => x.active && String(x.sku_code || "").trim())) {
      return setMsg({ ok: false, t: "Nothing saved — add the Flextock SKU code for at least the sizes you sell before switching on." });
    }
    setBusy("save"); setMsg(null);
    try {
      const value = { ...c, cities: Object.fromEntries(Object.entries(c.cities || {}).filter(([, v]) => String(v || "").trim())) };
      const up = await window.sb.from("settings").upsert({ key: "flextock", value }, { onConflict: "key" });
      if (up.error) return setMsg({ ok: false, t: "Nothing saved — " + up.error.message });
      for (const x of sizes) {
        const r = await window.sb.from("product_variants").update({ sku_code: String(x.sku_code || "").trim() || null }).eq("id", x.id);
        if (r.error) return setMsg({ ok: false, t: "Nothing saved — " + r.error.message });
      }
      setCfg(value);
      setMsg({ ok: true, t: value.enabled ? "Saved. New Egypt orders go to Flextock automatically." : "Saved. Flextock is off — nothing is sent." });
      if (onSaved) onSaved();
    } finally { setBusy(null); }
  }
  // Switching on records the moment, so only orders placed from now on are sent.
  const toggle = (on) => {
    const next = { ...cfg, enabled: on, enabled_at: on ? (cfg.enabled ? cfg.enabled_at : new Date().toISOString()) : cfg.enabled_at };
    setCfg(next); save(next);
  };

  async function test() {
    setBusy("test"); setConn(null);
    const r = await window.flextockCall("test");
    setBusy(null);
    setConn(r && r.ok ? { ok: true, t: "Connected — Flextock accepted the login." } : { ok: false, t: (r && r.error) || "Couldn’t reach Flextock." });
  }


  if (!cfg) return <div style={{ color: "var(--ink-2)" }}>Loading Flextock…</div>;
  const fmt = (d) => { try { return d ? new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "never"; } catch (e) { return d; } };
  const two = { display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "var(--space-3) var(--space-4)" };

  return (
    <div>
      <PageHeader label="Flextock" title="Warehouse and delivery." action={<Button size="sm" onClick={() => save()} disabled={!!busy}>{busy === "save" ? "Saving…" : "Save changes"}</Button>} />
      <div style={{ display: "grid", gap: "var(--space-5)" }}>
        {msg && <InlineAlert tone={msg.ok ? "ok" : "error"}>{msg.t}</InlineAlert>}
        {missing && <InlineAlert tone="error">The database hasn’t been updated for Flextock yet. Run the “flextock” update in Supabase, then refresh this page.</InlineAlert>}

        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 22 }}>Sending orders.</h2>
            <div style={{ marginInlineStart: "auto" }}><Switch checked={!!cfg.enabled} onChange={toggle} label="Send new Egypt orders to Flextock" /></div>
          </div>
          <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", margin: 0, lineHeight: 1.6 }}>
            When on, every new <strong>Egypt</strong> website order goes to Flextock as soon as it’s placed. Cash-on-delivery orders go straight away;
            <strong> InstaPay orders wait until you press “Mark as paid”</strong>. Orders placed before you switched on are never sent automatically —
            open one and press “Send to Flextock” if you want it there. Statuses and tracking are read back every 30 minutes, and the customer gets the usual email when an order moves.
            Cancelling here does <strong>not</strong> cancel at Flextock: use “Cancel at Flextock” on the order.
          </p>
          <div style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>
            {cfg.enabled ? "On since " + fmt(cfg.enabled_at) : "Off"} · Last checked with Flextock: {fmt(cfg.last_sync)}{cfg.enabled ? " · to check now, press “Sync Flextock” on Orders" : ""}
          </div>
        </Card>

        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-3)" }}>
          <h2 style={{ fontSize: 22 }}>Connection.</h2>
          <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", margin: 0, lineHeight: 1.6 }}>
            Your Flextock login is kept in Supabase, never on this page. In Supabase → <strong>Edge Functions → Secrets</strong>, add
            <code> FLEXTOCK_USERNAME</code>, <code>FLEXTOCK_PASSWORD</code> and <code>FLEXTOCK_API_KEY</code> (from Flextock), then press Test.
          </p>
          {conn && <InlineAlert tone={conn.ok ? "ok" : "error"}>{conn.t}</InlineAlert>}
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <Button size="sm" variant="quiet" onClick={test} disabled={!!busy}>{busy === "test" ? "Testing…" : "Test connection"}</Button>
          </div>
        </Card>

        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-3)" }}>
          <h2 style={{ fontSize: 22 }}>SKU codes.</h2>
          <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", margin: 0 }}>The product code Flextock uses for each size — ask Flextock for them. Bundles (2 or 3 jars) are sent as that many jars of their size.</p>
          {sizes.map((x) => (
            <div key={x.id} style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1.4fr"), gap: "var(--space-3)", alignItems: "end" }}>
              <div style={{ height: "var(--input-h)", display: "grid", alignContent: "center", fontSize: "var(--text-small)" }}>
                <span>{(x.size_ml || 300) + " ml · " + x.label_en}</span>
                {x.active === false && <span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>off in Egypt</span>}
              </div>
              <Input label="Flextock SKU code" value={x.sku_code || ""} onChange={(v) => setSku(x.id, v)} placeholder="e.g. STR-VTM-300" />
            </div>
          ))}
        </Card>

        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-3)" }}>
          <h2 style={{ fontSize: 22 }}>City names.</h2>
          <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", margin: 0 }}>Flextock only accepts its own city names. Get their list and type their name next to each governorate where it’s different. Blank sends the governorate name as it is.</p>
          <div style={two}>
            {(window.EG_GOVERNORATES || []).map((g) => (
              <Input key={g[0]} label={g[0]} value={(cfg.cities || {})[g[0]] || ""} onChange={(v) => setCity(g[0], v)} placeholder={g[0]} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
Object.assign(window, { DashFlextock: Flextock });
