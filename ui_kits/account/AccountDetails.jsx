/* The signed-in customer's own profile — live from public.profiles (own-row RLS). */
const { Card, Input, Select, Button, InlineAlert } = window.StrandsDesignSystem_6d0a65;
function AccountDetails() {
  const phone = window.useIsPhone();
  const [p, setP] = React.useState(null);
  const [msg, setMsg] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const two = { display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "var(--space-4)" };

  React.useEffect(() => {
    if (!window.SB_READY) return;
    (async () => {
      const { data: s } = await window.sb.auth.getSession();
      if (!s.session) return;
      const { data } = await window.sb.from("profiles").select("*").eq("user_id", s.session.user.id).maybeSingle();
      setP(data || { user_id: s.session.user.id, full_name: "", phone: "", email: s.session.user.email, street: "", area: "", governorate: "Cairo", landmark: "" });
    })();
  }, []);
  const set = (k, v) => { setP((x) => ({ ...x, [k]: v })); setMsg(null); };

  async function save() {
    setBusy(true);
    const { error } = await window.sb.from("profiles").update({
      full_name: p.full_name, phone: p.phone, street: p.street, area: p.area, governorate: p.governorate, landmark: p.landmark,
    }).eq("user_id", p.user_id);
    setBusy(false);
    setMsg(error ? { ok: false, msg: error.message } : { ok: true, msg: "Saved. We will use this for your next order." });
  }

  if (!p) return <div style={{ color: "var(--ink-2)" }}>Loading your details…</div>;
  const govs = (window.EG_GOVERNORATES || []).map((g) => g[0]);
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
        <h2 style={{ fontSize: 22 }}>Your details.</h2>
        <div style={two}>
          <Input label="Name" value={p.full_name || ""} onChange={(v) => set("full_name", v)} />
          <Input label="Phone" value={p.phone || ""} onChange={(v) => set("phone", v)} />
        </div>
        <Input label="Email" value={p.email || ""} type="email" onChange={(v) => set("email", v)} />
      </Card>
      <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
        <h2 style={{ fontSize: 22 }}>Delivery address.</h2>
        <div style={two}>
          <Input label="Street" value={p.street || ""} onChange={(v) => set("street", v)} />
          <Input label="Area" value={p.area || ""} onChange={(v) => set("area", v)} />
        </div>
        <div style={two}>
          <Select label="Governorate" value={p.governorate || "Cairo"} options={govs.length ? govs : ["Cairo", "Giza", "Alexandria"]} onChange={(v) => set("governorate", v)} />
          <Input label="Landmark" value={p.landmark || ""} onChange={(v) => set("landmark", v)} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <Button size="sm" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
          {msg && <InlineAlert tone={msg.ok ? "ok" : "error"}>{msg.msg}</InlineAlert>}
        </div>
      </Card>
    </div>
  );
}
Object.assign(window, { StrandsAccountDetails: AccountDetails });
