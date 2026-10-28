// Strands ⇄ Flextock — wiring. The rules are in core.ts.
// Deploy with JWT verification OFF: the 30-minute job calls it with a secret
// header instead of a user token; every other call is checked below.
//
// Secrets (Supabase → Edge Functions → Secrets): FLEXTOCK_USERNAME, FLEXTOCK_PASSWORD, FLEXTOCK_API_KEY.
import { createClient } from "jsr:@supabase/supabase-js@2";
import { sendOrder, syncStatuses, cancelOrder, runCron, testLogin, FINAL } from "./core.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const admin = createClient(SUPABASE_URL, SERVICE);
const ORDER = "*, order_items(*)";

const db = {
  async settings() {
    const { data } = await admin.from("settings").select("value").eq("key", "flextock").maybeSingle();
    return (data && data.value) || {};
  },
  async saveSettings(v: unknown) { await admin.from("settings").update({ value: v }).eq("key", "flextock"); },
  async variants() {
    const { data } = await admin.from("product_variants").select("key,jars,size_ml,sku_code");
    return data || [];
  },
  async order(id: string) {
    const { data } = await admin.from("orders").select(ORDER).eq("id", id).maybeSingle();
    return data;
  },
  async ordersToSend(cfg: any) {
    let q = admin.from("orders").select(ORDER).eq("country", "EG").not("status", "in", "(" + FINAL.join(",") + ")")
      .or("flextock_state.is.null,flextock_state.eq.waiting_payment").order("created_at", { ascending: true }).limit(50);
    if (cfg.enabled_at) q = q.gte("created_at", cfg.enabled_at);
    const { data } = await q;
    return data || [];
  },
  async ordersToSync() {
    const { data } = await admin.from("orders").select("id,order_number,status").eq("flextock_state", "sent")
      .not("status", "in", "(" + FINAL.join(",") + ")").order("created_at", { ascending: true }).limit(500);
    return data || [];
  },
  async updateOrder(id: string, patch: unknown) { await admin.from("orders").update(patch).eq("id", id); },
  async addEvent(order_id: string, status: string, note_en: string, note_ar: string) {
    await admin.from("order_events").insert({ order_id, status, note_en, note_ar });
  },
  // The customer's usual status email (notify-order accepts the service key from this function).
  async notify(order_id: string, status: string) {
    try {
      await fetch(SUPABASE_URL + "/functions/v1/notify-order", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + SERVICE, apikey: ANON }, body: JSON.stringify({ order_id, status }) });
    } catch (_e) { /* the status still moved; the email just didn't go */ }
  },
};

// Read the secrets on every call, so adding or changing them takes effect at once.
const depsNow = () => ({ env: Deno.env.toObject(), fetch, db });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body.action || "");
    const deps = depsNow();

    // The 30-minute job.
    if (action === "cron") {
      const secret = req.headers.get("x-cron-secret") || "";
      const { data: ok } = await admin.rpc("flextock_cron_ok", { p_secret: secret });
      if (ok !== true) return json({ ok: false, error: "forbidden" }, 403);
      return json({ ok: true, ...(await runCron(deps)) });
    }

    // Everyone else: who is calling?
    const asCaller = createClient(SUPABASE_URL, ANON, { global: { headers: { Authorization: req.headers.get("Authorization") || "" } } });
    const { data: u } = await asCaller.auth.getUser();
    const uid = u?.user?.id || null;
    const { data: isAdmin } = await asCaller.rpc("is_admin");
    const owner = isAdmin === true;

    if (action === "send") {
      const o = await db.order(String(body.order_id || ""));
      if (!o) return json({ ok: false, error: "order_not_found" }, 404);
      // The customer's own checkout may send their new order; anything else is the owner's.
      const fresh = Date.now() - new Date(o.created_at).getTime() < 15 * 60 * 1000;
      if (!owner && !(uid && uid === o.user_id && fresh)) return json({ ok: false, error: "forbidden" }, 403);
      const manual = owner && body.manual === true;
      return json({ ok: true, ...(await sendOrder(deps, o, await db.settings(), manual)) });
    }

    if (!owner) return json({ ok: false, error: "forbidden" }, 403);

    if (action === "sync") {
      const r = await syncStatuses(deps);
      const cfg = await db.settings();
      await db.saveSettings({ ...cfg, last_sync: new Date().toISOString() });
      return json({ ok: true, ...r });
    }
    if (action === "cancel") {
      const o = await db.order(String(body.order_id || ""));
      if (!o) return json({ ok: false, error: "order_not_found" }, 404);
      return json(await cancelOrder(deps, o));
    }
    if (action === "test") return json(await testLogin(deps));
    return json({ ok: false, error: "unknown_action" }, 400);
  } catch (e) {
    return json({ ok: false, error: String((e && (e as Error).message) || e) }, 500);
  }
});
