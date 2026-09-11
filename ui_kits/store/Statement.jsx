const { DamaskPanel, Eyebrow, FeatureColumn } = window.StrandsDesignSystem_6d0a65;
function Statement() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  return (
    <div id="how-to-use">
      <DamaskPanel pad={phone ? "var(--section-y-mobile) var(--gutter)" : undefined}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)", display: "grid", gap: phone ? "var(--space-6)" : "var(--space-7)" }}>
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <Eyebrow tone="lilac">{window.copy("statement.eyebrow", "Three ways to use it", "ثلاث طرق للاستخدام")}</Eyebrow>
            <h2 style={{ color: "var(--white)", fontSize: phone ? "var(--display-3)" : "var(--display-1)", maxWidth: "24ch" }}>{window.copy("statement.heading", "One jar covers the whole week, however you wash.", "علبة واحدة تكفي الأسبوع كله، مهما كانت طريقة غسيلك.")}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "repeat(3,1fr)"), gap: phone ? "var(--space-5)" : "var(--space-7)" }}>
            <FeatureColumn icon="droplet" title={window.copy("statement.c1.title", "Pre-wash", "قبل الغسيل")}>{window.copy("statement.c1.body", "Apply to damp hair, leave for up to 2 hours, then shampoo.", "حطّيه على شعر مبلول، سيبيه لحد ساعتين، وبعدين اغسليه بالشامبو.")}</FeatureColumn>
            <FeatureColumn icon="sparkles" title={window.copy("statement.c2.title", "As a conditioner", "بدل البلسم")}>{window.copy("statement.c2.body", "After shampooing, apply, leave 10 minutes, then rinse thoroughly.", "بعد الشامبو، حطّيه، سيبيه ١٠ دقايق، وبعدين اشطفيه كويس.")}</FeatureColumn>
            <FeatureColumn icon="clock" title={window.copy("statement.c3.title", "Deep care", "عناية عميقة")}>{window.copy("statement.c3.body", "Clean, damp hair, 30 to 60 minutes, then rinse with lukewarm water.", "شعر نضيف ومبلول، من ٣٠ لـ ٦٠ دقيقة، وبعدين اشطفيه بمياه فاترة.")}</FeatureColumn>
          </div>
        </div>
      </DamaskPanel>
    </div>
  );
}
Object.assign(window, { StrandsStatement: Statement });
