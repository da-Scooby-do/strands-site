/* Live checkout drawer. Talks to the strands-store Supabase project:
   - product_variants + settings (anon read) for prices and shipping
   - check_promo (anon rpc) for discounts
   - Supabase Auth (place_order requires a signed-in customer)
   - place_order (rpc) to create the real order
   Opens from any "Add to cart" button via window.StrandsCheckout. */
const { Button, Input, Select, InlineAlert, Icon } = window.StrandsDesignSystem_6d0a65;

function money(n) { return (n | 0).toLocaleString("en-US") + " EGP"; }

function Checkout({ open, onClose, initialVariant, variants: variantsProp, ship: shipProp }) {
  const [variants, setVariants] = React.useState(variantsProp || null);
  const [ship, setShip] = React.useState(shipProp || { flat_egp: 80, free_over_egp: 2000 });
  const [vkey, setVkey] = React.useState(initialVariant || "1jar");
  React.useEffect(() => { setVkey(initialVariant || "1jar"); }, [initialVariant]);
  React.useEffect(() => { if (variantsProp) setVariants(variantsProp); }, [variantsProp]);
  React.useEffect(() => { if (shipProp) setShip(shipProp); }, [shipProp]);
  const [qty, setQty] = React.useState(1);

  const [promoInput, setPromoInput] = React.useState("");
  const [promo, setPromo] = React.useState(null);      // {code,discount,free_shipping}
  const [promoErr, setPromoErr] = React.useState("");

  const [user, setUser] = React.useState(null);
  const [authMode, setAuthMode] = React.useState("signin");
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");

  const [form, setForm] = React.useState({ full_name: "", phone: "", governorate: "", area: "", street: "", landmark: "" });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [done, setDone] = React.useState(null);        // {order_number,total,...}
  const [notice, setNotice] = React.useState("");

  // Load variants + shipping settings + current session when first opened.
  React.useEffect(() => {
    if (!open || !window.SB_READY) return;
    let live = true;
    (async () => {
      const [{ data: vs }, { data: st }] = await Promise.all([
        window.sb.from("product_variants").select("key,label_en,jars,price_egp,save_egp,badge_en,sort,active").eq("active", true).order("sort"),
        window.sb.from("settings").select("value").eq("key", "shipping").maybeSingle(),
      ]);
      if (!live) return;
      if (vs && vs.length) setVariants(vs);
      if (st && st.value) setShip(st.value);
      const { data: sess } = await window.sb.auth.getSession();
      if (sess && sess.session) hydrateUser(sess.session.user);
    })();
    const { data: sub } = window.sb.auth.onAuthStateChange((_e, s) => { if (s) hydrateUser(s.user); else setUser(null); });
    return () => { live = false; sub && sub.subscription && sub.subscription.unsubscribe(); };
  }, [open]);

  function hydrateUser(u) {
    setUser(u);
    setEmail(u.email || "");
    // prefill name/phone from the account profile if present
    window.sb.from("profiles").select("full_name,phone,governorate,area,street,landmark").eq("user_id", u.id).maybeSingle().then(({ data }) => {
      if (data) setForm((f) => ({
        full_name: f.full_name || data.full_name || "",
        phone: f.phone || data.phone || "",
        governorate: f.governorate || data.governorate || "",
        area: f.area || data.area || "",
        street: f.street || data.street || "",
        landmark: f.landmark || data.landmark || "",
      }));
    });
  }

  const variant = React.useMemo(
    () => (variants || []).find((v) => v.key === vkey) || { price_egp: 0, label_en: "", jars: 1 },
    [variants, vkey]
  );
  const subtotal = variant.price_egp * qty;
  let shipping = subtotal >= (ship.free_over_egp || 2000) ? 0 : (ship.flat_egp || 80);
  if (promo && promo.free_shipping) shipping = 0;
  const discount = promo ? (promo.discount || 0) : 0;
  const total = Math.max(0, subtotal - discount) + shipping;

  async function applyPromo() {
    setPromoErr(""); setPromo(null);
    const code = promoInput.trim();
    if (!code) return;
    const r = await window.sbRpc("check_promo", { p_code: code, p_subtotal: subtotal });
    if (r && r.ok) { setPromo(r); setPromoErr(""); }
    else setPromoErr(r && r.error === "min_subtotal" ? "Spend more to use this code." : "That code isn’t valid.");
  }
  // Re-price an applied promo when the cart changes.
  React.useEffect(() => { if (promo) applyPromo(); /* eslint-disable-next-line */ }, [vkey, qty]);

  async function doAuth() {
    setErr(""); setBusy(true);
    try {
      if (authMode === "signin") {
        const { error } = await window.sb.auth.signInWithPassword({ email: email.trim(), password: pw });
        if (error) { setErr(error.message); return; }
      } else {
        const { data, error } = await window.sb.auth.signUp({
          email: email.trim(), password: pw,
          options: { data: { full_name: form.full_name || null, phone: form.phone || null, lang: "en" } },
        });
        if (error) { setErr(error.message); return; }
        if (!data.session) { setNotice("Account created. Check your email to confirm, then sign in to finish your order."); setAuthMode("signin"); return; }
      }
    } finally { setBusy(false); }
  }

  async function placeOrder() {
    setErr(""); setBusy(true);
    try {
      const payload = {
        lang: "en",
        full_name: form.full_name, phone: form.phone,
        governorate: form.governorate, area: form.area, street: form.street, landmark: form.landmark,
        promo_code: promo ? promo.code : null,
        items: [{ variant_key: vkey, qty }],
      };
      const r = await window.sbRpc("place_order", payload);
      if (r && r.ok) { setDone(r); }
      else {
        const map = {
          auth_required: "Please sign in to place your order.",
          name_required: "Enter your full name.",
          phone_invalid: "Enter a valid phone number.",
          governorate_required: "Choose your governorate.",
          address_required: "Enter your street address.",
          cart_empty: "Your cart is empty.",
        };
        setErr((r && map[r.error]) || (r && r.error) || "Could not place the order.");
      }
    } finally { setBusy(false); }
  }

  if (!open) return null;

  const panel = { position: "fixed", top: 0, bottom: 0, insetInlineEnd: 0, width: "min(460px, 100vw)", background: "var(--cream)", zIndex: 60, boxShadow: "-8px 0 40px rgba(0,0,0,.14)", display: "flex", flexDirection: "column", overflowY: "auto" };
  const field = { display: "grid", gap: "var(--space-3)" };
  const row2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" };

  return (
    <div>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(30,24,20,.4)", zIndex: 59 }} />
      <aside style={panel} role="dialog" aria-label="Checkout">
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-4) var(--space-5)", borderBottom: "1px solid var(--rule)", position: "sticky", top: 0, background: "var(--cream)", zIndex: 1 }}>
          <strong style={{ fontSize: 18 }}>{done ? "Order placed" : "Your order"}</strong>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", display: "grid", placeItems: "center", width: 36, height: 36 }}>
            <Icon name="x" size={20} />
          </button>
        </header>

        {done ? (
          <div style={{ padding: "var(--space-6) var(--space-5)", display: "grid", gap: "var(--space-4)" }}>
            <div style={{ display: "grid", placeItems: "center", gap: "var(--space-3)", textAlign: "center", padding: "var(--space-4) 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--green)", color: "var(--white)", display: "grid", placeItems: "center" }}><Icon name="check" size={28} /></div>
              <h2 style={{ fontSize: 24 }}>Thank you.</h2>
              <p style={{ color: "var(--ink-2)" }}>Your order <strong style={{ color: "var(--ink)" }}>{done.order_number}</strong> is in. We’ll message you as it moves. Pay <strong style={{ color: "var(--ink)" }}>{money(done.total)}</strong> on delivery.</p>
            </div>
            <Button fullWidth onClick={() => (window.location.href = "../account/index.html")}>Track it in your account</Button>
            <Button fullWidth variant="quiet" onClick={onClose}>Keep browsing</Button>
          </div>
        ) : (
          <div style={{ padding: "var(--space-5)", display: "grid", gap: "var(--space-5)" }}>
            {/* Variant + quantity */}
            <section style={field}>
              <label style={{ fontSize: "var(--text-small)", color: "var(--ink-2)" }}>How many jars</label>
              <div style={{ display: "grid", gap: "var(--space-2)" }}>
                {(variants || [{ key: "1jar", label_en: "1 jar", price_egp: 450, badge_en: null }]).map((v) => (
                  <button key={v.key} type="button" onClick={() => setVkey(v.key)}
                    style={{ font: "inherit", textAlign: "start", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 14px", borderRadius: "var(--radius-card)", background: "var(--white)", border: "2px solid " + (vkey === v.key ? "var(--purple)" : "var(--rule)") }}>
                    <span style={{ display: "grid" }}>
                      <span style={{ fontWeight: 600 }}>{v.label_en}{v.badge_en ? <span style={{ marginInlineStart: 8, fontSize: 10, letterSpacing: ".08em", color: "var(--green)", fontFamily: "var(--font-sans)" }}>{v.badge_en}</span> : null}</span>
                      {v.save_egp ? <span style={{ fontSize: "var(--text-fine-size)", color: "var(--green)" }}>Save {v.save_egp} EGP</span> : null}
                    </span>
                    <span style={{ fontFamily: "var(--font-numeric)", fontWeight: 600 }}>{money(v.price_egp)}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <span style={{ fontSize: "var(--text-small)", color: "var(--ink-2)" }}>Quantity</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button type="button" aria-label="Fewer" onClick={() => setQty((q) => Math.max(1, q - 1))} style={stepBtn}>–</button>
                  <span style={{ minWidth: 24, textAlign: "center", fontFamily: "var(--font-numeric)" }}>{qty}</span>
                  <button type="button" aria-label="More" onClick={() => setQty((q) => Math.min(20, q + 1))} style={stepBtn}>+</button>
                </div>
              </div>
            </section>

            {/* Promo */}
            <section style={field}>
              <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "end" }}>
                <div style={{ flex: 1 }}><Input label="Discount code" value={promoInput} onChange={setPromoInput} placeholder="e.g. NOUR10" /></div>
                <Button size="sm" variant="quiet" onClick={applyPromo}>Apply</Button>
              </div>
              {promo && <InlineAlert tone="ok">Code {promo.code} applied.</InlineAlert>}
              {promoErr && <InlineAlert tone="error">{promoErr}</InlineAlert>}
            </section>

            {/* Account / auth */}
            {!user ? (
              <section style={{ ...field, background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: "var(--space-4)" }}>
                <strong style={{ fontSize: 15 }}>{authMode === "signin" ? "Sign in to order" : "Create your account"}</strong>
                <p style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)", margin: 0 }}>Orders are cash on delivery. An account lets you track them.</p>
                <Input label="Email" type="email" value={email} onChange={setEmail} />
                <Input label="Password" type="password" value={pw} onChange={setPw} />
                {notice && <InlineAlert tone="ok">{notice}</InlineAlert>}
                <Button fullWidth onClick={doAuth} disabled={busy}>{busy ? "…" : authMode === "signin" ? "Sign in" : "Create account"}</Button>
                <button type="button" onClick={() => { setAuthMode(authMode === "signin" ? "signup" : "signin"); setErr(""); setNotice(""); }}
                  style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", cursor: "pointer", color: "var(--green)", fontSize: "var(--text-small)" }}>
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
                  <Select label="Governorate" value={form.governorate} onChange={(v) => setForm({ ...form, governorate: v })}
                    options={[{ value: "", label: "Choose…" }].concat((window.EG_GOVERNORATES || []).map((g) => ({ value: g[0], label: g[0] })))} />
                </div>
                <Input label="Street address" value={form.street} onChange={(v) => setForm({ ...form, street: v })} placeholder="Building, street" />
                <div style={row2}>
                  <Input label="Area (optional)" value={form.area} onChange={(v) => setForm({ ...form, area: v })} />
                  <Input label="Landmark (optional)" value={form.landmark} onChange={(v) => setForm({ ...form, landmark: v })} />
                </div>
              </section>
            )}

            {/* Totals + errors */}
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

const stepBtn = { font: "inherit", width: 32, height: 32, borderRadius: "var(--radius-control)", border: "1px solid var(--rule)", background: "var(--white)", cursor: "pointer", fontSize: 18, lineHeight: 1 };
function Row({ k, v, bold, green }) {
  return <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span style={{ color: "var(--ink-2)" }}>{k}</span>
    <span style={{ fontFamily: "var(--font-numeric)", fontWeight: bold ? 700 : 500, color: green ? "var(--green)" : "var(--ink)" }}>{v}</span>
  </div>;
}
Object.assign(window, { StrandsCheckout: Checkout });
