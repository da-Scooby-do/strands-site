/*
 * Strands site build — makes the three pages (store, account, dashboard) fast.
 *
 * RUN:  cd build && npm install && npm run build
 * Run it after editing any .jsx, styles/tokens, or when adding an icon, then
 * commit what it regenerates (listed at the end of the run).
 *
 * What it produces:
 *   _vendor.js            React + ReactDOM (production) + supabase-js + only the
 *                         lucide icons the site uses — one same-origin file
 *                         instead of three CDNs and the full 1,700-icon set.
 *   _ds_bundle.min.js     the design-system components (_ds_bundle.js), minified.
 *   _styles.css           styles.css with its @imports inlined (one request,
 *                         no CSS -> CSS -> CSS chain). Google Fonts is linked
 *                         from each page's <head> instead, so it starts at once.
 *   ui_kits/store/_bundle.store.js          the store's JSX, precompiled.
 *   ui_kits/account/_bundle.account.js      the account page, precompiled.
 *   ui_kits/dashboard/_bundle.dashboard.js  the dashboard, precompiled.
 * and rewrites each page's index.html to load them, with ?v=<hash> stamps so
 * browsers can keep them cached until they actually change.
 */
import { transformSync, buildSync } from "esbuild";
import Babel from "@babel/standalone";
import * as lucide from "lucide";
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rel = (p) => path.relative(root, p);
const read = (p) => readFileSync(p, "utf8");
const hash = (s) => createHash("sha1").update(s).digest("hex").slice(0, 10);
const written = [];
const write = (p, s) => { writeFileSync(p, s); written.push(rel(p)); console.log(`• wrote ${rel(p)} (${(s.length / 1024).toFixed(0)} KB)`); };

// ---------------------------------------------------------------- the pages

// Script order matters: each file reads globals the earlier ones set.
const KITS = {
  store: {
    mode: "esbuild",  // each file in its own scope (its components export via window)
    files: ["responsive.jsx", "Header.jsx", "Hero.jsx", "Statement.jsx", "PhotoStrip.jsx",
      "OverTime.jsx", "Science.jsx", "Standards.jsx", "Reviews.jsx", "Footer.jsx",
      "Checkout.jsx", "page.jsx"],
  },
  account: {
    mode: "babel",    // files share top-level names, exactly as in-browser Babel ran them
    files: ["../dashboard/responsive.jsx", "../dashboard/data.jsx", "../dashboard/Login.jsx",
      "AccountHeader.jsx", "OrderTimeline.jsx", "AccountOrders.jsx", "AccountDetails.jsx", "Account.jsx"],
    app: "app.jsx",
  },
  dashboard: {
    mode: "babel",
    files: ["responsive.jsx", "data.jsx", "Shell.jsx", "Login.jsx", "Overview.jsx", "Orders.jsx",
      "NewOrder.jsx", "ImportOrders.jsx", "OrderDetail.jsx", "Product.jsx", "SiteText.jsx", "Promos.jsx",
      "Delivery.jsx", "ReviewQuotes.jsx", "Waitlist.jsx", "Countries.jsx", "Flextock.jsx", "Weslat.jsx", "Emails.jsx"],
    app: "app.jsx",
  },
};

// The store: JSX -> React.createElement, each file wrapped in its own IIFE.
const esbuildJsx = (code, name) => transformSync(code, {
  loader: "jsx", jsx: "transform", jsxFactory: "React.createElement", jsxFragment: "React.Fragment",
  minify: true, sourcefile: name,
}).code;

// Account + dashboard were written for in-browser Babel, where every file is its own
// <script> and top-level const/let became var — so files freely re-declare names like
// `const { Button } = ...` and later files win. Keep that exactly: same Babel version,
// block scoping compiled to var; everything else left modern.
const babelFile = (code, name) => Babel.transform(code, {
  filename: name, sourceType: "script", babelrc: false, configFile: false,
  presets: ["react", ["env", { targets: { esmodules: true }, modules: false, include: ["transform-block-scoping", "transform-classes"] }]],
}).code;
// The page's own inline script ran with the React preset only (data-presets="react").
const babelApp = (code, name) => Babel.transform(code, { filename: name, sourceType: "script", babelrc: false, configFile: false, presets: ["react"] }).code;
const squeeze = (code) => transformSync(code, { minifyWhitespace: true, minifySyntax: true }).code;

