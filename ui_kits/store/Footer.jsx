const { DamaskPanel, Wordmark, NewsletterField, DisplayBand, Icon } = window.StrandsDesignSystem_6d0a65;
const IG_URL = "https://www.instagram.com/strandsbynour";
const IG_HANDLE = "@strandsbynour";
function Footer() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  const cols = ar ? [
    { h: "المتجر", links: ["ماسك فيلفيت تاتش", "عرض علبتين", "علبة الهدية"] },
    { h: "مساعدة", links: ["الشحن", "الإرجاع", "تواصلي معنا"] },
    { h: "عن Strands", links: ["قصتنا", "المكونات", "الآراء"] },
  ] : [
    { h: "Shop", links: ["Velvet Touch Masque", "2-jar bundle", "Gift box"] },
    { h: "Help", links: ["Shipping", "Returns", "Contact us"] },
    { h: "About", links: ["Our story", "Ingredients", "Reviews"] },
  ];
  return (
    <div>
      <DamaskPanel contrast={0.14} pad="var(--space-8) var(--gutter) var(--space-6)">
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "grid", gap: "var(--space-7)" }}>
          <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1.2fr repeat(3,1fr) 1.2fr"), gap: "var(--space-6)" }}>
            <div style={{ display: "grid", gap: "var(--space-4)", alignContent: "start" }}>
              <Wordmark size={24} color="var(--green-tint)" align="start" />
              <p style={{ color: "var(--lilac)", fontSize: "var(--text-small)", maxWidth: "26ch" }}>{ar ? "إدارة صاحبة العلامة في القاهرة. ماسك واحد، مصنوع بعناية." : "Owner-run in Cairo. One masque, made carefully."}</p>
              <a href={IG_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--white)", borderBottom: "none", fontSize: "var(--text-small)" }}>
                <Icon name="instagram" size={18} /> {IG_HANDLE}
              </a>
            </div>
            {cols.map((c) => (
              <div key={c.h} style={{ display: "grid", gap: "var(--space-3)", alignContent: "start" }}>
                <span style={{ fontSize: "var(--text-eyebrow-size)", letterSpacing: "var(--track-eyebrow)", textTransform: "uppercase", color: "var(--lilac)" }}>{c.h}</span>
                {c.links.map((l) => <a key={l} href="#" style={{ fontSize: "var(--text-small)", color: "var(--white)", borderBottom: "none" }}>{l}</a>)}
              </div>
            ))}
            <div style={{ display: "grid", gap: "var(--space-3)", alignContent: "start" }}>
              <span style={{ fontSize: "var(--text-eyebrow-size)", letterSpacing: "var(--track-eyebrow)", textTransform: "uppercase", color: "var(--lilac)" }}>{ar ? "النشرة" : "Newsletter"}</span>
              <NewsletterField />
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border-hairline-anchor)", paddingTop: "var(--space-4)", display: "flex", flexWrap: "wrap", gap: "var(--space-3) var(--space-5)", fontSize: "var(--text-fine-size)", color: "var(--lilac)" }}>
            <span>© 2026 Strands Hair Care</span><a href={IG_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--lilac)", borderBottom: "none" }}>{IG_HANDLE}</a><span style={{ marginInlineStart: "auto" }}>{ar ? "الخصوصية · الشروط" : "Privacy · Terms"}</span>
          </div>
        </div>
      </DamaskPanel>
      <DisplayBand size={phone ? 88 : 180} ground="var(--purple)" stroke="var(--lilac)">STRANDS</DisplayBand>
    </div>
  );
}
Object.assign(window, { StrandsFooter: Footer });
