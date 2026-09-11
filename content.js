/* Editable site copy.
   - SITE_COPY_SCHEMA: the list of editable text fields (defaults + labels),
     grouped by section. The dashboard "Site text" screen renders this.
   - window.copy(key, defEN, defAR): the storefront reads text through this.
     It returns the owner's override from settings.content when present,
     otherwise the default the component passes in (or the schema default).
   Overrides are loaded from settings key "content" and set via setSiteCopy(). */
;(function () {
  var S = [
    { section: "Statement — “Three ways to use it”", fields: [
      { key: "statement.eyebrow", label: "Eyebrow", en: "Three ways to use it", ar: "ثلاث طرق للاستخدام" },
      { key: "statement.heading", label: "Heading", multiline: true, en: "One jar covers the whole week, however you wash.", ar: "علبة واحدة تكفي الأسبوع كله، مهما كانت طريقة غسيلك." },
      { key: "statement.c1.title", label: "Card 1 — title", en: "Pre-wash", ar: "قبل الغسيل" },
      { key: "statement.c1.body", label: "Card 1 — text", multiline: true, en: "Apply to damp hair, leave for up to 2 hours, then shampoo.", ar: "حطّيه على شعر مبلول، سيبيه لحد ساعتين، وبعدين اغسليه بالشامبو." },
      { key: "statement.c2.title", label: "Card 2 — title", en: "As a conditioner", ar: "بدل البلسم" },
      { key: "statement.c2.body", label: "Card 2 — text", multiline: true, en: "After shampooing, apply, leave 10 minutes, then rinse thoroughly.", ar: "بعد الشامبو، حطّيه، سيبيه ١٠ دقايق، وبعدين اشطفيه كويس." },
      { key: "statement.c3.title", label: "Card 3 — title", en: "Deep care", ar: "عناية عميقة" },
      { key: "statement.c3.body", label: "Card 3 — text", multiline: true, en: "Clean, damp hair, 30 to 60 minutes, then rinse with lukewarm water.", ar: "شعر نضيف ومبلول، من ٣٠ لـ ٦٠ دقيقة، وبعدين اشطفيه بمياه فاترة." },
    ]},
    { section: "Over time", fields: [
      { key: "overtime.eyebrow", label: "Eyebrow", en: "Over time", ar: "مع الوقت" },
      { key: "overtime.heading", label: "Heading", en: "What it does after the first wash.", ar: "بيعمل إيه بعد أول غسلة." },
      { key: "overtime.sub", label: "Subheading", multiline: true, en: "Used two or three times a week, on any hair type.", ar: "مرتين أو تلاتة في الأسبوع، على أي نوع شعر." },
      { key: "overtime.s1.title", label: "Step 1 — title", en: "First wash — softness you can feel", ar: "أول غسلة — نعومة تحسّيها" },
      { key: "overtime.s1.body", label: "Step 1 — text", multiline: true, en: "The mango butter and jojoba coat the strand, so the comb runs through without catching.", ar: "زبدة المانجو والجوجوبا بتغلّف الشعرة، فالمشط بيعدّي من غير ما يتعلّق." },
      { key: "overtime.s2.title", label: "Step 2 — title", en: "Week two — the frizz settles", ar: "الأسبوع التاني — الهيشان يهدأ" },
      { key: "overtime.s2.body", label: "Step 2 — text", multiline: true, en: "Flaxseed gel holds moisture in the cuticle, so humidity has less to lift.", ar: "جل بذور الكتان بيحبس الترطيب في الشعرة، فالرطوبة ملهاش تأثير كبير." },
      { key: "overtime.s3.title", label: "Step 3 — title", en: "Week four — fuller, calmer hair", ar: "الأسبوع الرابع — شعر أكثف وأهدأ" },
      { key: "overtime.s3.body", label: "Step 3 — text", multiline: true, en: "Panthenol and hibiscus keep the scalp comfortable and the ends from splitting further.", ar: "البانثينول والكركديه بيريّحوا فروة الرأس ويمنعوا الأطراف من التقصّف أكتر." },
    ]},
    { section: "Ingredients / science", fields: [
      { key: "science.heading", label: "Heading", en: "Softness that holds through the week.", ar: "نعومة تفضل طول الأسبوع." },
    ]},
    { section: "Standards", fields: [
      { key: "standards.f1.title", label: "Feature 1 — title", en: "12 months", ar: "١٢ شهر" },
      { key: "standards.f1.body", label: "Feature 1 — text", multiline: true, en: "Period after opening, marked on the lid.", ar: "مدة الصلاحية بعد الفتح، مكتوبة على الغطا." },
      { key: "standards.f2.title", label: "Feature 2 — title", en: "Cash on delivery", ar: "الدفع عند الاستلام" },
      { key: "standards.f2.body", label: "Feature 2 — text", multiline: true, en: "Anywhere in Egypt, 2–4 days.", ar: "في أي مكان في مصر، من ٢ لـ ٤ أيام." },
    ]},
    { section: "Reviews", fields: [
      { key: "reviews.heading", label: "Heading", en: "What buyers say.", ar: "رأي المشترين." },
      { key: "reviews.empty", label: "Empty state (no reviews yet)", multiline: true, en: "Be the first to leave a review.", ar: "كوني أول من يكتب رأيه." },
      { key: "reviews.cta", label: "“Write a review” button", en: "Write a review", ar: "اكتبي رأيك" },
    ]},
    { section: "Hero", fields: [
      { key: "hero.tagline", label: "Fallback description (used when the product has no tagline set)", multiline: true, en: "A nine-ingredient mask built around mango butter and flaxseed gel. For soft, fluffy and hydrated hair — all hair types.", ar: "ماسك من تسع مكونات حول زبدة المانجو وجل بذور الكتان. لشعر ناعم ومنفوش ومرطّب — لكل أنواع الشعر." },
    ]},
  ];
  var IDX = {};
  S.forEach(function (g) { g.fields.forEach(function (f) { IDX[f.key] = f; }); });

  window.SITE_COPY_SCHEMA = S;
  window.__SITE_COPY = {};
  window.setSiteCopy = function (o) { window.__SITE_COPY = o || {}; };
  window.copy = function (key, defEN, defAR) {
    var isAr = !!(window.getStrandsLang && window.getStrandsLang() === "AR");
    var ov = window.__SITE_COPY[key];
    if (ov) { var v = isAr ? (ov.ar || ov.en) : (ov.en || ov.ar); if (v != null && v !== "") return v; }
    if (defEN !== undefined) return isAr ? (defAR !== undefined ? defAR : defEN) : defEN;
    var f = IDX[key];
    if (f) return isAr ? (f.ar || f.en) : (f.en || f.ar);
    return "";
  };
})();
