/* Promo codes — live against public.promo_codes (admin RLS). Create, enable /
   disable, and delete codes the storefront's check_promo / place_order honour. */
const { PageHeader, Button, Card, Input, Select, DataTable, InlineAlert } = window.StrandsDesignSystem_6d0a65;
const KIND_TO_DB = { "Percent off": "percent", "EGP off": "fixed", "Free shipping": "free_shipping" };
const DB_TO_KIND = { percent: "Percent off", fixed: "EGP off", free_shipping: "Free shipping" };
function valueLabel(p) { return p.kind === "percent" ? p.value + "%" : p.kind === "fixed" ? p.value + " EGP" : "—"; }

function Promos() {
  const phone = window.useIsPhone();
  const [list, setList] = React.useState([]);
  const [code, setCode] = React.useState("");
  const [kind, setKind] = React.useState("Percent off");
  const [value, setValue] = React.useState("");
  const [min, setMin] = React.useState("0");
  const [cap, setCap] = React.useState("");
  const [msg, setMsg] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => { load(); }, []);
  async function load() {
    if (!window.SB_READY) return;
    const { data } = await window.sb.from("promo_codes").select("*").order("created_at", { ascending: false });
    if (data) setList(data);
  }

  async function create() {
    setMsg(null);
    const c = code.trim().toUpperCase();
    if (!c) return setMsg({ ok: false, msg: "Nothing was created — the code cannot be empty." });
    if (list.some((p) => p.code.toUpperCase() === c)) return setMsg({ ok: false, msg: "Nothing was created — that code already exists." });
    const dbKind = KIND_TO_DB[kind];
    const row = {
      code: c, kind: dbKind,
      value: dbKind === "free_shipping" ? 0 : Number(value || 0),
      min_subtotal: Number(min || 0),
      max_uses: cap.trim() === "" ? null : Number(cap),
      active: true,
    };
    setBusy(true);
    const { error } = await window.sb.from("promo_codes").insert(row);
    setBusy(false);
    if (error) return setMsg({ ok: false, msg: "Nothing was created — " + error.message + ". Are you signed in as the owner?" });
    setCode(""); setValue(""); setCap("");
    setMsg({ ok: true, msg: "Code created. It works on the shop now." });
    load();
  }
  async function toggle(p) { const { error } = await window.sb.from("promo_codes").update({ active: !p.active }).eq("id", p.id); if (!error) load(); else setMsg({ ok: false, msg: error.message }); }
  async function remove(p) { const { error } = await window.sb.from("promo_codes").delete().eq("id", p.id); if (!error) load(); else setMsg({ ok: false, msg: error.message }); }

  const rows = list.map((p) => ({
    id: p.id, code: p.code, kindLabel: DB_TO_KIND[p.kind] || p.kind, valueLabel: valueLabel(p),
    minLabel: (p.min_subtotal || 0) + " EGP", capLabel: p.max_uses == null ? "No cap" : String(p.max_uses),
    used: p.uses || 0, active: p.active, _raw: p,
  }));

  return (
    <div>
      <PageHeader label="Promo codes" title="Codes customers can use." />
      <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)", marginBottom: "var(--space-5)" }}>
        <h2 style={{ fontSize: 22 }}>Create a code.</h2>
        <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1.1fr 1.2fr .8fr 1.1fr 1fr auto"), gap: "var(--space-3)", alignItems: "end" }}>
          <Input label="Code" value={code} onChange={(v) => { setCode(v); setMsg(null); }} placeholder="SPRING20" />
          <Select label="Kind" value={kind} onChange={setKind} options={["Percent off", "EGP off", "Free shipping"]} />
          <Input label="Value" value={value} onChange={setValue} placeholder={kind === "Percent off" ? "20" : "50"} />
          <Input label="Minimum subtotal" value={min} onChange={setMin} />
          <Input label="Cap on uses" value={cap} onChange={setCap} placeholder="No cap" />
          <div style={{ height: "var(--input-h)", display: "flex", alignItems: "center" }}><Button size="sm" onClick={create} disabled={busy} style={{ height: "var(--input-h)" }}>Create</Button></div>
        </div>
        {msg && <InlineAlert tone={msg.ok ? "ok" : "error"}>{msg.msg}</InlineAlert>}
      </Card>
      <DataTable rows={rows} empty="No codes yet." columns={[
        { key: "code", label: "Code" },
        { key: "kindLabel", label: "Kind" },
        { key: "valueLabel", label: "Value", numeric: true },
        { key: "minLabel", label: "Minimum", numeric: true },
        { key: "capLabel", label: "Cap", numeric: true },
        { key: "used", label: "Used", numeric: true, align: "end" },
        { key: "actions", label: "", align: "end", render: (r) => (
          <span style={{ display: "inline-flex", gap: "var(--space-2)" }}>
            <Button size="sm" variant="quiet" onClick={() => toggle(r._raw)}>{r.active ? "Disable" : "Enable"}</Button>
            <Button size="sm" variant="text" onClick={() => remove(r._raw)}>Delete</Button>
          </span>
        ) },
      ]} />
    </div>
  );
}
Object.assign(window, { DashPromos: Promos });
