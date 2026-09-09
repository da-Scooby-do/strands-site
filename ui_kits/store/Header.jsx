const { Wordmark, Button, IconButton, LanguageToggle } = window.StrandsDesignSystem_6d0a65;
const NAV = [
  { en: "The Masque", ar: "الماسك", href: "#the-masque" },
  { en: "Ingredients", ar: "المكونات", href: "#ingredients" },
  { en: "How to use", ar: "طريقة الاستخدام", href: "#how-to-use" },
  { en: "Reviews", ar: "الآراء", href: "#reviews" },
];
// Mobile hamburger menu — the short list the owner asked for.
const MENU = [
  { en: "Our story", ar: "قصتنا", href: "#story" },
  { en: "Ingredients", ar: "المكونات", href: "#ingredients" },
  { en: "Shop now", ar: "تسوّقي الآن", href: "#the-masque" },
];
function Header({ onBuy, onCart, cart }) {
  const phone = window.useIsPhone();
  const lang = window.useLang();
  const ar = lang === "AR";
  const [stuck, setStuck] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => { if (!phone) setMenuOpen(false); }, [phone]);
  React.useEffect(() => {
    const onScroll = () => setStuck((window.scrollY || document.documentElement.scrollTop || 0) > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--cream)", borderBottom: "1px solid var(--rule)", height: stuck ? 56 : 64, transition: "height var(--dur) var(--ease)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)", height: "100%", display: "flex", alignItems: "center", gap: phone ? "var(--space-3)" : "var(--space-6)" }}>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="Strands" style={{ display: "inline-flex", alignItems: "center", gap: phone ? 8 : 10, borderBottom: "none" }}>
          <img src="../../assets/brand/emblem.svg" alt="" aria-hidden="true" width={phone ? 26 : (stuck ? 30 : 34)} height={phone ? 26 : (stuck ? 30 : 34)} style={{ display: "block", flex: "0 0 auto", transition: "width var(--dur) var(--ease), height var(--dur) var(--ease)" }} />
          <Wordmark size={stuck ? 17 : 19} align="start" />
        </a>
        <nav style={{ display: phone ? "none" : "flex", gap: "var(--space-5)", marginInlineStart: "var(--space-5)" }}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} style={{ fontSize: "var(--text-small)", color: "var(--ink)", borderBottom: "none" }}>{ar ? n.ar : n.en}</a>
          ))}
        </nav>
        <div style={{ marginInlineStart: "auto", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          {!phone && <LanguageToggle value={window.langToggleValue()} onChange={window.setStrandsLang} />}
          <a href="../account/index.html" style={{ borderBottom: "none", display: "inline-flex" }}><IconButton name="user" label={ar ? "حسابك" : "Account"} /></a>
          <IconButton name="shopping-bag" label={ar ? "السلة" : "Cart"} badge={cart || undefined} onClick={onCart} />
          {phone && <LanguageToggle value={window.langToggleValue()} onChange={window.setStrandsLang} />}
          {phone && (
            <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-label={ar ? "القائمة" : "Menu"} aria-expanded={menuOpen}
              style={{ font: "inherit", width: 40, height: 40, display: "grid", placeItems: "center", background: menuOpen ? "var(--purple-tint)" : "transparent", border: "1px solid var(--rule)", borderRadius: "var(--radius-control)", color: "var(--ink)", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>
              {menuOpen ? "×" : "≡"}
            </button>
          )}
          {!phone && <Button size="sm" onClick={onBuy}>{ar ? "أضيفي للسلة" : "Add to cart"}</Button>}
        </div>
      </div>
      {phone && menuOpen && (
        <nav style={{ position: "absolute", insetInline: 0, top: "100%", background: "var(--cream)", borderBottom: "1px solid var(--rule)", boxShadow: "0 14px 26px rgba(42,31,42,.12)", padding: "var(--space-3) var(--gutter) var(--space-4)", display: "grid", gap: 2, zIndex: 21 }}>
          {MENU.map((m) => (
            <a key={m.en} href={m.href} onClick={() => setMenuOpen(false)}
              style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-size)", color: "var(--ink)", padding: "13px 8px", borderBottom: "none", borderRadius: "var(--radius-control)" }}>{ar ? m.ar : m.en}</a>
          ))}
        </nav>
      )}
    </header>
  );
}
Object.assign(window, { StrandsHeader: Header });