function buildKit(kit, cfg) {
  const dir = path.join(root, "ui_kits", kit);
  const htmlPath = path.join(dir, "index.html");
  let html = read(htmlPath);

  // First run only: lift the inline page script out of index.html into a source file.
  const inlineRe = /<script type="text\/babel" data-presets="react">([\s\S]*?)<\/script>/;
  const appFile = kit === "store" ? "page.jsx" : cfg.app;
  const appPath = path.join(dir, appFile);
  const inline = html.match(inlineRe);
  if (inline) {
    if (!existsSync(appPath)) { writeFileSync(appPath, inline[1].trim() + "\n"); console.log(`• extracted the inline page script -> ${rel(appPath)}`); }
    html = html.replace(inlineRe, "");
  }
  if (!existsSync(appPath)) throw new Error(`${rel(appPath)} not found — aborting.`);

  let bundle = "/* AUTO-GENERATED by `npm run build` — do not edit by hand. */\n";
  if (cfg.mode === "esbuild") {
    for (const f of cfg.files) bundle += `\n/* ${f} */\n(()=>{\n${esbuildJsx(read(path.join(dir, f)), f)}\n})();\n`;
  } else {
    let code = "";
    for (const f of cfg.files) code += `\n/* ${f} */\n${babelFile(read(path.join(dir, f)), f)}\n`;
    code += `\n/* ${appFile} */\n${babelApp(read(appPath), appFile)}\n`;
    bundle += squeeze(code);
  }
  const bundleName = `_bundle.${kit}.js`;
  write(path.join(dir, bundleName), bundle);

  // Production page: no Babel, no per-file scripts, the bundle once before </body>.
  html = html.replace(/\s*<script type="text\/babel" src="[^"]+"><\/script>/g, "");
  html = html.replace(new RegExp(`\\s*<script src="${bundleName.replace(/\./g, "\\.")}(\\?v=[a-f0-9]+)?"><\\/script>`, "g"), "");
  html = html.replace(/<\/body>/, `\n<script src="${bundleName}?v=${hash(bundle)}"></script>\n</body>`);
  return html;
}

// ---------------------------------------------------------------- icons

