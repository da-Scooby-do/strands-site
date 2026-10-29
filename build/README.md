# Site build: precompiled, light pages

The three pages (store, account, dashboard) are written as `.jsx`. This build
compiles them ahead of time, so visitors download plain JavaScript. There is no
Babel in the browser and no development React.

## Run it

You need Node 18 or newer.

```bash
cd build
npm install
npm run build
```

Run it after you change any of these, then commit what it lists at the end:

- a `.jsx` file
- `styles.css` or a file in `tokens/`
- `_ds_bundle.js`
- an icon name

## What it makes

| File | What it is |
| --- | --- |
| `_vendor.js` | React and ReactDOM (production), supabase-js, and only the lucide icons the site uses. These are found by scanning the code for icon names. One file on the site's own domain, instead of three outside CDNs and all 1,700 icons. |
| `_styles.css` | `styles.css` with its `@import`s inlined. Google Fonts is linked from each page's `<head>` instead, so it starts loading at once. |
| `_ds_bundle.min.js` | `_ds_bundle.js` (the design-system components), minified. |
| `ui_kits/store/_bundle.store.js` | The store. Each file is wrapped in its own scope. |
| `ui_kits/account/_bundle.account.js` | The account page. |
| `ui_kits/dashboard/_bundle.dashboard.js` | The dashboard. |

The account and dashboard files share top-level names, as they did under
in-browser Babel, where every file was its own `<script>` and `const` became
`var`. The build keeps that behaviour: it uses the same Babel version
(7.29.0) and compiles block scoping to `var`, leaving everything else modern.
Each page's inline script now lives in `ui_kits/<page>/app.jsx`, and the store's
in `ui_kits/store/page.jsx`.

Each `index.html` is rewritten in place, and it's safe to run again:

- Babel and the CDN scripts are removed.
- The marked `<!--build:head-->` block (styles, fonts, vendor) is regenerated.
- Every script and stylesheet gets a `?v=<hash>` stamp.

`vercel.json` lets browsers keep stamped files for a year, because any change
gives them a new address. Photos and fonts can be kept for a day and are then
refreshed in the background.

## Photos

`assets/photography/sm/` (480 px wide) holds the copies used in the photo strip.
`assets/photography/xs/` (160 px) holds the gallery thumbnails. If you replace
a photo, make new copies with ImageMagick:

```bash
convert photo.jpg -resize '480x>' -strip -interlace Plane -quality 72 sm/photo.jpg
convert photo.jpg -resize '160x>' -strip -interlace Plane -quality 74 xs/photo.jpg
```
