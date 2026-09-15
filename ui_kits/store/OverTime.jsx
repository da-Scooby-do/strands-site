const { SectionHeading } = window.StrandsDesignSystem_6d0a65;
function OverTime() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  const steps = [
    { title: window.copy("overtime.s1.title", "First wash — softness you can feel", "أول غسلة — نعومة تحسّيها") },
    { title: window.copy("overtime.s2.title", "Week two — the frizz settles", "الأسبوع التاني — الهيشان يهدأ") },
    { title: window.copy("overtime.s3.title", "Week four — fuller, calmer hair", "الأسبوع الرابع — شعر أكثف وأهدأ") },
  ];
  return (
    <section style={{ background: "var(--green-tint)", overflow: "hidden" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter) 0" : "var(--section-y) var(--gutter) 0", display: "grid", gap: phone ? "var(--space-6)" : "var(--space-7)" }}>
        <SectionHeading align="center" eyebrow={window.copy("overtime.eyebrow", "Over time", "مع الوقت")} title={window.copy("overtime.heading", "What it does after the first wash.", "بيعمل إيه بعد أول غسلة.")} sub={window.copy("overtime.sub", "Used two or three times a week, on any hair type.", "مرتين أو تلاتة في الأسبوع، على أي نوع شعر.")} />
        <div style={{ maxWidth: "var(--measure)", width: "100%", margin: "0 auto", borderBottom: "1px solid rgba(64,79,36,.25)" }}>
          {steps.map((s, i) => (
            <div key={s.title} style={{ borderTop: "1px solid var(--rule)", display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "16px 0", color: "var(--ink)", fontFamily: "var(--font-sans)" }}>
              <span style={{ fontFamily: "var(--font-numeric)", fontSize: "var(--text-small)", color: "var(--green)", width: 22 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ flex: 1, fontSize: "var(--text-body-size)", fontWeight: 500 }}>{s.title}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Full-width photo slider running across the section. */}
      <div style={{ paddingBottom: phone ? "var(--section-y-mobile)" : "var(--section-y)", paddingTop: phone ? "var(--space-6)" : "var(--space-7)" }}>
        <window.StrandsPhotoStrip horizontal />
      </div>
    </section>
  );
}
Object.assign(window, { StrandsOverTime: OverTime });
