const { ProductGallery, Chip, StarRating, PriceBlock, Button, CollapsibleRow, BundleCard } = window.StrandsDesignSystem_6d0a65;

function egp(n) { return (n == null ? "—" : (n | 0).toLocaleString("en-US")) + " EGP"; }

/* product + variants come from the database (owner-controlled in the dashboard).
   Nothing here is a hardcoded price. */
function Hero({ onAdd, added, product, variants }) {
  const phone = window.useIsPhone();
  const [open, setOpen] = React.useState(0);

  const v1 = (variants || []).find((v) => v.jars === 1) || (variants || [])[0];
  const v2 = (variants || []).find((v) => v.jars === 2);
  const price1 = v1 ? v1.price_egp : (product ? product.price_egp : null);

  const rows = [
    { title: "Benefits", body: "Softer, fuller hair with the frizz settled. Detangles as it works. Suits all hair types." },
    { title: "Ingredients", body: (product && product.ingredients_en) || "Mango butter · Jojoba oil · Safflower oil · Flaxseed gel · Hibiscus extract · Vitamin E · Panthenol · Fragrance oil · Preservative" },
    { title: "How to use", body: "Three ways — as a pre-wash treatment, in place of your conditioner, or as a 30–60 minute deep-care mask." },
    { title: "Shipping & returns", body: "Cash on delivery across Egypt, 2–4 days. Unopened jars can be returned within 14 days." },
  ];

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
        <div><Chip tone="green">Hair masque · {(product && product.size_ml) || 300} ml</Chip></div>
        <h1 style={{ fontSize: phone ? 32 : 44, lineHeight: 1.1 }}>{(product && product.name_en) || "Velvet Touch Masque"}</h1>
        <StarRating value={4.6} count={38} />
        <p style={{ color: "var(--ink-2)", fontSize: "var(--text-body-size)", maxWidth: "42ch" }}>
          {(product && product.tagline_en) || "A nine-ingredient mask built around mango butter and flaxseed gel. For soft, fluffy and hydrated hair — all hair types."}
        </p>
        <PriceBlock price={price1 == null ? "—" : price1} note="Cash on delivery, 2–4 days across Egypt." />
        <Button fullWidth onClick={() => onAdd(v1 ? v1.key : "1jar")}>{added ? "Added to cart" : price1 == null ? "Add to cart" : "Add to cart — " + egp(price1)}</Button>
        <div style={{ borderBottom: "1px solid var(--rule)" }}>
          {rows.map((r, i) => (
            <CollapsibleRow key={r.title} title={r.title} open={open === i} onToggle={(n) => setOpen(n ? i : -1)}>{r.body}</CollapsibleRow>
          ))}
        </div>
        {v2 && <BundleCard title={"2 jars — save " + (v2.save_egp || 0) + " EGP"} saving={v2.badge_en || "Bundle"} price={egp(v2.price_egp)} onAdd={() => onAdd(v2.key)} />}
      </div>
    </section>
  );
}
Object.assign(window, { StrandsHero: Hero });
