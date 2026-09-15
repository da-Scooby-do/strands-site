const { DamaskPanel, Wordmark, NewsletterField, Icon } = window.StrandsDesignSystem_6d0a65;
const IG_URL = "https://www.instagram.com/strandsbynour";
const IG_HANDLE = "@strandsbynour";
const TIKTOK_URL = "https://www.tiktok.com/@strandbynour";
const TIKTOK_HANDLE = "@strandbynour";
// Lucide (the page's icon set) has no TikTok brand mark, so render one inline.
function TikTokGlyph({ size = 18 }) {
  return (
    <span style={{ display: "inline-flex", width: size, height: size, flex: "none" }} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M16.5 3c.32 2.06 1.6 3.55 3.5 3.79v2.34c-1.18.06-2.36-.28-3.5-1v6.16c0 3.28-2.6 5.71-5.72 5.71A5.5 5.5 0 0 1 5.3 14.02c0-3.13 2.74-5.53 6.04-5.1v2.5c-.43-.13-.9-.2-1.35-.14-1.35.16-2.32 1.22-2.24 2.68a2.43 2.43 0 0 0 2.48 2.3c1.46 0 2.57-1.16 2.57-2.66V3h1.7z"/></svg>
    </span>
  );
}
function Footer() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  const C = window.copy;
  const stores = [
    { name: C("stores.s1.name", "Sheel Store", "متجر شيل"), map: "https://maps.app.goo.gl/ZTiPDXJc2wc2efy48" },
    { name: C("stores.s2.name", "Madinaty — Craft Zone, Block 6", "مدينتي — كرافت زون، بلوك ٦"), map: "https://maps.app.goo.gl/pqCYUzCYoNH7VbAj8", phone: "+20 104 488 2958" },
  ];
  const cols = [
    { h: C("footer.shop", "Shop", "المتجر"), links: [
      { t: C("footer.link.masque", "Velvet Touch Masque", "ماسك فيلفيت تاتش"), href: "#the-masque" },
    ] },
    { h: C("footer.help", "Help", "مساعدة"), links: [
      { t: C("footer.link.shipping", "Shipping", "الشحن"), href: "#the-masque" },
      { t: C("footer.link.returns", "Returns", "الإرجاع"), href: "#the-masque" },
      { t: C("footer.link.contact", "Contact us", "تواصلي معنا"), href: IG_URL, ext: true },
    ] },
    { h: C("footer.about", "About", "عن Strands"), links: [
      { t: C("footer.link.story", "Our story", "قصتنا"), href: "#story" },
      { t: C("footer.link.ingredients", "Ingredients", "المكونات"), href: "#ingredients" },
      { t: C("footer.link.reviews", "Reviews", "الآراء"), href: "#reviews" },
    ] },
  ];
  return (
    <div>
      <DamaskPanel contrast={0.14} pad="var(--space-8) var(--gutter) var(--space-6)">
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "grid", gap: "var(--space-7)" }}>
          <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1.2fr repeat(3,1fr) 1.2fr"), gap: "var(--space-6)" }}>
            <div style={{ display: "grid", gap: "var(--space-4)", alignContent: "start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><img src="../../assets/brand/emblem.svg" alt="" aria-hidden="true" width={40} height={40} style={{ display: "block", flex: "0 0 auto" }} /><Wordmark size={24} color="var(--green-tint)" align="start" /></div>
              <a href={IG_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--white)", borderBottom: "none", fontSize: "var(--text-small)" }}>
                <Icon name="instagram" size={18} /> {IG_HANDLE}
              </a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--white)", borderBottom: "none", fontSize: "var(--text-small)" }}>
                <TikTokGlyph size={18} /> {TIKTOK_HANDLE}
              </a>
            </div>
            {cols.map((c) => (
              <div key={c.h} style={{ display: "grid", gap: "var(--space-3)", alignContent: "start" }}>
                <span style={{ fontSize: "var(--text-eyebrow-size)", letterSpacing: "var(--track-eyebrow)", textTransform: "uppercase", color: "var(--green-on-anchor)" }}>{c.h}</span>
                {c.links.map((l) => <a key={l.t} href={l.href}
                  {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  style={{ fontSize: "var(--text-small)", color: "var(--white)", borderBottom: "none" }}>{l.t}</a>)}
              </div>
            ))}
            <div style={{ display: "grid", gap: "var(--space-3)", alignContent: "start" }}>
              <span style={{ fontSize: "var(--text-eyebrow-size)", letterSpacing: "var(--track-eyebrow)", textTransform: "uppercase", color: "var(--green-on-anchor)" }}>{window.copy("footer.newsletter", "Newsletter", "النشرة")}</span>
              <NewsletterField />
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border-hairline-anchor)", paddingTop: "var(--space-5)", display: "grid", gap: "var(--space-4)" }}>
            <span style={{ fontSize: "var(--text-eyebrow-size)", letterSpacing: "var(--track-eyebrow)", textTransform: "uppercase", color: "var(--green-on-anchor)" }}>{C("stores.heading", "Where to buy", "أماكن البيع")}</span>
            <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "var(--space-5) var(--space-6)" }}>
              {stores.map((s) => (
                <div key={s.name} style={{ display: "grid", gap: "var(--space-2)", alignContent: "start" }}>
                  <span style={{ fontSize: "var(--text-small)", color: "var(--white)", fontWeight: 600 }}>{s.name}</span>
                  <a href={s.map} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--green-on-anchor)", borderBottom: "none", fontSize: "var(--text-small)" }}>
                    <Icon name="map-pin" size={16} /> {C("stores.directions", "Get directions", "الاتجاهات")}
                  </a>
                  {s.phone && (
                    <a href={"tel:" + s.phone.replace(/\s+/g, "")} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--green-on-anchor)", borderBottom: "none", fontSize: "var(--text-small)", direction: "ltr" }}>
                      <Icon name="phone" size={16} /> {s.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border-hairline-anchor)", paddingTop: "var(--space-4)", display: "flex", flexWrap: "wrap", gap: "var(--space-3) var(--space-5)", fontSize: "var(--text-fine-size)", color: "var(--green-on-anchor)" }}>
            <span>{window.copy("footer.copyright", "© 2026 Strands Hair Care", "© 2026 Strands Hair Care")}</span><a href={IG_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--green-on-anchor)", borderBottom: "none" }}>{IG_HANDLE}</a><span style={{ marginInlineStart: "auto" }}>{window.copy("footer.legal", "Privacy · Terms", "الخصوصية · الشروط")}</span>
          </div>
        </div>
      </DamaskPanel>
      <div style={{ background: "var(--purple)", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", padding: phone ? "var(--space-6) var(--gutter)" : "var(--space-7) var(--gutter)" }}>
        {/* clamp keeps the whole word on screen (Aquilla "STRANDS" ≈ 4.53× the font size) so it stays centred; leaf green reads on the purple. */}
        <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(44px, 18vw, 168px)", lineHeight: 0.9, letterSpacing: ".04em", whiteSpace: "nowrap", color: "var(--green-on-anchor)" }}>STRANDS</span>
      </div>
      <div style={{ background: "var(--purple)", borderTop: "1px solid var(--border-hairline-anchor)", padding: "var(--space-4) var(--gutter)", textAlign: "center" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-fine-size)", color: "var(--green-on-anchor)" }}>
          {ar ? "تطوير " : "Developed by "}
          <a href="https://my-portfolio-ecru-three-47.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--white)", borderBottom: "1px solid var(--green-on-anchor)", fontWeight: 600 }}>Scooby</a>
        </span>
      </div>
    </div>
  );
}
Object.assign(window, { StrandsFooter: Footer });
