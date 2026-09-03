// Strands — transactional order emails.
// Called by the dashboard whenever the owner advances an order's status, and by
// the storefront right after a customer places an order ('placed'). Renders the
// branded template for the status and sends it through Resend, then logs the
// result on the matching order_events row (notified_email / notify_result).
//
// Secrets used (set with `supabase secrets set` or in the dashboard):
//   RESEND_API_KEY  – required to actually send; without it the status still
//                     changes and the event is logged as 'no_provider'.
//   STRANDS_FROM    – e.g. "Strands <orders@strandsbynour.com>" (verified domain).
//                     Defaults to Resend's onboarding sender.
//   SITE_URL        – public site origin for the buttons. Defaults to the Vercel URL.
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM = Deno.env.get("STRANDS_FROM") || "Strands <onboarding@resend.dev>";
const SITE_URL = (Deno.env.get("SITE_URL") || "https://strands-site.vercel.app").replace(/\/$/, "");

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

function esc(s: unknown) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
}
function money(n: number) { return (Math.round(Number(n) || 0)).toLocaleString("en-US") + " EGP"; }

const PLUM = "#45254A", CREAM = "#FBF6EE", INK = "#2A2130", MUTED = "#615468", RULE = "#E6D9CB", LILAC = "#BEA8D1";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

const track = SITE_URL + "/ui_kits/account/";
const shopHref = SITE_URL + "/";
const igHref = "https://instagram.com/nourscoils";

