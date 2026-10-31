// Strands ⇄ Weslat International (delivery, Sudan), through its "Accurate" GraphQL API.
// The rules live here; index.ts only wires them to Supabase and the network, so they
// can be tested on their own.
//
//   send     — create one order's shipment ("Mark as paid", the dashboard button, or the job)
//   cron     — every 30 min: send what's due, then read statuses + tracking back
//   webhook  — Weslat's call on a status change (re-read from the API, never trusted as sent)
//   sync     — the dashboard's "Sync Weslat" (the read-back half of cron)
//   quote    — Weslat's own delivery price per Sudan delivery choice, for a number of jars
//   test / services / zones — check the login, and the lookups for Dashboard → Weslat

export const FINAL = ["delivered", "cancelled", "returned"];
const FLOW = ["placed", "confirmed", "packed", "with_courier", "delivered"];

// ---------- what Weslat receives ----------

// Sudanese numbers as couriers dial them (09xxxxxxxx / 01xxxxxxxx); others stay international.
export function localPhone(p: string) {
  const d = String(p || "").replace(/[^\d+]/g, "");
  if (d.startsWith("+249")) return "0" + d.slice(4);
  if (d.startsWith("249") && d.length === 12) return "0" + d.slice(3);
  return d;
}

// Jars in an order, from the stored "300 ml · 2 jars" labels.
export function jarsIn(o: any) {
  let n = 0;
  for (const it of o.order_items || []) {
    const m = String(it.meta_en || "").match(/(\d+)\s*jar/i);
    n += (Number(it.qty) || 1) * (m ? Number(m[1]) : 1);
  }
  return Math.max(1, n);
}

// Our order -> Weslat's saveShipment input. Returns { input } or { error }.
export function buildShipment(o: any, cfg: any) {
  if (!cfg || !cfg.service_id) return { error: "Choose the Weslat shipping service on Dashboard → Weslat." };
  const z = ((cfg.zones || {})[o.delivery_method || ""]) || null;
  if (!z || !z.zone_id) {
    return { error: "No Weslat city for the delivery choice “" + (o.delivery_method || "none") + "” — set it on Dashboard → Weslat." };
  }
  const jars = jarsIn(o);
  const cod = o.payment_method === "cod";
  const address = [o.street, o.area, o.landmark ? "Landmark: " + o.landmark : "", o.governorate].filter((x) => String(x || "").trim()).join(", ");
  const input: any = {
    serviceId: Number(cfg.service_id),
    refNumber: o.order_number,
    recipientName: o.full_name || "",
    recipientMobile: localPhone(o.phone),
    recipientZoneId: Number(z.zone_id),
    recipientSubzoneId: z.subzone_id ? Number(z.subzone_id) : null,  // filled in by sendOrder when not saved
    recipientAddress: address,
    description: "Strands hair masque × " + jars,
    piecesCount: 1,
    weight: Math.max(0.5, Math.round(jars * (Number(cfg.jar_kg) || 0.5) * 10) / 10),
    // Paid orders (transfer on WhatsApp): the courier collects nothing.
    price: cod ? Number(o.total) || 0 : 0,
    priceTypeCode: "INCLD",
    paymentTypeCode: cod ? "COLC" : "PAID",
    notes: "Strands order " + o.order_number,
  };
  if (o.phone2 && localPhone(o.phone2) !== input.recipientMobile) input.recipientPhone = localPhone(o.phone2);
  return { input };
}

// ---------- who gets sent ----------

// Why an order should NOT be sent now (or "" if it should).
// `manual` = the owner pressed "Send to Weslat" (skips the date and failed checks).
export function holdReason(o: any, cfg: any, manual = false) {
  if (!cfg || !cfg.enabled) return "Weslat is switched off";
  if ((o.country || "EG") !== "SD") return "Weslat delivers in Sudan only";
  if (FINAL.includes(o.status)) return "Order is " + o.status;
  if (o.weslat_state === "sent") return "Already sent";
  if (o.payment_method !== "cod" && !o.paid_at) return "waiting_payment";
  if (!manual) {
    if (o.weslat_state === "failed") return "Last send failed — use Send to Weslat";
    if (cfg.enabled_at && new Date(o.created_at) < new Date(cfg.enabled_at)) return "Placed before Weslat was switched on";
  }
  return "";
}

// ---------- what comes back ----------

// Weslat's status code -> our status, or null to leave ours as it is.
export function mapStatus(code: string): string | null {
  const c = String(code || "").toUpperCase();
  if (["PKD", "RITS", "PRP", "PRPD", "BMT", "BMR", "STD", "OTD"].includes(c)) return "with_courier";
  if (c === "DTR") return "delivered";
  if (c === "RTRN") return "returned";
  return null;  // PKR/PKM/PKH (not picked up yet), DEX/HTR (retrying), RTS/RCV/OTR (on its way back), RJCT
}

