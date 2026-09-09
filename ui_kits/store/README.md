# UI kit — Strands store (product page)

A recreation of the single-product direct-to-customer page specified in
`uploads/STRANDS-page-style.md`, section by section. There is one product, so
there is one page; the kit is that page split into its sections.

| File | Section in the spec |
|---|---|
| `Header.jsx` | 1. Slim sticky header — shrinks on scroll |
| `Hero.jsx` | 2. Gallery left / buy box right (60-40), collapsible rows, bundle upsell |
| `Statement.jsx` | 3. Full-bleed purple statement + three ways to use it |
| `OverTime.jsx` | 5. Numbered accordion beside the scrolling photo strip |
| `PhotoStrip.jsx` | The gallery column: every product photograph, looping slowly, masked at both ends, paused on hover |
| `Science.jsx` | 6. Science block — three ingredient cards + the full-width chart |
| `Compare.jsx` | 7. Comparison table, full-bleed purple |
| `Standards.jsx` | 8. Standards / testing |
| `Reviews.jsx` | 9. Reviews — average, histogram, search, topic chips, sort, pagination |
| `Footer.jsx` | 10. Purple footer + 11. outlined display band |

## Interactive

Add to cart increments the header cart badge and flips the button label. Buy-box
rows and the numbered accordion open one at a time (first open on load). Review
search, topic chips and sort all filter the list. Language toggle is present but
does not translate the page — Arabic copy exists only for ingredients and usage.

## Phone

One breakpoint at 760px, from `responsive.jsx` (`useIsPhone`). Every row becomes
one column, section padding drops from 96px to 56px, headlines step down to
`--display-3`, and nothing scrolls sideways except the comparison table inside
its own container. The header sheds its nav, language toggle and account icon,
keeping only the wordmark and the cart; the add-to-cart action moves to a fixed
bar at the bottom of the screen carrying the price and the delivery promise.
The closing display band shrinks so it still clips rather than overflows.

## Photography

Real product photography, from `assets/photography/`: the jar in both hands, the
three-jar stack, the gift bag, the whipped texture, and the mango-butter-and-flaxseed
still. Warm daylight on cream and stone grounds, which is the direction the brand
already shoots in. All three ingredient cards now carry their own
still — mango, flaxseed oil and seed, hibiscus — shot on warm stone and wood.
