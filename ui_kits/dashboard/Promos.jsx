const { PageHeader, Button, Card, Input, Select, DataTable, InlineAlert } = window.StrandsDesignSystem_6d0a65;
function Promos() {
  const phone = window.useIsPhone();
  const [list, setList] = React.useState(window.DASH.PROMOS);
  const [code, setCode] = React.useState("");
  const [kind, setKind] = React.useState("Percent off");
  const [value, setValue] = React.useState("");
  const [min, setMin] = React.useState("0");
  const [cap, setCap] = React.useState("");
  const [msg, setMsg] = React.useState(null);
  const create = () => {
    if (!code.trim()) return setMsg({ ok: false, msg: "Nothing was created — the code cannot be empty." });
    if (list.some((p) => p.id.toLowerCase() === code.trim().toLowerCase())) return setMsg({ ok: false, msg: "Nothing was created — that code already exists." });
    setList([...list, { id: code.toUpperCase().trim(), kind, value: kind === "Free shipping" ? "—" : value || "—", min: (min || "0") + " EGP", cap: cap || "—", used: 0, on: true }]);
    setCode(""); setValue(""); setCap("");
    setMsg({ ok: true, msg: "Code created. It works on the shop now." });
  };
  const toggle = (id) => setList((l) => l.map((p) => (p.id === id ? { ...p, on: !p.on } : p)));
  const remove = (id) => setList((l) => l.filter((p) => p.id !== id));
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
          <div style={{ height: "var(--input-h)", display: "flex", alignItems: "center" }}><Button size="sm" onClick={create} style={{ height: "var(--input-h)" }}>Create</Button></div>
        </div>
        {msg && <InlineAlert tone={msg.ok ? "ok" : "error"}>{msg.msg}</InlineAlert>}
      </Card>
      <DataTable rows={list} columns={[
        { key: "id", label: "Code" },
        { key: "kind", label: "Kind" },
        { key: "value", label: "Value", numeric: true },
        { key: "min", label: "Minimum", numeric: true },
        { key: "cap", label: "Cap", numeric: true },
        { key: "used", label: "Used", numeric: true, align: "end" },
        { key: "actions", label: "", align: "end", render: (r) => (
          <span style={{ display: "inline-flex", gap: "var(--space-2)" }}>
            <Button size="sm" variant="quiet" onClick={() => toggle(r.id)}>{r.on ? "Disable" : "Enable"}</Button>
            <Button size="sm" variant="text" onClick={() => remove(r.id)}>Delete</Button>
          </span>
        ) },
      ]} />
    </div>
  );
}
Object.assign(window, { DashPromos: Promos });
