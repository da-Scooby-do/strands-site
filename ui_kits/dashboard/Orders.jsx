const { PageHeader, DataTable, StatusPill, SearchField, Button } = window.StrandsDesignSystem_6d0a65;
const FILTERS = ["To action", "All", "Placed", "Confirmed", "Packed", "With courier", "Delivered", "Cancelled"];
function Orders({ orders, onOpen, onReload }) {
  const [filter, setFilter] = React.useState("To action");
  const [q, setQ] = React.useState("");
  const [newOpen, setNewOpen] = React.useState(false);
  const rows = orders.filter((o) => {
    const f = filter === "All" ? true : filter === "To action" ? !["Delivered", "Cancelled"].includes(o.status) : o.status === filter;
    const s = (o.id + o.customer + o.phone).toLowerCase().includes(q.toLowerCase());
    return f && s;
  });
  const exportCSV = () => {
    const headers = ["Order", "Source", "Customer", "Phone", "WhatsApp", "Email", "Governorate", "Area", "Street", "Landmark", "Items", "Subtotal", "Shipping", "Promo code", "Discount", "Total", "Status", "Placed", "Note"];
    const data = rows.map((o) => {
      const sub = o.items.reduce((a, i) => a + i.p * i.q, 0);
      const items = o.items.map((i) => i.n + " x" + i.q).join(" | ");
      return [o.id, o.source, o.customer, o.phone, o.whatsapp || "", o.email, o.gov, o.area, o.street, o.landmark, items, sub, o.shipping, o.promo || "", o.discount || 0, sub - (o.discount || 0) + (o.shipping || 0), o.status, o.placed, o.note];
    });
    window.downloadCSV("strands-orders.csv", headers, data);
  };
  return (
    <div>
      <window.DashNewOrder open={newOpen} onClose={() => setNewOpen(false)} onCreated={() => { if (onReload) onReload(); }} />
      <PageHeader label="Orders" title="What needs packing." action={<span style={{ display: "inline-flex", gap: "var(--space-2)" }}><Button size="sm" onClick={() => setNewOpen(true)}>New order</Button><Button size="sm" variant="quiet" onClick={exportCSV}>Export CSV</Button></span>} />
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
        {FILTERS.map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)}
            style={{ font: "inherit", fontFamily: "var(--font-sans)", fontSize: "var(--text-small)", height: 32, padding: "0 14px", borderRadius: "var(--radius-pill)", cursor: "pointer", background: filter === f ? "var(--purple)" : "transparent", color: filter === f ? "var(--white)" : "var(--ink-2)", border: "1px solid " + (filter === f ? "var(--purple)" : "var(--rule)") }}>{f}</button>
        ))}
      </div>
      <div style={{ maxWidth: 320, marginBottom: "var(--space-4)" }}>
        <SearchField value={q} onChange={setQ} placeholder="Order number, name, or phone" />
      </div>
      <DataTable onRowClick={onOpen} rows={rows} empty="No orders match that filter." columns={[
        { key: "id", label: "Order", numeric: true },
        { key: "customer", label: "Customer" },
        { key: "source", label: "From", render: (r) => (r.source && r.source !== "website") ? <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--radius-pill)", background: "var(--purple-tint)", color: "var(--purple)", textTransform: "capitalize", whiteSpace: "nowrap" }}>{r.source}</span> : <span style={{ fontSize: 11, color: "var(--ink-2)" }}>Site</span> },
        { key: "phone", label: "Phone", numeric: true },
        { key: "address", label: "Address", maxWidth: "220px", render: (r) => r.street + ", " + r.area },
        { key: "total", label: "Total", numeric: true, align: "end", render: (r) => {
          const t = (r.total != null) ? r.total : (r.items.reduce((a, i) => a + i.p * i.q, 0) - (r.discount || 0) + r.shipping);
          return <span style={{ display: "inline-grid", justifyItems: "end", gap: 2 }}>
            <span style={{ fontFamily: "var(--font-numeric)" }}>{t.toLocaleString("en-US")} EGP</span>
            {r.discount > 0 && <span style={{ fontSize: 10, color: "var(--green)", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>−{r.discount.toLocaleString("en-US")}{r.promo ? " · " + r.promo : ""}</span>}
          </span>;
        } },
        { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
        { key: "email", label: "Email", render: (r) => { const s = window.emailStatusOf(r.emailResult); return <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, padding: "3px 9px", borderRadius: "var(--radius-pill)", background: s.bg, color: s.color, whiteSpace: "nowrap" }}>{s.label}</span>; } },
        { key: "placed", label: "Placed", numeric: true, align: "end" },
      ]} />
    </div>
  );
}
Object.assign(window, { DashOrders: Orders });
