const { PageHeader, DataTable, StatusPill, SearchField, Button } = window.StrandsDesignSystem_6d0a65;
const FILTERS = ["To action", "All", "Placed", "Confirmed", "Packed", "With courier", "Delivered", "Cancelled"];
const BULK_ACTIONS = [
  { key: "confirmed", label: "Confirm" },
  { key: "packed", label: "Pack" },
  { key: "with_courier", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];
const BULK_DONE_LABEL = { confirmed: "Confirmed", packed: "Packed", with_courier: "Out for delivery", delivered: "Delivered", cancelled: "Cancelled" };
function Orders({ orders, onOpen, onReload, onBulkAction }) {
  const [filter, setFilter] = React.useState("To action");
  const [q, setQ] = React.useState("");
  const [newOpen, setNewOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(() => new Set());
  const [bulkBusy, setBulkBusy] = React.useState(false);
  const [bulkMsg, setBulkMsg] = React.useState(null);
  const query = q.trim().toLowerCase();
  const rows = orders.filter((o) => {
    const s = ("" + o.id + o.customer + o.phone).toLowerCase().includes(query);
    // While searching, look across every order regardless of the status tab, so an
    // order number is always findable — even if it's Delivered or Cancelled.
    if (query) return s;
    return filter === "All" ? true : filter === "To action" ? !["Delivered", "Cancelled"].includes(o.status) : o.status === filter;
  });
  // Actionable = anything not already finished (Delivered/Cancelled are terminal).
  const actionable = rows.filter((r) => !["Delivered", "Cancelled"].includes(r.status));
  const allSelected = actionable.length > 0 && actionable.every((r) => selected.has(r.uuid));
  const toggle = (uuid) => setSelected((s) => { const n = new Set(s); n.has(uuid) ? n.delete(uuid) : n.add(uuid); return n; });
  const toggleAll = () => setSelected((s) => { const n = new Set(s); if (allSelected) actionable.forEach((r) => n.delete(r.uuid)); else actionable.forEach((r) => n.add(r.uuid)); return n; });
  const runBulk = async (targetKey) => {
    const chosen = orders.filter((o) => selected.has(o.uuid));
    if (!chosen.length || !onBulkAction) return;
    if (targetKey === "cancelled" && !window.confirm("Cancel " + chosen.length + " selected order(s)? Each customer is emailed.")) return;
    setBulkBusy(true); setBulkMsg(null);
    const res = await onBulkAction(chosen, targetKey);
    setBulkBusy(false); setSelected(new Set()); setBulkMsg(res);
  };
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
      <window.DashImportOrders open={importOpen} onClose={() => setImportOpen(false)} onDone={() => { if (onReload) onReload(); }} />
      <PageHeader label="Orders" title="What needs packing." action={<span style={{ display: "inline-flex", gap: "var(--space-2)", flexWrap: "wrap" }}><Button size="sm" onClick={() => setNewOpen(true)}>New order</Button><Button size="sm" variant="quiet" onClick={() => setImportOpen(true)}>Import CSV</Button><Button size="sm" variant="quiet" onClick={exportCSV}>Export CSV</Button></span>} />
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
        {FILTERS.map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)}
            style={{ font: "inherit", fontFamily: "var(--font-sans)", fontSize: "var(--text-small)", height: 32, padding: "0 14px", borderRadius: "var(--radius-pill)", cursor: "pointer", background: filter === f ? "var(--purple)" : "transparent", color: filter === f ? "var(--white)" : "var(--ink-2)", border: "1px solid " + (filter === f ? "var(--purple)" : "var(--rule)") }}>{f}</button>
        ))}
      </div>
      <div style={{ maxWidth: 320, marginBottom: "var(--space-4)" }}>
        <SearchField value={q} onChange={setQ} placeholder="Order number, name, or phone" />
      </div>
      {actionable.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-4)", fontSize: "var(--text-small)" }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", color: "var(--ink-2)" }}>
            <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ width: 16, height: 16, cursor: "pointer" }} />
            Select all ({actionable.length})
          </label>
          {selected.size > 0 && !bulkBusy && (
            <span style={{ display: "inline-flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ color: "var(--ink-2)" }}>{selected.size} selected:</span>
              {BULK_ACTIONS.map((a) => <Button key={a.key} size="sm" variant="quiet" onClick={() => runBulk(a.key)}>{a.label}</Button>)}
              <Button size="sm" variant="text" onClick={() => runBulk("cancelled")}>Cancel orders</Button>
              <button type="button" onClick={() => setSelected(new Set())} style={{ font: "inherit", fontFamily: "var(--font-sans)", background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", fontSize: "var(--text-small)" }}>Clear</button>
            </span>
          )}
          {bulkBusy && <span style={{ color: "var(--ink-2)" }}>Working… emailing each customer.</span>}
          {bulkMsg && !bulkBusy && <span style={{ color: "var(--green)" }}>{bulkMsg.done} → {BULK_DONE_LABEL[bulkMsg.targetKey] || bulkMsg.targetKey}{bulkMsg.emailFailed ? (" · " + bulkMsg.emailFailed + " email(s) failed") : " & emailed"}{bulkMsg.skipped ? (" · " + bulkMsg.skipped + " skipped") : ""}</span>}
        </div>
      )}
      <DataTable onRowClick={onOpen} rows={rows} empty="No orders match that filter." columns={[
        { key: "sel", label: "", render: (r) => !["Delivered", "Cancelled"].includes(r.status) ? <input type="checkbox" checked={selected.has(r.uuid)} onChange={() => toggle(r.uuid)} onClick={(e) => e.stopPropagation()} style={{ width: 16, height: 16, cursor: "pointer" }} /> : null },
        { key: "id", label: "Order", numeric: true },
        { key: "customer", label: "Customer" },
        { key: "source", label: "From", render: (r) => <span style={{ display: "inline-flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
          {(r.source && r.source !== "website") ? <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--radius-pill)", background: "var(--purple-tint)", color: "var(--green)", textTransform: "capitalize", whiteSpace: "nowrap" }}>{r.source}</span> : <span style={{ fontSize: 11, color: "var(--ink-2)" }}>Site</span>}
          {r.pay === "instapay" && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--radius-pill)", background: "#FBEFD8", color: "#7A5200", whiteSpace: "nowrap" }}>InstaPay</span>}
        </span> },
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
