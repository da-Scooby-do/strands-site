const { ProductGallery, Chip, StarRating, PriceBlock, Button, CollapsibleRow, BundleCard } = window.StrandsDesignSystem_6d0a65;
const HERO_ROWS = [
  { title: "Benefits", body: "Softer, fuller hair with the frizz settled. Detangles as it works. Suits all hair types." },
  { title: "Ingredients", body: "Mango butter · Jojoba oil · Safflower oil · Flaxseed gel · Hibiscus extract · Vitamin E · Panthenol · Fragrance oil · Preservative" },
  { title: "How to use", body: "Three ways — as a pre-wash treatment, in place of your conditioner, or as a 30–60 minute deep-care mask." },
  { title: "Shipping & returns", body: "Cash on delivery across Egypt, 2–4 days. Unopened jars can be returned within 14 days." },
];
function Hero({ onAdd, added }) {
  const phone = window.useIsPhone();
  const [open, setOpen] = React.useState(0);
  return (
    <section id="the-masque" style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--space-6) var(--gutter)" : "var(--space-8) var(--gutter)", display: "grid", gridTemplateColumns: window.cols(phone, "60fr 40fr"), gap: phone ? "var(--space-5)" : "var(--space-8)", alignItems: "start" }}>
      <ProductGallery ratio={phone ? "1 / 1" : "4 / 5"} images={[
        { label: "The jar", src: "../../assets/photography/jar-in-hands.jpg", position: phone ? "center 78%" : "center 62%" },
        { label: "Three jars", src: "../../assets/photography/three-jars.jpg", position: phone ? "center 62%" : "center 55%" },
        { label: "The gift bag", src: "../../assets/photography/gift-bag.jpg", position: "center 55%" },
        { label: "Texture", src: "../../assets/photography/texture.jpg" },
        { label: "Ingredients", src: "../../assets/photography/mango-butter-flaxseed.jpg", notes: [
          { text: "Mango butter", top: "26%", left: "6%", tilt: -6 },
          { text: "Flaxseed", top: "66%", left: "52%", tilt: 4, flip: true },
        ] },
      ]} />
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        <div><Chip tone="green">Hair masque · 300 ml</Chip></div>
        <h1 style={{ fontSize: phone ? 32 : 44, lineHeight: 1.1 }}>Velvet Touch Masque</h1>
        <StarRating value={4.6} count={38} />
        <p style={{ color: "var(--ink-2)", fontSize: "var(--text-body-size)", maxWidth: "42ch" }}>
          A nine-ingredient mask built around mango butter and flaxseed gel. For soft, fluffy and hydrated hair — all hair types.
        </p>
        <PriceBlock price={380} was={430} note="Cash on delivery, 2–4 days across Egypt." />
        <Button fullWidth onClick={onAdd}>{added ? "Added to cart" : "Add to cart — 380 EGP"}</Button>
        <div style={{ borderBottom: "1px solid var(--rule)" }}>
          {HERO_ROWS.map((r, i) => (
            <CollapsibleRow key={r.title} title={r.title} open={open === i} onToggle={(n) => setOpen(n ? i : -1)}>{r.body}</CollapsibleRow>
          ))}
        </div>
        <BundleCard title="2 jars — save 50 EGP" saving="Free delivery included" price="710 EGP" onAdd={onAdd} />
      </div>
    </section>
  );
}
Object.assign(window, { StrandsHero: Hero });
