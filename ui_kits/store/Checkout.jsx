/* Cart + checkout drawer, bilingual. Reads the language toggle (window.useLang)
   and mirrors to RTL for Arabic. Talks to Supabase: product_variants + settings
   (anon), check_promo (anon rpc), Supabase Auth, and place_order. */
const { Button, Input, Select, InlineAlert, Icon } = window.StrandsDesignSystem_6d0a65;
const INSTAPAY_URL = "https://ipn.eg/S/nourhatim/instapay/3CHDAq";
const INSTAPAY_HANDLE = "nourhatim@instapay";
const SHOP_WA = "201023789109";  // shop WhatsApp for InstaPay payment screenshots
// Normalise a phone number to international form. A number that already carries a
// "+" country code (from the picker) is kept as-is; a bare Egyptian number gets +20.
function egPhone(n) {
  const s = String(n || "").trim();
  if (s[0] === "+") return "+" + s.slice(1).replace(/[^\d]/g, "");
  const d = s.replace(/[^\d]/g, "");
  if (!d) return s;
  if (d.slice(0, 2) === "20") return "+" + d;
  if (d[0] === "0") return "+20" + d.slice(1);
  return "+20" + d;
}
// Every country's calling code as ISO + dial digits. Names (EN/AR) come from the
// browser's Intl.DisplayNames so the list stays short; flags are built from the ISO.
const DIAL_RAW = "AF93 AX358 AL355 DZ213 AS1684 AD376 AO244 AI1264 AG1268 AR54 AM374 AW297 AU61 AT43 AZ994 BS1242 BH973 BD880 BB1246 BY375 BE32 BZ501 BJ229 BM1441 BT975 BO591 BQ599 BA387 BW267 BR55 IO246 VG1284 BN673 BG359 BF226 BI257 KH855 CM237 CA1 CV238 KY1345 CF236 TD235 CL56 CN86 CX61 CC61 CO57 KM269 CG242 CD243 CK682 CR506 CI225 HR385 CU53 CW599 CY357 CZ420 DK45 DJ253 DM1767 DO1809 EC593 EG20 SV503 GQ240 ER291 EE372 SZ268 ET251 FK500 FO298 FJ679 FI358 FR33 GF594 PF689 GA241 GM220 GE995 DE49 GH233 GI350 GR30 GL299 GD1473 GP590 GU1671 GT502 GG44 GN224 GW245 GY592 HT509 HN504 HK852 HU36 IS354 IN91 ID62 IR98 IQ964 IE353 IM44 IL972 IT39 JM1876 JP81 JE44 JO962 KZ7 KE254 KI686 XK383 KW965 KG996 LA856 LV371 LB961 LS266 LR231 LY218 LI423 LT370 LU352 MO853 MG261 MW265 MY60 MV960 ML223 MT356 MH692 MQ596 MR222 MU230 YT262 MX52 FM691 MD373 MC377 MN976 ME382 MS1664 MA212 MZ258 MM95 NA264 NR674 NP977 NL31 NC687 NZ64 NI505 NE227 NG234 NU683 NF672 KP850 MK389 MP1670 NO47 OM968 PK92 PW680 PS970 PA507 PG675 PY595 PE51 PH63 PL48 PT351 PR1787 QA974 RE262 RO40 RU7 RW250 BL590 SH290 KN1869 LC1758 MF590 PM508 VC1784 WS685 SM378 ST239 SA966 SN221 RS381 SC248 SL232 SG65 SX1721 SK421 SI386 SB677 SO252 ZA27 KR82 SS211 ES34 LK94 SD249 SR597 SJ47 SE46 CH41 SY963 TW886 TJ992 TZ255 TH66 TL670 TG228 TK690 TO676 TT1868 TN216 TR90 TM993 TC1649 TV688 UG256 UA380 AE971 GB44 US1 UY598 UZ998 VU678 VA39 VE58 VN84 VI1340 WF681 YE967 ZM260 ZW263";
// When several countries share a code, a saved number maps back to this one.
const DIAL_PREFERRED = { "+1": "US", "+7": "RU", "+44": "GB", "+61": "AU", "+39": "IT", "+47": "NO", "+262": "RE", "+358": "FI", "+590": "GP", "+599": "CW" };
function regionNames(locale) { try { return new Intl.DisplayNames([locale], { type: "region" }); } catch (e) { return null; } }
const DN_EN = regionNames("en"), DN_AR = regionNames("ar");
const flagOf = (iso) => String.fromCodePoint(...[...iso].map((c) => 0x1f1a5 + c.charCodeAt(0)));
const DIAL_CODES = DIAL_RAW.split(" ").map((t) => {
  const iso = t.slice(0, 2), d = "+" + t.slice(2);
  const n = (DN_EN && DN_EN.of(iso)) || iso, a = (DN_AR && DN_AR.of(iso)) || n;
  return { iso, f: flagOf(iso), d, n, a };
}).sort((x, y) => (x.iso === "EG" ? -1 : y.iso === "EG" ? 1 : x.n.localeCompare(y.n)));
const DIAL_BY_LEN = DIAL_CODES.slice().sort((a, b) => b.d.length - a.d.length);
function splitPhone(value) {
  const v = String(value || "").replace(/[^\d+]/g, "");
  if (v[0] === "+") {
    const m = DIAL_BY_LEN.find((x) => v.startsWith(x.d));
    if (m) return { code: m.d, local: v.slice(m.d.length) };
    return { code: "+20", local: v.replace(/^\+/, "") };
  }
  if (v && v[0] === "0") return { code: "+20", local: v.slice(1) };
  return { code: "+20", local: v };
}
const defaultIso = (code) => DIAL_PREFERRED[code] || ((DIAL_CODES.find((c) => c.d === code) || {}).iso) || "EG";
const norm = (t) => String(t || "").toLowerCase().normalize("NFKD").replace(/[̀-ًͯ-ٟ]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");

/* Searchable country-code picker: type a country (English or Arabic) or a code. */
function DialPicker({ iso, onPick, ar }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const wrap = React.useRef(null), search = React.useRef(null);
  const cur = DIAL_CODES.find((c) => c.iso === iso) || DIAL_CODES[0];
  React.useEffect(() => {
    if (!open) return;
    setQ(""); setTimeout(() => search.current && search.current.focus(), 0);
    const out = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", out); document.addEventListener("touchstart", out); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", out); document.removeEventListener("touchstart", out); document.removeEventListener("keydown", esc); };
  }, [open]);
  const nq = norm(q.trim()), digits = q.replace(/\D/g, "");
  const list = !nq ? DIAL_CODES : DIAL_CODES.filter((c) =>
    (digits && digits === q.replace(/[\s+]/g, "") ? c.d.slice(1).startsWith(digits)
      : norm(c.n).includes(nq) || norm(c.a).includes(nq) || c.iso.toLowerCase() === nq));
  const pick = (c) => { onPick(c); setOpen(false); };
  const box = { boxSizing: "border-box", height: 46, border: "1px solid var(--rule)", borderRadius: "var(--radius-control)", padding: "0 10px", font: "inherit", fontFamily: "var(--font-sans)", fontSize: 15, background: "var(--white)", color: "var(--ink)" };
  return (
    <div ref={wrap} style={{ position: "relative", flex: "0 0 auto" }}>
      <button type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={ar ? "كود الدولة" : "Country code"} onClick={() => setOpen(!open)} style={{ ...box, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", whiteSpace: "nowrap" }}>
        <span>{cur.f}</span><bdi dir="ltr" style={{ fontFamily: "var(--font-numeric)", direction: "ltr", unicodeBidi: "isolate" }}>{cur.d}</bdi><Icon name="chevron-down" size={14} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", insetInlineStart: 0, zIndex: 5, width: "min(300px, calc(100vw - 48px))", background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", boxShadow: "0 12px 32px rgba(0,0,0,.14)", overflow: "hidden" }}>
          <div style={{ padding: 8, borderBottom: "1px solid var(--rule)" }}>
            <input ref={search} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={ar ? "ابحثي بالدولة أو الكود" : "Search country or code"}
              onKeyDown={(e) => { if (e.key === "Enter" && list[0]) { e.preventDefault(); pick(list[0]); } }}
              style={{ ...box, height: 40, width: "100%" }} />
          </div>
          <ul role="listbox" style={{ listStyle: "none", margin: 0, padding: 4, maxHeight: 260, overflowY: "auto" }}>
            {list.map((c) => (
              <li key={c.iso} role="option" aria-selected={c.iso === cur.iso} onClick={() => pick(c)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 6, cursor: "pointer", fontSize: 14, background: c.iso === cur.iso ? "var(--purple-tint)" : "transparent" }}
                onMouseEnter={(e) => { if (c.iso !== cur.iso) e.currentTarget.style.background = "var(--cream)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = c.iso === cur.iso ? "var(--purple-tint)" : "transparent"; }}>
                <span>{c.f}</span>
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ar ? c.a : c.n}</span>
                <bdi dir="ltr" style={{ color: "var(--ink-2)", fontFamily: "var(--font-numeric)", direction: "ltr", unicodeBidi: "isolate" }}>{c.d}</bdi>
              </li>
            ))}
            {!list.length && <li style={{ padding: "12px 10px", fontSize: 14, color: "var(--ink-2)" }}>{ar ? "مفيش نتايج" : "No matches"}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
function PhoneField({ label, value, onChange, hint, placeholder }) {
  const ar = window.useLang() === "AR";
  const { code, local } = splitPhone(value);
  // Remember the exact country picked (several share +1, +7, +44…); fall back to the code's usual one.
  const [iso, setIso] = React.useState(() => defaultIso(code));
  const shownIso = (DIAL_CODES.find((c) => c.iso === iso) || {}).d === code ? iso : defaultIso(code);
  const box = { boxSizing: "border-box", height: 46, border: "1px solid var(--rule)", borderRadius: "var(--radius-control)", padding: "0 12px", font: "inherit", fontFamily: "var(--font-sans)", fontSize: 15, background: "var(--white)", color: "var(--ink)" };
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label style={{ fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-2)", fontFamily: "var(--font-sans)" }}>{label}</label>
      <div style={{ display: "flex", gap: 8 }}>
        <DialPicker iso={shownIso} ar={ar} onPick={(c) => { setIso(c.iso); onChange(c.d + local); }} />
        <input type="tel" inputMode="tel" value={local} onChange={(e) => onChange(code + e.target.value.replace(/\D/g, ""))} placeholder={placeholder} style={{ ...box, flex: 1, minWidth: 0 }} />
      </div>
      {hint && <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{hint}</span>}
    </div>
  );
}

function Checkout({ open, onClose, cart, variants, ship, onSetQty, onRemove, onClear, maxQty }) {
  const ar = window.useLang() === "AR";
  const T = (en, arr) => (ar ? arr : en);
  const money = window.money;
  const [step, setStep] = React.useState("cart");
  const [pay, setPay] = React.useState("cod");  // "cod" | "instapay"
  const shipCfg = ship || { flat_egp: 80, free_over_egp: 2000 };
  const [zones, setZones] = React.useState([]);

  const [promoInput, setPromoInput] = React.useState("");
  const [promo, setPromo] = React.useState(null);
  const [promoErr, setPromoErr] = React.useState("");

  const [user, setUser] = React.useState(null);
  const [authMode, setAuthMode] = React.useState("signin");
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");

  const [form, setForm] = React.useState({ full_name: "", phone: "", phone2: "", governorate: "", area: "", street: "", landmark: "" });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [done, setDone] = React.useState(null);
  const [notice, setNotice] = React.useState("");

  const lines = (cart || []).map((c) => {
    const v = (variants || []).find((x) => x.key === c.key) || { key: c.key, label_en: c.key, label_ar: c.key, price_egp: 0 };
    const label = ar ? (v.label_ar || v.label_en) : v.label_en;
    const max = typeof maxQty === "function" ? maxQty(c.key) : maxQty;
    return { key: c.key, qty: c.qty, label: v.size_ml ? v.size_ml + (ar ? " مل · " : " ml · ") + label : label, price: v.price_egp, lineTotal: v.price_egp * c.qty, max };
  });
  const subtotal = lines.reduce((a, l) => a + l.lineTotal, 0);
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const zonePrice = (gov) => { if (!gov) return null; const z = zones.find((z) => (z.governorates || []).includes(gov)); return z ? z.price_egp : (shipCfg.flat_egp || 80); };
  let shipping = zonePrice(form.governorate);            // null until a governorate is chosen
  if (promo && promo.free_shipping) shipping = 0;
  else if (shipping != null && shipCfg.free_over_egp && subtotal >= shipCfg.free_over_egp) shipping = 0;
  const shipKnown = shipping != null;
  const discount = promo ? (promo.discount || 0) : 0;
  const total = Math.max(0, subtotal - discount) + (shipKnown ? shipping : 0);

  React.useEffect(() => {
    if (!open || !window.SB_READY) return;
    let live = true;
    (async () => {
      const { data: sess } = await window.sb.auth.getSession();
      if (live && sess && sess.session) hydrateUser(sess.session.user);
    })();
    window.sb.from("shipping_zones").select("name_en,price_egp,governorates").eq("active", true).then(({ data }) => { if (live && data) setZones(data); });
    const { data: sub } = window.sb.auth.onAuthStateChange((_e, s) => { if (s) hydrateUser(s.user); else setUser(null); });
    return () => { live = false; sub && sub.subscription && sub.subscription.unsubscribe(); };
  }, [open]);

  function hydrateUser(u) {
    setUser(u); setEmail(u.email || "");
    window.sb.from("profiles").select("full_name,phone,governorate,area,street,landmark").eq("user_id", u.id).maybeSingle().then(({ data }) => {
      if (data) setForm((f) => ({
        ...f,
        full_name: f.full_name || data.full_name || "", phone: f.phone || data.phone || "",
        governorate: f.governorate || data.governorate || "", area: f.area || data.area || "",
        street: f.street || data.street || "", landmark: f.landmark || data.landmark || "",
      }));
    });
    // profiles has no WhatsApp column, so restore phone2 from the customer's most recent order.
    window.sb.from("orders").select("phone2").eq("user_id", u.id).not("phone2", "is", null).order("created_at", { ascending: false }).limit(1).maybeSingle().then(({ data }) => {
      if (data && data.phone2) setForm((f) => (f.phone2 ? f : { ...f, phone2: data.phone2 }));
    });
  }

  async function applyPromo() {
    setPromoErr(""); setPromo(null);
    const code = promoInput.trim();
    if (!code) return null;
    const r = await window.sbRpc("check_promo", { p_code: code, p_subtotal: subtotal });
    if (r && r.ok) { setPromo(r); return r; }
    setPromoErr(
      r && r.error === "min_subtotal" ? T("Spend more to use this code.", "لازم تشتري أكتر عشان تستخدمي الكود ده.")
        : r && r.error === "already_used" ? T("You’ve already used this code.", "استخدمتي الكود ده قبل كده.")
        : T("That code isn’t valid.", "الكود ده مش صحيح."));
    return null;
  }
  React.useEffect(() => { if (promo) applyPromo(); /* eslint-disable-next-line */ }, [subtotal]);
  // Auto-apply as the customer types (debounced) so the discount shows without pressing Apply.
  React.useEffect(() => {
    const code = promoInput.trim();
    if (!code) { setPromo(null); setPromoErr(""); return; }
    if (promo && String(promo.code).toLowerCase() === code.toLowerCase()) return;
    const t = setTimeout(() => { applyPromo(); }, 500);
    return () => clearTimeout(t);
    /* eslint-disable-next-line */
  }, [promoInput]);

  async function doAuth() {
    if (busy) return; setErr(""); setBusy(true);
    try {
      if (authMode === "signin") {
        const { error } = await window.sb.auth.signInWithPassword({ email: email.trim(), password: pw });
        if (error) setErr(error.message);
      } else {
        const { data, error } = await window.sb.auth.signUp({ email: email.trim(), password: pw, options: { data: { full_name: form.full_name || null, phone: form.phone || null, lang: ar ? "ar" : "en" } } });
        if (error) { setErr(error.message); return; }
        if (!data.session) { setNotice(T("Account created. Check your email to confirm, then sign in to finish your order.", "تم إنشاء الحساب. راجعي بريدك للتأكيد، وبعدين سجّلي دخول عشان تكمّلي الطلب.")); setAuthMode("signin"); }
      }
    } finally { setBusy(false); }
  }

  async function placeOrder() {
    if (busy) return; setErr("");
    if (!form.phone2 || !form.phone2.trim()) { setErr(T("Enter your WhatsApp number.", "اكتبي رقم الواتساب.")); return; }
    // If a code was typed but "Apply" wasn't pressed, validate it now so the discount still counts.
    const typedCode = promoInput.trim();
    let usePromo = promo;
    if (typedCode && (!promo || String(promo.code).toLowerCase() !== typedCode.toLowerCase())) {
      usePromo = await applyPromo();
    }
    setBusy(true);
    try {
      const payload = {
        lang: ar ? "ar" : "en", full_name: form.full_name, phone: egPhone(form.phone), phone2: egPhone(form.phone2),
        governorate: form.governorate, area: form.area, street: form.street, landmark: form.landmark,
        promo_code: usePromo ? usePromo.code : null,
        payment_method: pay,
        items: lines.map((l) => ({ variant_key: l.key, qty: l.qty })),
      };
      const r = await window.sbRpc("place_order", { payload });
      if (r && r.ok) {
        setDone(r); if (onClear) onClear();
        // InstaPay: send the customer straight to WhatsApp with their order number
        // and amount already written in — all they do is attach the screenshot.
        const waRedirect = pay === "instapay"
          ? "https://wa.me/" + SHOP_WA + "?text=" + encodeURIComponent(
              T("Hi Strands! My order ", "أهلاً ستراندز! طلبي ") + r.order_number +
              T(" — total ", " — الإجمالي ") + money(r.total) +
              T(". I’m paying by InstaPay here: ", ". هدفع بإنستاباي من هنا: ") + INSTAPAY_URL +
              T(" — I’ll send the payment screenshot in this chat.", " — وهبعت صورة التحويل في نفس المحادثة."))
          : null;
        try {
          const { data: o } = await window.sb.from("orders").select("id").eq("order_number", r.order_number).maybeSingle();
          if (o) { const inv = window.sb.functions.invoke("notify-order", { body: { order_id: o.id, status: "confirmed" } }); if (waRedirect) await inv; }
        } catch (e) { /* non-blocking */ }
        if (waRedirect) window.location.href = waRedirect;  // hand off to WhatsApp
      } else {
        const map = {
          auth_required: T("Please sign in to place your order.", "سجّلي دخول عشان تكملي الطلب."),
          name_required: T("Enter your full name.", "اكتبي اسمك كامل."),
          phone_invalid: T("Enter a valid phone number.", "اكتبي رقم تليفون صحيح."),
          governorate_required: T("Choose your governorate.", "اختاري المحافظة."),
          address_required: T("Enter your street address.", "اكتبي عنوان الشارع."),
          cart_empty: window.copy("co.empty", "Your cart is empty.", "سلتك فاضية."),
          promo_already_used: T("You’ve already used this code — remove it to continue.", "استخدمتي الكود ده قبل كده — شيليه عشان تكملي."),
          too_fast: T("You just placed an order — give it a moment before trying again.", "لسه دلوقتي عملتي طلب — استني شوية قبل ما تحاولي تاني."),
          rate_limited: T("Too many orders in a short time. Please try again later.", "طلبات كتير في وقت قصير. حاولي تاني بعد شوية."),
          out_of_stock: T("Sorry — this just went out of stock.", "للأسف المنتج خلص من المخزون."),
        };
        setErr((r && map[r.error]) || (r && r.error) || T("Could not place the order.", "معرفناش نكمّل الطلب."));
      }
    } finally { setBusy(false); }
  }

  if (!open) return null;
  const panel = { position: "fixed", top: 0, bottom: 0, insetInlineEnd: 0, width: "min(460px, 100vw)", background: "var(--cream)", zIndex: 60, boxShadow: "-8px 0 40px rgba(0,0,0,.14)", display: "flex", flexDirection: "column", overflowY: "auto" };
  // minmax(0,1fr) keeps these single/two-column grids from stretching to a wide
  // child's max-content, which in RTL overflowed the drawer to the left (clipped).
  const field = { display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "var(--space-3)" };
  const row2 = { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "var(--space-3)" };
  const heading = done ? T("Order placed", "تم الطلب") : step === "cart" ? window.copy("co.cart.title", "Your cart", "سلتك") : window.copy("co.checkout.title", "Checkout", "إتمام الطلب");

  return (
    <div>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(30,24,20,.4)", zIndex: 59 }} />
      <aside style={panel} role="dialog" aria-label={heading}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-4) var(--space-5)", borderBottom: "1px solid var(--rule)", position: "sticky", top: 0, background: "var(--cream)", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {step === "checkout" && !done && <button type="button" onClick={() => setStep("cart")} aria-label={T("Back to cart", "رجوع للسلة")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", display: "grid", placeItems: "center" }}><Icon name={ar ? "arrow-right" : "arrow-left"} size={18} /></button>}
            <strong style={{ fontSize: 18 }}>{heading}{step === "cart" && count ? " · " + count : ""}</strong>
          </div>
          <button type="button" onClick={onClose} aria-label={T("Close", "إغلاق")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", display: "grid", placeItems: "center", width: 36, height: 36 }}><Icon name="x" size={20} /></button>
        </header>

        {done ? (
          <div style={{ padding: "var(--space-6) var(--space-5)", display: "grid", gap: "var(--space-4)" }}>
            <div style={{ display: "grid", placeItems: "center", gap: "var(--space-3)", textAlign: "center", padding: "var(--space-4) 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--green)", color: "var(--white)", display: "grid", placeItems: "center" }}><Icon name="check" size={28} /></div>
              <h2 style={{ fontSize: 24 }}>{window.copy("co.done.title", "Thank you.", "شكرًا ليكي.")}</h2>
              {pay === "instapay"
                ? <p style={{ color: "var(--ink-2)" }}>{T("Your order", "طلبك")} <strong style={{ color: "var(--ink)" }}>{done.order_number}</strong> {T("is placed. Tap WhatsApp below — your order number is already in the message. Pay", "اتسجّل. اضغطي واتساب تحت — رقم طلبك موجود في الرسالة. حوّلي")} <strong style={{ color: "var(--ink)" }}>{money(done.total)}</strong> {T("by InstaPay to", "بإنستاباي لـ")} <strong style={{ color: "var(--ink)" }}>{INSTAPAY_HANDLE}</strong>{T(", then send the screenshot in the same chat.", "، وابعتي صورة التحويل في نفس المحادثة.")}</p>
                : <p style={{ color: "var(--ink-2)" }}>{T("Your order", "طلبك")} <strong style={{ color: "var(--ink)" }}>{done.order_number}</strong> {T("is in. We’ll message you as it moves. Pay", "وصلنا. هنبعتلك مع كل خطوة. ادفعي")} <strong style={{ color: "var(--ink)" }}>{money(done.total)}</strong> {T("on delivery.", "عند الاستلام.")}</p>}
            </div>
            {pay === "instapay" && <Button fullWidth onClick={() => window.open("https://wa.me/" + SHOP_WA + "?text=" + encodeURIComponent(T("Hi Strands! My order ", "أهلاً ستراندز! طلبي ") + done.order_number + T(" — total ", " — الإجمالي ") + money(done.total) + T(". Paying by InstaPay — I’ll send the screenshot here.", ". بدفع بإنستاباي — وهبعت صورة التحويل هنا.")), "_blank", "noopener")}>{T("Message us on WhatsApp", "كلّمينا على واتساب")}</Button>}
            {pay === "instapay" && <Button fullWidth variant="quiet" onClick={() => window.open(INSTAPAY_URL, "_blank", "noopener")}>{T("Open InstaPay to pay", "افتحي إنستاباي للدفع")} {money(done.total)}</Button>}
            <Button fullWidth variant={pay === "instapay" ? "text" : undefined} onClick={() => (window.location.href = "../account/index.html")}>{window.copy("co.done.track", "Track it in your account", "تابعي طلبك من حسابك")}</Button>
            <Button fullWidth variant="quiet" onClick={() => { setDone(null); onClose(); }}>{window.copy("co.done.keep", "Keep browsing", "كملي تسوّق")}</Button>
          </div>
        ) : lines.length === 0 ? (
          <div style={{ padding: "var(--space-7) var(--space-5)", display: "grid", gap: "var(--space-4)", placeItems: "center", textAlign: "center" }}>
            <Icon name="shopping-bag" size={32} />
            <p style={{ color: "var(--ink-2)" }}>{window.copy("co.empty", "Your cart is empty.", "سلتك فاضية.")}</p>
            <Button onClick={onClose}>{window.copy("co.keepShopping", "Continue shopping", "كملي تسوّق")}</Button>
          </div>
        ) : step === "cart" ? (
          <div style={{ padding: "var(--space-5)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "var(--space-5)" }}>
            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              {lines.map((l) => (
                <div key={l.key} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--space-3)", alignItems: "center", background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: "12px 14px" }}>
                  <div style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: 600 }}>{l.label}</span>
                    <span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>{money(l.price)} {window.copy("co.each", "each", "للعلبة")}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button type="button" aria-label={T("Fewer", "أقل")} onClick={() => onSetQty(l.key, l.qty - 1)} style={stepBtn}>–</button>
                      <span style={{ minWidth: 22, textAlign: "center", fontFamily: "var(--font-numeric)" }}>{l.qty}</span>
                      <button type="button" aria-label={T("More", "أكتر")} disabled={Number.isFinite(l.max) && l.qty >= l.max} onClick={() => onSetQty(l.key, l.qty + 1)} style={Number.isFinite(l.max) && l.qty >= l.max ? { ...stepBtn, opacity: 0.4, cursor: "not-allowed" } : stepBtn}>+</button>
                      <button type="button" onClick={() => onRemove(l.key)} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", fontSize: "var(--text-fine-size)", marginInlineStart: 6 }}>{window.copy("co.remove", "Remove", "إزالة")}</button>
                      {Number.isFinite(l.max) && l.qty >= l.max && <span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)", marginInlineStart: 4 }}>{T("Max in stock", "الحد المتاح")}</span>}
                    </div>
                  </div>
                  <span style={{ fontFamily: "var(--font-numeric)", fontWeight: 600 }}>{money(l.lineTotal)}</span>
                </div>
              ))}
            </div>
            <section style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: "var(--space-4)", display: "grid", gap: 8, fontSize: "var(--text-small)" }}>
              <Row k={window.copy("co.subtotal", "Subtotal", "الإجمالي الفرعي")} v={money(subtotal)} />
              <Row k={window.copy("co.shipping", "Shipping", "الشحن")} v={shipKnown ? (shipping ? money(shipping) : window.copy("co.free", "Free", "مجاني")) : window.copy("co.shipping.tbd", "Set at checkout", "تُحسب عند الطلب")} />
              <div style={{ borderTop: "1px solid var(--rule)", marginTop: 4, paddingTop: 8 }}><Row k={window.copy("co.total", "Total (cash on delivery)", "الإجمالي (الدفع عند الاستلام)")} v={money(subtotal + (shipKnown ? shipping : 0))} bold /></div>
            </section>
            <Button fullWidth onClick={() => setStep("checkout")}>{window.copy("co.checkout.title", "Checkout", "إتمام الطلب")} — {money(subtotal + (shipKnown ? shipping : 0))}</Button>
            <button type="button" onClick={onClose} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", cursor: "pointer", color: "var(--green)", fontSize: "var(--text-small)" }}>{window.copy("co.keepShopping", "Continue shopping", "كملي تسوّق")}</button>
          </div>
        ) : (
          <div style={{ padding: "var(--space-5)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "var(--space-5)" }}>
            <section style={field}>
              <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "end" }}>
                <div style={{ flex: 1, minWidth: 0 }}><Input label={window.copy("co.promo.label", "Discount code", "كود الخصم")} value={promoInput} onChange={setPromoInput} placeholder={T("e.g. NOUR10", "مثال: NOUR10")} /></div>
                <Button size="sm" variant="quiet" onClick={applyPromo}>{window.copy("co.promo.apply", "Apply", "تطبيق")}</Button>
              </div>
              {promo && <InlineAlert tone="ok">{T("Code", "الكود")} {promo.code} {T("applied.", "اتفعّل.")}</InlineAlert>}
              {promoErr && <InlineAlert tone="error">{promoErr}</InlineAlert>}
            </section>

            {!user ? (
              <section style={{ ...field, background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: "var(--space-4)" }}>
                <strong style={{ fontSize: 15 }}>{authMode === "signin" ? window.copy("co.auth.signinTitle", "Sign in to order", "سجّلي دخول للطلب") : window.copy("co.auth.createTitle", "Create your account", "أنشئي حسابك")}</strong>
                <p style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)", margin: 0 }}>{window.copy("co.auth.note", "Orders are cash on delivery. An account lets you track them.", "الطلبات بالدفع عند الاستلام. الحساب بيخليكي تتابعي طلباتك.")}</p>
                <Input label={window.copy("co.email", "Email", "البريد الإلكتروني")} type="email" value={email} onChange={setEmail} />
                <Input label={window.copy("co.password", "Password", "كلمة السر")} type="password" value={pw} onChange={setPw} />
                {notice && <InlineAlert tone="ok">{notice}</InlineAlert>}
                <Button fullWidth onClick={doAuth} disabled={busy}>{busy ? "…" : authMode === "signin" ? window.copy("co.signin", "Sign in", "دخول") : window.copy("co.createAccount", "Create account", "إنشاء حساب")}</Button>
                <button type="button" onClick={() => { setAuthMode(authMode === "signin" ? "signup" : "signin"); setErr(""); setNotice(""); }} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", cursor: "pointer", color: "var(--green)", fontSize: "var(--text-small)" }}>
                  {authMode === "signin" ? T("New here? Create an account", "أول مرة؟ أنشئي حساب") : T("Already have an account? Sign in", "عندك حساب؟ سجّلي دخول")}
                </button>
              </section>
            ) : (
              <section style={field}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "var(--text-small)", color: "var(--ink-2)" }}>{T("Signed in as", "داخلة باسم")} {user.email}</span>
                  <button type="button" onClick={() => window.sb.auth.signOut()} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", cursor: "pointer", color: "var(--green)", fontSize: "var(--text-small)" }}>{T("Sign out", "خروج")}</button>
                </div>
                <Input label={window.copy("co.fullName", "Full name", "الاسم بالكامل")} value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
                <PhoneField label={window.copy("co.phone", "Phone", "التليفون")} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="10 1234 5678" />
                <PhoneField label={window.copy("co.whatsapp", "WhatsApp", "واتساب")} value={form.phone2} onChange={(v) => setForm({ ...form, phone2: v })} placeholder="10 1234 5678" hint={T("we’ll confirm your order on WhatsApp", "هنأكد طلبك على واتساب")} />
                <Select label={window.copy("co.gov", "Governorate", "المحافظة")} value={form.governorate} onChange={(v) => setForm({ ...form, governorate: v })} options={[{ value: "", label: window.copy("co.choose", "Choose…", "اختاري…") }].concat((window.EG_GOVERNORATES || []).map((g) => ({ value: g[0], label: ar ? g[1] : g[0] })))} />
                <Input label={window.copy("co.street", "Street address", "عنوان الشارع")} value={form.street} onChange={(v) => setForm({ ...form, street: v })} placeholder={T("Building, street", "العمارة، الشارع")} />
                <div style={row2}>
                  <Input label={window.copy("co.area", "Area (optional)", "المنطقة (اختياري)")} value={form.area} onChange={(v) => setForm({ ...form, area: v })} />
                  <Input label={window.copy("co.landmark", "Landmark (optional)", "علامة مميزة (اختياري)")} value={form.landmark} onChange={(v) => setForm({ ...form, landmark: v })} />
                </div>
              </section>
            )}

            <section style={field}>
              <strong style={{ fontSize: 15 }}>{T("How would you like to pay?", "طريقة الدفع")}</strong>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "var(--space-3)" }}>
                <PayOption active={pay === "cod"} onClick={() => setPay("cod")} title={T("Cash on delivery", "الدفع عند الاستلام")} sub={T("Pay the courier", "ادفعي للمندوب")} />
                <PayOption active={pay === "instapay"} onClick={() => setPay("instapay")} title={T("InstaPay", "إنستاباي")} sub={T("Pay now, send proof", "ادفعي وابعتي الإيصال")} />
              </div>
              {pay === "instapay" && <p style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)", margin: 0 }}>{T("After you place the order you’ll get the InstaPay link. Pay, then send us a screenshot on WhatsApp with your order number.", "بعد ما تعملي الطلب هيظهرلك لينك إنستاباي. ادفعي وابعتيلنا صورة التحويل على واتساب مع رقم الطلب.")}</p>}
            </section>

            {err && <InlineAlert tone="error">{err}</InlineAlert>}
            <section style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: "var(--space-4)", display: "grid", gap: 8, fontSize: "var(--text-small)" }}>
              <Row k={window.copy("co.subtotal", "Subtotal", "الإجمالي الفرعي")} v={money(subtotal)} />
              {discount ? <Row k={window.copy("co.discount", "Discount", "خصم") + " (" + promo.code + ")"} v={"– " + money(discount)} green /> : null}
              <Row k={window.copy("co.shipping", "Shipping", "الشحن")} v={shipKnown ? (shipping ? money(shipping) : window.copy("co.free", "Free", "مجاني")) : window.copy("co.shipping.tbd", "Set at checkout", "تُحسب عند الطلب")} />
              <div style={{ borderTop: "1px solid var(--rule)", marginTop: 4, paddingTop: 8 }}><Row k={pay === "instapay" ? T("Total (pay by InstaPay)", "الإجمالي (الدفع بإنستاباي)") : window.copy("co.total", "Total (cash on delivery)", "الإجمالي (الدفع عند الاستلام)")} v={money(total)} bold /></div>
            </section>
            {user && <Button fullWidth onClick={placeOrder} disabled={busy}>{busy ? T("Placing…", "بنكمّل…") : window.copy("co.placeOrder", "Place order — ", "إتمام الطلب — ") + money(total)}</Button>}
          </div>
        )}
      </aside>
    </div>
  );
}

const stepBtn = { font: "inherit", width: 30, height: 30, borderRadius: "var(--radius-control)", border: "1px solid var(--rule)", background: "var(--white)", cursor: "pointer", fontSize: 17, lineHeight: 1 };
function PayOption({ active, onClick, title, sub }) {
  return <button type="button" onClick={onClick} style={{ textAlign: "start", cursor: "pointer", font: "inherit", fontFamily: "var(--font-sans)", background: active ? "var(--purple-tint)" : "var(--white)", border: "1.5px solid " + (active ? "var(--purple)" : "var(--rule)"), borderRadius: "var(--radius-card)", padding: "12px 14px", display: "grid", gap: 3 }}>
    <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>
    <span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>{sub}</span>
  </button>;
}
function Row({ k, v, bold, green }) {
  return <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span style={{ color: "var(--ink-2)" }}>{k}</span>
    <span style={{ fontFamily: "var(--font-numeric)", fontWeight: bold ? 700 : 500, color: green ? "var(--green)" : "var(--ink)" }}>{v}</span>
  </div>;
}
Object.assign(window, { StrandsCheckout: Checkout });
