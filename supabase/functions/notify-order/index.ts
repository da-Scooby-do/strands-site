// Strands — transactional order emails.
// Subject + body per status are OWNER-EDITABLE, stored in settings.emails
// ({status: {subject_en, body_en, subject_ar, body_ar}}); the headline, order
// card, totals and button stay fixed for a consistent look. Placeholders in the
// copy: {name} {order} {total}. Sent through Resend; result logged on the event.
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
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

function esc(s) { return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function money(n, lang) { return (Math.round(Number(n) || 0)).toLocaleString("en-US") + (lang === "ar" ? " ج.م" : " EGP"); }

const PLUM = "#45254A", CREAM = "#FBF6EE", INK = "#2A2130", MUTED = "#615468", RULE = "#E6D9CB", LILAC = "#BEA8D1";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";
const track = SITE_URL + "/ui_kits/account/", shopHref = SITE_URL + "/", igHref = "https://instagram.com/nourscoils";

const h1 = (t, rtl) => `<h1 style="font-family:${SERIF};color:${INK};font-size:34px;line-height:1.15;margin:0 0 18px;font-weight:400;${rtl ? "direction:rtl;text-align:right;" : ""}">${t}</h1>`;
const p = (t, rtl) => `<p style="font-family:${SANS};color:${MUTED};font-size:17px;line-height:1.6;margin:0 0 6px;${rtl ? "direction:rtl;text-align:right;" : ""}">${t}</p>`;
const numberCard = (num, label) => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0;"><tr><td style="background:#FFFFFF;border:1px solid ${RULE};padding:16px 22px;">
    <div style="font-family:${SANS};color:${MUTED};font-size:12px;letter-spacing:.12em;text-transform:uppercase;">${label}</div>
    <div style="font-family:${SANS};color:${INK};font-size:26px;font-weight:700;margin-top:4px;">${esc(num)}</div>
  </td></tr></table>`;
const button = (label, href) => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 4px;"><tr><td style="background:${PLUM};">
    <a href="${href}" style="display:inline-block;padding:15px 32px;font-family:${SANS};color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;">${label}</a>
  </td></tr></table>`;
const green = (t, rtl) => `<div style="background:#EDF0E7;padding:18px 20px;margin:24px 0;font-family:${SANS};color:#4C6531;font-size:16px;line-height:1.55;${rtl ? "direction:rtl;text-align:right;" : ""}">${t}</div>`;

function itemsTable(order, lang) {
  const rtl = lang === "ar";
  const row = (k, v, bold = false) =>
    `<tr><td style="padding:12px 0;border-top:1px solid ${RULE};font-family:${SANS};color:${bold ? INK : MUTED};font-size:16px;${bold ? "font-weight:700;" : ""}${rtl ? "text-align:right;" : ""}">${k}</td>
       <td align="${rtl ? "left" : "right"}" style="padding:12px 0;border-top:1px solid ${RULE};font-family:${SANS};color:${bold ? INK : MUTED};font-size:16px;${bold ? "font-weight:700;" : ""}">${v}</td></tr>`;
  const items = (order.order_items || []).map((i) => row(`${esc(rtl ? (i.title_ar || i.title_en) : i.title_en)} × ${i.qty}`, money(i.line_total, lang))).join("");
  const L = rtl
    ? { sub: "الإجمالي الفرعي", disc: "خصم", ship: "الشحن", free: "مجاني", total: "الإجمالي" }
    : { sub: "Subtotal", disc: "Discount", ship: "Shipping", free: "Free", total: "Total" };
  const disc = order.discount ? row(L.disc, "– " + money(order.discount, lang)) : "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border-collapse:collapse;${rtl ? "direction:rtl;" : ""}">
    ${items}${row(L.sub, money(order.subtotal, lang))}${disc}${row(L.ship, order.shipping ? money(order.shipping, lang) : L.free)}${row(L.total, money(order.total, lang), true)}
  </table>`;
}

function shell(inner) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${CREAM};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};"><tr><td align="center" style="padding:0;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;">
      <tr><td style="background:${PLUM};padding:26px 36px;"><div style="font-family:${SERIF};color:#FFFFFF;font-size:24px;letter-spacing:.24em;">STRANDS</div></td></tr>
      <tr><td style="padding:40px 36px;">${inner}</td></tr>
      <tr><td style="background:${PLUM};padding:28px 36px;">
        <div style="font-family:${SERIF};color:#FFFFFF;font-size:20px;letter-spacing:.24em;">STRANDS</div>
        <div style="font-family:${SANS};color:${LILAC};font-size:13px;margin-top:8px;">Perfection for every strand</div>
        <div style="font-family:${SANS};color:#9C86AE;font-size:12px;margin-top:12px;">© 2026 Strands. Cairo, Egypt. &nbsp;·&nbsp; @nourscoils</div>
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

const HEADLINE = {
  placed: { en: "Thank you {first} — we have your order.", ar: "شكرًا {first} — وصلنا طلبك." },
  confirmed: { en: "We have confirmed your order.", ar: "أكّدنا طلبك." },
  packed: { en: "Your order is packed.", ar: "طلبك اتجهّز." },
  with_courier: { en: "Your order is with the courier.", ar: "طلبك مع المندوب." },
  delivered: { en: "Your order arrived.", ar: "طلبك وصل." },
  cancelled: { en: "Your order was cancelled.", ar: "طلبك اتلغى." },
};
const BTN = {
  track: { en: "Track your order", ar: "تابعي طلبك" },
  share: { en: "Share your result", ar: "شاركي نتيجتك" },
  shop: { en: "Back to the shop", ar: "رجوع للمتجر" },
  orderNo: { en: "Order number", ar: "رقم الطلب" },
};
const GREEN = {
  placed: { en: "You pay {total} in cash to the courier when the box arrives.", ar: "بتدفعي {total} كاش للمندوب لما العلبة توصل." },
  with_courier: { en: "Have {total} in cash ready for the courier.", ar: "جهّزي {total} كاش للمندوب." },
};

function fill(s, order, lang, doEsc) {
  const first = String(order.full_name || "there").split(" ")[0] || "there";
  let out = doEsc ? esc(String(s || "")) : String(s || "");
  return out.replace(/\{name\}/g, doEsc ? esc(first) : first)
            .replace(/\{first\}/g, doEsc ? esc(first) : first)
            .replace(/\{order\}/g, doEsc ? esc(order.order_number) : order.order_number)
            .replace(/\{total\}/g, money(order.total, lang));
}

function renderEmail(status, order, tmpl, lang) {
  if (!HEADLINE[status]) return null;
  const rtl = lang === "ar";
  const num = order.order_number;
  tmpl = tmpl || {};
  const subject = fill(tmpl["subject_" + lang] || tmpl.subject_en || "", order, lang, false) || (rtl ? "طلبك من Strands" : "Your Strands order");
  const bodyText = fill(tmpl["body_" + lang] || tmpl.body_en || "", order, lang, true);
  const head = fill(HEADLINE[status][lang] || HEADLINE[status].en, order, lang, true);
  const orderLabel = BTN.orderNo[lang];

  let inner = h1(head, rtl) + p(bodyText, rtl) + numberCard(num, orderLabel);
  if (status === "placed") inner += itemsTable(order, lang) + green(fill(GREEN.placed[lang], order, lang, false), rtl) + button(BTN.track[lang], track);
  else if (status === "with_courier") inner += green(fill(GREEN.with_courier[lang], order, lang, false), rtl) + button(BTN.track[lang], track);
  else if (status === "delivered") inner += button(BTN.share[lang], igHref);
  else if (status === "cancelled") inner += button(BTN.shop[lang], shopHref);
  else inner += button(BTN.track[lang], track);

  return { subject, html: shell(inner) };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  try {
    const auth = req.headers.get("Authorization") || "";
    const body = await req.json().catch(() => ({}));
    const order_id = body.order_id, status = body.status;
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

    const lang = order.lang === "ar" ? "ar" : "en";
    const { data: st } = await admin.from("settings").select("value").eq("key", "emails").maybeSingle();
    const templates = (st && st.value) || {};
    const tpl = renderEmail(status, order, templates[status], lang);
    if (!tpl) return json({ ok: false, error: "unknown_status" }, 400);

    let notify = "no_provider";
    if (!order.email) notify = "no_email";
    else if (RESEND_API_KEY) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: FROM, to: [order.email], subject: tpl.subject, html: tpl.html }),
      });
      notify = r.ok ? "sent" : ("error:" + (await r.text()).slice(0, 200));
    }

    const { data: ev } = await admin.from("order_events").select("id")
      .eq("order_id", order_id).eq("status", status).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (ev) await admin.from("order_events").update({ notified_email: order.email, notify_result: notify }).eq("id", ev.id);

    return json({ ok: true, sent: notify === "sent", notify_result: notify });
  } catch (e) {
    return json({ ok: false, error: String((e && e.message) || e) }, 500);
  }
});
