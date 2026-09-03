/* Gulf waitlist — live read of public.waitlist (admin RLS). */
const { PageHeader, Button, DataTable, StatBox } = window.StrandsDesignSystem_6d0a65;
function fmt(d) { try { return new Date(d).toLocaleDateString("en-GB"); } catch (e) { return ""; } }
function Waitlist() {
  const phone = window.useIsPhone();
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    if (!window.SB_READY) return;
    window.sb.from("waitlist").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setRows(data.map((w) => ({ email: w.email, city: w.city || "—", country: w.country, joined: fmt(w.created_at), name: w.name })));
    });
  }, []);
  return (
    <div>
      <PageHeader label="Gulf waitlist" title="People waiting outside Egypt." />
      <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "220px 1fr"), gap: "var(--space-5)", alignItems: "start" }}>
        <StatBox value={rows.length} caption="people on the list" />
        <DataTable rows={rows} empty="Nobody has joined yet." columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "city", label: "City" },
          { key: "country", label: "Country" },
          { key: "joined", label: "Joined", numeric: true, align: "end" },
        ]} />
      </div>
      <p style={{ fontSize: "var(--text-fine-size)", color: "var(--ink-2)", marginTop: "var(--space-4)" }}>Read-only. It exists so the list is not lost.</p>
    </div>
  );
}
Object.assign(window, { DashWaitlist: Waitlist });
