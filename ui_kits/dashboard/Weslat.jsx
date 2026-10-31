/* Weslat — the delivery company in Sudan (Weslat International, "Accurate" API).
   Switch it on, check the login, pick the shipping service and, for each Sudan
   delivery choice (Countries → Sudan), Weslat's city (its sub-area, which the API
   insists on, is picked automatically — the address says the rest). Paid Sudan orders
   are then sent automatically; statuses come back by webhook and every 30 min. */
const { PageHeader, Button, Card, Input, Select, Switch, InlineAlert } = window.StrandsDesignSystem_6d0a65;

function Weslat({ onSaved }) {
  const phone = window.useIsPhone();
  const [cfg, setCfg] = React.useState(null);
  const [choices, setChoices] = React.useState([]);   // Sudan delivery choices
  const [missing, setMissing] = React.useState(false);
  const [busy, setBusy] = React.useState(null);
  const [msg, setMsg] = React.useState(null);
  const [conn, setConn] = React.useState(null);
  const [services, setServices] = React.useState(null);
  const [zones, setZones] = React.useState(null);      // [{id,name}] for the chosen service
  const [lookMsg, setLookMsg] = React.useState(null);
  const [hook, setHook] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const [prices, setPrices] = React.useState(null);
  const [cityMsg, setCityMsg] = React.useState(null);   // Weslat's price per choice, for 1 jar

  React.useEffect(() => { load(); }, []);
  async function load() {
    if (!window.SB_READY) return;
    const [s, m, h] = await Promise.all([
      window.sb.from("settings").select("value").eq("key", "weslat").maybeSingle(),
      window.sb.from("markets").select("delivery_options").eq("code", "SD").maybeSingle(),
      window.sb.rpc("weslat_hook_url"),
    ]);
    setMissing(!s.data);
    setCfg((s.data && s.data.value) || { enabled: false, zones: {}, jar_kg: 0.5 });
    setChoices((m.data && m.data.delivery_options) || []);
    setHook((h && h.data) || null);
  }

  const set = (k, v) => { setCfg((c) => ({ ...c, [k]: v })); setMsg(null); };
  const setZone = (key, patch) => { setCfg((c) => ({ ...c, zones: { ...(c.zones || {}), [key]: { ...((c.zones || {})[key] || {}), ...patch } } })); setMsg(null); };

  async function save(next) {
    const c = next || cfg;
    const kg = Number(c.jar_kg);
    if (!(kg > 0 && kg < 20)) return setMsg({ ok: false, t: "Nothing saved — the weight per jar must be a number of kilograms, e.g. 0.5." });
    if (c.enabled) {
      if (!c.service_id) return setMsg({ ok: false, t: "Nothing saved — choose the Weslat shipping service before switching on." });
      // Cities taken from Weslat ("wz_…") carry their own; others need one picked here.
      const unmapped = c.auto_cities ? [] : choices.filter((o) => { const z = (c.zones || {})[o.key]; return !/^wz_\d+$/.test(o.key) && (!z || !z.zone_id); });
      if (unmapped.length) return setMsg({ ok: false, t: "Nothing saved — choose the Weslat city for: " + unmapped.map((o) => o.name_en).join(", ") + "." });
    }
    setBusy("save"); setMsg(null);
    try {
      const value = { ...c, jar_kg: kg };
      const up = await window.sb.from("settings").upsert({ key: "weslat", value }, { onConflict: "key" });
      if (up.error) return setMsg({ ok: false, t: "Nothing saved — " + up.error.message });
      setCfg(value);
      setMsg({ ok: true, t: value.enabled ? "Saved. Paid Sudan orders go to Weslat automatically." : "Saved. Weslat is off — nothing is sent." });
      if (onSaved) onSaved();
      return true;
    } finally { setBusy(null); }
  }
  // Sudan's delivery choices = Weslat's cities (refreshed every 30 minutes, or now).
  async function updateCities() {
    setBusy("cities"); setCityMsg(null);
    const r = await window.weslatCall("cities");
    setBusy(null);
    if (r && r.ok) {
      const bits = [r.cities + " cities from Weslat at checkout."];
      if (r.added && r.added.length) bits.push("New: " + r.added.join(", ") + ".");
      if (r.removed && r.removed.length) bits.push("Gone: " + r.removed.join(", ") + ".");
      if (r.unpriced) bits.push(r.unpriced + " more Weslat didn’t price, so they’re not shown.");
      setCityMsg({ ok: true, t: bits.join(" ") });
      const m = await window.sb.from("markets").select("delivery_options").eq("code", "SD").maybeSingle();
      setChoices((m.data && m.data.delivery_options) || []);
    } else setCityMsg({ ok: false, t: (r && r.error) || "Couldn’t get the cities from Weslat." });
  }
  const toggleAuto = async (on) => { if (await save({ ...cfg, auto_cities: on }) && on) updateCities(); };
  // Switching on records the moment, so only orders placed from now on are sent.
  // The switch only moves once that's saved (save shows why when it can't be).
  const toggle = (on) => {
    const next = { ...cfg, enabled: on, enabled_at: on ? (cfg.enabled ? cfg.enabled_at : new Date().toISOString()) : cfg.enabled_at };
    save(next);
  };

  async function test() {
    setBusy("test"); setConn(null);
    const r = await window.weslatCall("test");
    setBusy(null);
    setConn(r && r.ok ? { ok: true, t: "Connected — Weslat accepted the login." } : { ok: false, t: (r && r.error) || "Couldn’t reach Weslat." });
  }
  async function getServices() {
    setBusy("services"); setLookMsg(null);
    const r = await window.weslatCall("services");
    setBusy(null);
    if (r && r.ok) { setServices(r.services || []); if (!(r.services || []).length) setLookMsg({ ok: false, t: "Weslat has no shipping service on your account yet — ask them to add one." }); }
    else setLookMsg({ ok: false, t: (r && r.error) || "Couldn’t get the services from Weslat." });
  }
  async function getZones() {
    if (!cfg.service_id) return setLookMsg({ ok: false, t: "Choose the shipping service first." });
    setBusy("zones"); setLookMsg(null);
    const r = await window.weslatCall("zones", { service_id: cfg.service_id });
    setBusy(null);
    if (r && r.ok) setZones(r.zones || []);
    else setLookMsg({ ok: false, t: (r && r.error) || "Couldn’t get the cities from Weslat." });
  }
  // Weslat requires a sub-area too: take the city's first one (the customer's address
  // tells the courier where exactly). If it can't be read now, sending picks one then.
  async function autoSubzone(key, zoneId) {
    const r = await window.weslatCall("zones", { service_id: cfg.service_id, zone_id: zoneId });
    const first = r && r.ok && (r.zones || [])[0];
    setCfg((c) => { const cur = (c.zones || {})[key] || {}; if (String(cur.zone_id) !== String(zoneId)) return c; return { ...c, zones: { ...(c.zones || {}), [key]: { ...cur, subzone_id: first ? first.id : null, subzone_name: first ? first.name : null } } }; });
  }
  const pickService = (id) => { const s = (services || []).find((x) => String(x.id) === String(id)); set("service_id", s ? s.id : null); set("service_name", s ? s.name : null); setZones(null); };
  const pickZone = (key, id) => { const z = (zones || []).find((x) => String(x.id) === String(id)); setZone(key, { zone_id: z ? z.id : null, zone_name: z ? z.name : null, subzone_id: null, subzone_name: null }); if (z) autoSubzone(key, z.id); };
  // What customers are charged: Weslat's own price for one jar, per city (saved ones show if Weslat can't answer).
  async function checkPrices() {
    setBusy("prices"); setLookMsg(null);
    const r = await window.weslatCall("quote", { jars: 1 });
    setBusy(null);
    if (r && r.ok) setPrices(r.fees || {});
    else setLookMsg({ ok: false, t: (r && r.error) || "Couldn’t get the prices from Weslat." });
  }
  async function copyHook() { try { await navigator.clipboard.writeText(hook); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (e) { window.prompt("Copy this address:", hook); } }

  if (!cfg) return <div style={{ color: "var(--ink-2)" }}>Loading Weslat…</div>;
  const fmt = (d) => { try { return d ? new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "never"; } catch (e) { return d; } };
  const p = { fontSize: "var(--text-small)", color: "var(--ink-2)", margin: 0, lineHeight: 1.6 };
  const choose = { value: "", label: "Choose…" };

  return (
    <div>
      <PageHeader label="Weslat" title="Delivery in Sudan." action={<Button size="sm" onClick={() => save()} disabled={!!busy}>{busy === "save" ? "Saving…" : "Save changes"}</Button>} />
      <div style={{ display: "grid", gap: "var(--space-5)" }}>
        {msg && <InlineAlert tone={msg.ok ? "ok" : "error"}>{msg.t}</InlineAlert>}
        {missing && <InlineAlert tone="error">The database hasn’t been updated for Weslat yet. Run the “weslat” update in Supabase, then refresh this page.</InlineAlert>}

        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 22 }}>Sending orders.</h2>
            <div style={{ marginInlineStart: "auto" }}><Switch checked={!!cfg.enabled} onChange={toggle} label="Send paid Sudan orders to Weslat" /></div>
          </div>
          <p style={p}>
            Sudan customers pay first on WhatsApp. When this is on, a Sudan order goes to Weslat <strong>as soon as you press “Mark as paid”</strong> on it
            (and the 30-minute check sends any paid one that was missed). Orders placed before you switched on are never sent automatically —
            open one and press “Send to Weslat”. Weslat tells the site each time a shipment moves, and the customer gets the usual email.
            Cancelling here does <strong>not</strong> cancel at Weslat: tell them on WhatsApp.
          </p>
          <div style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>
            {cfg.enabled ? "On since " + fmt(cfg.enabled_at) : "Off"} · Last checked with Weslat: {fmt(cfg.last_sync)}
          </div>
        </Card>

        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-3)" }}>
          <h2 style={{ fontSize: 22 }}>Connection.</h2>
          <p style={p}>
            Your Weslat login is kept in Supabase, never on this page. In Supabase → <strong>Edge Functions → Secrets</strong>, add
            <code> WESLAT_API_URL</code> (the endpoint Weslat gives you) and <code>WESLAT_API_KEY</code> (their API key), then press Test.
            If Weslat gave you a username and password instead of a key, add <code>WESLAT_USERNAME</code> and <code>WESLAT_PASSWORD</code>.
          </p>
          {conn && <InlineAlert tone={conn.ok ? "ok" : "error"}>{conn.t}</InlineAlert>}
          <div><Button size="sm" variant="quiet" onClick={test} disabled={!!busy}>{busy === "test" ? "Testing…" : "Test connection"}</Button></div>
        </Card>

        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-3)" }}>
          <h2 style={{ fontSize: 22 }}>Service and cities.</h2>
          <p style={p}>Pick the service. Then either take Sudan’s cities straight from Weslat (recommended), or pick the Weslat city for each delivery choice you made on Countries → Sudan. The customer’s address goes with every shipment, so the courier knows exactly where.</p>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "end" }}>
            <Button size="sm" variant="quiet" onClick={getServices} disabled={!!busy}>{busy === "services" ? "Loading…" : "Get services from Weslat"}</Button>
            {!cfg.auto_cities && <Button size="sm" variant="quiet" onClick={getZones} disabled={!!busy || !cfg.service_id}>{busy === "zones" ? "Loading…" : "Get cities from Weslat"}</Button>}
          </div>
          {lookMsg && <InlineAlert tone={lookMsg.ok ? "ok" : "error"}>{lookMsg.t}</InlineAlert>}
          {services
            ? <Select label="Shipping service" value={cfg.service_id ? String(cfg.service_id) : ""} onChange={pickService} options={[choose].concat(services.map((s) => ({ value: String(s.id), label: s.name })))} />
            : <div style={{ fontSize: "var(--text-small)" }}>Service: <strong>{cfg.service_name || (cfg.service_id ? "#" + cfg.service_id : "not chosen")}</strong></div>}
          <div style={{ display: "grid", gap: "var(--space-2)", background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: "var(--space-4)" }}>
            <Switch checked={!!cfg.auto_cities} onChange={toggleAuto} label="Take Sudan’s cities and prices from Weslat" />
            <p style={{ ...p, fontSize: "var(--text-fine-size)" }}>When on, the cities customers in Sudan choose from are Weslat’s own list, each at Weslat’s price. A city Weslat adds appears at checkout; one it stops serving disappears. The list refreshes every 30 minutes{cfg.service_id ? "" : " — choose the service first"}.</p>
            {cfg.auto_cities && <div><Button size="sm" variant="quiet" onClick={updateCities} disabled={!!busy || !cfg.service_id}>{busy === "cities" ? "Asking Weslat…" : "Update cities now"}</Button></div>}
            {cityMsg && <InlineAlert tone={cityMsg.ok ? "ok" : "error"}>{cityMsg.t}</InlineAlert>}
            {cfg.auto_cities && choices.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "4px var(--space-5)" }}>
                {choices.map((o) => <div key={o.key} style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)", fontSize: "var(--text-small)", borderTop: "1px solid var(--rule)", padding: "6px 0" }}><span>{o.name_en}{o.name_ar && o.name_ar !== o.name_en ? " · " + o.name_ar : ""}</span><span style={{ fontFamily: "var(--font-numeric)", whiteSpace: "nowrap" }}>{window.fmtMoney(Number(o.fee) || 0, "SDG")}</span></div>)}
              </div>
            )}
          </div>
          {!cfg.auto_cities && !choices.length && <InlineAlert tone="error">Sudan has no delivery choices yet — add them on Countries → Sudan first.</InlineAlert>}
          {!cfg.auto_cities && choices.map((o) => {
            const z = (cfg.zones || {})[o.key] || {};
            return (
              <div key={o.key} style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1.6fr"), gap: "var(--space-3)", alignItems: "end" }}>
                <div style={{ height: "var(--input-h)", display: "grid", alignContent: "center", fontSize: "var(--text-small)" }}>
                  <span>{o.name_en}</span>
                  <span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>{window.fmtMoney ? window.fmtMoney(Number(o.fee) || 0, "SDG") : o.fee}</span>
                </div>
                {zones
                  ? <Select label="Weslat city" value={z.zone_id ? String(z.zone_id) : ""} onChange={(v) => pickZone(o.key, v)} options={[choose].concat(zones.map((x) => ({ value: String(x.id), label: x.name })))} />
                  : <Input label="Weslat city" value={z.zone_name || (z.zone_id ? "#" + z.zone_id : "")} onChange={() => {}} placeholder="press Get cities" />}
              </div>
            );
          })}
          <div style={{ maxWidth: 260 }}>
            <Input label="Weight per jar (kg)" value={cfg.jar_kg == null ? "" : String(cfg.jar_kg)} onChange={(v) => set("jar_kg", v)} placeholder="0.5" />
          </div>
          <p style={{ ...p, fontSize: "var(--text-fine-size)" }}>Weslat prices by weight (first 2 kg, then per extra kg), so the shipment’s weight is jars × this.</p>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            <p style={p}>Delivery prices at checkout come <strong>from Weslat</strong> for each city and the number of jars (save the cities first). The prices on Countries → Sudan are only used if Weslat can’t answer.</p>
            {!cfg.auto_cities && <div><Button size="sm" variant="quiet" onClick={checkPrices} disabled={!!busy}>{busy === "prices" ? "Asking Weslat…" : "See Weslat’s prices (1 jar)"}</Button></div>}
            {prices && !cfg.auto_cities && choices.map((o) => (
              <div key={o.key} style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)", fontSize: "var(--text-small)", borderTop: "1px solid var(--rule)", padding: "6px 0" }}>
                <span>{o.name_en}</span>
                <span style={{ fontFamily: "var(--font-numeric)" }}>{prices[o.key] != null ? window.fmtMoney(prices[o.key], "SDG") + " · from Weslat" : window.fmtMoney(Number(o.fee) || 0, "SDG") + " · saved price (Weslat didn’t price it)"}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-3)" }}>
          <h2 style={{ fontSize: 22 }}>Status updates.</h2>
          <p style={p}>Send this address to Weslat and ask them to save it as your account’s <strong>webhook</strong>. They call it every time a shipment changes status, so orders here move by themselves. Keep it private — it contains a key.</p>
          {hook
            ? <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
                <code style={{ fontSize: 12, background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-control)", padding: "8px 10px", wordBreak: "break-all", flex: "1 1 260px" }}>{hook}</code>
                <Button size="sm" variant="quiet" onClick={copyHook}>{copied ? "Copied ✓" : "Copy"}</Button>
              </div>
            : <InlineAlert tone="error">Couldn’t load the address — refresh the page.</InlineAlert>}
        </Card>
      </div>
    </div>
  );
}
Object.assign(window, { DashWeslat: Weslat });
