# Strands Design System

**Strands** is an owner-run hair-care brand in Cairo, Egypt, selling one product
direct to customers online, cash on delivery across Egypt. The product is the
**Velvet Touch Masque**, 300 ml, a nine-ingredient hair mask that works three
ways: as a pre-wash treatment, in place of conditioner, or as a deep-care mask.
The business is bilingual — English above Arabic, and the Arabic is Egyptian
dialect, never formal MSA.

The identity is ornamental and feminine: damask scrollwork, a filigree monogram,
wavy die-cut label shapes. It reads closer to a perfume or apothecary brand than
to a modern minimal cosmetics label. **Purple and green together are the
signature; neither works alone.**

## Surfaces represented

| Surface | Where | Status |
|---|---|---|
| Packaging (jar, lid label, box, thank-you card) | source of the identity | described in the brief; no artwork files supplied |
| Product page (single-product D2C store) | `ui_kits/store/` | fully recreated |
| Customer account (orders and their status) | `ui_kits/account/` | fully recreated |
| Owner dashboard (one-person store admin) | `ui_kits/dashboard/` | fully recreated |

## Sources given

- `uploads/STRANDS-brand-brief.md` — identity, logo, colour, type, product, voice, rules. Read off the packaging artwork.
- `uploads/STRANDS-page-style.md` — a build spec for the product page: palette, type, shape, all eleven sections in order, plus mobile behaviour.
- `uploads/STRANDS-dashboard.md` (given in chat) — the owner's side of the store, screen by screen: who it is for, the shell, and all eight admin screens.
- `uploads/refero.design d0c4cb9b-1043-405b-be62-f222dd49af68.jpg` — a screenshot of a contemporary supplement brand's product page (Seed), supplied as a **layout** reference only. Nothing of its colour, wordmark or copy is used here.

No codebase, Figma file, logo artwork, font binaries, photography or icon set
were supplied. Everything flagged below as a substitution or a placeholder is
waiting on those.

---

## CONTENT FUNDAMENTALS

**Voice.** Warm, personal, first-person plural. The brand says *we* and *our
family*, and addresses the customer as *you*. It is softly spoken and it asks
for honest feedback rather than praise. Straight from the thank-you card:

> Thank you for being part of our Strands family. Every ingredient in your hair
> mask has been carefully selected to nourish your hair and give it exactly what
> it needs. We hope it works beautifully for you, and we'd love to hear your
> honest thoughts.

**Never oversells.** No superlatives, no *miracle*, no *best*, no *revolutionary*.
Claims are specific and modest — "For Soft, Fluffy and Hydrated Hair", "For All
Hair Types".

**Numbers are stated plainly and never dressed up:** 300 ml · 9 ingredients ·
12 months after opening · 2–4 days · 380 EGP. No countdowns, no "only 3 left",
no fake scarcity.

**Casing.** Headlines are sentence case with a full stop — *"Softness that holds
through the week."* Eyebrows and micro-labels are uppercase with wide tracking.
The logotype and descriptor are all caps. Product names are caps-and-lowercase,
letterspaced. Body copy is never centred on the web page (packaging is centred;
the page is not).

**Length.** Two sentences of description in the buy box, never three. Two lines
of body under a feature heading. One line of subhead under a section heading.

**Arabic.** Egyptian dialect, spoken and warm — *"إنك بقيتي جزء من عائلتنا في
ستراندز"*. English first, Arabic beneath, separated by a hairline rule. Never
formal Modern Standard Arabic. In layout, mirror everything and use logical
start/end properties, never left/right.

**No emoji, anywhere.** The brand is ornamental, not casual.

---

## VISUAL FOUNDATIONS

**Colour.** Two brand colours: purple `#653467` and green `#577537`. Purple is
the ground — the jar, the box, the dark full-bleed sections, primary buttons,
the footer. Green is the voice of the type — the logotype, eyebrows, checkmarks,
data highlights. Lilac `#BEA8D1` carries the scrollwork and all secondary text on
purple. Supporting grounds: cream `#FBF6EE` (the default page ground — warm,
never pure white), green tint `#EDF0E7`, purple tint `#F1EAF2`, white for cards
and inputs. Ink `#2A2130` for body, `#615468` for secondary, `#231F20` for fine
print only. **No third brand colour, ever.** The logotype is never purple, never
white, never reversed out.

**Sections alternate** cream → pale green → cream → full-bleed purple → cream.
The purple sections are the anchors: two or three per page, never more.

**Hand annotations.** One marker script, `--font-hand` (Caveat), used only to write
on top of photography — ingredient call-outs and the like, always in purple with a
small hand-drawn arrow. Never for UI text, headings or labels.

**Type.** A high-contrast display serif for the logotype and every headline
(40–56px desktop, weight 400, line-height 1.15). A geometric sans — Century
Gothic in character — for everything else: body at 15–16px, line-height 1.7,
max 65 characters per line; eyebrows at 10px uppercase with .18em tracking;
claims in sans italic; sub-claims in sans bold; the "HAIR CARE" descriptor at
.35em tracking. Numbers are tabular.

