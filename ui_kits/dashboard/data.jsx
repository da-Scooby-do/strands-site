const ORDERS = [
  { id: "STR-1041", customer: "Mariam Adel", phone: "0100 111 2233", email: "mariam@example.com", street: "12 Sharia Gamal el-Din", area: "Zamalek", gov: "Cairo", landmark: "Above the pharmacy", city: "Cairo", items: [{ n: "Velvet Touch Masque — 1 jar", q: 1, p: 380 }], shipping: 60, status: "Placed", placed: "02/09/2026", note: "", dates: { Placed: "02/09" } },
  { id: "STR-1040", customer: "Salma Ramy", phone: "0101 555 8899", email: "salma@example.com", street: "8 Sharia Fouad", area: "Sidi Gaber", gov: "Alexandria", landmark: "Blue building", city: "Alexandria", items: [{ n: "Velvet Touch Masque — 2 jars", q: 1, p: 710 }], shipping: 0, status: "With courier", placed: "01/09/2026", note: "Courier said the flat was empty, calling back tomorrow.", dates: { Placed: "01/09", Confirmed: "01/09", Packed: "01/09", "With courier": "02/09" } },
  { id: "STR-1039", customer: "Habiba Kamal", phone: "0122 404 1717", email: "habiba@example.com", street: "45 Sharia el-Nasr", area: "Nasr City", gov: "Cairo", landmark: "", city: "Cairo", items: [{ n: "Velvet Touch Masque — 1 jar", q: 2, p: 380 }], shipping: 60, status: "Packed", placed: "01/09/2026", note: "", dates: { Placed: "01/09", Confirmed: "01/09", Packed: "02/09" } },
  { id: "STR-1038", customer: "Yara Mostafa", phone: "0111 232 4545", email: "yara@example.com", street: "3 Sharia el-Horreya", area: "Tanta", gov: "Gharbia", landmark: "Next to the bakery", city: "Tanta", items: [{ n: "Velvet Touch Masque — 3 jars", q: 1, p: 1020 }], shipping: 0, status: "Confirmed", placed: "31/08/2026", note: "", dates: { Placed: "31/08", Confirmed: "31/08" } },
  { id: "STR-1037", customer: "Dina Sherif", phone: "0128 909 3131", email: "dina@example.com", street: "22 Sharia Port Said", area: "Maadi", gov: "Cairo", landmark: "", city: "Cairo", items: [{ n: "Velvet Touch Masque — 1 jar", q: 1, p: 380 }], shipping: 60, status: "Delivered", placed: "29/08/2026", note: "" },
  { id: "STR-1036", customer: "Aya Fathy", phone: "0155 121 6767", email: "aya@example.com", street: "7 Sharia el-Geish", area: "Mansoura", gov: "Dakahlia", landmark: "", city: "Mansoura", items: [{ n: "Velvet Touch Masque — 2 jars", q: 1, p: 710 }], shipping: 0, status: "Delivered", placed: "28/08/2026", note: "" },
  { id: "STR-1035", customer: "Nada Hassan", phone: "0106 767 1212", email: "nada@example.com", street: "19 Sharia Sudan", area: "Mohandessin", gov: "Cairo", landmark: "", city: "Cairo", items: [{ n: "Velvet Touch Masque — 1 jar", q: 1, p: 380 }], shipping: 60, status: "Cancelled", placed: "27/08/2026", note: "Customer asked to cancel — wrong size." },
  { id: "STR-1034", customer: "Rana Ezz", phone: "0114 878 2323", email: "rana@example.com", street: "5 Sharia Ahmed Orabi", area: "Shubra", gov: "Cairo", landmark: "", city: "Cairo", items: [{ n: "Velvet Touch Masque — 1 jar", q: 1, p: 380 }], shipping: 60, status: "Delivered", placed: "26/08/2026", note: "" },
];
const FLOW = ["Placed", "Confirmed", "Packed", "With courier", "Delivered"];
const NEXT_LABEL = { Placed: "Mark confirmed", Confirmed: "Mark packed", Packed: "Mark with courier", "With courier": "Mark delivered" };
const HISTORY = {
  "STR-1040": [
    { s: "Placed", t: "01/09/2026 10:12", mail: { ok: true, to: "salma@example.com" } },
    { s: "Confirmed", t: "01/09/2026 11:40", mail: { ok: true, to: "salma@example.com" } },
    { s: "Packed", t: "01/09/2026 17:05", mail: { ok: false, why: "The mail service refused the address. Message her on WhatsApp instead." } },
    { s: "With courier", t: "02/09/2026 09:20", mail: { ok: true, to: "salma@example.com" } },
  ],
};
const PROMOS = [
  { id: "NOUR10", kind: "Percent off", value: "10%", min: "0 EGP", cap: "—", used: 23, on: true },
  { id: "SHIPFREE", kind: "Free shipping", value: "—", min: "600 EGP", cap: "100", used: 41, on: true },
];
const QUOTES = [
  { id: 1, en: "My hair felt soft for days, and the comb goes straight through now.", ar: "شعري بقى ناعم لأيام، والمشط بيمشي فيه على طول.", byEn: "Customer · Alexandria", byAr: "عميلة · الإسكندرية", order: 1, published: true },
  { id: 2, en: "The scent is light. It is gone by the time my hair dries.", ar: "الريحة خفيفة، بتختفي لما الشعر ينشف.", byEn: "Customer · Cairo", byAr: "عميلة · القاهرة", order: 2, published: true },
  { id: 3, en: "A little goes a long way. I use it instead of conditioner.", ar: "كمية صغيرة تكفي. بستخدمه بدل البلسم.", byEn: "Customer · Tanta", byAr: "عميلة · طنطا", order: 3, published: false },
];
const WAITLIST = [
  { id: 1, email: "lamia@example.com", city: "Dubai", country: "United Arab Emirates", joined: "28/08/2026" },
  { id: 2, email: "hind@example.com", city: "Riyadh", country: "Saudi Arabia", joined: "25/08/2026" },
  { id: 3, email: "fatma@example.com", city: "Doha", country: "Qatar", joined: "19/08/2026" },
  { id: 4, email: "reem@example.com", city: "Kuwait City", country: "Kuwait", joined: "11/08/2026" },
];
const EMAILS = {
  "Order confirmation": { subject: "We have your order, {name} — STR-1041", body: "Thank you for your order. We have it, and we will message you as soon as it is confirmed.\n\nTotal to collect on delivery: 440 EGP." },
  Confirmed: { subject: "Your Strands order is confirmed", body: "Your order is confirmed and we are getting it ready. Cash on delivery, 4–6 days." },
  Packed: { subject: "Your jar is packed", body: "Your order is packed and waiting for the courier." },
  "With courier": { subject: "On its way to you", body: "Your order is with the courier. They will call before they arrive." },
  Delivered: { subject: "Thank you for being part of our Strands family", body: "Every ingredient in your hair mask has been carefully selected to nourish your hair and give it exactly what it needs. We hope it works beautifully for you, and we'd love to hear your honest thoughts." },
  Cancelled: { subject: "Your Strands order was cancelled", body: "Your order has been cancelled and nothing was collected. If this was a mistake, message us and we will place it again." },
};
Object.assign(window, { DASH: { ORDERS, FLOW, NEXT_LABEL, HISTORY, PROMOS, QUOTES, WAITLIST, EMAILS } });
