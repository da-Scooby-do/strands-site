/* Delivery zones — owner-editable shipping prices per area (public.shipping_zones).
   Each zone has a price, an optional return fee, and the governorates it covers.
   Checkout charges the zone price for the customer's governorate. */
const { PageHeader, Button, Card, Input, Switch, InlineAlert } = window.StrandsDesignSystem_6d0a65;
function Delivery() {
  const phone = window.useIsPhone();
  const [zones, setZones] = React.useState(null);
  const [msg, setMsg] = React.useState(null);
  const govs = (window.EG_GOVERNORATES || []).map((g) => g[0]);

  React.useEffect(() => { load(); }, []);
  async function load() {
    if (!window.SB_READY) return;
    const { data } = await window.sb.from("shipping_zones").select("*").order("sort");
    if (data) setZones(data);
  }
  const setLocal = (id, k, v) => { setZones((l) => l.map((z) => (z.id === id ? { ...z, [k]: v } : z))); setMsg(null); };
  const toggleGov = (id, g) => setZones((l) => l.map((z) => {
    if (z.id !== id) return z;
    const set = new Set(z.governorates || []);
    if (set.has(g)) set.delete(g); else set.add(g);
    return { ...z, governorates: [...set] };
  }));

  async function saveOne(z) {
    const digits = (v) => parseInt(String(v == null ? "" : v).replace(/[^0-9]/g, ""), 10);
    const { error } = await window.sb.from("shipping_zones").update({
      name_en: z.name_en, name_ar: z.name_ar, price_egp: digits(z.price_egp) || 0,
      return_egp: z.return_egp === "" || z.return_egp == null ? null : digits(z.return_egp),
      governorates: z.governorates || [], sort: digits(z.sort) || 0, active: !!z.active,
    }).eq("id", z.id);
    setMsg(error ? { ok: false, msg: error.message + " — are you signed in as the owner?" } : { ok: true, msg: "Saved. The shop now charges this for that area." });
  }
  async function add() {
    const { error } = await window.sb.from("shipping_zones").insert({ name_en: "New zone", name_ar: "منطقة جديدة", price_egp: 0, governorates: [], sort: (zones ? zones.length : 0) + 1, active: true });
    if (error) setMsg({ ok: false, msg: error.message }); else load();
  }
  async function remove(z) { const { error } = await window.sb.from("shipping_zones").delete().eq("id", z.id); if (!error) load(); else setMsg({ ok: false, msg: error.message }); }

  if (!zones) return <div style={{ color: "var(--ink-2)" }}>Loading delivery zones…</div>;
  const assigned = new Set(); zones.forEach((z) => (z.governorates || []).forEach((g) => assigned.add(g)));
  const unassigned = govs.filter((g) => !assigned.has(g));

  return (
    <div>
      <PageHeader label="Delivery" title="What you charge to deliver, by area." action={<Button size="sm" onClick={add}>Add a zone</Button>} />
      <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", marginBottom: "var(--space-5)", maxWidth: "var(--measure)" }}>
        Set a delivery price for each area and tick which governorates it covers. Checkout charges the matching zone’s price automatically.
        {unassigned.length > 0 && <span> <strong style={{ color: "var(--purple)" }}>{unassigned.length} governorates aren’t in any zone</strong> — they’ll use the default rate.</span>}
      </p>

      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        {zones.map((z) => (
          <Card key={z.id} pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)", opacity: z.active ? 1 : 0.6 }}>
            <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr 120px 120px"), gap: "var(--space-3)", alignItems: "end" }}>
              <Input label="Name (EN)" value={z.name_en || ""} onChange={(v) => setLocal(z.id, "name_en", v)} />
              <Input label="Name (AR)" value={z.name_ar || ""} onChange={(v) => setLocal(z.id, "name_ar", v)} />
              <Input label="Price (EGP)" value={String(z.price_egp ?? "")} onChange={(v) => setLocal(z.id, "price_egp", v)} />
              <Input label="Return fee (EGP)" value={z.return_egp == null ? "" : String(z.return_egp)} onChange={(v) => setLocal(z.id, "return_egp", v)} />
            </div>
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              <span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>Governorates in this zone</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {govs.map((g) => {
                  const on = (z.governorates || []).includes(g);
                  return (
                    <button key={g} type="button" onClick={() => { toggleGov(z.id, g); setMsg(null); }}
                      style={{ font: "inherit", fontFamily: "var(--font-sans)", fontSize: 12, padding: "5px 11px", borderRadius: "var(--radius-pill)", cursor: "pointer", border: "1px solid " + (on ? "var(--purple)" : "var(--rule)"), background: on ? "var(--purple)" : "transparent", color: on ? "var(--white)" : "var(--ink-2)" }}>{g}</button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <Switch checked={!!z.active} onChange={(v) => setLocal(z.id, "active", v)} label="Active" />
              <Button size="sm" variant="quiet" onClick={() => saveOne(z)}>Save</Button>
              <Button size="sm" variant="text" onClick={() => remove(z)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
      {msg && <div style={{ marginTop: "var(--space-4)" }}><InlineAlert tone={msg.ok ? "ok" : "error"}>{msg.msg}</InlineAlert></div>}
    </div>
  );
}
Object.assign(window, { DashDelivery: Delivery });
