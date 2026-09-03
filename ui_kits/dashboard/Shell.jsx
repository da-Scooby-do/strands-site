const { Wordmark } = window.StrandsDesignSystem_6d0a65;
const NAV = ["Overview", "Orders", "Product & bundles", "Promo codes", "Reviews", "Gulf waitlist", "Emails"];
function Shell({ page, setPage, onSignOut, children }) {
  const phone = window.useIsPhone();
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => { if (!phone) setOpen(false); }, [phone]);
  const pick = (n) => { setPage(n); setOpen(false); };
  if (phone) return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--purple)", padding: "var(--space-3) var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <Wordmark size={15} color="var(--green-tint)" align="start" descriptor={false} />
        <span style={{ marginInlineStart: "auto", color: "var(--lilac)", fontSize: "var(--text-fine-size)" }}>{page}</span>
        <button type="button" onClick={() => setOpen(!open)} aria-label="Menu"
          style={{ width: 40, height: 40, display: "grid", placeItems: "center", background: open ? "var(--purple-light)" : "transparent", border: "1px solid var(--border-hairline-anchor)", borderRadius: "var(--radius-control)", color: "var(--white)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>{open ? "×" : "≡"}</button>
      </header>
      {open && (
        <nav style={{ background: "var(--purple)", padding: "0 var(--space-4) var(--space-4)", display: "grid", gap: 2 }}>
          {NAV.map((n) => (
            <button key={n} type="button" onClick={() => pick(n)}
              style={{ font: "inherit", fontFamily: "var(--font-sans)", textAlign: "start", fontSize: "var(--text-body-size)", padding: "13px 12px", borderRadius: "var(--radius-control)", border: "none", cursor: "pointer", background: page === n ? "var(--purple-light)" : "transparent", color: page === n ? "var(--white)" : "var(--lilac)" }}>{n}</button>
          ))}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", paddingTop: "var(--space-4)", marginTop: "var(--space-2)", borderTop: "1px solid var(--border-hairline-anchor)", fontSize: "var(--text-fine-size)", color: "var(--lilac)" }}>
            <span>nour@strands.eg</span>
            <a href="../store/index.html" target="_blank" style={{ color: "var(--white)", borderBottom: "none" }}>View store ↗</a>
            <button type="button" onClick={onSignOut} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", padding: 0, color: "var(--lilac)", cursor: "pointer", fontSize: "var(--text-fine-size)" }}>Sign out</button>
          </div>
        </nav>
      )}
      <main style={{ padding: "var(--space-5) var(--space-4)" }}>{children}</main>
    </div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "210px 1fr", minHeight: "100vh", background: "var(--cream)" }}>
      <aside style={{ background: "var(--purple)", padding: "var(--space-5) var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-6)", position: "sticky", top: 0, height: "100vh" }}>
        <Wordmark size={19} color="var(--green-tint)" align="start" />
        <nav style={{ display: "grid", gap: 2 }}>
          {NAV.map((n) => {
            const on = page === n;
            return (
              <button key={n} type="button" onClick={() => setPage(n)}
                style={{ font: "inherit", fontFamily: "var(--font-sans)", textAlign: "start", fontSize: "var(--text-small)", padding: "9px 12px", borderRadius: "var(--radius-control)", border: "none", cursor: "pointer", background: on ? "var(--purple-light)" : "transparent", color: on ? "var(--white)" : "var(--lilac)" }}>{n}</button>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", display: "grid", gap: "var(--space-3)", fontSize: "var(--text-fine-size)", color: "var(--lilac)", borderTop: "1px solid var(--border-hairline-anchor)", paddingTop: "var(--space-4)" }}>
          <span>nour@strands.eg</span>
          <a href="../store/index.html" target="_blank" style={{ color: "var(--white)", borderBottom: "none" }}>View store ↗</a>
          <button type="button" onClick={onSignOut} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", padding: 0, textAlign: "start", color: "var(--lilac)", cursor: "pointer", fontSize: "var(--text-fine-size)" }}>Sign out</button>
        </div>
      </aside>
      <main style={{ padding: "var(--space-7) var(--space-8)", maxWidth: 1060 }}>{children}</main>
    </div>
  );
}
Object.assign(window, { DashShell: Shell });
