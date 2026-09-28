const { PageHeader, StatBox, DataTable, StatusPill, Button } = window.StrandsDesignSystem_6d0a65;
function Overview({ orders, onOpen, goOrders }) {
  const phone = window.useIsPhone();
  const [stock, setStock] = React.useState(null);
  const [sizeStock, setSizeStock] = React.useState([]); // sizes that keep their own stock, e.g. 500 ml
  React.useEffect(() => {
    if (!window.SB_READY) return;
    window.sb.from("products").select("stock").order("created_at").limit(1).maybeSingle().then(({ data }) => { if (data) setStock(data.stock); });
    window.sb.from("product_variants").select("size_ml,stock,sort").not("stock", "is", null).order("sort").then(({ data }) => { if (data) setSizeStock(data); });
  }, []);
  const toAction = orders.filter((o) => !["Delivered", "Cancelled"].includes(o.status)).length;
  const last30 = orders.length;
  const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.items.reduce((a, i) => a + i.p * i.q, 0) + o.shipping, 0);
  return (
    <div>
      <PageHeader label="Overview" title="Good to see you, Nour." action={<Button size="sm" onClick={goOrders}>Open orders</Button>} />
      <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr 1fr" : "repeat(4,1fr)", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
        <StatBox tone="green" value={toAction} caption="orders to action" />
        <StatBox value={last30} caption="orders, last 30 days" />
        <StatBox value={revenue.toLocaleString("en-US")} caption="EGP revenue, last 30 days" />
        <StatBox value={stock == null ? "—" : stock} caption={sizeStock.length ? "jars in stock (300 ml) · " + sizeStock.map((v) => v.size_ml + " ml: " + v.stock).join(" · ") : "jars in stock"} />
      </div>
      <h2 style={{ fontSize: 22, marginBottom: "var(--space-4)" }}>The ten newest orders.</h2>
      <DataTable onRowClick={onOpen} rows={orders.slice(0, 10)} columns={[
        { key: "id", label: "Order", numeric: true },
        { key: "customer", label: "Customer" },
        { key: "items", label: "Items", render: (r) => <span style={{ whiteSpace: "nowrap", fontFamily: "var(--font-numeric)" }}>{window.itemsSummary(r.items) || "—"}</span> },
        { key: "city", label: "City" },
        { key: "total", label: "Total", numeric: true, align: "end", render: (r) => (r.items.reduce((a, i) => a + i.p * i.q, 0) + r.shipping).toLocaleString("en-US") + " EGP" },
        { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
        { key: "placed", label: "Placed", numeric: true, align: "end" },
      ]} />
    </div>
  );
}
Object.assign(window, { DashOverview: Overview });
