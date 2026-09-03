const { Wordmark, Button, IconButton } = window.StrandsDesignSystem_6d0a65;
function AccountHeader({ isOwner, onDashboard, onSignOut }) {
  const phone = window.useIsPhone();
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--cream)", borderBottom: "1px solid var(--rule)", height: 64 }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)", height: "100%", display: "flex", alignItems: "center", gap: phone ? "var(--space-3)" : "var(--space-6)" }}>
        <a href="../store/index.html" style={{ borderBottom: "none" }}><Wordmark size={19} align="start" /></a>
        {!phone && <nav style={{ display: "flex", gap: "var(--space-5)", marginInlineStart: "var(--space-5)" }}>
          <a href="../store/index.html" style={{ fontSize: "var(--text-small)", color: "var(--ink)", borderBottom: "none" }}>The Masque</a>
          <a href="../store/index.html#reviews" style={{ fontSize: "var(--text-small)", color: "var(--ink)", borderBottom: "none" }}>Reviews</a>
        </nav>}
        <div style={{ marginInlineStart: "auto", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          {/* The ONLY thing the owner sees that a customer does not. */}
          {isOwner && <Button size="sm" variant="quiet" onClick={onDashboard}>Dashboard</Button>}
          <IconButton name="shopping-bag" label="Cart" />
          {!phone && <Button size="sm" variant="text" onClick={onSignOut}>Sign out</Button>}
        </div>
      </div>
    </header>
  );
}
Object.assign(window, { StrandsAccountHeader: AccountHeader });
