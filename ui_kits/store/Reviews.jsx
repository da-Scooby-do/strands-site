const { StarRating, RatingHistogram, SearchField, Chip, Select, ReviewCard, Pagination } = window.StrandsDesignSystem_6d0a65;
const TOPICS = [
  { v: "texture", en: "texture", ar: "القوام" },
  { v: "smell", en: "smell", ar: "الريحة" },
  { v: "results", en: "results", ar: "النتيجة" },
  { v: "packaging", en: "packaging", ar: "التغليف" },
];
const ALL = [
  { name: "Mariam A.", nameAr: "مريم أ.", rating: 5, date: "12/08/2026", title: "My hair felt soft for days", titleAr: "شعري فضل ناعم لأيام", body: "I used it as a pre-wash twice and the difference held through the week. The comb goes straight through now.", bodyAr: "استخدمته قبل الغسيل مرتين والفرق فضل طول الأسبوع. المشط بقى بيعدّي على طول.", helpful: 12, notHelpful: 0, topic: "results" },
  { name: "Salma R.", nameAr: "سلمى ر.", rating: 5, date: "04/08/2026", title: "The scent is light, which I wanted", titleAr: "الريحة خفيفة، وده اللي كنت عايزاه", body: "Nothing heavy or perfumed. It is gone by the time my hair dries.", bodyAr: "مفيش حاجة تقيلة ولا عطرية. بتروح لما الشعر ينشف.", helpful: 7, notHelpful: 1, topic: "smell" },
  { name: "Habiba K.", nameAr: "حبيبة ك.", rating: 4, date: "29/07/2026", title: "Thick but spreads easily", titleAr: "تقيل بس بينفرد بسهولة", body: "A little goes a long way on my hair. I use it instead of conditioner most washes.", bodyAr: "كمية صغيرة بتكفي شعري. بستخدمه بدل البلسم في معظم الغسلات.", helpful: 5, notHelpful: 0, topic: "texture" },
  { name: "Yara M.", nameAr: "يارا م.", rating: 5, date: "21/07/2026", title: "The box arrived perfectly", titleAr: "العلبة وصلت بحالة ممتازة", body: "Packed well and the card inside was a nice touch. Delivery took three days to Alexandria.", bodyAr: "متغلّفة كويس والكارت اللي جوه كان لمسة حلوة. التوصيل خد تلات أيام للإسكندرية.", helpful: 3, notHelpful: 0, topic: "packaging" },
];
function Reviews() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  const [q, setQ] = React.useState("");
  const [topic, setTopic] = React.useState(null);
  const [sort, setSort] = React.useState("recent");
  const [page, setPage] = React.useState(1);
  const list = ALL.filter((r) => (!topic || r.topic === topic) && (r.title + r.body + r.titleAr + r.bodyAr).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === "rating" ? b.rating - a.rating : 0));
  return (
    <section id="reviews" style={{ background: "var(--cream)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter)" : "var(--section-y) var(--gutter)", display: "grid", gap: "var(--space-6)" }}>
        <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: phone ? "var(--space-5)" : "var(--space-8)", alignItems: "center" }}>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <h2 style={{ fontSize: phone ? "var(--display-3)" : "var(--display-2)" }}>{ar ? "رأي المشترين." : "What buyers say."}</h2>
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-4)" }}>
              <span style={{ fontFamily: "var(--font-numeric)", fontSize: 48, fontWeight: 500 }}>4.6</span>
              <div style={{ display: "grid", gap: 4 }}><StarRating value={4.6} size={16} /><span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>{ar ? "من ٣٨ تقييم" : "Based on 38 reviews"}</span></div>
            </div>
          </div>
          <RatingHistogram counts={[1, 0, 2, 7, 28]} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "260px 1fr auto"), gap: "var(--space-4)", alignItems: phone ? "stretch" : "center" }}>
          <SearchField value={q} onChange={setQ} placeholder={ar ? "ابحثي في الآراء" : "Search reviews"} />
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {TOPICS.map((t) => <Chip key={t.v} selected={topic === t.v} onClick={() => setTopic(topic === t.v ? null : t.v)}>{ar ? t.ar : t.en}</Chip>)}
          </div>
          <Select value={sort} onChange={setSort} options={[{ value: "recent", label: ar ? "الأحدث" : "Most recent" }, { value: "rating", label: ar ? "الأعلى تقييمًا" : "Highest rated" }]} />
        </div>
        <div style={{ borderBottom: "1px solid var(--rule)" }}>
          {list.map((r) => <ReviewCard key={r.name} name={ar ? r.nameAr : r.name} rating={r.rating} date={r.date} title={ar ? r.titleAr : r.title} helpful={r.helpful} notHelpful={r.notHelpful}>{ar ? r.bodyAr : r.body}</ReviewCard>)}
          {list.length === 0 && <p style={{ padding: "var(--space-6) 0", color: "var(--ink-2)", fontSize: "var(--text-small)" }}>{ar ? "مفيش آراء مطابقة للفلتر ده لسه." : "No reviews match that filter yet."}</p>}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}><Pagination page={page} pages={4} onChange={setPage} /></div>
      </div>
    </section>
  );
}
Object.assign(window, { StrandsReviews: Reviews });
