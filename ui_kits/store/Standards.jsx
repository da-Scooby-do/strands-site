const { Eyebrow, FeatureColumn } = window.StrandsDesignSystem_6d0a65;
function Standards() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  return (
    <section id="story" style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", background: "var(--cream)", scrollMarginTop: 72 }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter)" : "var(--section-y) var(--gutter)", display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1.2fr"), gap: phone ? "var(--space-6)" : "var(--space-8)", alignItems: "start" }}>
        <div style={{ display: "grid", gap: "var(--space-4)" }}>
          <Eyebrow>{ar ? "معاييرنا" : "Standards"}</Eyebrow>
          <h2 className="strands-hgrad" style={{ fontSize: "var(--display-3)" }}>{ar ? "مصنوع بعناية، بكميات صغيرة." : "Made carefully, in small batches."}</h2>
          <p style={{ color: "var(--ink-2)", fontSize: "var(--text-small)", maxWidth: "var(--measure)" }}>{ar ? "بيتخلط ويتعبّى في القاهرة. كل دفعة بتتفحص قبل ما تتعبّى، والعلبة مكتوب عليها مدة الصلاحية بعد الفتح على الغطا." : "Mixed and filled in Cairo. Every batch is checked before it is boxed, and the jar carries its period-after-opening on the lid."}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "repeat(3,1fr)"), gap: "var(--space-5)" }}>
          <FeatureColumn tone="light" icon="flask-conical" title={ar ? "كميات صغيرة" : "Small batches"}>{ar ? "بتتخلط في القاهرة، وبتتفحص قبل التعبئة." : "Mixed in Cairo, checked before boxing."}</FeatureColumn>
          <FeatureColumn tone="light" icon="shield-check" title={ar ? "١٢ شهر" : "12 months"}>{ar ? "مدة الصلاحية بعد الفتح، مكتوبة على الغطا." : "Period after opening, marked on the lid."}</FeatureColumn>
          <FeatureColumn tone="light" icon="truck" title={ar ? "الدفع عند الاستلام" : "Cash on delivery"}>{ar ? "في أي مكان في مصر، من ٢ لـ ٤ أيام." : "Anywhere in Egypt, 2–4 days."}</FeatureColumn>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { StrandsStandards: Standards });