// Every lucide icon name that appears as a string anywhere in the site's code.
function iconsUsed() {
  const kebab = (k) => k.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").replace(/([a-zA-Z])([0-9])/g, "$1-$2").toLowerCase();
  const byName = {};
  for (const k of Object.keys(lucide.icons)) byName[kebab(k)] = k;
  let text = "";
  (function walk(d) {
    for (const f of readdirSync(d)) {
      const p = path.join(d, f);
      if (/node_modules|\.git$|^build$|supabase|guidelines/.test(f) || /_bundle\.|_vendor\.js/.test(f)) continue;
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(jsx|js|html)$/.test(f)) text += read(p) + "\n";
    }
  })(root);
  const found = new Set();
  for (const m of text.matchAll(/["'`]([a-z][a-z0-9-]*)["'`]/g)) if (byName[m[1]]) found.add(byName[m[1]]);
  return [...found].sort();
}

// ---------------------------------------------------------------- vendor + styles

function buildVendor() {
  const icons = iconsUsed();
  console.log(`• icons: ${icons.length} of ${Object.keys(lucide.icons).length} (${icons.join(", ")})`);
  // Same API the pages call (window.lucide.createIcons({ nameAttr, root })), with only these icons.
  const iconJs = buildSync({
    stdin: {
      contents: `import { createIcons, ${icons.join(", ")} } from "lucide";\n` +
        `const icons = { ${icons.join(", ")} };\n` +
        `window.lucide = { icons, createIcons: (o = {}) => createIcons({ icons, ...o }) };\n`,
      resolveDir: path.join(root, "build"), loader: "js",
    },
    bundle: true, minify: true, format: "iife", write: false, target: "es2018",
  }).outputFiles[0].text;
  const lib = (p) => read(path.join(root, "build", "node_modules", p)).replace(/\/\/# sourceMappingURL=.*$/m, "");
  const vendor = [
    "/* AUTO-GENERATED by `npm run build`: react 18.3.1, react-dom 18.3.1, @supabase/supabase-js 2.114.0, lucide 0.454.0 (icons used only). */",
    lib("react/umd/react.production.min.js"),
    lib("react-dom/umd/react-dom.production.min.js"),
    lib("@supabase/supabase-js/dist/umd/supabase.js"),
    iconJs,
  ].join("\n;\n");
  write(path.join(root, "_vendor.js"), vendor);
  return vendor;
}

let fontsHref = "";
function buildStyles() {
  // Inline @import url("x.css") recursively; rebase relative url()s to the site root.
  const inlineCss = (file) => read(file).replace(/@import\s+url\("([^"]+)"\);?/g, (all, href) => {
    if (/^https?:/.test(href)) { if (/fonts\.googleapis/.test(href)) fontsHref = href; return ""; }
    return inlineCss(path.join(path.dirname(file), href));
  }).replace(/url\("(?!data:|https?:|\/)([^"]+)"\)/g, (all, u) => `url("${path.relative(root, path.join(path.dirname(file), u)).split(path.sep).join("/")}")`);
  const css = "/* AUTO-GENERATED by `npm run build` from styles.css — edit tokens/*.css instead. */\n" +
    transformSync(inlineCss(path.join(root, "styles.css")), { loader: "css", minify: true }).code;
  if (!fontsHref) throw new Error("Google Fonts @import not found in the stylesheets.");
  write(path.join(root, "_styles.css"), css);
  return css;
}

// The design system's components, minified for the pages (_ds_bundle.js stays the source).
function buildDs() {
  const min = transformSync(read(path.join(root, "_ds_bundle.js")), { minify: true }).code;
  write(path.join(root, "_ds_bundle.min.js"), min);
  return min;
}

// ---------------------------------------------------------------- page <head>

const SUPABASE_ORIGIN = (read(path.join(root, "_supabase.js")).match(/https:\/\/[a-z0-9]+\.supabase\.co/) || [])[0];

function productionHead(html, stamps) {
  // Drop the CDN copies the vendor file replaces, and in-browser Babel.
  html = html
    .replace(/<link rel="preconnect" href="https:\/\/(unpkg\.com|cdn\.jsdelivr\.net)"[^>]*>/g, "")
    .replace(/<script src="https:\/\/(unpkg\.com|cdn\.jsdelivr\.net)\/[^"]*"[^>]*><\/script>/g, "");
  // One block for styles + fonts + vendor, regenerated on every run.
  const block = "<!--build:head-->" +
    '<link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    (SUPABASE_ORIGIN ? `<link rel="preconnect" href="${SUPABASE_ORIGIN}" crossorigin>` : "") +
    `<link rel="stylesheet" href="${fontsHref.replace(/&/g, "&amp;")}">` +
    `<link rel="stylesheet" href="../../_styles.css?v=${stamps.styles}">` +
    `<script src="../../_vendor.js?v=${stamps.vendor}"></script>` +
    "<!--/build:head-->";
  if (/<!--build:head-->[\s\S]*?<!--\/build:head-->/.test(html)) html = html.replace(/<!--build:head-->[\s\S]*?<!--\/build:head-->/, block);
  else if (/<link rel="stylesheet" href="\.\.\/\.\.\/styles\.css">/.test(html)) html = html.replace(/<link rel="stylesheet" href="\.\.\/\.\.\/styles\.css">/, block);
  else throw new Error("No stylesheet link to replace.");
  html = html.replace(/"\.\.\/\.\.\/_ds_bundle(\.min)?\.js(\?v=[a-f0-9]+)?"/g, `"../../_ds_bundle.min.js?v=${stamps.ds}"`);
  // Stamp the shared site scripts.
  for (const f of ["_supabase.js", "i18n.js", "content.js"]) {
    html = html.replace(new RegExp(`"\\.\\./\\.\\./${f.replace(/\./g, "\\.")}(\\?v=[a-f0-9]+)?"`, "g"), `"../../${f}?v=${hash(read(path.join(root, f)))}"`);
  }
  return html;
}

// ---------------------------------------------------------------- run

const stamps = { vendor: hash(buildVendor()), styles: hash(buildStyles()), ds: hash(buildDs()) };
for (const [kit, cfg] of Object.entries(KITS)) {
  const htmlPath = path.join(root, "ui_kits", kit, "index.html");
  const html = productionHead(buildKit(kit, cfg), stamps);
  writeFileSync(htmlPath, html); written.push(rel(htmlPath));
  console.log(`• rewrote ${rel(htmlPath)}`);
}
console.log("\nDone. Commit these, then deploy:\n  " + [...new Set(written)].join("\n  "));