// Should our order move from `cur` to `next`? Forward along the flow, or to returned;
// never out of a finished state (except delivered -> returned).
export function shouldMove(cur: string, next: string | null) {
  if (!next || next === cur) return false;
  if (cur === "cancelled" || cur === "returned") return false;
  if (cur === "delivered") return next === "returned";
  if (next === "returned") return true;
  return FLOW.indexOf(next) > FLOW.indexOf(cur);
}

// ---------- the API ----------
// deps: { env, fetch, db } — db is a small set of Supabase reads/writes (see index.ts).

const SHIPMENT_FIELDS = "id code refNumber trackingUrl status { code name }";
const short = (x: any) => (typeof x === "string" ? x : JSON.stringify(x)).slice(0, 300);

// Either an API key from Weslat (used as the token as it is), or a username + password to log in with.
const apiKey = (deps: any) => String(deps.env.WESLAT_API_KEY || "").trim().replace(/^Bearer\s+/i, "");
const canLogIn = (deps: any) => !!(deps.env.WESLAT_USERNAME && deps.env.WESLAT_PASSWORD);

function apiUrl(deps: any) {
  const u = String(deps.env.WESLAT_API_URL || "").trim();
  if (!u || !(apiKey(deps) || canLogIn(deps))) {
    throw new Error("Weslat login isn't set up — add WESLAT_API_URL and WESLAT_API_KEY (or WESLAT_USERNAME and WESLAT_PASSWORD) in Supabase → Edge Functions → Secrets.");
  }
  return u;
}

// GraphQL errors arrive with HTTP 200, so read the body. Validation details are spelled out.
function errorText(body: any, status: number) {
  const errs = body && Array.isArray(body.errors) ? body.errors : null;
  if (!errs) return "HTTP " + status + ": " + short(body);
  return errs.map((e: any) => {
    const v = e && e.extensions && e.extensions.validation;
    const detail = v ? " (" + Object.entries(v).map(([k, m]) => k.replace(/^input\./, "") + ": " + [].concat(m as any).join(" ")).join("; ") + ")" : "";
    return String((e && e.message) || "error") + detail;
  }).join(" · ");
}

