const { StarRating } = window.StrandsDesignSystem_6d0a65;
/* Live testimonials: the published quotes the owner manages in the dashboard
   (public.reviews). Bilingual, in the owner's sort order. */
function Reviews() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  const [quotes, setQuotes] = React.useState(null);

  React.useEffect(() => {
    if (!window.SB_READY) return;
    window.sb.from("reviews").select("quote_en,quote_ar,city_en,city_ar,sort,published").eq("published", true).order("sort")
      .then(({ data }) => { if (data) setQuotes(data); });
  }, []);

  const list = (quotes || []).filter((q) => (ar ? q.quote_ar : q.quote_en));
  if (quotes && list.length === 0) return null;

  return (
    <section id="reviews" style={{ background: "var(--cream)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter)" : "var(--section-y) var(--gutter)", display: "grid", gap: phone ? "var(--space-6)" : "var(--space-7)" }}>
        <div style={{ display: "grid", gap: "var(--space-3)", justifyItems: "center", textAlign: "center" }}>
          <StarRating value={5} size={18} />
          <h2 style={{ fontSize: phone ? "var(--display-3)" : "var(--display-2)" }}>{ar ? "رأي المشترين." : "What buyers say."}</h2>
          <p style={{ color: "var(--ink-2)", maxWidth: "48ch" }}>{ar ? "كلمات من عميلات اخترنا ننشرها. مش تقييمات مُرسلة تلقائيًا." : "Words from customers we’ve chosen to publish."}</p>
        </div>
        {list.length ? (
          <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr" : "repeat(3, 1fr)", gap: phone ? "var(--space-4)" : "var(--space-5)" }}>
            {list.map((q, i) => (
              <figure key={i} style={{ margin: 0, background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: phone ? "var(--space-5)" : "var(--space-6)", display: "grid", gap: "var(--space-4)", alignContent: "start" }}>
                <span aria-hidden style={{ fontFamily: "var(--font-display)", fontSize: 44, lineHeight: 0.6, color: "var(--green)", height: 22 }}>{ar ? "”" : "“"}</span>
                <blockquote style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: phone ? 20 : 22, lineHeight: 1.4, color: "var(--ink)" }}>{ar ? q.quote_ar : q.quote_en}</blockquote>
                <figcaption style={{ fontSize: "var(--text-fine-size)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--green)" }}>{(ar ? q.city_ar : q.city_en) || ""}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "var(--ink-2)" }}>{ar ? "بنجمع آراء عميلاتنا." : "Gathering our customers’ words."}</p>
        )}
      </div>
    </section>
  );
}
Object.assign(window, { StrandsReviews: Reviews });
