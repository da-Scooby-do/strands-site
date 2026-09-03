/* Cart + checkout drawer. The customer can open the bag, see everything in it,
   change quantities, remove lines, then check out. Cart contents come from the
   Page (persisted in localStorage). Checkout talks to Supabase:
   check_promo (anon), Supabase Auth (place_order needs a signed-in customer),
   and place_order for the real cash-on-delivery order. */
const { Button, Input, Select, InlineAlert, Icon } = window.StrandsDesignSystem_6d0a65;

function money(n) { return (n | 0).toLocaleString("en-US") + " EGP"; }

function Checkout({ open, onClose, cart, variants, ship, onSetQty, onRemove, onClear }) {
  const [step, setStep] = React.useState("cart"); // cart | checkout
  const shipCfg = ship || { flat_egp: 80, free_over_egp: 2000 };

  const [promoInput, setPromoInput] = React.useState("");
  const [promo, setPromo] = React.useState(null);
  const [promoErr, setPromoErr] = React.useState("");

  const [user, setUser] = React.useState(null);
  const [authMode, setAuthMode] = React.useState("signin");
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");

  const [form, setForm] = React.useState({ full_name: "", phone: "", governorate: "", area: "", street: "", landmark: "" });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [done, setDone] = React.useState(null);
  const [notice, setNotice] = React.useState("");

  // Join cart lines with their live variant (label + price).
  const lines = (cart || []).map((c) => {
    const v = (variants || []).find((x) => x.key === c.key) || { key: c.key, label_en: c.key, price_egp: 0 };
    return { key: c.key, qty: c.qty, label: v.label_en, price: v.price_egp, lineTotal: v.price_egp * c.qty };
  });
  const subtotal = lines.reduce((a, l) => a + l.lineTotal, 0);
  const count = lines.reduce((a, l) => a + l.qty, 0);
  let shipping = subtotal >= (shipCfg.free_over_egp || 2000) ? 0 : (shipCfg.flat_egp || 80);
  if (promo && promo.free_shipping) shipping = 0;
  const discount = promo ? (promo.discount || 0) : 0;
  const total = Math.max(0, subtotal - discount) + (subtotal > 0 ? shipping : 0);

  // Session + profile prefill when the drawer opens.
  React.useEffect(() => {
    if (!open || !window.SB_READY) return;
    let live = true;
    (async () => {
      const { data: sess } = await window.sb.auth.getSession();
      if (live && sess && sess.session) hydrateUser(sess.session.user);
    })();
    const { data: sub } = window.sb.auth.onAuthStateChange((_e, s) => { if (s) hydrateUser(s.user); else setUser(null); });
    return () => { live = false; sub && sub.subscription && sub.subscription.unsubscribe(); };
  }, [open]);

  function hydrateUser(u) {
    setUser(u); setEmail(u.email || "");
    window.sb.from("profiles").select("full_name,phone,governorate,area,street,landmark").eq("user_id", u.id).maybeSingle().then(({ data }) => {
      if (data) setForm((f) => ({
        full_name: f.full_name || data.full_name || "", phone: f.phone || data.phone || "",
        governorate: f.governorate || data.governorate || "", area: f.area || data.area || "",
        street: f.street || data.street || "", landmark: f.landmark || data.landmark || "",
      }));
    });
  }

  async function applyPromo() {
    setPromoErr(""); setPromo(null);
    const code = promoInput.trim();
    if (!code) return;
    const r = await window.sbRpc("check_promo", { p_code: code, p_subtotal: subtotal });
    if (r && r.ok) setPromo(r);
    else setPromoErr(r && r.error === "min_subtotal" ? "Spend more to use this code." : "That code isn’t valid.");
  }
  React.useEffect(() => { if (promo) applyPromo(); /* eslint-disable-next-line */ }, [subtotal]);

  async function doAuth() {
    if (busy) return; setErr(""); setBusy(true);
    try {
      if (authMode === "signin") {
        const { error } = await window.sb.auth.signInWithPassword({ email: email.trim(), password: pw });
        if (error) setErr(error.message);
      } else {
        const { data, error } = await window.sb.auth.signUp({ email: email.trim(), password: pw, options: { data: { full_name: form.full_name || null, phone: form.phone || null, lang: "en" } } });
        if (error) { setErr(error.message); return; }
        if (!data.session) { setNotice("Account created. Check your email to confirm, then sign in to finish your order."); setAuthMode("signin"); }
      }
    } finally { setBusy(false); }
  }

  async function placeOrder() {
    if (busy) return; setErr(""); setBusy(true);
    try {
      const payload = {
        lang: "en", full_name: form.full_name, phone: form.phone,
        governorate: form.governorate, area: form.area, street: form.street, landmark: form.landmark,
        promo_code: promo ? promo.code : null,
        items: lines.map((l) => ({ variant_key: l.key, qty: l.qty })),
      };
      const r = await window.sbRpc("place_order", payload);
      if (r && r.ok) {
        setDone(r); if (onClear) onClear();
        // Fire the "order received" email (function allows the order's owner for 'placed').
        try {
          const { data: o } = await window.sb.from("orders").select("id").eq("order_number", r.order_number).maybeSingle();
          if (o) window.sb.functions.invoke("notify-order", { body: { order_id: o.id, status: "placed" } });
        } catch (e) { /* non-blocking */ }
      }
      else {
        const map = { auth_required: "Please sign in to place your order.", name_required: "Enter your full name.", phone_invalid: "Enter a valid phone number.", governorate_required: "Choose your governorate.", address_required: "Enter your street address.", cart_empty: "Your cart is empty." };
        setErr((r && map[r.error]) || (r && r.error) || "Could not place the order.");
      }
    } finally { setBusy(false); }
  }

  if (!open) return null;
  const panel = { position: "fixed", top: 0, bottom: 0, insetInlineEnd: 0, width: "min(460px, 100vw)", background: "var(--cream)", zIndex: 60, boxShadow: "-8px 0 40px rgba(0,0,0,.14)", display: "flex", flexDirection: "column", overflowY: "auto" };
  const field = { display: "grid", gap: "var(--space-3)" };
  const row2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" };
  const heading = done ? "Order placed" : step === "cart" ? "Your cart" : "Checkout";

  return (
    <div>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(30,24,20,.4)", zIndex: 59 }} />
      <aside style={panel} role="dialog" aria-label={heading}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-4) var(--space-5)", borderBottom: "1px solid var(--rule)", position: "sticky", top: 0, background: "var(--cream)", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {step === "checkout" && !done && <button type="button" onClick={() => setStep("cart")} aria-label="Back to cart" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", display: "grid", placeItems: "center" }}><Icon name="arrow-left" size={18} /></button>}
            <strong style={{ fontSize: 18 }}>{heading}{step === "cart" && count ? " · " + count : ""}</strong>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", display: "grid", placeItems: "center", width: 36, height: 36 }}><Icon name="x" size={20} /></button>
        </header>

        {done ? (
          <div style={{ padding: "var(--space-6) var(--space-5)", display: "grid", gap: "var(--space-4)" }}>
            <div style={{ display: "grid", placeItems: "center", gap: "var(--space-3)", textAlign: "center", padding: "var(--space-4) 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--green)", color: "var(--white)", display: "grid", placeItems: "center" }}><Icon name="check" size={28} /></div>
              <h2 style={{ fontSize: 24 }}>Thank you.</h2>
              <p style={{ color: "var(--ink-2)" }}>Your order <strong style={{ color: "var(--ink)" }}>{done.order_number}</strong> is in. We’ll message you as it moves. Pay <strong style={{ color: "var(--ink)" }}>{money(done.total)}</strong> on delivery.</p>
            </div>
            <Button fullWidth onClick={() => (window.location.href = "../account/index.html")}>Track it in your account</Button>
            <Button fullWidth variant="quiet" onClick={() => { setDone(null); onClose(); }}>Keep browsing</Button>
          </div>
        ) : lines.length === 0 ? (
          <div style={{ padding: "var(--space-7) var(--space-5)", display: "grid", gap: "var(--space-4)", placeItems: "center", textAlign: "center" }}>
            <Icon name="shopping-bag" size={32} />
            <p style={{ color: "var(--ink-2)" }}>Your cart is empty.</p>
            <Button onClick={onClose}>Continue shopping</Button>
          </div>
        ) : step === "cart" ? (
          <div style={{ padding: "var(--space-5)", display: "grid", gap: "var(--space-5)" }}>
            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              {lines.map((l) => (
                <div key={l.key} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--space-3)", alignItems: "center", background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: "12px 14px" }}>
                  <div style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: 600 }}>{l.label}</span>
                    <span style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)" }}>{money(l.price)} each</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button type="button" aria-label="Fewer" onClick={() => onSetQty(l.key, l.qty - 1)} style={stepBtn}>–</button>
                      <span style={{ minWidth: 22, textAlign: "center", fontFamily: "var(--font-numeric)" }}>{l.qty}</span>
                      <button type="button" aria-label="More" onClick={() => onSetQty(l.key, l.qty + 1)} style={stepBtn}>+</button>
                      <button type="button" onClick={() => onRemove(l.key)} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", fontSize: "var(--text-fine-size)", marginInlineStart: 6 }}>Remove</button>
                    </div>
                  </div>
                  <span style={{ fontFamily: "var(--font-numeric)", fontWeight: 600 }}>{money(l.lineTotal)}</span>
                </div>
              ))}
            </div>
            <section style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: "var(--space-4)", display: "grid", gap: 8, fontSize: "var(--text-small)" }}>
              <Row k="Subtotal" v={money(subtotal)} />
              <Row k="Shipping" v={shipping ? money(shipping) : "Free"} />
              <div style={{ borderTop: "1px solid var(--rule)", marginTop: 4, paddingTop: 8 }}><Row k="Total (cash on delivery)" v={money(subtotal + shipping)} bold /></div>
            </section>
            <Button fullWidth onClick={() => setStep("checkout")}>Checkout — {money(subtotal + shipping)}</Button>
            <button type="button" onClick={onClose} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", cursor: "pointer", color: "var(--green)", fontSize: "var(--text-small)" }}>Continue shopping</button>
          </div>
        ) : (
          <div style={{ padding: "var(--space-5)", display: "grid", gap: "var(--space-5)" }}>
            {/* Promo */}
            <section style={field}>
              <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "end" }}>
                <div style={{ flex: 1 }}><Input label="Discount code" value={promoInput} onChange={setPromoInput} placeholder="e.g. NOUR10" /></div>
                <Button size="sm" variant="quiet" onClick={applyPromo}>Apply</Button>
              </div>
              {promo && <InlineAlert tone="ok">Code {promo.code} applied.</InlineAlert>}
              {promoErr && <InlineAlert tone="error">{promoErr}</InlineAlert>}
            </section>

            {/* Auth */}
            {!user ? (
              <section style={{ ...field, background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: "var(--space-4)" }}>
                <strong style={{ fontSize: 15 }}>{authMode === "signin" ? "Sign in to order" : "Create your account"}</strong>
                <p style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)", margin: 0 }}>Orders are cash on delivery. An account lets you track them.</p>
                <Input label="Email" type="email" value={email} onChange={setEmail} />
                <Input label="Password" type="password" value={pw} onChange={setPw} />
                {notice && <InlineAlert tone="ok">{notice}</InlineAlert>}
                <Button fullWidth onClick={doAuth} disabled={busy}>{busy ? "…" : authMode === "signin" ? "Sign in" : "Create account"}</Button>
                <button type="button" onClick={() => { setAuthMode(authMode === "signin" ? "signup" : "signin"); setErr(""); setNotice(""); }} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", cursor: "pointer", color: "var(--green)", fontSize: "var(--text-small)" }}>
                  {authMode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
                </button>
              </section>
            ) : (
              <section style={field}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "var(--text-small)", color: "var(--ink-2)" }}>Signed in as {user.email}</span>
                  <button type="button" onClick={() => window.sb.auth.signOut()} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", cursor: "pointer", color: "var(--green)", fontSize: "var(--text-small)" }}>Sign out</button>
                </div>
                <Input label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
                <div style={row2}>
                  <Input label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  <Select label="Governorate" value={form.governorate} onChange={(v) => setForm({ ...form, governorate: v })} options={[{ value: "", label: "Choose…" }].concat((window.EG_GOVERNORATES || []).map((g) => ({ value: g[0], label: g[0] })))} />
                </div>
                <Input label="Street address" value={form.street} onChange={(v) => setForm({ ...form, street: v })} placeholder="Building, street" />
                <div style={row2}>
                  <Input label="Area (optional)" value={form.area} onChange={(v) => setForm({ ...form, area: v })} />
                  <Input label="Landmark (optional)" value={form.landmark} onChange={(v) => setForm({ ...form, landmark: v })} />
                </div>
              </section>
            )}

            {err && <InlineAlert tone="error">{err}</InlineAlert>}
            <section style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: "var(--space-4)", display: "grid", gap: 8, fontSize: "var(--text-small)" }}>
              <Row k="Subtotal" v={money(subtotal)} />
              {discount ? <Row k={"Discount (" + promo.code + ")"} v={"– " + money(discount)} green /> : null}
              <Row k="Shipping" v={shipping ? money(shipping) : "Free"} />
              <div style={{ borderTop: "1px solid var(--rule)", marginTop: 4, paddingTop: 8 }}><Row k="Total (cash on delivery)" v={money(total)} bold /></div>
            </section>
            {user && <Button fullWidth onClick={placeOrder} disabled={busy}>{busy ? "Placing…" : "Place order — " + money(total)}</Button>}
          </div>
        )}
      </aside>
    </div>
  );
}

const stepBtn = { font: "inherit", width: 30, height: 30, borderRadius: "var(--radius-control)", border: "1px solid var(--rule)", background: "var(--white)", cursor: "pointer", fontSize: 17, lineHeight: 1 };
function Row({ k, v, bold, green }) {
  return <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span style={{ color: "var(--ink-2)" }}>{k}</span>
    <span style={{ fontFamily: "var(--font-numeric)", fontWeight: bold ? 700 : 500, color: green ? "var(--green)" : "var(--ink)" }}>{v}</span>
  </div>;
}
Object.assign(window, { StrandsCheckout: Checkout });
