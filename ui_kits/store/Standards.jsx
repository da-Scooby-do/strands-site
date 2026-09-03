const { Eyebrow, FeatureColumn } = window.StrandsDesignSystem_6d0a65;
function Standards() {
  const phone = window.useIsPhone();
  return (
    <section style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", background: "var(--cream)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter)" : "var(--section-y) var(--gutter)", display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1.2fr"), gap: phone ? "var(--space-6)" : "var(--space-8)", alignItems: "start" }}>
        <div style={{ display: "grid", gap: "var(--space-4)" }}>
          <Eyebrow>Standards</Eyebrow>
          <h2 style={{ fontSize: "var(--display-3)" }}>Made carefully, in small batches.</h2>
          <p style={{ color: "var(--ink-2)", fontSize: "var(--text-small)", maxWidth: "var(--measure)" }}>Mixed and filled in Cairo. Every batch is checked before it is boxed, and the jar carries its period-after-opening on the lid.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "repeat(3,1fr)"), gap: "var(--space-5)" }}>
          <FeatureColumn tone="light" icon="flask-conical" title="Small batches">Mixed in Cairo, checked before boxing.</FeatureColumn>
          <FeatureColumn tone="light" icon="shield-check" title="12 months">Period after opening, marked on the lid.</FeatureColumn>
          <FeatureColumn tone="light" icon="truck" title="Cash on delivery">Anywhere in Egypt, 2–4 days.</FeatureColumn>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { StrandsStandards: Standards });
