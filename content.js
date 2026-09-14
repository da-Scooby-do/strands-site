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
    { section: "Header & menu", fields: [
      { key: "nav.masque", label: "Menu — The Masque", en: "The Masque", ar: "الماسك" },
      { key: "nav.ingredients", label: "Menu — Ingredients", en: "Ingredients", ar: "المكونات" },
      { key: "nav.howto", label: "Menu — How to use", en: "How to use", ar: "طريقة الاستخدام" },
      { key: "nav.reviews", label: "Menu — Reviews", en: "Reviews", ar: "الآراء" },
      { key: "menu.story", label: "Phone menu — Our story", en: "Our story", ar: "قصتنا" },
      { key: "menu.shopnow", label: "Phone menu — Shop now", en: "Shop now", ar: "تسوّقي الآن" },
      { key: "cta.add", label: "“Add to cart” button", en: "Add to cart", ar: "أضيفي للسلة" },
    ]},
    { section: "Product area", fields: [
      { key: "hero.chip", label: "Category chip (before the size)", en: "Hair masque", ar: "ماسك شعر" },
      { key: "hero.tagline", label: "Description (used when the product has no tagline set)", multiline: true, en: "A nine-ingredient mask built around mango butter and flaxseed gel. For soft, fluffy and hydrated hair — all hair types.", ar: "ماسك من تسع مكونات حول زبدة المانجو وجل بذور الكتان. لشعر ناعم ومنفوش ومرطّب — لكل أنواع الشعر." },
      { key: "hero.priceNote", label: "Line under the price", en: "Cash on delivery, 2–4 days across Egypt.", ar: "الدفع عند الاستلام، من ٢ لـ ٤ أيام في كل مصر." },
      { key: "hero.added", label: "Button label after adding", en: "Added to cart", ar: "تمت الإضافة" },
      { key: "hero.cod", label: "Phone bar — payment note", en: "Cash on delivery", ar: "الدفع عند الاستلام" },
      { key: "hero.row.benefits.t", label: "Row — Benefits (title)", en: "Benefits", ar: "الفوائد" },
      { key: "hero.row.benefits.b", label: "Row — Benefits (text)", multiline: true, en: "Softer, fuller hair with the frizz settled. Detangles as it works. Suits all hair types.", ar: "شعر أنعم وأكثف والهيشان يهدأ. بيفك التشابك وهو بيشتغل. مناسب لكل أنواع الشعر." },
      { key: "hero.row.ingredients.t", label: "Row — Ingredients (title)", en: "Ingredients", ar: "المكونات" },
      { key: "hero.row.howto.t", label: "Row — How to use (title)", en: "How to use", ar: "طريقة الاستخدام" },
      { key: "hero.row.howto.b", label: "Row — How to use (text)", multiline: true, en: "Three ways — as a pre-wash treatment, in place of your conditioner, or as a 30–60 minute deep-care mask.", ar: "بثلاث طرق — قبل الغسيل، بدل البلسم، أو كماسك عناية عميقة من ٣٠ لـ ٦٠ دقيقة." },
      { key: "hero.row.shipping.t", label: "Row — Shipping & returns (title)", en: "Shipping & returns", ar: "الشحن والإرجاع" },
      { key: "hero.row.shipping.b", label: "Row — Shipping & returns (text)", multiline: true, en: "Cash on delivery across Egypt, 2–4 days. Unopened jars can be returned within 14 days.", ar: "الدفع عند الاستلام في كل مصر، من ٢ لـ ٤ أيام. العلب غير المفتوحة تترجّع خلال ١٤ يوم." },
    ]},
    { section: "Footer", fields: [
      { key: "footer.shop", label: "Column heading — Shop", en: "Shop", ar: "المتجر" },
      { key: "footer.link.masque", label: "Link — the product", en: "Velvet Touch Masque", ar: "ماسك فيلفيت تاتش" },
      { key: "footer.help", label: "Column heading — Help", en: "Help", ar: "مساعدة" },
      { key: "footer.link.shipping", label: "Link — Shipping", en: "Shipping", ar: "الشحن" },
      { key: "footer.link.returns", label: "Link — Returns", en: "Returns", ar: "الإرجاع" },
      { key: "footer.link.contact", label: "Link — Contact us (opens Instagram)", en: "Contact us", ar: "تواصلي معنا" },
      { key: "footer.about", label: "Column heading — About", en: "About", ar: "عن Strands" },
      { key: "footer.link.story", label: "Link — Our story", en: "Our story", ar: "قصتنا" },
      { key: "footer.link.ingredients", label: "Link — Ingredients", en: "Ingredients", ar: "المكونات" },
      { key: "footer.link.reviews", label: "Link — Reviews", en: "Reviews", ar: "الآراء" },
      { key: "footer.newsletter", label: "Column heading — Newsletter", en: "Newsletter", ar: "النشرة" },
      { key: "footer.copyright", label: "Copyright line", en: "© 2026 Strands Hair Care", ar: "© 2026 Strands Hair Care" },
      { key: "footer.legal", label: "Legal line", en: "Privacy · Terms", ar: "الخصوصية · الشروط" },
    ]},
    { section: "Review form", fields: [
      { key: "revform.title", label: "Title", en: "Write a review", ar: "اكتبي رأيك" },
      { key: "revform.signin.msg", label: "Sign-in prompt", multiline: true, en: "Sign in to your account to leave a review.", ar: "سجّلي دخول بحسابك عشان تكتبي رأيك." },
      { key: "revform.signin.btn", label: "Sign-in button", en: "Sign in", ar: "تسجيل الدخول" },
      { key: "revform.rating", label: "“Your rating” label", en: "Your rating", ar: "تقييمك" },
      { key: "revform.review.label", label: "Review box label", en: "Your review", ar: "رأيك" },
      { key: "revform.review.ph", label: "Review box placeholder", en: "How did the masque work for you?", ar: "إيه رأيك في الماسك؟" },
      { key: "revform.name", label: "Name field label", en: "Name (optional)", ar: "الاسم (اختياري)" },
      { key: "revform.city", label: "City field label", en: "City (optional)", ar: "المدينة (اختياري)" },
      { key: "revform.submit", label: "Submit button", en: "Submit review", ar: "إرسال الرأي" },
      { key: "revform.thanks.title", label: "Thank-you title", en: "Thank you", ar: "شكرًا ليكي" },
      { key: "revform.thanks.msg", label: "Thank-you message", multiline: true, en: "We’ve got your review — it’ll appear on the shop once we’ve approved it. Thank you!", ar: "استلمنا رأيك، وهيظهر على المتجر بعد المراجعة. شكرًا!" },
    ]},
    { section: "Cart & checkout", fields: [
      { key: "co.cart.title", label: "Cart title", en: "Your cart", ar: "سلتك" },
      { key: "co.checkout.title", label: "Checkout title", en: "Checkout", ar: "إتمام الطلب" },
      { key: "co.each", label: "“each” (per jar)", en: "each", ar: "للعلبة" },
      { key: "co.remove", label: "Remove link", en: "Remove", ar: "إزالة" },
      { key: "co.subtotal", label: "Subtotal", en: "Subtotal", ar: "الإجمالي الفرعي" },
      { key: "co.shipping", label: "Shipping", en: "Shipping", ar: "الشحن" },
      { key: "co.shipping.tbd", label: "Shipping not-yet-known", en: "Set at checkout", ar: "تُحسب عند الطلب" },
      { key: "co.free", label: "Free shipping", en: "Free", ar: "مجاني" },
      { key: "co.total", label: "Total line", en: "Total (cash on delivery)", ar: "الإجمالي (الدفع عند الاستلام)" },
      { key: "co.discount", label: "Discount line", en: "Discount", ar: "خصم" },
      { key: "co.keepShopping", label: "Continue shopping", en: "Continue shopping", ar: "كملي تسوّق" },
      { key: "co.empty", label: "Empty cart message", en: "Your cart is empty.", ar: "سلتك فاضية." },
      { key: "co.promo.label", label: "Discount code field", en: "Discount code", ar: "كود الخصم" },
      { key: "co.promo.apply", label: "“Apply” button", en: "Apply", ar: "تطبيق" },
      { key: "co.auth.signinTitle", label: "Sign-in box title", en: "Sign in to order", ar: "سجّلي دخول للطلب" },
      { key: "co.auth.createTitle", label: "Create-account box title", en: "Create your account", ar: "أنشئي حسابك" },
      { key: "co.auth.note", label: "Sign-in box note", multiline: true, en: "Orders are cash on delivery. An account lets you track them.", ar: "الطلبات بالدفع عند الاستلام. الحساب بيخليكي تتابعي طلباتك." },
      { key: "co.email", label: "Email field", en: "Email", ar: "البريد الإلكتروني" },
      { key: "co.password", label: "Password field", en: "Password", ar: "كلمة السر" },
      { key: "co.signin", label: "Sign-in button", en: "Sign in", ar: "دخول" },
      { key: "co.createAccount", label: "Create-account button", en: "Create account", ar: "إنشاء حساب" },
      { key: "co.fullName", label: "Full name field", en: "Full name", ar: "الاسم بالكامل" },
      { key: "co.phone", label: "Phone field", en: "Phone", ar: "التليفون" },
      { key: "co.whatsapp", label: "WhatsApp field", en: "WhatsApp (optional)", ar: "واتساب (اختياري)" },
      { key: "co.gov", label: "Governorate field", en: "Governorate", ar: "المحافظة" },
      { key: "co.choose", label: "“Choose…” option", en: "Choose…", ar: "اختاري…" },
      { key: "co.street", label: "Street address field", en: "Street address", ar: "عنوان الشارع" },
      { key: "co.area", label: "Area field", en: "Area (optional)", ar: "المنطقة (اختياري)" },
      { key: "co.landmark", label: "Landmark field", en: "Landmark (optional)", ar: "علامة مميزة (اختياري)" },
      { key: "co.placeOrder", label: "“Place order” button", en: "Place order — ", ar: "إتمام الطلب — " },
      { key: "co.done.title", label: "Order-placed — thank you", en: "Thank you.", ar: "شكرًا ليكي." },
      { key: "co.done.track", label: "Order-placed — track button", en: "Track it in your account", ar: "تابعي طلبك من حسابك" },
      { key: "co.done.keep", label: "Order-placed — keep browsing", en: "Keep browsing", ar: "كملي تسوّق" },
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
