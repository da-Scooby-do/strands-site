const { SectionHeading, CollapsibleRow } = window.StrandsDesignSystem_6d0a65;
const STEPS = [
  { title: "First wash — softness you can feel", body: "The mango butter and jojoba coat the strand, so the comb runs through without catching." },
  { title: "Week two — the frizz settles", body: "Flaxseed gel holds moisture in the cuticle, so humidity has less to lift." },
  { title: "Week four — fuller, calmer hair", body: "Panthenol and hibiscus keep the scalp comfortable and the ends from splitting further." },
];
function OverTime() {
  const phone = window.useIsPhone();
  const [open, setOpen] = React.useState(0);
  return (
    <section style={{ background: "var(--green-tint)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter)" : "var(--section-y) var(--gutter)", display: "grid", gap: phone ? "var(--space-6)" : "var(--space-7)" }}>
        <SectionHeading align="center" eyebrow="Over time" title="What it does after the first wash." sub="Used two or three times a week, on any hair type." />
        <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: phone ? "var(--space-5)" : "var(--space-8)", alignItems: "start" }}>
          <div style={{ borderBottom: "1px solid rgba(87,117,55,.25)" }}>
            {STEPS.map((s, i) => (
              <CollapsibleRow key={s.title} number={i + 1} title={s.title} open={open === i} onToggle={(n) => setOpen(n ? i : -1)}>{s.body}</CollapsibleRow>
            ))}
          </div>
          <window.StrandsPhotoStrip />
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { StrandsOverTime: OverTime });
