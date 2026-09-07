const { Wordmark, Button, IconButton, LanguageToggle } = window.StrandsDesignSystem_6d0a65;
const NAV = [
  { en: "The Masque", ar: "الماسك", href: "#the-masque" },
  { en: "Ingredients", ar: "المكونات", href: "#ingredients" },
  { en: "How to use", ar: "طريقة الاستخدام", href: "#how-to-use" },
  { en: "Reviews", ar: "الآراء", href: "#reviews" },
];
function Header({ onBuy, onCart, cart }) {
  const phone = window.useIsPhone();
  const lang = window.useLang();
  const ar = lang === "AR";
  const [stuck, setStuck] = React.useState(false);
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
          {!phone && <Button size="sm" onClick={onBuy}>{ar ? "أضيفي للسلة" : "Add to cart"}</Button>}
        </div>
      </div>
    </header>
  );
}
Object.assign(window, { StrandsHeader: Header });
