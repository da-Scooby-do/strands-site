// Strands ⇄ Flextock (warehouse + delivery, Egypt). The rules live here; index.ts
// only wires them to Supabase and the network, so they can be tested on their own.
//
//   send    — push one order to Flextock (auto after checkout, "Mark as paid", or the dashboard button)
//   cron    — every 30 min: send what's due, then read statuses + tracking back
//   sync    — the dashboard's "Sync now" (the read-back half of cron)
//   cancel  — the dashboard's "Cancel at Flextock"
//   test    — check the login works

export const API = "https://api.flextock.com";
export const FINAL = ["delivered", "cancelled", "returned"];
const FLOW = ["placed", "confirmed", "packed", "with_courier", "delivered"];

// ---------- what Flextock receives ----------

function splitName(full: string) {
  const parts = String(full || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { first_name: "Customer", last_name: "" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

// Our order + items -> Flextock's create-order body. Each line becomes its size's
// SKU × jars (a bundle without its own code uses its size's single-jar code), and
// lines that share a SKU are merged (Flextock refuses duplicate SKUs).
// Returns { body } or { error } when a SKU code is missing.
export function buildOrder(o: any, variants: any[], cfg: any) {
  const byKey: Record<string, any> = {};
  const singleBySize: Record<string, string> = {};
  for (const v of variants || []) {
    byKey[v.key] = v;
    if ((Number(v.jars) || 1) === 1 && v.sku_code) singleBySize[String(v.size_ml || 300)] = String(v.sku_code).trim();
  }
  const lines: Record<string, { sku_code: string; quantity: number; sku_price: number }> = {};
  for (const it of o.order_items || []) {
    const v = byKey[it.variant_key] || {};
    const sku = String(v.sku_code || "").trim() || singleBySize[String(v.size_ml || 300)] || "";
    if (!sku) return { error: "No Flextock SKU code for " + (it.meta_en || it.variant_key) + " — add it on Dashboard → Flextock." };
    const jars = Math.max(1, Number(v.jars) || 1);
    const qty = (Number(it.qty) || 1) * jars;
    const unit = Math.round(((Number(it.unit_price) || 0) / jars) * 100) / 100;  // price of one jar
    if (lines[sku]) lines[sku].quantity += qty;
    else lines[sku] = { sku_code: sku, quantity: qty, sku_price: unit };
  }
  const items = Object.values(lines);
  if (!items.length) return { error: "The order has no items." };

  const cities = (cfg && cfg.cities) || {};
  const prepaid = o.payment_method === "instapay";
  const name = splitName(o.full_name);
  const body: any = {
    order_code: o.order_number,
    order_date: String(o.created_at || new Date().toISOString()).slice(0, 10),
    shipping_fees: Number(o.shipping) || 0,
    is_free_shipping: !(Number(o.shipping) > 0),
    is_gift_order: false,
    order_currency: o.currency || "EGP",
    integration_source: "Strands",
    vendor_name: "Strands",
    customer_address: {
      country: "Egypt",
      city: cities[o.governorate] || o.governorate || "",
      area: o.area || "",
      address_line1: o.street || "",
      address_line2: o.landmark || "",
      is_work_address: false,
      ...name,
      phone_number: localPhone(o.phone),
      secondary_phone_number: localPhone(o.phone2 || o.phone),
      note: o.landmark ? "Landmark: " + o.landmark : "",
    },
    line_items: items,
    payment_data: [prepaid
      ? { value: Number(o.total) || 0, payment_type: "prepaid", payment_method: "InstaPay", payment_reference: o.order_number, payment_timestamp: fxTime(o.paid_at || o.created_at) }
      : { value: Number(o.total) || 0, payment_type: "cash_on_delivery" }],
    requires_self_delivery: false,  // Flextock delivers
  };
  if (Number(o.discount) > 0) body.discounts_data = [{ value: Number(o.discount), discount_type: "fixed", discount_code: o.promo_code || "DISCOUNT" }];
  return { body };
}

// Egyptian numbers as Flextock shows them (01xxxxxxxxx); others stay international.
export function localPhone(p: string) {
  const d = String(p || "").replace(/[^\d+]/g, "");
  if (d.startsWith("+20")) return "0" + d.slice(3);
  if (d.startsWith("20") && d.length === 12) return "0" + d.slice(2);
  return d;
}
function fxTime(t: string) {  // "2024-12-03 13:46:14.000 +0000"
  const d = new Date(t || Date.now());
  return d.toISOString().replace("T", " ").replace("Z", "") + " +0000";
}

// ---------- who gets sent ----------

// Why an order should NOT be sent automatically right now (or "" if it should).
// `manual` = the owner pressed "Send to Flextock" (skips the date and state checks).
export function holdReason(o: any, cfg: any, manual = false) {
  if (!cfg || !cfg.enabled) return "Flextock is switched off";
  if ((o.country || "EG") !== "EG") return "Flextock delivers in Egypt only";
  if (FINAL.includes(o.status)) return "Order is " + o.status;
  if (o.flextock_state === "sent") return "Already sent";
  if (o.payment_method === "instapay" && !o.paid_at) return "waiting_payment";
  if (!manual) {
    if (o.flextock_state === "failed") return "Last send failed — use Send to Flextock";
    if (cfg.enabled_at && new Date(o.created_at) < new Date(cfg.enabled_at)) return "Placed before Flextock was switched on";
  }
  return "";
}

// ---------- what comes back ----------

// Flextock's status word -> our status, or null to leave ours as it is.
export function mapStatus(raw: string): string | null {
  const s = String(raw || "").toLowerCase();
  if (!s) return null;
  if (/return/.test(s)) return "returned";
  if (/cancel/.test(s)) return "cancelled";
  if (/(fail|undeliver|not.?deliver|reject)/.test(s)) return null;  // a failed attempt: keep ours, show theirs
  // "out_for_delivery" mentions delivery but isn't delivered yet, so check this first.
  if (/(out.?for|ship|transit|courier|dispatch|picked|fulfil|on.?the.?way|handed)/.test(s)) return "with_courier";
  if (/(delivered|completed)/.test(s)) return "delivered";
  return null;  // pending / processing / packed …: nothing to change yet
}

// Should our order move from `cur` to `next`? Only forward along the flow, or to
// cancelled / returned; never out of a finished state (except delivered -> returned).
export function shouldMove(cur: string, next: string | null) {
  if (!next || next === cur) return false;
  if (cur === "cancelled" || cur === "returned") return false;
  if (cur === "delivered") return next === "returned";
  if (next === "cancelled" || next === "returned") return true;
  return FLOW.indexOf(next) > FLOW.indexOf(cur);
}

// Flextock's order-status reply -> { [order_code]: {order_status, tracking_number, tracking_url, courier_name} }.
// Their document only shows the single-order shape, so accept a list, a map, or one object.
export function readStatuses(data: any, codes: string[]) {
  const out: Record<string, any> = {};
  const one = (x: any, code?: string) => {
    if (!x || typeof x !== "object") return;
    const c = x.order_code || x.Order_code || x.code || code;
    if (c) out[c] = x;
  };
  if (Array.isArray(data)) data.forEach((x) => one(x));
  else if (data && typeof data === "object") {
    const list = data.orders || data.results || data.data;
    if (Array.isArray(list)) list.forEach((x: any) => one(x));
    else if ("order_status" in data && codes.length === 1) one(data, codes[0]);
    else for (const k of Object.keys(data)) if (data[k] && typeof data[k] === "object") one(data[k], k);
  }
  return out;
}

// ---------- the actions ----------
// deps: { env, fetch, db } — db is a small set of Supabase reads/writes (see index.ts).

async function fxLogin(deps: any) {
  const { FLEXTOCK_USERNAME: u, FLEXTOCK_PASSWORD: p, FLEXTOCK_API_KEY: k } = deps.env;
  if (!u || !p || !k) throw new Error("Flextock login isn't set up — add FLEXTOCK_USERNAME, FLEXTOCK_PASSWORD and FLEXTOCK_API_KEY in Supabase → Edge Functions → Secrets.");
  const r = await call(deps, "/base/auth/", null, { username: u, password: p, key: k });
  if (!r.ok || !r.data || !r.data.access) throw new Error("Flextock login failed (" + r.status + "): " + short(r.data));
  return r.data.access as string;
}

async function call(deps: any, path: string, token: string | null, body?: any, method = "POST") {
  const res = await deps.fetch(API + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data: any = text;
  try { data = JSON.parse(text); } catch (_e) { /* keep text */ }
  return { ok: res.ok, status: res.status, data };
}
const short = (x: any) => (typeof x === "string" ? x : JSON.stringify(x)).slice(0, 300);

// Send one order. Returns what happened, and records it on the order.
export async function sendOrder(deps: any, o: any, cfg: any, manual: boolean, token?: string) {
  const why = holdReason(o, cfg, manual);
  if (why === "waiting_payment") {
    if (o.flextock_state !== "waiting_payment") await deps.db.updateOrder(o.id, { flextock_state: "waiting_payment", flextock_error: null });
    return { sent: false, state: "waiting_payment" };
  }
  if (why) return { sent: false, skipped: why };
  const built = buildOrder(o, await deps.db.variants(), cfg);
  if (built.error) {
    await deps.db.updateOrder(o.id, { flextock_state: "failed", flextock_error: built.error });
    return { sent: false, state: "failed", error: built.error };
  }
  token = token || await fxLogin(deps);
  const r = await call(deps, "/external-integration/create-order/", token, built.body);
  // "already exists" means it reached Flextock before (e.g. a retry after a timeout).
  const dup = !r.ok && /already exists/i.test(short(r.data));
  if (r.ok || dup) {
    await deps.db.updateOrder(o.id, { flextock_state: "sent", flextock_error: null, flextock_sent_at: new Date().toISOString() });
    return { sent: true, state: "sent" };
  }
  const err = "Flextock refused the order (" + r.status + "): " + short(r.data);
  await deps.db.updateOrder(o.id, { flextock_state: "failed", flextock_error: err });
  return { sent: false, state: "failed", error: err };
}

// Read statuses + tracking for every sent, unfinished order; move ours and email the customer.
export async function syncStatuses(deps: any, token?: string) {
  const open = await deps.db.ordersToSync();  // flextock_state = sent, status not final
  if (!open.length) return { checked: 0, moved: 0 };
  token = token || await fxLogin(deps);
  let moved = 0, checked = 0;
  for (let i = 0; i < open.length; i += 100) {
    const batch = open.slice(i, i + 100);
    const codes = batch.map((o: any) => o.order_number);
    const r = await call(deps, "/external-integration/order-status/", token, codes.length === 1 ? { order_code: codes[0] } : { order_code_array: codes });
    if (!r.ok) throw new Error("Flextock status check failed (" + r.status + "): " + short(r.data));
    const st = readStatuses(r.data, codes);
    for (const o of batch) {
      const x = st[o.order_number];
      if (!x) continue;
      checked++;
      const patch: any = { flextock_status: x.order_status ?? null, flextock_synced_at: new Date().toISOString() };
      if (x.tracking_number) patch.tracking_number = x.tracking_number;
      if (x.tracking_url) patch.tracking_url = x.tracking_url;
      if (x.courier_name) patch.courier_name = x.courier_name;
      const next = mapStatus(x.order_status);
      if (shouldMove(o.status, next)) {
        patch.status = next;
        if (next === "cancelled") patch.flextock_state = "cancelled";
        moved++;
      }
      await deps.db.updateOrder(o.id, patch);
      if (patch.status) {
        await deps.db.addEvent(o.id, patch.status, "Flextock: " + x.order_status, "فليكستوك: " + x.order_status);
        await deps.db.notify(o.id, patch.status);
      }
    }
  }
  return { checked, moved };
}

export async function cancelOrder(deps: any, o: any) {
  const token = await fxLogin(deps);
  const r = await call(deps, "/external-integration/cancel-order/", token, { order_code: o.order_number, order_type: "outbound" });
  const msg = short(r.data);
  if (r.ok) {
    const pending = /in progress/i.test(msg);
    await deps.db.updateOrder(o.id, { flextock_state: pending ? "sent" : "cancelled", flextock_error: pending ? "Cancellation in progress at Flextock" : null });
    return { ok: true, pending };
  }
  const err = r.status === 406 ? "Flextock can't cancel it at this stage (" + msg + ")" : "Flextock cancel failed (" + r.status + "): " + msg;
  await deps.db.updateOrder(o.id, { flextock_error: err });
  return { ok: false, error: err };
}

// The 30-minute job: send what's due (newest first, a few per run), then read back.
export async function runCron(deps: any) {
  const cfg = await deps.db.settings();
  if (!cfg.enabled) return { skipped: "Flextock is switched off" };
  const token = await fxLogin(deps);
  const due = await deps.db.ordersToSend(cfg);  // EG, not sent, not final, placed after enabled_at
  const sent: string[] = [], failed: string[] = [];
  for (const o of due.slice(0, 50)) {
    const r = await sendOrder(deps, o, cfg, false, token);
    if (r.sent) sent.push(o.order_number); else if (r.state === "failed") failed.push(o.order_number);
  }
  const sync = await syncStatuses(deps, token);
  await deps.db.saveSettings({ ...cfg, last_sync: new Date().toISOString() });
  return { sent, failed, ...sync };
}

export async function testLogin(deps: any) {
  await fxLogin(deps);
  return { ok: true };
}
