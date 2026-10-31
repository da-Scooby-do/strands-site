// Strands ⇄ Weslat — wiring. The rules are in core.ts.
// Deploy with JWT verification OFF: the 30-minute job (secret header) and Weslat's
// webhook (key in the address) call it without a user token; every other call is
// checked below.
//
// Secrets (Supabase → Edge Functions → Secrets): WESLAT_API_URL and WESLAT_API_KEY
// (or WESLAT_USERNAME + WESLAT_PASSWORD to log in with).
import { createClient } from "jsr:@supabase/supabase-js@2";
import { sendOrder, syncStatuses, handleWebhook, runCron, testLogin, listServices, listZones, FINAL } from "./core.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const admin = createClient(SUPABASE_URL, SERVICE);
const ORDER = "*, order_items(*)";

const db = {
  async settings() {
    const { data } = await admin.from("settings").select("value").eq("key", "weslat").maybeSingle();
    return (data && data.value) || {};
  },
  async saveSettings(v: unknown) { await admin.from("settings").update({ value: v }).eq("key", "weslat"); },
  async order(id: string) {
    const { data } = await admin.from("orders").select(ORDER).eq("id", id).maybeSingle();
    return data;
  },
  async orderByWeslatCode(code: string) {
    const { data } = await admin.from("orders").select("id,order_number,status,weslat_code").eq("weslat_code", code).maybeSingle();
    return data;
  },
  async ordersToSend(cfg: any) {
    let q = admin.from("orders").select(ORDER).eq("country", "SD").not("status", "in", "(" + FINAL.join(",") + ")")
      .or("weslat_state.is.null,weslat_state.eq.waiting_payment").order("created_at", { ascending: true }).limit(50);
    if (cfg.enabled_at) q = q.gte("created_at", cfg.enabled_at);
    const { data } = await q;
    return data || [];
  },
  async ordersToSync() {
    const { data } = await admin.from("orders").select("id,order_number,status,weslat_code").eq("weslat_state", "sent")
      .not("status", "in", "(" + FINAL.join(",") + ")").order("created_at", { ascending: true }).limit(500);
    return data || [];
  },
  async updateOrder(id: string, patch: unknown) { await admin.from("orders").update(patch).eq("id", id); },
  async addEvent(order_id: string, status: string, note_en: string, note_ar: string) {
    await admin.from("order_events").insert({ order_id, status, note_en, note_ar });
  },
  // The customer's usual status email (notify-order accepts the service key).
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
    const deps = depsNow();

    // Weslat's status webhook: https://…/functions/v1/weslat?key=…
    const key = new URL(req.url).searchParams.get("key");
    if (key !== null) {
      const { data: ok } = await admin.rpc("weslat_hook_ok", { p_key: key });
      if (ok !== true) return json({ ok: false, error: "forbidden" }, 403);
      try { return json(await handleWebhook(deps, body)); }
      // Answer 200 anyway: the 30-minute job reads the status if this one failed.
      catch (e) { return json({ ok: true, deferred: String((e as Error).message || e) }); }
    }

    const action = String(body.action || "");
    // The 30-minute job (same secret as Flextock's job).
    if (action === "cron") {
      const { data: ok } = await admin.rpc("flextock_cron_ok", { p_secret: req.headers.get("x-cron-secret") || "" });
      if (ok !== true) return json({ ok: false, error: "forbidden" }, 403);
      return json({ ok: true, ...(await runCron(deps)) });
    }

    // Everything else is the owner's.
    const asCaller = createClient(SUPABASE_URL, ANON, { global: { headers: { Authorization: req.headers.get("Authorization") || "" } } });
    const { data: isAdmin } = await asCaller.rpc("is_admin");
    if (isAdmin !== true) return json({ ok: false, error: "forbidden" }, 403);

    if (action === "send") {
      const o = await db.order(String(body.order_id || ""));
      if (!o) return json({ ok: false, error: "order_not_found" }, 404);
      return json({ ok: true, ...(await sendOrder(deps, o, await db.settings(), body.manual === true)) });
    }
    if (action === "sync") {
      const r = await syncStatuses(deps);
      const cfg = await db.settings();
      await db.saveSettings({ ...cfg, last_sync: new Date().toISOString() });
      return json({ ok: true, ...r });
    }
    if (action === "test") return json(await testLogin(deps));
    if (action === "services") return json(await listServices(deps));
    if (action === "zones") return json(await listZones(deps, Number(body.service_id), body.zone_id ? Number(body.zone_id) : undefined));
    return json({ ok: false, error: "unknown_action" }, 400);
  } catch (e) {
    return json({ ok: false, error: String((e && (e as Error).message) || e) }, 500);
  }
});
