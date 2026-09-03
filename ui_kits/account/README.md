# UI kit — customer account

The customer's side of the same sign-in. Everyone signs in on `/{lang}/account/login`
and lands here; **the only thing that differs for the owner is one extra button in
the header — "Dashboard"** — which crosses over to `ui_kits/dashboard/`. Nothing else
on the page changes, and nothing on the storefront hints the dashboard exists.

| File | What it is |
|---|---|
| `AccountHeader.jsx` | Storefront header, plus Dashboard for the owner only |
| `Account.jsx` | Page shell: greeting, three counts, Orders / Details tabs |
| `AccountOrders.jsx` | Order cards — number, status pill, contents, total, expand to track |
| `OrderTimeline.jsx` | The five steps with checks, the current one called out |
| `AccountDetails.jsx` | Name, phone, email, and the delivery address |

Order data is shared with the dashboard (`../dashboard/data.jsx`), so a status the
owner advances is the same status the customer reads.

## Interactive

The sign-in screen carries a **Preview as: Customer / Owner** switch so you can see
the one difference without two accounts. Track expands the timeline and the delivery
and payment details; the Details tab saves and confirms in words.

## Deliberately absent

No invoices, no returns portal, no wishlist, no loyalty points, no password screen —
the brief is orders and their status. Payment is cash on delivery, so there is
nothing charged online to show.
