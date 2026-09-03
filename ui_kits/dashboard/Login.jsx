const { Wordmark, Input, Button, Icon, InlineAlert, DamaskPanel } = window.StrandsDesignSystem_6d0a65;
function Login({ onSignIn }) {
  const [email, setEmail] = React.useState("nour@strands.eg");
  const [pw, setPw] = React.useState("velvet-touch");
  const [show, setShow] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  return (
    <DamaskPanel pad="var(--space-7)" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ width: 380, display: "grid", gap: "var(--space-5)", justifyItems: "center" }}>
        <Wordmark size={30} color="var(--green-tint)" />
        <div style={{ background: "var(--white)", border: "var(--border-card)", borderRadius: "var(--radius-card)", padding: "var(--space-6)", display: "grid", gap: "var(--space-4)", width: "100%" }}>
          <h1 style={{ fontSize: 26 }}>Sign in.</h1>
          <Input label="Email" value={email} onChange={setEmail} type="email" />
          <div style={{ position: "relative" }}>
            <Input label="Password" value={pw} onChange={setPw} type={show ? "text" : "password"} style={{ width: "100%" }} />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}
              style={{ position: "absolute", insetInlineEnd: 6, bottom: 6, width: 36, height: 36, display: "grid", placeItems: "center", background: "none", border: "none", borderRadius: "var(--radius-control)", cursor: "pointer", color: "var(--ink-2)" }}>
              <Icon name={show ? "eye-off" : "eye"} size={17} />
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "calc(var(--space-2) * -1)" }}>
            <button type="button" onClick={() => setSent(true)}
              style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", padding: 0, color: "var(--green)", cursor: "pointer", fontSize: "var(--text-small)" }}>Forgot your password?</button>
          </div>
          {sent && <InlineAlert>If {email} has an account, a reset link is on its way.</InlineAlert>}
          <Button fullWidth onClick={onSignIn}>Sign in</Button>
          <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", textAlign: "center", paddingTop: "var(--space-2)", borderTop: "1px solid var(--rule)" }}>
            New here? <a href="#" onClick={(e) => e.preventDefault()}>Create an account</a>
          </p>
          <p style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)", lineHeight: 1.6 }}>
            The same page customers use. Signing in as the owner lands on the dashboard; a customer lands on their own account.
          </p>
        </div>
      </div>
    </DamaskPanel>
  );
}
Object.assign(window, { DashLogin: Login });