async function post(deps: any, token: string | null, query: string, variables: any) {
  const res = await deps.fetch(apiUrl(deps), {
    method: "POST",
    headers: { "Content-Type": "application/json", "Content-Language": "en", ...(token ? { Authorization: "Bearer " + token } : {}) },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  let body: any = text;
  try { body = JSON.parse(text); } catch (_e) { /* keep text */ }
  return { status: res.status, body };
}

// One session per run. With an API key it is the token; otherwise log in on first use,
// and once more if the token is refused.
export function session(deps: any) {
  let token: string | null = apiKey(deps) || null;
  const login = async () => {
    if (!canLogIn(deps)) throw new Error("Weslat refused the API key (Unauthenticated) — check WESLAT_API_KEY with Weslat.");
    const r = await post(deps, null, "mutation Login($input: LoginInput!) { login(input: $input) { token } }",
      { input: { username: deps.env.WESLAT_USERNAME, password: deps.env.WESLAT_PASSWORD, rememberMe: true } });
    const t = r.body && r.body.data && r.body.data.login && r.body.data.login.token;
    if (!t) throw new Error("Weslat login failed — " + errorText(r.body, r.status));
    token = t;
  };
  return async function gql(query: string, variables: any = {}) {
    apiUrl(deps);  // fails clearly when the secrets aren't set
    if (!token) await login();
    let r = await post(deps, token, query, variables);
    const unauth = (b: any) => b && Array.isArray(b.errors) && b.errors.some((e: any) => /unauthenticated/i.test(String(e && e.message)));
    if (r.status === 401 || unauth(r.body)) { await login(); r = await post(deps, token, query, variables); }
    if (r.status >= 400 || !r.body || typeof r.body !== "object" || (Array.isArray(r.body.errors) && r.body.errors.length)) {
      throw new Error(errorText(r.body, r.status));
    }
    return r.body.data;
  };
}

// ---------- the actions ----------

// Weslat insists on a sub-area; the address says where exactly, so the city's first one does.
async function firstSubzone(gql: any, zoneId: number) {
  const subs = await gql("query Subzones($zoneId: Int!) { listZonesDropdown(input: { active: true, parentId: $zoneId }) { id name } }", { zoneId });
  const first = subs && subs.listZonesDropdown && subs.listZonesDropdown[0];
  return first ? Number(first.id) : zoneId;
}

// Send one order. Records what happened on the order and returns it.
export async function sendOrder(deps: any, o: any, cfg: any, manual: boolean, gql?: any) {
  const why = holdReason(o, cfg, manual);
  if (why === "waiting_payment") {
    if (o.weslat_state !== "waiting_payment") await deps.db.updateOrder(o.id, { weslat_state: "waiting_payment", weslat_error: null });
    return { sent: false, state: "waiting_payment" };
  }
  if (why) return { sent: false, skipped: why };
  const built = buildShipment(o, cfg);
  if (built.error) {
    await deps.db.updateOrder(o.id, { weslat_state: "failed", weslat_error: built.error });
    return { sent: false, state: "failed", error: built.error };
  }
  gql = gql || session(deps);
  try {
    // A retry after a timeout may find it already there: adopt it rather than ship twice.
    const found = await gql("query Find($input: ListShipmentsFilterInput) { listShipments(input: $input, first: 1) { data { " + SHIPMENT_FIELDS + " } } }",
      { input: { refNumber: [o.order_number] } });
    let s = found && found.listShipments && found.listShipments.data && found.listShipments.data[0];
    if (!s) {
      if (!built.input.recipientSubzoneId) built.input.recipientSubzoneId = await firstSubzone(gql, built.input.recipientZoneId);
      const made = await gql("mutation CreateShipment($input: ShipmentInput!) { saveShipment(input: $input) { " + SHIPMENT_FIELDS + " } }", { input: built.input });
      s = made && made.saveShipment;
      if (!s) throw new Error("Weslat returned no shipment.");
    }
    await deps.db.updateOrder(o.id, {
      weslat_state: "sent", weslat_error: null, weslat_sent_at: new Date().toISOString(),
      weslat_id: s.id, weslat_code: s.code, weslat_status: (s.status && s.status.code) || null,
      tracking_number: s.code, tracking_url: s.trackingUrl || null, courier_name: "Weslat",
    });
    return { sent: true, state: "sent", code: s.code };
  } catch (e) {
    const err = "Weslat refused the shipment: " + String((e as Error).message || e);
    await deps.db.updateOrder(o.id, { weslat_state: "failed", weslat_error: err });
    return { sent: false, state: "failed", error: err };
  }
}

// Apply one shipment's state (from the API) to our order; email the customer if it moved.
async function applyShipment(deps: any, o: any, s: any) {
  const code = s.status && s.status.code;
  const patch: any = { weslat_status: code || null, weslat_synced_at: new Date().toISOString() };
  if (s.trackingUrl) patch.tracking_url = s.trackingUrl;
  const next = mapStatus(code);
  if (shouldMove(o.status, next)) patch.status = next;
  await deps.db.updateOrder(o.id, patch);
  if (patch.status) {
    const name = (s.status && s.status.name) || code;
    await deps.db.addEvent(o.id, patch.status, "Weslat: " + name, "وصلت: " + name);
    await deps.db.notify(o.id, patch.status);
  }
  return !!patch.status;
}

// Read statuses + tracking for every sent, unfinished order.
export async function syncStatuses(deps: any, gql?: any) {
  const open = await deps.db.ordersToSync();  // weslat_state = sent, status not final
  if (!open.length) return { checked: 0, moved: 0 };
  gql = gql || session(deps);
  let moved = 0, checked = 0;
  for (let i = 0; i < open.length; i += 100) {
    const batch = open.slice(i, i + 100);
    const d = await gql("query MyShipments($input: ListShipmentsFilterInput) { listShipments(input: $input, first: 100) { data { " + SHIPMENT_FIELDS + " } } }",
      { input: { code: batch.map((o: any) => o.weslat_code) } });
    const byCode: Record<string, any> = {};
    for (const s of (d && d.listShipments && d.listShipments.data) || []) byCode[s.code] = s;
    for (const o of batch) {
      const s = byCode[o.weslat_code];
      if (!s) continue;
      checked++;
      if (await applyShipment(deps, o, s)) moved++;
    }
  }
  return { checked, moved };
}

// Weslat's webhook: the body only says which shipment changed. Read that shipment
// from the API ourselves, so a forged call can't move an order.
export async function handleWebhook(deps: any, body: any) {
  const code = String((body && body.shipmentCode) || "").trim();
  if (!code) return { ok: true, ignored: "no shipmentCode" };
  const o = await deps.db.orderByWeslatCode(code);
  if (!o) return { ok: true, ignored: "not one of our orders" };
  const gql = session(deps);
  const d = await gql("query Track($code: String) { shipment(code: $code) { " + SHIPMENT_FIELDS + " } }", { code });
  if (!d || !d.shipment) return { ok: true, ignored: "shipment not found at Weslat" };
  const moved = await applyShipment(deps, o, d.shipment);
  return { ok: true, moved };
}

// The 30-minute job: send what's due, then read back.
export async function runCron(deps: any) {
  const cfg = await deps.db.settings();
  if (!cfg.enabled) return { skipped: "Weslat is switched off" };
  const gql = session(deps);
  const due = await deps.db.ordersToSend(cfg);  // SD, not sent, not final, placed after enabled_at
  const sent: string[] = [], failed: string[] = [];
  for (const o of due.slice(0, 50)) {
    const r = await sendOrder(deps, o, cfg, false, gql);
    if (r.sent) sent.push(o.order_number); else if (r.state === "failed") failed.push(o.order_number);
  }
  const sync = await syncStatuses(deps, gql);
  await deps.db.saveSettings({ ...cfg, last_sync: new Date().toISOString() });
  return { sent, failed, ...sync };
}

// ---------- delivery prices ----------

export const QUOTE_HOURS = 6;  // a price is asked again after this long (the order accepts it for 24 h)

// What Weslat charges, from calculateShipmentFees: everything but the goods' own amount.
export function feeFrom(f: any) {
  if (!f) return null;
  const total = Number(f.total) - Number(f.amount || 0);
  const parts = ["delivery", "weight", "collection", "post", "tax"].reduce((a, k) => a + (Number(f[k]) || 0), 0);
  const fee = total > 0 ? total : parts;
  return fee > 0 ? Math.round(fee) : null;
}

// Weslat's price for every Sudan delivery choice that has a Weslat city, for `jars` jars.
// Fresh saved prices are reused; the rest are asked for, saved, and returned.
// Returns { fees: { key: fee } } — a choice Weslat couldn't price is left out (its saved fee applies).
export async function quoteFees(deps: any, jarsIn: number) {
  const jars = Math.min(20, Math.max(1, Math.floor(Number(jarsIn) || 1)));
  const cfg = await deps.db.settings();
  const options = (await deps.db.deliveryOptions("SD")) || [];
  const fees: Record<string, number> = {};
  if (!cfg.service_id) return { ok: true, jars, fees };
  const fresh = await deps.db.quotes("SD", jars, QUOTE_HOURS);  // { key: fee }
  const todo = options.filter((o: any) => ((cfg.zones || {})[o.key] || {}).zone_id && !(o.key in fresh));
  for (const k of Object.keys(fresh)) fees[k] = fresh[k];
  if (!todo.length) return { ok: true, jars, fees };
  const gql = session(deps);
  const weight = Math.max(0.5, Math.round(jars * (Number(cfg.jar_kg) || 0.5) * 10) / 10);
  await Promise.all(todo.map(async (o: any) => {
    try {
      const z = cfg.zones[o.key];
      const sub = z.subzone_id ? Number(z.subzone_id) : await firstSubzone(gql, Number(z.zone_id));
      const d = await gql("query Fees($input: CalculateShipmentFeesInput!) { calculateShipmentFees(input: $input) { amount delivery weight collection post tax total } }",
        { input: { serviceId: Number(cfg.service_id), weight, recipientZoneId: Number(z.zone_id), recipientSubzoneId: sub, price: 0, priceTypeCode: "EXCLD", paymentTypeCode: "PAID" } });
      const fee = feeFrom(d && d.calculateShipmentFees);
      if (fee) { fees[o.key] = fee; await deps.db.saveQuote("SD", o.key, jars, fee); }
    } catch (_e) { /* this choice keeps its saved fee */ }
  }));
  return { ok: true, jars, fees };
}

// ---------- lookups for the dashboard ----------

export async function testLogin(deps: any) {
  await session(deps)("query Services { listShippingServicesDropdown(input: { active: true }) { id } }");
  return { ok: true };
}
export async function listServices(deps: any) {
  const d = await session(deps)("query Services { listShippingServicesDropdown(input: { active: true }) { id name } }");
  return { ok: true, services: (d && d.listShippingServicesDropdown) || [] };
}
// Zones the service delivers to, or (with zoneId) the subzones inside one zone.
export async function listZones(deps: any, serviceId: number, zoneId?: number) {
  const gql = session(deps);
  const d = zoneId
    ? await gql("query Subzones($zoneId: Int!) { listZonesDropdown(input: { active: true, parentId: $zoneId }) { id name } }", { zoneId })
    : await gql("query Zones($serviceId: Int!) { listZonesDropdown(input: { active: true, service: { serviceId: $serviceId } }) { id name } }", { serviceId });
  return { ok: true, zones: (d && d.listZonesDropdown) || [] };
}
