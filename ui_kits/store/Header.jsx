const { Wordmark, Button, IconButton, LanguageToggle } = window.StrandsDesignSystem_6d0a65;
function Header({ onBuy, onCart, cart, lang, setLang }) {
  const phone = window.useIsPhone();
  const [stuck, setStuck] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setStuck((window.scrollY || document.documentElement.scrollTop || 0) > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const nav = ["The Masque", "Ingredients", "How to use", "Reviews"];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--cream)", borderBottom: "1px solid var(--rule)", height: stuck ? 56 : 64, transition: "height var(--dur) var(--ease)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)", height: "100%", display: "flex", alignItems: "center", gap: phone ? "var(--space-3)" : "var(--space-6)" }}>
        <Wordmark size={stuck ? 17 : 19} align="start" />
        <nav style={{ display: phone ? "none" : "flex", gap: "var(--space-5)", marginInlineStart: "var(--space-5)" }}>
          {nav.map((n) => (
            <a key={n} href={"#" + n.toLowerCase().replace(/ /g, "-")} style={{ fontSize: "var(--text-small)", color: "var(--ink)", borderBottom: "none" }}>{n}</a>
          ))}
        </nav>
        <div style={{ marginInlineStart: "auto", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          {!phone && <LanguageToggle value={lang} onChange={setLang} />}
          {!phone && <a href="../account/index.html" style={{ borderBottom: "none", display: "inline-flex" }}><IconButton name="user" label="Account" /></a>}
          <IconButton name="shopping-bag" label="Cart" badge={cart || undefined} onClick={onCart} />
          {!phone && <Button size="sm" onClick={onBuy}>Add to cart</Button>}
        </div>
      </div>
    </header>
  );
}
Object.assign(window, { StrandsHeader: Header });
