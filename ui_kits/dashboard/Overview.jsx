const { PageHeader, StatBox, DataTable, StatusPill, Button } = window.StrandsDesignSystem_6d0a65;
function Overview({ orders, onOpen, market }) {
  const phone = window.useIsPhone();
  const [stock, setStock] = React.useState(null);
  const [sizeStock, setSizeStock] = React.useState([]); // sizes that keep their own stock, e.g. 500 ml
  const [mktStock, setMktStock] = React.useState([]);   // the selected country's stock per size (outside Egypt)
  const code = market ? market.code : null;
  React.useEffect(() => {
    if (!window.SB_READY) return;
    window.sb.from("products").select("stock").order("created_at").limit(1).maybeSingle().then(({ data }) => { if (data) setStock(data.stock); });
    window.sb.from("product_variants").select("size_ml,stock,sort").not("stock", "is", null).order("sort").then(({ data }) => { if (data) setSizeStock(data); });
  }, []);
  React.useEffect(() => {
    if (!window.SB_READY || !code || code === "EG") { setMktStock([]); return; }
    Promise.all([
      window.sb.from("market_variants").select("variant_key,price,stock").eq("market", code),
      window.sb.from("product_variants").select("key,size_ml,label_en,jars,sort").order("sort"),
    ]).then(([mv, v]) => {
      const list = (mv.data || []).filter((x) => x.price != null).map((x) => { const pv = (v.data || []).find((p) => p.key === x.variant_key) || {}; return { label: (pv.size_ml || 300) + " ml" + (pv.jars > 1 ? " ×" + pv.jars : ""), stock: x.stock, sort: pv.sort || 0 }; }).sort((a, b) => a.sort - b.sort);
      setMktStock(list);
    }, () => setMktStock([]));
  }, [code]);
  const toAction = orders.filter((o) => !["Delivered", "Cancelled"].includes(o.status)).length;
  const last30 = orders.length;
  const revParts = window.sumByCurrency(orders.filter((o) => o.status !== "Cancelled"), (o) => o.items.reduce((a, i) => a + i.p * i.q, 0) + o.shipping).split(" · ");
  // One currency: the big number. Several (All countries): one smaller line each — never added together.
  const revenue = revParts.length === 1 ? revParts[0] : <span style={{ display: "grid", gap: 2, fontSize: 22, lineHeight: 1.25 }}>{revParts.map((x) => <span key={x}>{x}</span>)}</span>;
  const outsideEG = code && code !== "EG";
  return (
    <div>
      <PageHeader label={"Overview" + (market ? " · " + market.name_en : " · All countries")} title="Good to see you, Nour." />
      <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr 1fr" : "repeat(4,1fr)", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
        <StatBox tone="green" value={toAction} caption="orders to action" />
        <StatBox value={last30} caption="orders, last 30 days" />
        <StatBox value={revenue} caption="revenue, last 30 days" />
        {outsideEG
          ? <StatBox value={mktStock.length ? mktStock.reduce((a, x) => a + (x.stock || 0), 0) : "—"} caption={mktStock.length ? "jars in stock · " + mktStock.map((x) => x.label + ": " + x.stock).join(" · ") : "no prices set yet — see Countries"} />
          : <StatBox value={stock == null ? "—" : stock} caption={(market ? "" : "Egypt · ") + (sizeStock.length ? "jars in stock (300 ml) · " + sizeStock.map((v) => v.size_ml + " ml: " + v.stock).join(" · ") : "jars in stock")} />}
      </div>
      <h2 style={{ fontSize: 22, marginBottom: "var(--space-4)" }}>The ten newest orders.</h2>
      <DataTable onRowClick={onOpen} rows={orders.slice(0, 10)} columns={[
        { key: "id", label: "Order", numeric: true },
        { key: "customer", label: "Customer" },
        { key: "items", label: "Items", render: (r) => <span style={{ whiteSpace: "nowrap", fontFamily: "var(--font-numeric)" }}>{window.itemsSummary(r.items) || "—"}</span> },
        { key: "city", label: "City" },
        { key: "total", label: "Total", numeric: true, align: "end", render: (r) => window.fmtMoney(r.items.reduce((a, i) => a + i.p * i.q, 0) + r.shipping, r.currency) },
        { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
        { key: "placed", label: "Placed", numeric: true, align: "end" },
      ]} />
    </div>
  );
}
Object.assign(window, { DashOverview: Overview });
