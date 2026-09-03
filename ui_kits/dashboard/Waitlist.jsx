const { PageHeader, Button, DataTable, StatBox } = window.StrandsDesignSystem_6d0a65;
function Waitlist() {
  const phone = window.useIsPhone();
  const rows = window.DASH.WAITLIST;
  return (
    <div>
      <PageHeader label="Gulf waitlist" title="People waiting outside Egypt." action={<Button size="sm">Export CSV</Button>} />
      <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "220px 1fr"), gap: "var(--space-5)", alignItems: "start" }}>
        <StatBox value={rows.length} caption="people on the list" />
        <DataTable rows={rows} empty="Nobody has joined yet." columns={[
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
