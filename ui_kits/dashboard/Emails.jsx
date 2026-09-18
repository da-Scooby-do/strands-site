/* Email editor — subject + body per order status, EN + AR, stored in
   settings.emails and used by the notify-order function. */
const { PageHeader, Card, Select, Input, Textarea, Button, InlineAlert, Wordmark } = window.StrandsDesignSystem_6d0a65;
const STATUSES = [
  { key: "confirmed", label: "Order received (confirmed)" },
  { key: "with_courier", label: "With courier" },
  { key: "delivered", label: "Delivered" },
  { key: "returned", label: "Returned" },
  { key: "cancelled", label: "Cancelled" },
];
const HEAD = {
  confirmed: { en: "Thank you Mona — your order is confirmed.", ar: "شكرًا Mona — تم تأكيد طلبك." },
  with_courier: { en: "Your order is with the courier.", ar: "طلبك مع المندوب." },
  delivered: { en: "Your order arrived.", ar: "طلبك وصل." },
  returned: { en: "Your order has been returned.", ar: "تم إرجاع طلبك." },
  cancelled: { en: "Your order was cancelled.", ar: "طلبك اتلغى." },
};
function sample(s) {
  return String(s || "").replace(/\{name\}/g, "Mona").replace(/\{first\}/g, "Mona").replace(/\{order\}/g, "STR-2490").replace(/\{total\}/g, "230 EGP");
}
function Emails() {
  const phone = window.useIsPhone();
  const [emails, setEmails] = React.useState(null);
  const [which, setWhich] = React.useState("confirmed");
  const [langLabel, setLangLabel] = React.useState("English");
  const [msg, setMsg] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const lang = langLabel === "Arabic" ? "ar" : "en";
  const rtl = lang === "ar";

  React.useEffect(() => { load(); }, []);
  async function load() {
    if (!window.SB_READY) return;
    const { data } = await window.sb.from("settings").select("value").eq("key", "emails").maybeSingle();
    setEmails((data && data.value) || {});
  }
  const cur = (emails && emails[which]) || {};
  const set = (field, v) => { setEmails((e) => ({ ...e, [which]: { ...(e[which] || {}), [field]: v } })); setMsg(null); };

  async function save() {
    setBusy(true);
    const { error } = await window.sb.from("settings").update({ value: emails }).eq("key", "emails");
    setBusy(false);
    setMsg(error ? { ok: false, msg: error.message + " — are you signed in as the owner?" } : { ok: true, msg: "Saved. New orders at this status use this wording." });
  }

  async function sendTest() {
    setBusy(true); setMsg(null);
    const { data, error } = await window.sb.functions.invoke("notify-order", { body: { test: true, status: which, lang, template: cur } });
    setBusy(false);
    if (error) return setMsg({ ok: false, msg: "Couldn’t send the test — " + error.message });
    if (data && data.sent) return setMsg({ ok: true, msg: "Test sent to " + (data.to || "your inbox") + ". Check your email." });
    if (data && data.notify_result === "no_provider") return setMsg({ ok: false, msg: "No email key set yet. Set RESEND_API_KEY on the function, then try again." });
    setMsg({ ok: false, msg: "Test not sent — " + ((data && data.notify_result) || (data && data.error) || "unknown error") + "." });
  }

  if (!emails) return <div style={{ color: "var(--ink-2)" }}>Loading the emails…</div>;

  return (
    <div>
      <PageHeader label="Emails" title="What each status email says." action={<span style={{ display: "inline-flex", gap: "var(--space-2)" }}><Button size="sm" variant="quiet" onClick={sendTest} disabled={busy}>Send a test to me</Button><Button size="sm" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button></span>} />
      <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", marginBottom: "var(--space-5)", maxWidth: "var(--measure)" }}>
        Edit the subject and message for each order status. Use <code>{"{name}"}</code>, <code>{"{order}"}</code> and <code>{"{total}"}</code> — they’re filled in automatically. The header, order card and button are added for you.
      </p>
      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-5)", flexWrap: "wrap" }}>
        <Select label="Status" value={which} onChange={setWhich} options={STATUSES.map((s) => ({ value: s.key, label: s.label }))} />
        <Select label="Language" value={langLabel} onChange={setLangLabel} options={["English", "Arabic"]} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "var(--space-5)", alignItems: "start" }}>
        <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
          <Input label={"Subject (" + (rtl ? "AR" : "EN") + ")"} value={cur["subject_" + lang] || ""} onChange={(v) => set("subject_" + lang, v)} />
          <Textarea label={"Message (" + (rtl ? "AR" : "EN") + ")"} rows={5} dir={rtl ? "rtl" : "ltr"} value={cur["body_" + lang] || ""} onChange={(v) => set("body_" + lang, v)} />
          {msg && <InlineAlert tone={msg.ok ? "ok" : "error"}>{msg.msg}</InlineAlert>}
        </Card>

        <div style={{ border: "var(--border-card)", borderRadius: "var(--radius-card)", background: "var(--white)", overflow: "hidden" }}>
          <div style={{ background: "var(--purple)", padding: "var(--space-5)", display: "grid" }}><span style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: 22, letterSpacing: ".22em" }}>STRANDS</span></div>
          <div style={{ padding: "var(--space-6)", display: "grid", gap: "var(--space-3)", direction: rtl ? "rtl" : "ltr", textAlign: rtl ? "right" : "left" }}>
            <div style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-2)" }}>Subject</div>
            <div style={{ fontSize: "var(--text-small)", fontWeight: 600, marginBottom: 6 }}>{sample(cur["subject_" + lang]) || "—"}</div>
            <h3 style={{ fontFamily: rtl ? "var(--font-arabic)" : "var(--font-display)", fontSize: 24, margin: 0 }}>{HEAD[which][lang]}</h3>
            <p style={{ fontFamily: rtl ? "var(--font-arabic)" : "var(--font-sans)", fontSize: "var(--text-small)", color: "var(--ink-2)", lineHeight: 1.6 }}>{sample(cur["body_" + lang]) || "…"}</p>
            <div style={{ background: "var(--white)", border: "1px solid var(--rule)", padding: "12px 16px", width: "fit-content" }}>
              <div style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-2)" }}>{rtl ? "رقم الطلب" : "Order number"}</div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>STR-2490</div>
            </div>
            <div style={{ background: "var(--purple)", color: "#fff", padding: "12px 24px", width: "fit-content", fontSize: 13, fontWeight: 700 }}>{which === "delivered" ? (rtl ? "شاركي نتيجتك" : "Share your result") : (which === "cancelled" || which === "returned") ? (rtl ? "رجوع للمتجر" : "Back to the shop") : (rtl ? "تابعي طلبك" : "Track your order")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { DashEmails: Emails });
