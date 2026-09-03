const { Card, Input, Select, Button, InlineAlert } = window.StrandsDesignSystem_6d0a65;
function AccountDetails() {
  const phone = window.useIsPhone();
  const [saved, setSaved] = React.useState(false);
  const two = { display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "var(--space-4)" };
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
        <h2 style={{ fontSize: 22 }}>Your details.</h2>
        <div style={two}>
          <Input label="Name" value="Mariam Adel" onChange={() => setSaved(false)} />
          <Input label="Phone" value="0100 111 2233" onChange={() => setSaved(false)} />
        </div>
        <Input label="Email" value="mariam@example.com" type="email" onChange={() => setSaved(false)} />
      </Card>
      <Card pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
        <h2 style={{ fontSize: 22 }}>Delivery address.</h2>
        <div style={two}>
          <Input label="Street" value="12 Sharia Gamal el-Din" onChange={() => setSaved(false)} />
          <Input label="Area" value="Zamalek" onChange={() => setSaved(false)} />
        </div>
        <div style={two}>
          <Select label="Governorate" value="Cairo" options={["Cairo", "Giza", "Alexandria", "Gharbia", "Dakahlia"]} onChange={() => setSaved(false)} />
          <Input label="Landmark" value="Above the pharmacy" onChange={() => setSaved(false)} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <Button size="sm" onClick={() => setSaved(true)}>Save changes</Button>
          {saved && <InlineAlert>Saved. We will use this for your next order.</InlineAlert>}
        </div>
      </Card>
    </div>
  );
}
Object.assign(window, { StrandsAccountDetails: AccountDetails });
