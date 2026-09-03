const { StarRating, RatingHistogram, SearchField, Chip, Select, ReviewCard, Pagination } = window.StrandsDesignSystem_6d0a65;
const TOPICS = ["texture", "smell", "results", "packaging"];
const ALL = [
  { name: "Mariam A.", rating: 5, date: "12/08/2026", title: "My hair felt soft for days", body: "I used it as a pre-wash twice and the difference held through the week. The comb goes straight through now.", helpful: 12, notHelpful: 0, topic: "results" },
  { name: "Salma R.", rating: 5, date: "04/08/2026", title: "The scent is light, which I wanted", body: "Nothing heavy or perfumed. It is gone by the time my hair dries.", helpful: 7, notHelpful: 1, topic: "smell" },
  { name: "Habiba K.", rating: 4, date: "29/07/2026", title: "Thick but spreads easily", body: "A little goes a long way on my hair. I use it instead of conditioner most washes.", helpful: 5, notHelpful: 0, topic: "texture" },
  { name: "Yara M.", rating: 5, date: "21/07/2026", title: "The box arrived perfectly", body: "Packed well and the card inside was a nice touch. Delivery took three days to Alexandria.", helpful: 3, notHelpful: 0, topic: "packaging" },
];
function Reviews() {
  const phone = window.useIsPhone();
  const [q, setQ] = React.useState("");
  const [topic, setTopic] = React.useState(null);
  const [sort, setSort] = React.useState("Most recent");
  const [page, setPage] = React.useState(1);
  const list = ALL.filter((r) => (!topic || r.topic === topic) && (r.title + r.body).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === "Highest rated" ? b.rating - a.rating : 0));
  return (
    <section id="reviews" style={{ background: "var(--cream)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter)" : "var(--section-y) var(--gutter)", display: "grid", gap: "var(--space-6)" }}>
        <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: phone ? "var(--space-5)" : "var(--space-8)", alignItems: "center" }}>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <h2 style={{ fontSize: phone ? "var(--display-3)" : "var(--display-2)" }}>What buyers say.</h2>
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-4)" }}>
              <span style={{ fontFamily: "var(--font-numeric)", fontSize: 48, fontWeight: 500 }}>4.6</span>
              <div style={{ display: "grid", gap: 4 }}><StarRating value={4.6} size={16} /><span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>Based on 38 reviews</span></div>
            </div>
          </div>
          <RatingHistogram counts={[1, 0, 2, 7, 28]} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "260px 1fr auto"), gap: "var(--space-4)", alignItems: phone ? "stretch" : "center" }}>
          <SearchField value={q} onChange={setQ} />
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {TOPICS.map((t) => <Chip key={t} selected={topic === t} onClick={() => setTopic(topic === t ? null : t)}>{t}</Chip>)}
          </div>
          <Select value={sort} onChange={setSort} options={["Most recent", "Highest rated"]} />
        </div>
        <div style={{ borderBottom: "1px solid var(--rule)" }}>
          {list.map((r) => <ReviewCard key={r.name} {...r} children={r.body} />)}
          {list.length === 0 && <p style={{ padding: "var(--space-6) 0", color: "var(--ink-2)", fontSize: "var(--text-small)" }}>No reviews match that filter yet.</p>}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}><Pagination page={page} pages={4} onChange={setPage} /></div>
      </div>
    </section>
  );
}
Object.assign(window, { StrandsReviews: Reviews });
