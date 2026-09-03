# UI kit — Strands owner dashboard

Nour's side of the store, recreated from `STRANDS-dashboard.md`. One person runs
the brand, so the dashboard shows **what needs doing**, not what happened: no
charts, no funnels, no cohort tables. English only — it is a tool, not a
customer surface.

| File | Screen |
|---|---|
| `Login.jsx` | `/{lang}/account/login` — the same page customers use |
| `Shell.jsx` | Fixed 210px dark-purple sidebar, cream content area |
| `Overview.jsx` | `/admin` — four stat boxes, ten newest orders |
| `Orders.jsx` | `/admin/orders` — status filters, search, export |
| `OrderDetail.jsx` | `/admin/orders/[id]` — move it along · the order itself · deliver to · history |
| `Product.jsx` | `/admin/product` — price, stock, copy in both languages, three bundles, shipping |
| `Promos.jsx` | `/admin/promos` — create, enable/disable, delete |
| `ReviewQuotes.jsx` | `/admin/reviews` — chosen quotes, EN/AR, published switch |
| `Waitlist.jsx` | `/admin/waitlist` — read-only, with export |
| `Emails.jsx` | `/admin/emails` — every message rendered as it will arrive |
| `data.jsx` | Sample orders, promos, quotes, waitlist and email copy |

## Interactive

Sign in (any values) lands on the overview. Order rows open the detail screen,
where the single filled button advances one step through Placed → Confirmed →
Packed → With courier → Delivered, and the quiet chip row shows where it sits.
Cancel is quiet and last. Order filters and search work. Product and promo saves
validate and answer in words — a bad stock value refuses and says why. Review
publish switches, promo enable/disable and delete all work. The Emails screen
renders each message; nothing is sent from it.

## Faithful to the spec

- One filled button per screen; everything else outlined or text.
- Only the **next** status is offered — she never works out which of six comes next.
- History shows the email result per step, including a **failed** send on STR-1040
  with a plain sentence saying what to do instead.
- Nothing fails silently; nothing is worded in database language.

## Phone

Same 760px breakpoint. The fixed sidebar becomes a purple top bar showing the
current screen name and a menu button; the nav drops down beneath it at 48px
touch targets and closes on pick. Overview stats go two-up, the order screen
stacks to one column, and every admin table scrolls horizontally inside its own
card rather than squeezing its columns. Page headers wrap their action button
onto a second line instead of crushing the heading.

## Not built

Real auth and the customer-vs-owner routing rule, CSV generation, WhatsApp deep
links, and Arabic email bodies (the Arabic view says the copy is not written yet).
