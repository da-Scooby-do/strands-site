const { Card, StatusPill, Button, Badge } = window.StrandsDesignSystem_6d0a65;
function AccountOrders({ orders, open, setOpen }) {
  const phone = window.useIsPhone();
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      {orders.map((o) => {
        const total = o.items.reduce((a, i) => a + i.p * i.q, 0) + o.shipping;
        const isOpen = open === o.id;
        return (
          <Card key={o.id} pad="var(--space-5)" style={{ display: "grid", gap: "var(--space-4)" }}>
            <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr auto"), gap: "var(--space-4)", alignItems: "start" }}>
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-numeric)", fontSize: "var(--text-body-size)", fontWeight: 500 }}>{o.id}</span>
                  <StatusPill status={o.status} />
                </div>
                <span style={{ fontSize: "var(--text-small)", color: "var(--ink-2)" }}>
                  {o.items.map((i) => i.n + " × " + i.q).join(", ")} · placed {o.placed}
                </span>
              </div>
              <div style={{ display: "grid", gap: "var(--space-3)", justifyItems: phone ? "start" : "end" }}>
                <span style={{ fontFamily: "var(--font-numeric)", fontSize: 20, fontWeight: 500 }}>{total.toLocaleString("en-US")} EGP</span>
                <Button size="sm" variant="quiet" onClick={() => setOpen(isOpen ? null : o.id)}>{isOpen ? "Hide details" : "Track this order"}</Button>
              </div>
            </div>
            {isOpen && (
              <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: "var(--space-6)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--rule)" }}>
                <div style={{ display: "grid", gap: "var(--space-3)", alignContent: "start" }}>
                  <span style={{ fontSize: "var(--text-eyebrow-size)", letterSpacing: "var(--track-eyebrow)", textTransform: "uppercase", color: "var(--green)" }}>Progress</span>
                  <window.StrandsOrderTimeline status={o.status} dates={o.dates || {}} />
                </div>
                <div style={{ display: "grid", gap: "var(--space-4)", alignContent: "start" }}>
                  <div style={{ display: "grid", gap: "var(--space-2)" }}>
                    <span style={{ fontSize: "var(--text-eyebrow-size)", letterSpacing: "var(--track-eyebrow)", textTransform: "uppercase", color: "var(--green)" }}>Delivering to</span>
                    <span style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", lineHeight: 1.6 }}>{o.street}, {o.area}<br />{o.gov} · {o.phone}</span>
                  </div>
                  <div style={{ display: "grid", gap: "var(--space-2)" }}>
                    <span style={{ fontSize: "var(--text-eyebrow-size)", letterSpacing: "var(--track-eyebrow)", textTransform: "uppercase", color: "var(--green)" }}>Payment</span>
                    <span style={{ fontSize: "var(--text-small)", color: "var(--ink-2)" }}>Cash on delivery — {total.toLocaleString("en-US")} EGP to the courier.</span>
                    <span><Badge>Nothing charged online</Badge></span>
                  </div>
                  <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                    <Button size="sm" variant="quiet" onClick={() => window.open("https://wa.me/201023789109?text=" + encodeURIComponent("Hi Strands, I have a question about order " + o.id), "_blank", "noopener")}>Message us on WhatsApp</Button>
                    <Button size="sm" variant="text" onClick={() => {
                      try {
                        const items = (o.items || []).filter((i) => i.k).map((i) => ({ key: i.k, qty: i.q }));
                        if (items.length) localStorage.setItem("strands-cart", JSON.stringify(items));
                      } catch (e) {}
                      window.location.href = "../store/?checkout=1";
                    }}>Order again</Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
Object.assign(window, { StrandsAccountOrders: AccountOrders });