**Backgrounds.** Product photography lives in `assets/photography/`; slots without
a photograph fall back to a labelled tinted panel. The one repeating texture is the **damask
scrollwork** — supplied artwork, cream filigree on deep purple, at
`assets/patterns/damask.png`. It carries its own ground, so it is laid in as a
full background rather than a tinted overlay, tiled at 520px and held back to
~18% opacity over the purple so it reads as texture rather than decoration. It
appears only on purple grounds.

The logotype sits **green on light grounds**. On purple, green holds only at
display sizes on flat ground — over the damask, or below about 32px, it drops to
roughly 1.7:1 and the mark switches to green-tint `#EDF0E7`.

**No gradients. No drop shadows.** Both are explicitly forbidden by the brand
rules. Separation comes from grounds and 1px `#E6D9CB` hairlines — nothing else.
There is no elevation system, and the token file says so.

**Corner radii.** 16px on cards and images, 8px on buttons and inputs, 2px on
store forms elsewhere in the business, pill for chips, badges and the monogram.

**Cards** are a tinted or white ground, a 1px hairline, 16px radius, no shadow.
Nothing floats.

**Animation.** Restrained. 200ms on `cubic-bezier(.2,.6,.2,1)`; colour and
height transitions only. No bounce, no parallax, no scroll-triggered reveals.
The sticky header shrinks from 64px to 56px on scroll — that is the only motion
on the page.

**Hover** darkens: the purple fill goes `#653467` → `#542956`; outlined and icon
buttons fill with purple tint; links move from green to purple. **Press** darkens
further, to `#48224A`. Nothing scales, lifts, or shrinks on press.

**Transparency and blur** are not part of the brand. The only translucency is
lilac at low alpha for hairlines on purple grounds, and the highlighted column
panel in the comparison table. No frosted glass, no protection gradients over
imagery — text sits on flat grounds instead.

**Layout.** 1120px container, 24px gutters, 96px section padding on desktop and
56px on mobile, 64px header. The header is the only fixed element.

**One breakpoint, at 760px.** Both kits carry a `useIsPhone` hook rather than
media queries, because the layout is written in inline styles. Below it: every
row becomes one column, section padding drops to 56px, headlines step down one
size, and the page body never scrolls sideways — only the comparison table and
the admin tables scroll, inside their own containers. On the storefront the
header sheds everything but the wordmark and cart, and the add-to-cart action
moves to a fixed bottom bar with the price and delivery promise. In the
dashboard the sidebar becomes a top bar with a drop-down menu at 48px touch
targets.

**Imagery direction.** Warm, not cool; soft daylight; the jar on cream, warm stone
or pale purple grounds; no grain filter, no black and white, no stock photography
of smiling models. The supplied set follows this: the jar held in daylight against
plants and gold framing, the three-jar stack on a green mat, the gift bag in
profile, and two close crops — the whipped texture and the raw mango butter with
flaxseed. Note the gift bag carries the real S monogram and the gold logotype;
use it as the reference when the official artwork arrives.

**One filled button per section**, and never two text blocks in a row — every
section carries a photograph or a diagram.

---

## ICONOGRAPHY

The brand materials contain **no icon set** — no icon font, no sprite, no SVGs.
The page spec calls for "line-drawn" icons in circular outlined containers, so
**Lucide is substituted** (line-drawn, 1.5px stroke, rounded caps — the closest
CDN match). Loaded from
`https://unpkg.com/lucide@0.454.0/dist/umd/lucide.js` and wrapped by the
`Icon` component. **Flagged: replace with the brand's own set if one exists.**

Usage rules:
- Icons are **line-drawn only** — never filled, never duotone.
- Icons are **green on every ground**, and it is the same green everywhere:
  `--icon-on-light` and `--icon-on-anchor` both resolve to `--green-bright`
  `#7FA84E`, the brand green lifted just enough to read on purple, where base
  green measures about 1.7:1. Type stays on base green; only icons use the lift.
- Circled feature icons draw at **2.75 stroke** inside a 44px ring; UI chrome stays at 1.5.
- Recurring glyphs: `droplet`, `sparkles`, `clock` (the three ways to use it);
  `flask-conical`, `shield-check`, `truck` (standards); `user`, `shopping-bag`,
  `search`, `chevron-down`, `chevron-up`, `chevron-right`, `arrow-right`,
  `thumbs-up`, `thumbs-down`, `check`.
- **Emoji are never used as icons, or at all.**
- Two marks are drawn inline rather than taken from the icon set, because they
  are data rather than decoration: the five-pointed **star** in `StarRating`, and
  the filled-check / hollow-ring pair in `ComparisonTable`.

### Assets on disk

- `assets/patterns/damask-tile.png` — the same artwork flattened to two colours and
  downscaled to 480px. This is what `--damask-tile` carries, inlined as a data URI
  in `tokens/shape.css` so it resolves from any folder depth. `--damask-size` sets
  the tile (520px) and `--damask-opacity` how far it is held back (.18).
