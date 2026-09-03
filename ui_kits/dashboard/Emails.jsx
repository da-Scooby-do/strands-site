const { PageHeader, Card, Select, Wordmark } = window.StrandsDesignSystem_6d0a65;
function Emails() {
  const { EMAILS } = window.DASH;
  const names = Object.keys(EMAILS);
  const [which, setWhich] = React.useState(names[0]);
  const [lang, setLang] = React.useState("English");
  const mail = EMAILS[which];
  return (
    <div>
      <PageHeader label="Emails" title="Every message the shop can send." />
      <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", marginBottom: "var(--space-5)", maxWidth: "var(--measure)" }}>
        Nothing is sent from this page. It is here so you can read the wording before a customer does.
      </p>
      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-5)" }}>
        <Select label="Message" value={which} onChange={setWhich} options={names} />
        <Select label="Language" value={lang} onChange={setLang} options={["English", "Arabic"]} />
      </div>
      <Card pad="var(--space-4) var(--space-5)" style={{ marginBottom: "var(--space-4)" }}>
        <span style={{ fontSize: "var(--text-fine-size)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-2)" }}>Subject</span>
        <div style={{ fontSize: "var(--text-body-size)", marginTop: 4 }}>{mail.subject}</div>
      </Card>
      <div style={{ border: "var(--border-card)", borderRadius: "var(--radius-card)", background: "var(--white)", overflow: "hidden" }}>
        <div style={{ background: "var(--purple)", padding: "var(--space-6)", display: "grid", justifyItems: "center" }}><Wordmark size={24} color="var(--green-tint)" /></div>
        <div style={{ padding: "var(--space-7)", display: "grid", gap: "var(--space-4)", maxWidth: 560, margin: "0 auto" }} dir={lang === "Arabic" ? "rtl" : "ltr"}>
          {mail.body.split("\n\n").map((p, i) => (
            <p key={i} style={{ fontSize: "var(--text-small)", lineHeight: "var(--body-lh)", color: "var(--ink)", fontFamily: lang === "Arabic" ? "var(--font-arabic)" : "var(--font-sans)" }}>
              {lang === "Arabic" ? "النص العربي لهذه الرسالة لم يُكتب بعد." : p}
            </p>
          ))}
          <hr style={{ border: "none", borderTop: "1px solid var(--rule)", margin: 0 }} />
          <p style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>Strands Hair Care · Cairo · @strands.eg</p>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { DashEmails: Emails });
