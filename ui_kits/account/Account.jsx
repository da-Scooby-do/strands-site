const { PageHeader, Button, StatBox } = window.StrandsDesignSystem_6d0a65;
const TABS = ["Orders", "Details"];
function Account({ user, isOwner, onDashboard, onSignOut }) {
  const phone = window.useIsPhone();
  const [tab, setTab] = React.useState("Orders");
  const [open, setOpen] = React.useState(null);
  const orders = window.DASH.ORDERS.filter((o) => o.customer === user).length
    ? window.DASH.ORDERS.filter((o) => o.customer === user)
    : window.DASH.ORDERS.slice(0, 4);
  const live = orders.filter((o) => !["Delivered", "Cancelled"].includes(o.status)).length;
  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <window.StrandsAccountHeader isOwner={isOwner} onDashboard={onDashboard} onSignOut={onSignOut} />
      <main style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--space-5) var(--gutter)" : "var(--space-7) var(--gutter)" }}>
        <PageHeader label="Your account" title={"Hello, " + user.split(" ")[0] + "."}
          action={<Button size="sm" onClick={() => (window.location.href = "../store/index.html")}>Buy another jar</Button>} />
        <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr 1fr" : "repeat(3,220px)", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
          <StatBox tone="green" value={live} caption="orders on the way" />
          <StatBox value={orders.length} caption="orders in total" />
          {!phone && <StatBox value="2–4 days" caption="usual delivery, cash on arrival" />}
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
          {TABS.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              style={{ font: "inherit", fontFamily: "var(--font-sans)", fontSize: "var(--text-small)", height: 36, padding: "0 16px", borderRadius: "var(--radius-pill)", cursor: "pointer", background: tab === t ? "var(--purple)" : "transparent", color: tab === t ? "var(--white)" : "var(--ink-2)", border: "1px solid " + (tab === t ? "var(--purple)" : "var(--rule)") }}>{t}</button>
          ))}
        </div>
        {tab === "Orders"
          ? <window.StrandsAccountOrders orders={orders} open={open} setOpen={setOpen} />
          : <window.StrandsAccountDetails />}
      </main>
    </div>
  );
}
Object.assign(window, { StrandsAccount: Account });
