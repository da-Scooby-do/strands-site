const { DamaskPanel, Eyebrow, FeatureColumn } = window.StrandsDesignSystem_6d0a65;
function Statement() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  return (
    <div id="how-to-use">
      <DamaskPanel pad={phone ? "var(--section-y-mobile) var(--gutter)" : undefined}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)", display: "grid", gap: phone ? "var(--space-6)" : "var(--space-7)" }}>
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <Eyebrow tone="lilac">{ar ? "ثلاث طرق للاستخدام" : "Three ways to use it"}</Eyebrow>
            <h2 style={{ color: "var(--white)", fontSize: phone ? "var(--display-3)" : "var(--display-1)", maxWidth: "24ch" }}>{ar ? "علبة واحدة تكفي الأسبوع كله، مهما كانت طريقة غسيلك." : "One jar covers the whole week, however you wash."}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "repeat(3,1fr)"), gap: phone ? "var(--space-5)" : "var(--space-7)" }}>
            <FeatureColumn icon="droplet" title={ar ? "قبل الغسيل" : "Pre-wash"}>{ar ? "حطّيه على شعر مبلول، سيبيه لحد ساعتين، وبعدين اغسليه بالشامبو." : "Apply to damp hair, leave for up to 2 hours, then shampoo."}</FeatureColumn>
            <FeatureColumn icon="sparkles" title={ar ? "بدل البلسم" : "As a conditioner"}>{ar ? "بعد الشامبو، حطّيه، سيبيه ١٠ دقايق، وبعدين اشطفيه كويس." : "After shampooing, apply, leave 10 minutes, then rinse thoroughly."}</FeatureColumn>
            <FeatureColumn icon="clock" title={ar ? "عناية عميقة" : "Deep care"}>{ar ? "شعر نضيف ومبلول، من ٣٠ لـ ٦٠ دقيقة، وبعدين اشطفيه بمياه فاترة." : "Clean, damp hair, 30 to 60 minutes, then rinse with lukewarm water."}</FeatureColumn>
          </div>
        </div>
      </DamaskPanel>
    </div>
  );
}
Object.assign(window, { StrandsStatement: Statement });