const h1 = (t: string) => `<h1 style="font-family:${SERIF};color:${INK};font-size:34px;line-height:1.15;margin:0 0 18px;font-weight:400;">${t}</h1>`;
const p = (t: string) => `<p style="font-family:${SANS};color:${MUTED};font-size:17px;line-height:1.6;margin:0 0 6px;">${t}</p>`;
const numberCard = (num: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0;"><tr><td style="background:#FFFFFF;border:1px solid ${RULE};padding:16px 22px;">
    <div style="font-family:${SANS};color:${MUTED};font-size:12px;letter-spacing:.12em;text-transform:uppercase;">Order number</div>
    <div style="font-family:${SANS};color:${INK};font-size:26px;font-weight:700;margin-top:4px;">${esc(num)}</div>
  </td></tr></table>`;
const button = (label: string, href: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 4px;"><tr><td style="background:${PLUM};">
    <a href="${href}" style="display:inline-block;padding:15px 32px;font-family:${SANS};color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:.01em;">${label}</a>
  </td></tr></table>`;
const green = (t: string) => `
  <div style="background:#EDF0E7;padding:18px 20px;margin:24px 0;font-family:${SANS};color:#4C6531;font-size:16px;line-height:1.55;">${t}</div>`;

function itemsTable(order: any) {
  const row = (k: string, v: string, bold = false) =>
    `<tr>
       <td style="padding:12px 0;border-top:1px solid ${RULE};font-family:${SANS};color:${bold ? INK : MUTED};font-size:16px;${bold ? "font-weight:700;" : ""}">${k}</td>
       <td align="right" style="padding:12px 0;border-top:1px solid ${RULE};font-family:${SANS};color:${bold ? INK : MUTED};font-size:16px;${bold ? "font-weight:700;" : ""}">${v}</td>
     </tr>`;
  const items = (order.order_items || []).map((i: any) => row(`${esc(i.title_en)} × ${i.qty}`, money(i.line_total))).join("");
  const disc = order.discount ? row("Discount", "– " + money(order.discount)) : "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border-collapse:collapse;">
    ${items}${row("Subtotal", money(order.subtotal))}${disc}${row("Shipping", order.shipping ? money(order.shipping) : "Free")}${row("Total", money(order.total), true)}
  </table>`;
}

function shell(inner: string) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${CREAM};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};"><tr><td align="center" style="padding:0;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;">
      <tr><td style="background:${PLUM};padding:26px 36px;">
        <div style="font-family:${SERIF};color:#FFFFFF;font-size:24px;letter-spacing:.24em;">STRANDS</div>
      </td></tr>
      <tr><td style="padding:40px 36px;">${inner}</td></tr>
      <tr><td style="background:${PLUM};padding:28px 36px;">
        <div style="font-family:${SERIF};color:#FFFFFF;font-size:20px;letter-spacing:.24em;">STRANDS</div>
        <div style="font-family:${SANS};color:${LILAC};font-size:13px;margin-top:8px;">Perfection for every strand</div>
        <div style="font-family:${SANS};color:#9C86AE;font-size:12px;margin-top:12px;">© 2026 Strands. Cairo, Egypt. &nbsp;·&nbsp; @nourscoils</div>
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

function renderEmail(status: string, order: any): { subject: string; html: string } | null {
  const first = esc(String(order.full_name || "there").split(" ")[0]);
  const num = order.order_number;
  const total = order.total;
  switch (status) {
    case "placed":
      return { subject: `We have your order, ${first} — ${num}`, html: shell(
        h1(`Thank you ${first} — we have your order.`) +
        p("Nour will confirm on WhatsApp within a few hours. Have your phone nearby when the courier calls.") +
        numberCard(num) + itemsTable(order) +
        green(`You pay ${money(total)} in cash to the courier when the box arrives.`) +
        button("Track your order", track)) };
    case "confirmed":
      return { subject: "Your Strands order is confirmed", html: shell(
        h1("We have confirmed your order.") +
        p(`Order ${esc(num)} is confirmed and we are getting it ready. You will pay ${money(total)} in cash to the courier when it arrives.`) +
        numberCard(num) + button("Track your order", track)) };
    case "packed":
      return { subject: "Your jar is packed", html: shell(
        h1("Your order is packed.") +
        p("Your jar is boxed and waiting for the courier. We will write again the moment it goes out for delivery.") +
        numberCard(num) + button("Track your order", track)) };
    case "with_courier":
      return { subject: "On its way to you", html: shell(
        h1("Your order is with the courier.") +
        p(`It is out for delivery. Keep your phone nearby — the courier will call — and have ${money(total)} in cash ready.`) +
        numberCard(num) + green(`Have ${money(total)} in cash ready for the courier.`) +
        button("Track your order", track)) };
    case "delivered":
      return { subject: "Thank you for being part of our Strands family", html: shell(
        h1("Your order arrived.") +
        p("We hope you love it. If you do, tag us — we like seeing your hair.") +
        numberCard(num) + button("Share your result", igHref)) };
    case "cancelled":
      return { subject: "Your Strands order was cancelled", html: shell(
        h1("Your order was cancelled.") +
        p(`Order ${esc(num)} has been cancelled and nothing will be charged. If that is not right, message us and we will fix it.`) +
        numberCard(num) + button("Back to the shop", shopHref)) };
    default:
      return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  try {
    const auth = req.headers.get("Authorization") || "";
    const { order_id, status } = await req.json().catch(() => ({}));
    if (!order_id || !status) return json({ ok: false, error: "missing_order_id_or_status" }, 400);

    const asCaller = createClient(SUPABASE_URL, ANON, { global: { headers: { Authorization: auth } } });
    const { data: userData } = await asCaller.auth.getUser();
    const uid = userData?.user?.id || null;
    const { data: isAdmin } = await asCaller.rpc("is_admin");

    const admin = createClient(SUPABASE_URL, SERVICE);
    const { data: order, error: oErr } = await admin.from("orders").select("*, order_items(*)").eq("id", order_id).maybeSingle();
    if (oErr || !order) return json({ ok: false, error: "order_not_found" }, 404);

    const allowed = isAdmin === true || (status === "placed" && uid && uid === order.user_id);
    if (!allowed) return json({ ok: false, error: "forbidden" }, 403);

    const tpl = renderEmail(status, order);
    if (!tpl) return json({ ok: false, error: "unknown_status" }, 400);

    let notify = "no_provider";
    if (!order.email) {
      notify = "no_email";
    } else if (RESEND_API_KEY) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: FROM, to: [order.email], subject: tpl.subject, html: tpl.html }),
      });
      notify = r.ok ? "sent" : ("error:" + (await r.text()).slice(0, 200));
    }

    // Log the outcome on the most recent event for this order + status.
    const { data: ev } = await admin.from("order_events").select("id")
      .eq("order_id", order_id).eq("status", status).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (ev) await admin.from("order_events").update({ notified_email: order.email, notify_result: notify }).eq("id", ev.id);

    return json({ ok: true, sent: notify === "sent", notify_result: notify });
  } catch (e) {
    return json({ ok: false, error: String((e as Error)?.message || e) }, 500);
  }
});
