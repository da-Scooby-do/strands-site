const { ProductGallery, Chip, StarRating, PriceBlock, Button, CollapsibleRow, BundleCard } = window.StrandsDesignSystem_6d0a65;

/* product + variants come from the database (owner-controlled in the dashboard).
   Nothing here is a hardcoded price; copy switches EN/AR with the language toggle. */
function Hero({ onAdd, added, product, variants, status }) {
  const phone = window.useIsPhone();
  const lang = window.useLang();
  const ar = lang === "AR";
  const [open, setOpen] = React.useState(0);
  const [rev, setRev] = React.useState({ avg: 0, count: 0 });
  React.useEffect(() => {
    if (!window.SB_READY) return;
    window.sb.from("reviews").select("rating").eq("published", true).then(({ data }) => {
      if (data && data.length) { const c = data.length; const a = Math.round((data.reduce((s, r) => s + (r.rating || 5), 0) / c) * 10) / 10; setRev({ avg: a, count: c }); }
    });
  }, []);

  const v1 = (variants || []).find((v) => v.jars === 1) || (variants || [])[0];
  const v2 = (variants || []).find((v) => v.jars === 2);
  const price1 = v1 ? v1.price_egp : (product ? product.price_egp : null);
  const outOfStock = !!(product && (product.in_stock === false || (product.stock != null && product.stock <= 0)));
  const size = (product && product.size_ml) || 300;
  const name = product ? (ar ? product.name_ar : product.name_en) : (ar ? "ماسك فيلفيت تاتش" : "Velvet Touch Masque");
  const tagline = product ? (ar ? product.tagline_ar : product.tagline_en) : "";

  const ingredientList = (product && (ar ? product.ingredients_ar : product.ingredients_en)) ||
    (ar ? "زبدة المانجو · زيت الجوجوبا · زيت القرطم · جل بذور الكتان · منقوع الكركديه · فيتامين هـ · بانثينول · زيت عطري · مادة حافظة"
        : "Mango butter · Jojoba oil · Safflower oil · Flaxseed gel · Hibiscus extract · Vitamin E · Panthenol · Fragrance oil · Preservative");
  const rows = [
    { title: window.copy("hero.row.benefits.t", "Benefits", "الفوائد"), body: window.copy("hero.row.benefits.b", "Softer, fuller hair with the frizz settled. Detangles as it works. Suits all hair types.", "شعر أنعم وأكثف والهيشان يهدأ. بيفك التشابك وهو بيشتغل. مناسب لكل أنواع الشعر.") },
    { title: window.copy("hero.row.ingredients.t", "Ingredients", "المكونات"), body: ingredientList },
    { title: window.copy("hero.row.howto.t", "How to use", "طريقة الاستخدام"), body: window.copy("hero.row.howto.b", "Three ways — as a pre-wash treatment, in place of your conditioner, or as a 30–60 minute deep-care mask.", "بثلاث طرق — قبل الغسيل، بدل البلسم، أو كماسك عناية عميقة من ٣٠ لـ ٦٠ دقيقة.") },
    { title: window.copy("hero.row.shipping.t", "Shipping & returns", "الشحن والإرجاع"), body: window.copy("hero.row.shipping.b", "Cash on delivery across Egypt, 4–6 working days. Unopened jars can be returned within 14 days.", "الدفع عند الاستلام في كل مصر، من ٤ لـ ٦ أيام عمل. العلب غير المفتوحة تترجّع خلال ١٤ يوم.") },
  ];

  return (
    <section id="the-masque" style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--space-6) var(--gutter)" : "var(--space-8) var(--gutter)", display: "grid", gridTemplateColumns: window.cols(phone, "60fr 40fr"), gap: phone ? "var(--space-5)" : "var(--space-8)", alignItems: "start" }}>
      <ProductGallery ratio={phone ? "1 / 1" : "4 / 5"} images={[
        { label: ar ? "العلبة" : "The jar", src: "../../assets/photography/jar-in-hands.jpg", position: phone ? "center 78%" : "center 62%" },
        { label: ar ? "ثلاث علب" : "Three jars", src: "../../assets/photography/three-jars.jpg", position: phone ? "center 62%" : "center 55%" },
        { label: ar ? "كيس الهدية" : "The gift bag", src: "../../assets/photography/gift-bag.jpg", position: "center 55%" },
        { label: ar ? "القوام" : "Texture", src: "../../assets/photography/texture.jpg" },
      ]} />
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        <div><Chip tone="green">{window.copy("hero.chip", "Hair masque", "ماسك شعر") + " · " + size + " " + (ar ? "مل" : "ml")}</Chip></div>
        <h1 className="strands-hgrad" style={{ fontSize: phone ? 32 : 44, lineHeight: 1.1 }}>{name}</h1>
        {rev.count > 0 && <StarRating value={rev.avg} count={rev.count} />}
        <p style={{ color: "var(--ink-2)", fontSize: "var(--text-body-size)", maxWidth: "42ch" }}>
          {tagline || window.copy("hero.tagline", "A nine-ingredient mask built around mango butter and flaxseed gel. For soft, fluffy and hydrated hair — all hair types.", "ماسك من تسع مكونات حول زبدة المانجو وجل بذور الكتان. لشعر ناعم ومنفوش ومرطّب — لكل أنواع الشعر.")}
        </p>
        {price1 != null
          ? <PriceBlock price={price1} note={window.copy("hero.priceNote", "Cash on delivery, 4–6 working days across Egypt.", "الدفع عند الاستلام، من ٤ لـ ٦ أيام عمل في كل مصر.")} />
          : status === "error"
            ? <div style={{ fontSize: "var(--text-body-size)", color: "var(--ink-2)" }}>{window.copy("hero.priceError", "Price couldn’t load — tap Retry at the top of the page.", "السعر ماحمّلش — دوسي إعادة المحاولة فوق.")}</div>
            : <div aria-live="polite" style={{ fontFamily: "var(--font-numeric)", fontSize: 32, fontWeight: 500, color: "var(--ink-2)" }}>{window.copy("hero.priceLoading", "Loading price…", "بيحمّل السعر…")}</div>}
        <Button fullWidth disabled={price1 == null || outOfStock} onClick={() => onAdd(v1 ? v1.key : "1jar")}>
          {outOfStock ? window.copy("cta.outofstock", "Out of stock", "خلص من المخزون")
            : added ? window.copy("hero.added", "Added to cart", "تمت الإضافة")
            : price1 == null ? (status === "error" ? window.copy("cta.unavailable", "Unavailable", "غير متاح") : window.copy("cta.loading", "Loading…", "بيحمّل…"))
            : (window.copy("cta.add", "Add to cart", "أضيفي للسلة") + " — " + window.money(price1))}
        </Button>
        <div style={{ borderBottom: "1px solid var(--rule)" }}>
          {rows.map((r, i) => (
            <CollapsibleRow key={r.title} title={r.title} open={open === i} onToggle={(n) => setOpen(n ? i : -1)}>{r.body}</CollapsibleRow>
          ))}
        </div>
        {v2 && <BundleCard
          title={ar ? ("علبتين — وفّري " + (v2.save_egp || 0) + " ج.م") : ("2 jars — save " + (v2.save_egp || 0) + " EGP")}
          saving={(ar ? v2.badge_ar : v2.badge_en) || (ar ? "الأكثر طلبًا" : "Bundle")}
          price={window.money(v2.price_egp)} onAdd={() => onAdd(v2.key)} />}
      </div>
    </section>
  );
}
Object.assign(window, { StrandsHero: Hero });
