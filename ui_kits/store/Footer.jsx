const { DamaskPanel, Wordmark, NewsletterField, Icon } = window.StrandsDesignSystem_6d0a65;
const IG_URL = "https://www.instagram.com/strandsbynour";
const IG_HANDLE = "@strandsbynour";
function Footer() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  const cols = ar ? [
    { h: "المتجر", links: ["ماسك فيلفيت تاتش"] },
    { h: "مساعدة", links: ["الشحن", "الإرجاع", "تواصلي معنا"] },
    { h: "عن Strands", links: ["قصتنا", "المكونات", "الآراء"] },
  ] : [
    { h: "Shop", links: ["Velvet Touch Masque"] },
    { h: "Help", links: ["Shipping", "Returns", "Contact us"] },
    { h: "About", links: ["Our story", "Ingredients", "Reviews"] },
  ];
  return (
    <div>
      <DamaskPanel contrast={0.14} pad="var(--space-8) var(--gutter) var(--space-6)">
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "grid", gap: "var(--space-7)" }}>
          <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1.2fr repeat(3,1fr) 1.2fr"), gap: "var(--space-6)" }}>
            <div style={{ display: "grid", gap: "var(--space-4)", alignContent: "start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><img src="../../assets/brand/emblem.svg" alt="" aria-hidden="true" width={40} height={40} style={{ display: "block", flex: "0 0 auto" }} /><Wordmark size={24} color="var(--green-tint)" align="start" /></div>
              <p style={{ color: "var(--green-on-anchor)", fontSize: "var(--text-small)", maxWidth: "26ch" }}>{ar ? "إدارة صاحبة العلامة في القاهرة. ماسك واحد، مصنوع بعناية." : "Owner-run in Cairo. One masque, made carefully."}</p>
              <a href={IG_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--white)", borderBottom: "none", fontSize: "var(--text-small)" }}>
                <Icon name="instagram" size={18} /> {IG_HANDLE}
              </a>
            </div>
            {cols.map((c) => (
              <div key={c.h} style={{ display: "grid", gap: "var(--space-3)", alignContent: "start" }}>
                <span style={{ fontSize: "var(--text-eyebrow-size)", letterSpacing: "var(--track-eyebrow)", textTransform: "uppercase", color: "var(--green-on-anchor)" }}>{c.h}</span>
                {c.links.map((l) => <a key={l} href="#" style={{ fontSize: "var(--text-small)", color: "var(--white)", borderBottom: "none" }}>{l}</a>)}
              </div>
            ))}
            <div style={{ display: "grid", gap: "var(--space-3)", alignContent: "start" }}>
              <span style={{ fontSize: "var(--text-eyebrow-size)", letterSpacing: "var(--track-eyebrow)", textTransform: "uppercase", color: "var(--green-on-anchor)" }}>{ar ? "النشرة" : "Newsletter"}</span>
              <NewsletterField />
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border-hairline-anchor)", paddingTop: "var(--space-4)", display: "flex", flexWrap: "wrap", gap: "var(--space-3) var(--space-5)", fontSize: "var(--text-fine-size)", color: "var(--green-on-anchor)" }}>
            <span>© 2026 Strands Hair Care</span><a href={IG_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--green-on-anchor)", borderBottom: "none" }}>{IG_HANDLE}</a><span style={{ marginInlineStart: "auto" }}>{ar ? "الخصوصية · الشروط" : "Privacy · Terms"}</span>
          </div>
        </div>
      </DamaskPanel>
      <div style={{ background: "var(--purple)", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", padding: "var(--space-7) 0" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: phone ? 88 : 180, lineHeight: 0.9, letterSpacing: ".06em", whiteSpace: "nowrap", color: "var(--green)", textIndent: ".06em" }}>STRANDS</span>
      </div>
    </div>
  );
}
Object.assign(window, { StrandsFooter: Footer });
