const { ProductGallery, Chip, StarRating, PriceBlock, Button, CollapsibleRow, BundleCard } = window.StrandsDesignSystem_6d0a65;

/* product + variants come from the database (owner-controlled in the dashboard).
   Nothing here is a hardcoded price; copy switches EN/AR with the language toggle. */
function Hero({ onAdd, added, product, variants }) {
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
  const size = (product && product.size_ml) || 300;
  const name = product ? (ar ? product.name_ar : product.name_en) : (ar ? "ماسك فيلفيت تاتش" : "Velvet Touch Masque");
  const tagline = product ? (ar ? product.tagline_ar : product.tagline_en) : "";

  const rows = ar ? [
    { title: "الفوائد", body: "شعر أنعم وأكثف والهيشان يهدأ. بيفك التشابك وهو بيشتغل. مناسب لكل أنواع الشعر." },
    { title: "المكونات", body: (product && product.ingredients_ar) || "زبدة المانجو · زيت الجوجوبا · زيت القرطم · جل بذور الكتان · منقوع الكركديه · فيتامين هـ · بانثينول · زيت عطري · مادة حافظة" },
    { title: "طريقة الاستخدام", body: "بثلاث طرق — قبل الغسيل، بدل البلسم، أو كماسك عناية عميقة من ٣٠ لـ ٦٠ دقيقة." },
    { title: "الشحن والإرجاع", body: "الدفع عند الاستلام في كل مصر، من ٢ لـ ٤ أيام. العلب غير المفتوحة تترجّع خلال ١٤ يوم." },
  ] : [
    { title: "Benefits", body: "Softer, fuller hair with the frizz settled. Detangles as it works. Suits all hair types." },
    { title: "Ingredients", body: (product && product.ingredients_en) || "Mango butter · Jojoba oil · Safflower oil · Flaxseed gel · Hibiscus extract · Vitamin E · Panthenol · Fragrance oil · Preservative" },
    { title: "How to use", body: "Three ways — as a pre-wash treatment, in place of your conditioner, or as a 30–60 minute deep-care mask." },
    { title: "Shipping & returns", body: "Cash on delivery across Egypt, 2–4 days. Unopened jars can be returned within 14 days." },
  ];

  return (
    <section id="the-masque" style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--space-6) var(--gutter)" : "var(--space-8) var(--gutter)", display: "grid", gridTemplateColumns: window.cols(phone, "60fr 40fr"), gap: phone ? "var(--space-5)" : "var(--space-8)", alignItems: "start" }}>
      <ProductGallery ratio={phone ? "1 / 1" : "4 / 5"} images={[
        { label: ar ? "العلبة" : "The jar", src: "../../assets/photography/jar-in-hands.jpg", position: phone ? "center 78%" : "center 62%" },
        { label: ar ? "ثلاث علب" : "Three jars", src: "../../assets/photography/three-jars.jpg", position: phone ? "center 62%" : "center 55%" },
        { label: ar ? "كيس الهدية" : "The gift bag", src: "../../assets/photography/gift-bag.jpg", position: "center 55%" },
        { label: ar ? "القوام" : "Texture", src: "../../assets/photography/texture.jpg" },
        { label: ar ? "المكونات" : "Ingredients", src: "../../assets/photography/mango-butter-flaxseed.jpg", notes: [
          { text: ar ? "زبدة المانجو" : "Mango butter", top: "26%", left: "6%", tilt: -6 },
          { text: ar ? "بذور الكتان" : "Flaxseed", top: "66%", left: "52%", tilt: 4, flip: true },
        ] },
      ]} />
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        <div><Chip tone="green">{ar ? ("ماسك شعر · " + size + " مل") : ("Hair masque · " + size + " ml")}</Chip></div>
        <h1 className="strands-hgrad" style={{ fontSize: phone ? 32 : 44, lineHeight: 1.1 }}>{name}</h1>
        {rev.count > 0 && <StarRating value={rev.avg} count={rev.count} />}
        <p style={{ color: "var(--ink-2)", fontSize: "var(--text-body-size)", maxWidth: "42ch" }}>
          {tagline || (ar ? "ماسك من تسع مكونات حول زبدة المانجو وجل بذور الكتان. لشعر ناعم ومنفوش ومرطّب — لكل أنواع الشعر." : "A nine-ingredient mask built around mango butter and flaxseed gel. For soft, fluffy and hydrated hair — all hair types.")}
        </p>
        <PriceBlock price={price1 == null ? "—" : price1} note={ar ? "الدفع عند الاستلام، من ٢ لـ ٤ أيام في كل مصر." : "Cash on delivery, 2–4 days across Egypt."} />
        <Button fullWidth onClick={() => onAdd(v1 ? v1.key : "1jar")}>
          {added ? (ar ? "تمت الإضافة" : "Added to cart") : price1 == null ? (ar ? "أضيفي للسلة" : "Add to cart") : (ar ? ("أضيفي للسلة — " + window.money(price1)) : ("Add to cart — " + window.money(price1)))}
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
