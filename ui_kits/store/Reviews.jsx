const { StarRating, Icon } = window.StrandsDesignSystem_6d0a65;
/* Live testimonials — the published quotes the owner manages in the dashboard
   (public.reviews), bilingual, in sort order.
   Phone: a simple vertical stack so every review is visible, no sliding.
   Desktop: a swipeable 3-up slider. */
function Reviews() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  const [quotes, setQuotes] = React.useState(null);
  const trackRef = React.useRef(null);
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (!window.SB_READY) return;
    window.sb.from("reviews").select("quote_en,quote_ar,city_en,city_ar,sort,published").eq("published", true).order("sort")
      .then(({ data }) => { if (data) setQuotes(data); });
  }, []);

  const list = (quotes || []).filter((q) => (ar ? q.quote_ar : q.quote_en));
  if (quotes && list.length === 0) return null;

  const card = (q, i, extra) => (
    <figure key={i} style={{ margin: 0, background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: phone ? "var(--space-5)" : "var(--space-6)", display: "grid", gap: "var(--space-4)", alignContent: "start", ...extra }}>
      <span aria-hidden style={{ fontFamily: "var(--font-display)", fontSize: 44, lineHeight: 0.6, color: "var(--green)", height: 22 }}>{ar ? "”" : "“"}</span>
      <blockquote style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: phone ? 20 : 22, lineHeight: 1.4, color: "var(--green)" }}>{ar ? q.quote_ar : q.quote_en}</blockquote>
      <figcaption style={{ fontSize: "var(--text-fine-size)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--green)" }}>{(ar ? q.city_ar : q.city_en) || ""}</figcaption>
    </figure>
  );

  const go = (delta) => {
    const track = trackRef.current; if (!track) return;
    const cards = track.children;
    const next = Math.max(0, Math.min(cards.length - 1, idx + delta));
    setIdx(next);
    if (cards[next]) cards[next].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };
  const onScroll = () => {
    const track = trackRef.current; if (!track || !track.children.length) return;
    const w = track.children[0].getBoundingClientRect().width + 20;
    setIdx(Math.round(Math.abs(track.scrollLeft) / w));
  };
  const showArrows = list.length > 3;
  const arrow = (dir) => ({ position: "absolute", top: "50%", transform: "translateY(-50%)", [dir === "prev" ? "insetInlineStart" : "insetInlineEnd"]: -10, zIndex: 2, width: 44, height: 44, borderRadius: "50%", background: "var(--white)", border: "1px solid var(--rule)", boxShadow: "0 4px 14px rgba(0,0,0,.10)", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--ink)" });

  return (
    <section id="reviews" style={{ background: "var(--cream)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter)" : "var(--section-y) var(--gutter)", display: "grid", gap: phone ? "var(--space-6)" : "var(--space-7)" }}>
        <div style={{ display: "grid", gap: "var(--space-3)", justifyItems: "center", textAlign: "center" }}>
          <StarRating value={5} size={18} />
          <h2 style={{ fontSize: phone ? "var(--display-3)" : "var(--display-2)" }}>{ar ? "رأي المشترين." : "What buyers say."}</h2>
          <p style={{ color: "var(--ink-2)", maxWidth: "48ch" }}>{ar ? "كلمات من عميلات اخترنا ننشرها." : "Words from customers we’ve chosen to publish."}</p>
        </div>

        {list.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--ink-2)" }}>{ar ? "بنجمع آراء عميلاتنا." : "Gathering our customers’ words."}</p>
        ) : phone ? (
          /* Phone: every review stacked, fully visible, no sliding. */
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            {list.map((q, i) => card(q, i))}
          </div>
        ) : (
          /* Desktop: swipeable 3-up slider. */
          <div style={{ position: "relative" }}>
            {showArrows && idx > 0 && <button type="button" aria-label={ar ? "السابق" : "Previous"} onClick={() => go(-1)} style={arrow("prev")}><Icon name={ar ? "chevron-right" : "chevron-left"} size={20} /></button>}
            {showArrows && idx < list.length - 1 && <button type="button" aria-label={ar ? "التالي" : "Next"} onClick={() => go(1)} style={arrow("next")}><Icon name={ar ? "chevron-left" : "chevron-right"} size={20} /></button>}
            <div ref={trackRef} onScroll={onScroll} className="strands-review-track" style={{ display: "flex", gap: "var(--space-5)", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", paddingBottom: 4 }}>
              {list.map((q, i) => card(q, i, { flex: "0 0 auto", width: "calc((100% - 2 * var(--space-5)) / 3)", scrollSnapAlign: "start", minHeight: 230 }))}
            </div>
            {list.length > 3 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: "var(--space-4)" }}>
                {list.map((_, i) => (
                  <button key={i} type="button" aria-label={"Review " + (i + 1)} onClick={() => go(i - idx)}
                    style={{ width: i === idx ? 22 : 8, height: 8, borderRadius: 999, border: "none", cursor: "pointer", padding: 0, background: i === idx ? "var(--green)" : "var(--rule)", transition: "width var(--dur) var(--ease)" }} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
Object.assign(window, { StrandsReviews: Reviews });
