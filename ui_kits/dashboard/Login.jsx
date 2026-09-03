/* Shared real-auth login for both the owner dashboard and the customer account.
   It only authenticates; the page that mounts it decides where to send you
   (dashboard checks is_admin, account shows the customer their orders). */
const { Wordmark, Input, Button, Icon, InlineAlert, DamaskPanel } = window.StrandsDesignSystem_6d0a65;
function Login({ onSignedIn, heading }) {
  const isPhone = window.useIsPhone();
  const [mode, setMode] = React.useState("signin"); // signin | signup
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [note, setNote] = React.useState("");

  async function submit() {
    setErr(""); setNote("");
    if (!window.SB_READY) { setErr("Still loading — try again in a moment."); return; }
    setBusy(true);
    try {
      if (mode === "signin") {
        const { data, error } = await window.sb.auth.signInWithPassword({ email: email.trim(), password: pw });
        if (error) { setErr(error.message); return; }
        if (data.session && onSignedIn) onSignedIn(data.session);
      } else {
        const { data, error } = await window.sb.auth.signUp({
          email: email.trim(), password: pw,
          options: { data: { full_name: name || null, phone: phone || null, lang: "en" } },
        });
        if (error) { setErr(error.message); return; }
        if (data.session) { if (onSignedIn) onSignedIn(data.session); }
        else { setNote("Account created. Check your email to confirm, then sign in."); setMode("signin"); }
      }
    } finally { setBusy(false); }
  }

  async function forgot() {
    setErr(""); setNote("");
    if (!email.trim()) { setErr("Enter your email first."); return; }
    await window.sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.href });
    setNote("If " + email.trim() + " has an account, a reset link is on its way.");
  }

  return (
    <DamaskPanel pad={isPhone ? "var(--space-4)" : "var(--space-7)"} style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 380, display: "grid", gap: "var(--space-5)", justifyItems: "center" }}>
        <Wordmark size={30} color="var(--green-tint)" />
        <div style={{ background: "var(--white)", border: "var(--border-card)", borderRadius: "var(--radius-card)", padding: "var(--space-6)", display: "grid", gap: "var(--space-4)", width: "100%" }}>
          <h1 style={{ fontSize: 26 }}>{heading || (mode === "signin" ? "Sign in." : "Create your account.")}</h1>
          {mode === "signup" && <Input label="Full name" value={name} onChange={setName} />}
          {mode === "signup" && <Input label="Phone" type="tel" value={phone} onChange={setPhone} />}
          <Input label="Email" value={email} onChange={setEmail} type="email" />
          <div style={{ position: "relative" }}>
            <Input label="Password" value={pw} onChange={setPw} type={show ? "text" : "password"} style={{ width: "100%" }} />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}
              style={{ position: "absolute", insetInlineEnd: 6, bottom: 6, width: 36, height: 36, display: "grid", placeItems: "center", background: "none", border: "none", borderRadius: "var(--radius-control)", cursor: "pointer", color: "var(--ink-2)" }}>
              <Icon name={show ? "eye-off" : "eye"} size={17} />
            </button>
          </div>
          {mode === "signin" && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "calc(var(--space-2) * -1)" }}>
              <button type="button" onClick={forgot}
                style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", padding: 0, color: "var(--green)", cursor: "pointer", fontSize: "var(--text-small)" }}>Forgot your password?</button>
            </div>
          )}
          {err && <InlineAlert tone="error">{err}</InlineAlert>}
          {note && <InlineAlert tone="ok">{note}</InlineAlert>}
          <Button fullWidth onClick={submit} disabled={busy}>{busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}</Button>
          <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", textAlign: "center", paddingTop: "var(--space-2)", borderTop: "1px solid var(--rule)", margin: 0 }}>
            {mode === "signin"
              ? <span>New here? <a href="#" onClick={(e) => { e.preventDefault(); setMode("signup"); setErr(""); setNote(""); }}>Create an account</a></span>
              : <span>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode("signin"); setErr(""); setNote(""); }}>Sign in</a></span>}
          </p>
        </div>
      </div>
    </DamaskPanel>
  );
}
Object.assign(window, { DashLogin: Login });
