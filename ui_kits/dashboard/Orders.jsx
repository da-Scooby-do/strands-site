const { PageHeader, DataTable, StatusPill, SearchField, Button } = window.StrandsDesignSystem_6d0a65;
const FILTERS = ["To action", "All", "Placed", "Confirmed", "Packed", "With courier", "Delivered", "Cancelled"];
function Orders({ orders, onOpen }) {
  const [filter, setFilter] = React.useState("To action");
  const [q, setQ] = React.useState("");
  const rows = orders.filter((o) => {
    const f = filter === "All" ? true : filter === "To action" ? !["Delivered", "Cancelled"].includes(o.status) : o.status === filter;
    const s = (o.id + o.customer + o.phone).toLowerCase().includes(q.toLowerCase());
    return f && s;
  });
  return (
    <div>
      <PageHeader label="Orders" title="What needs packing." action={<Button size="sm">Export CSV</Button>} />
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
        { key: "phone", label: "Phone", numeric: true },
        { key: "address", label: "Address", maxWidth: "220px", render: (r) => r.street + ", " + r.area },
        { key: "total", label: "Total", numeric: true, align: "end", render: (r) => (r.items.reduce((a, i) => a + i.p * i.q, 0) + r.shipping).toLocaleString("en-US") + " EGP" },
        { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
        { key: "email", label: "Email", render: (r) => { const s = window.emailStatusOf(r.emailResult); return <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, padding: "3px 9px", borderRadius: "var(--radius-pill)", background: s.bg, color: s.color, whiteSpace: "nowrap" }}>{s.label}</span>; } },
        { key: "placed", label: "Placed", numeric: true, align: "end" },
      ]} />
    </div>
  );
}
Object.assign(window, { DashOrders: Orders });
