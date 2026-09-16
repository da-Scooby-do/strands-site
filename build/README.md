# Store build — drop Babel Standalone

The store page loads its `.jsx` and transpiles it **in the browser** with Babel
Standalone (~900 KB gzipped) on every visit. This one-step build transpiles that
JSX **ahead of time** so the live page ships production React + a single
precompiled bundle, with **no Babel** — a big win on slow connections.

It only affects `ui_kits/store/`. The account and dashboard pages are untouched.

## Run it

You need **Node 18+** (this repo's dev machine doesn't have Node — run this
wherever Node is available, or in CI).

```bash
cd build
npm install
npm run build
```

Then commit the regenerated files and deploy:

```bash
git add ui_kits/store/index.html ui_kits/store/_bundle.store.js ui_kits/store/page.jsx
git commit -m "store: precompile JSX, drop Babel Standalone"
git push
```

## What it does

1. **First run only:** lifts the inline page script out of `index.html` into
   `ui_kits/store/page.jsx` (so it becomes an editable source file).
2. Transpiles every store component + `page.jsx` (JSX → `React.createElement`),
   wraps each in its own scope, and writes them to
   `ui_kits/store/_bundle.store.js`.
3. Rewrites `ui_kits/store/index.html` to production form: production React,
   **Babel Standalone removed**, per-file `text/babel` scripts replaced by the
   one precompiled bundle. (Idempotent — safe to re-run.)

## Day-to-day workflow after this

The `.jsx` files (and `page.jsx`) stay the **source you edit**.
`index.html` + `_bundle.store.js` are **generated** — after editing any store
`.jsx`, run `npm run build` again, then commit. Head/styles in `index.html`
(preconnect, preload, `<style>`) are preserved across builds, so you can still
hand-edit those.

## Wiring into Vercel (optional)

To build automatically on deploy instead of committing the output, set the
project's **Build Command** to `cd build && npm install && npm run build` and
leave the output directory as the repo root. (Left to you — this script does not
change any Vercel config.)
