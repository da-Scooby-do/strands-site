const { Card, Eyebrow } = window.StrandsDesignSystem_6d0a65;
function ClaimSplit() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  const points = ar ? [
    { k: "القوام", v: "بلسم غني بينفرد من غير شد — بيفك التشابك وإنتي بتوزعيه." },
    { k: "الريحة", v: "زيت عطري خفيف، بيروح لما الشعر ينشف." },
    { k: "مناسب لـ", v: "كل أنواع الشعر. صالح ١٢ شهر بعد الفتح." },
  ] : [
    { k: "Texture", v: "A thick balm that spreads without pulling — it detangles as you work it through." },
    { k: "Scent", v: "A light fragrance oil, gone by the time your hair dries." },
    { k: "Suitability", v: "For all hair types. 12 months after opening." },
  ];
  return (
    <section style={{ background: "var(--cream)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter)" : "var(--section-y) var(--gutter)", display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: phone ? "var(--space-5)" : "var(--space-7)", alignItems: "stretch" }}>
        <div style={{ background: "var(--purple-tint)", borderRadius: "var(--radius-card)", minHeight: phone ? 240 : 380, overflow: "hidden" }}>
          <img src="../../assets/photography/jar-and-gift-bag.jpg" alt={ar ? "الماسك وكيس الهدية" : "The masque and its gift bag"} style={{ width: "100%", height: "100%", minHeight: phone ? 300 : 380, objectFit: "cover", objectPosition: "center 38%", display: "block" }} />
        </div>
        <Card tone="green" pad={phone ? "var(--space-5)" : "var(--space-7)"} style={{ display: "grid", gap: "var(--space-5)", alignContent: "center" }}>
          <Eyebrow>{ar ? "الماسك" : "The masque"}</Eyebrow>
          <h2 style={{ fontSize: phone ? "var(--display-3)" : "var(--display-2)" }}>{ar ? "مصنوع بكميات صغيرة في القاهرة." : "Made in small batches in Cairo."}</h2>
          <div>
            {points.map((p, i) => (
              <div key={p.k} style={{ display: "grid", gridTemplateColumns: window.cols(phone, "120px 1fr"), gap: phone ? "var(--space-1)" : "var(--space-4)", padding: "var(--space-4) 0", borderTop: i ? "1px solid rgba(87,117,55,.2)" : "none" }}>
                <span style={{ fontSize: "var(--text-fine-size)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--green)" }}>{p.k}</span>
                <span style={{ fontSize: "var(--text-small)", color: "var(--ink)", lineHeight: 1.6 }}>{p.v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
Object.assign(window, { StrandsClaimSplit: ClaimSplit });
