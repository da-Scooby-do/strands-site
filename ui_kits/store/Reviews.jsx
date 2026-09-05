const { StarRating, Button, Input, Textarea, InlineAlert, Icon } = window.StrandsDesignSystem_6d0a65;
/* Live customer reviews (public.reviews). Shows 3 at a time with View more.
   Customers can submit a star rating + words; it lands unpublished for the owner
   to approve in the dashboard. 3-up on desktop, stacked on phone. */

function StarInput({ value, onChange, ar }) {
  return (
    <div style={{ display: "flex", gap: 4 }} role="radiogroup" aria-label={ar ? "التقييم" : "Rating"}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" aria-label={n + (ar ? " نجوم" : " stars")} onClick={() => onChange(n)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "var(--green)", lineHeight: 1 }}>
          <Icon name="star" size={26} fill={n <= value ? "var(--green)" : "none"} />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ open, onClose, ar }) {
  const [user, setUser] = React.useState(null);
  const [rating, setRating] = React.useState(5);
  const [quote, setQuote] = React.useState("");
  const [name, setName] = React.useState("");
  const [city, setCity] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!open || !window.SB_READY) return;
    window.sb.auth.getSession().then(({ data }) => {
      const u = data && data.session ? data.session.user : null;
      setUser(u);
      if (u) window.sb.from("profiles").select("full_name").eq("user_id", u.id).maybeSingle().then(({ data }) => { if (data && data.full_name) setName((n) => n || data.full_name); });
    });
    setDone(false); setErr("");
  }, [open]);

  async function submit() {
    if (busy) return;
    setErr("");
    if (quote.trim().length < 3) { setErr(ar ? "اكتبي رأيك." : "Write a few words."); return; }
    setBusy(true);
    const r = await window.sbRpc("submit_review", { payload: { rating, quote, name, city } });
    setBusy(false);
    if (r && r.ok) setDone(true);
    else {
      const map = { auth_required: ar ? "سجّلي دخول عشان تكتبي رأيك." : "Please sign in to leave a review.", quote_required: ar ? "اكتبي رأيك." : "Write a few words.", too_many: ar ? "شكرًا، سجّلتي آراء كتير بالفعل." : "Thanks — you’ve already left several reviews." };
      setErr((r && map[r.error]) || (r && r.error) || (ar ? "لم نتمكن من الحفظ." : "Could not save your review."));
    }
  }

  if (!open) return null;
  return (
    <div>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(30,24,20,.45)", zIndex: 59 }} />
      <div role="dialog" aria-label={ar ? "اكتبي رأيك" : "Write a review"} style={{ position: "fixed", insetInline: 0, bottom: 0, margin: "0 auto", top: "50%", transform: "translateY(-50%)", width: "min(440px,92vw)", maxHeight: "90vh", overflowY: "auto", background: "var(--cream)", borderRadius: "var(--radius-card)", zIndex: 60, boxShadow: "0 20px 60px rgba(0,0,0,.25)", padding: "var(--space-6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
          <h3 style={{ fontSize: 22, margin: 0 }}>{done ? (ar ? "شكرًا ليكي" : "Thank you") : (ar ? "اكتبي رأيك" : "Write a review")}</h3>
          <button type="button" onClick={onClose} aria-label={ar ? "إغلاق" : "Close"} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)" }}><Icon name="x" size={20} /></button>
        </div>

        {done ? (
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <p style={{ color: "var(--ink-2)" }}>{ar ? "استلمنا رأيك، وهيظهر على المتجر بعد المراجعة. شكرًا!" : "We’ve got your review — it’ll appear on the shop once we’ve approved it. Thank you!"}</p>
            <Button fullWidth onClick={onClose}>{ar ? "تمام" : "Done"}</Button>
          </div>
        ) : !user ? (
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <p style={{ color: "var(--ink-2)" }}>{ar ? "سجّلي دخول بحسابك عشان تكتبي رأيك." : "Sign in to your account to leave a review."}</p>
            <Button fullWidth onClick={() => (window.location.href = "../account/index.html")}>{ar ? "تسجيل الدخول" : "Sign in"}</Button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <div style={{ display: "grid", gap: 8 }}>
              <span style={{ fontSize: "var(--text-small)", color: "var(--ink-2)" }}>{ar ? "تقييمك" : "Your rating"}</span>
              <StarInput value={rating} onChange={setRating} ar={ar} />
            </div>
            <Textarea label={ar ? "رأيك" : "Your review"} rows={4} dir={ar ? "rtl" : "ltr"} value={quote} onChange={setQuote} placeholder={ar ? "إيه رأيك في الماسك؟" : "How did the masque work for you?"} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
              <Input label={ar ? "الاسم (اختياري)" : "Name (optional)"} value={name} onChange={setName} />
              <Input label={ar ? "المدينة (اختياري)" : "City (optional)"} value={city} onChange={setCity} />
            </div>
            {err && <InlineAlert tone="error">{err}</InlineAlert>}
            <Button fullWidth onClick={submit} disabled={busy}>{busy ? (ar ? "بنبعت…" : "Sending…") : (ar ? "إرسال الرأي" : "Submit review")}</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Reviews() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  const [quotes, setQuotes] = React.useState(null);
  const [shown, setShown] = React.useState(3);
  const [formOpen, setFormOpen] = React.useState(false);

  React.useEffect(() => {
    if (!window.SB_READY) return;
    window.sb.from("reviews").select("quote_en,quote_ar,city_en,city_ar,rating,sort,published").eq("published", true).order("sort")
      .then(({ data }) => { if (data) setQuotes(data); });
  }, []);

  const list = (quotes || []).filter((q) => (ar ? q.quote_ar : q.quote_en));
  const count = list.length;
  const avg = count ? Math.round((list.reduce((a, q) => a + (q.rating || 5), 0) / count) * 10) / 10 : 0;
  const visible = list.slice(0, shown);
  const hasMore = count > shown;
  const expanded = shown > 3;

  return (
    <section id="reviews" style={{ background: "var(--cream)" }}>
      <ReviewForm open={formOpen} onClose={() => setFormOpen(false)} ar={ar} />
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter)" : "var(--section-y) var(--gutter)", display: "grid", gap: phone ? "var(--space-6)" : "var(--space-7)" }}>
        <div style={{ display: "grid", gap: "var(--space-3)", justifyItems: "center", textAlign: "center" }}>
          <StarRating value={avg || 5} size={18} />
          <h2 style={{ fontSize: phone ? "var(--display-3)" : "var(--display-2)" }}>{ar ? "رأي المشترين." : "What buyers say."}</h2>
          {count > 0
            ? <p style={{ color: "var(--ink-2)" }}>{ar ? (avg + " من ٥ · " + count + " تقييم") : (avg + " out of 5 · " + count + (count === 1 ? " review" : " reviews"))}</p>
            : <p style={{ color: "var(--ink-2)", maxWidth: "48ch" }}>{ar ? "كوني أول من يكتب رأيه." : "Be the first to leave a review."}</p>}
          <div style={{ marginTop: "var(--space-2)" }}><Button size="sm" variant="quiet" onClick={() => setFormOpen(true)}>{ar ? "اكتبي رأيك" : "Write a review"}</Button></div>
        </div>

        {count > 0 && (
          <React.Fragment>
            <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr" : "repeat(3, 1fr)", gap: phone ? "var(--space-4)" : "var(--space-5)", alignItems: "start" }}>
              {visible.map((q, i) => (
                <figure key={i} style={{ margin: 0, background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: phone ? "var(--space-5)" : "var(--space-6)", display: "grid", gap: "var(--space-3)", alignContent: "start" }}>
                  <StarRating value={q.rating || 5} size={15} />
                  <blockquote style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: phone ? 20 : 22, lineHeight: 1.4, color: "var(--green)" }}>{ar ? q.quote_ar : q.quote_en}</blockquote>
                  <figcaption style={{ fontSize: "var(--text-fine-size)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--green)" }}>{(ar ? q.city_ar : q.city_en) || ""}</figcaption>
                </figure>
              ))}
            </div>
            {(hasMore || expanded) && (
              <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-3)" }}>
                {hasMore && <Button variant="quiet" onClick={() => setShown((s) => s + 3)}>{ar ? "عرض المزيد" : "View more"}</Button>}
                {expanded && !hasMore && <Button variant="quiet" onClick={() => setShown(3)}>{ar ? "عرض أقل" : "Show less"}</Button>}
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </section>
  );
}
Object.assign(window, { StrandsReviews: Reviews });
