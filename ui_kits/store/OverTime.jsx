const { SectionHeading, CollapsibleRow } = window.StrandsDesignSystem_6d0a65;
function OverTime() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  const [open, setOpen] = React.useState(0);
  const steps = [
    { title: window.copy("overtime.s1.title", "First wash — softness you can feel", "أول غسلة — نعومة تحسّيها"), body: window.copy("overtime.s1.body", "The mango butter and jojoba coat the strand, so the comb runs through without catching.", "زبدة المانجو والجوجوبا بتغلّف الشعرة، فالمشط بيعدّي من غير ما يتعلّق.") },
    { title: window.copy("overtime.s2.title", "Week two — the frizz settles", "الأسبوع التاني — الهيشان يهدأ"), body: window.copy("overtime.s2.body", "Flaxseed gel holds moisture in the cuticle, so humidity has less to lift.", "جل بذور الكتان بيحبس الترطيب في الشعرة، فالرطوبة ملهاش تأثير كبير.") },
    { title: window.copy("overtime.s3.title", "Week four — fuller, calmer hair", "الأسبوع الرابع — شعر أكثف وأهدأ"), body: window.copy("overtime.s3.body", "Panthenol and hibiscus keep the scalp comfortable and the ends from splitting further.", "البانثينول والكركديه بيريّحوا فروة الرأس ويمنعوا الأطراف من التقصّف أكتر.") },
  ];
  return (
    <section style={{ background: "var(--green-tint)", overflow: "hidden" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter) 0" : "var(--section-y) var(--gutter) 0", display: "grid", gap: phone ? "var(--space-6)" : "var(--space-7)" }}>
        <SectionHeading align="center" eyebrow={window.copy("overtime.eyebrow", "Over time", "مع الوقت")} title={window.copy("overtime.heading", "What it does after the first wash.", "بيعمل إيه بعد أول غسلة.")} sub={window.copy("overtime.sub", "Used two or three times a week, on any hair type.", "مرتين أو تلاتة في الأسبوع، على أي نوع شعر.")} />
        <div style={{ maxWidth: "var(--measure)", width: "100%", margin: "0 auto", borderBottom: "1px solid rgba(64,79,36,.25)" }}>
          {steps.map((s, i) => (
            <CollapsibleRow key={s.title} number={i + 1} title={s.title} open={open === i} onToggle={(n) => setOpen(n ? i : -1)}>{s.body}</CollapsibleRow>
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