- `assets/patterns/damask.svg` — the earlier placeholder motif, kept but unused.
- **No logo file was supplied**, so none was drawn. The `Wordmark` component sets
  the name in the display serif and the `Monogram` sets a plain S in a damask
  roundel. The real logotype's defining detail — the **swash curl inside the A** —
  is deliberately not approximated. Drop in the official SVGs when available.

---

## SUBSTITUTIONS TO RESOLVE

1. **Fonts.** No binaries supplied. Nearest Google Fonts matches are loaded from
   CDN in `tokens/fonts.css`: **Bodoni Moda** for the high-contrast display
   serif, **Jost** for the geometric sans, **Noto Kufi Arabic** for Arabic.
2. **Icons.** Lucide, substituted as above.
3. **Logo and monogram.** Type-set stand-ins; the swash A is not reproduced.
5. **Photography.** Supplied for the jar, the gift bag, the texture and all three
   ingredients. Still missing: anything showing the masque on hair.
6. **Chart data.** The moisture-retention figures in the science block are
   illustrative and captioned as such on the page.

## Intentional additions

- **`Icon`** — a glyph wrapper. The source defines no icon component, but every
  other component needs one, and the page spec calls for line-drawn icons.
- **`Wordmark` / `Monogram`** — placeholders for the missing logo artwork, so
  that consuming designs have a single place to swap in the real files.

---

## INDEX

**Root**
- `styles.css` — the entry point; `@import` lines only.
- `readme.md` — this file.
- `SKILL.md` — portable skill wrapper.
- `thumbnail.html` — homepage tile.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`,
`shape.css`, `motion.css`, `base.css`.

**`assets/`** — `patterns/damask.png` (the real artwork), `patterns/damask.svg`
(unused placeholder), and `photography/` — `jar-in-hands.jpg`, `three-jars.jpg`,
`jar-and-gift-bag.jpg`, `gift-bag.jpg`, `texture.jpg`, `mango-butter-flaxseed.jpg`,
and the three ingredient stills `ingredient-mango-butter.jpg`,
`ingredient-flaxseed.jpg`, `ingredient-hibiscus.jpg`. All are JPEG at 1000px on the
long edge, roughly 50–140 KB each. **Keep them that way** — the masters arrived as
2–4 MB PNGs, which is unaffordable for a cash-on-delivery store selling on Egyptian
mobile data. Re-encode anything new to about twice its largest display size before
committing it.

**`guidelines/`** — 16 specimen cards: Colors (brand, grounds, ink & rules, legal
pairings), Type (display, logotype, body, utility, Arabic), Spacing (scale,
layout), Shape (radii, no-shadow, hover & press), Brand (damask, voice,
iconography).

**`components/`**
- `brand/` — `Wordmark`, `Monogram`, `DamaskPanel`, `DisplayBand`
- `core/` — `Button`, `IconButton`, `Icon`, `Eyebrow`, `SectionHeading`, `Chip`, `Badge`, `Card`, `CollapsibleRow`, `Pagination`
- `forms/` — `Input`, `Select`, `SearchField`, `NewsletterField`, `LanguageToggle`
- `commerce/` — `StarRating`, `PriceBlock`, `ProductGallery`, `BundleCard`, `FeatureColumn`, `IngredientCard`, `ReviewCard`
- `data/` — `RatingHistogram`, `ComparisonTable`, `RetentionChart`
- `admin/` — `PageHeader`, `StatBox`, `StatusPill`, `DataTable`, `Switch`, `Checkbox`, `Textarea`, `InlineAlert`

**`ui_kits/store/`** — the product page, top to bottom. See its own README for
the section-by-section map.

**`ui_kits/account/`** — the customer account: orders, their status and a delivery
timeline, plus the customer's details. Same sign-in as the owner; the owner simply
gains a Dashboard button in the header. See its own README.

**`ui_kits/dashboard/`** — the owner dashboard: sign-in plus the eight admin
screens, with the order flow interactive. See its own README.

### The dashboard's own rules

It is built for one person doing this between other work, so it answers **one
question per screen** and shows what needs doing rather than what happened.
There are **no charts** in it — two numbers about the last thirty days is the
entire report. The **next action is the only loud thing**: one filled button per
screen, everything else outlined. **Nothing fails silently** — a refused save or
a failed email says so, in the place it happened, in words she can act on. The
dashboard is **English only**; the storefront is bilingual.

## RULES, IN ONE PLACE

**Always:** purple ground with the damask one shade lighter · green logotype ·
HAIR CARE beneath the name · English above Arabic with a hairline between ·
sentence-case headlines with a full stop · one job per section · a photograph or
diagram in every section · price and delivery promise above the fold.

**Never:** the logotype in purple or white · the A redrawn without its swash ·
purple and green swapped · a third brand colour · gradients · drop shadows ·
the descriptor omitted · formal MSA Arabic · emoji · carousels · popups ·
countdown timers · "only 3 left" · stock photos of smiling models · centred body
paragraphs · more than one filled button per section.
