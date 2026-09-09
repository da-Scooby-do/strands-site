const { SectionHeading, CollapsibleRow } = window.StrandsDesignSystem_6d0a65;
function OverTime() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  const [open, setOpen] = React.useState(0);
  const steps = ar ? [
    { title: "أول غسلة — نعومة تحسّيها", body: "زبدة المانجو والجوجوبا بتغلّف الشعرة، فالمشط بيعدّي من غير ما يتعلّق." },
    { title: "الأسبوع التاني — الهيشان يهدأ", body: "جل بذور الكتان بيحبس الترطيب في الشعرة، فالرطوبة ملهاش تأثير كبير." },
    { title: "الأسبوع الرابع — شعر أكثف وأهدأ", body: "البانثينول والكركديه بيريّحوا فروة الرأس ويمنعوا الأطراف من التقصّف أكتر." },
  ] : [
    { title: "First wash — softness you can feel", body: "The mango butter and jojoba coat the strand, so the comb runs through without catching." },
    { title: "Week two — the frizz settles", body: "Flaxseed gel holds moisture in the cuticle, so humidity has less to lift." },
    { title: "Week four — fuller, calmer hair", body: "Panthenol and hibiscus keep the scalp comfortable and the ends from splitting further." },
  ];
  return (
    <section style={{ background: "var(--green-tint)", overflow: "hidden" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter) 0" : "var(--section-y) var(--gutter) 0", display: "grid", gap: phone ? "var(--space-6)" : "var(--space-7)" }}>
        <SectionHeading align="center" eyebrow={ar ? "مع الوقت" : "Over time"} title={ar ? "بيعمل إيه بعد أول غسلة." : "What it does after the first wash."} sub={ar ? "مرتين أو تلاتة في الأسبوع، على أي نوع شعر." : "Used two or three times a week, on any hair type."} />
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
