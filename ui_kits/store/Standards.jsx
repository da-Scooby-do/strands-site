const { FeatureColumn } = window.StrandsDesignSystem_6d0a65;
function Standards() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  return (
    <section id="story" style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", background: "var(--cream)", scrollMarginTop: 72 }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter)" : "var(--section-y) var(--gutter)" }}>
        <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "repeat(2,1fr)"), gap: phone ? "var(--space-5)" : "var(--space-7)", maxWidth: 680, margin: "0 auto" }}>
          <FeatureColumn tone="light" icon="shield-check" title={window.copy("standards.f1.title", "12 months", "١٢ شهر")}>{window.copy("standards.f1.body", "Period after opening, marked on the lid.", "مدة الصلاحية بعد الفتح، مكتوبة على الغطا.")}</FeatureColumn>
          <FeatureColumn tone="light" icon="truck" title={window.copy("standards.f2.title", "Cash on delivery", "الدفع عند الاستلام")}>{window.copy("standards.f2.body", "Anywhere in Egypt, 4–6 working days.", "في أي مكان في مصر، من ٤ لـ ٦ أيام عمل.")}</FeatureColumn>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { StrandsStandards: Standards });
