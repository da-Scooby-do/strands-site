/* Bulk-import orders from a CSV. Each row becomes an order via create_manual_order.
   Flexible headers (case-insensitive): name, phone, whatsapp, governorate, street,
   area, landmark, jars (1/2/3) or variant, qty, shipping, discount, status, source, note. */
const { Button, InlineAlert, Icon } = window.StrandsDesignSystem_6d0a65;

function parseCSV(text) {
  text = String(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows = []; let i = 0, field = "", row = [], inQ = false;
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i += 2; continue; } inQ = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { inQ = true; i++; continue; }
    if (c === ",") { row.push(field); field = ""; i++; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((x) => String(x).trim() !== ""));
}
const TEMPLATE_COLS = ["name", "phone", "whatsapp", "governorate", "street", "area", "landmark", "jars", "qty", "shipping", "discount", "status", "source", "note"];

function ImportOrders({ open, onClose, onDone }) {
  const [variants, setVariants] = React.useState([]);
  const [rows, setRows] = React.useState(null);     // parsed data objects
  const [fileName, setFileName] = React.useState("");
  const [err, setErr] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState(null); // {done,total}
  const [result, setResult] = React.useState(null);     // {ok, fail:[{row,reason}]}
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (!open || !window.SB_READY) return;
    window.sb.from("product_variants").select("key,jars").then(({ data }) => { if (data) setVariants(data); });
    setRows(null); setResult(null); setErr(""); setFileName(""); setProgress(null);
  }, [open]);

  const variantByJars = {}; variants.forEach((v) => { variantByJars[v.jars] = v.key; });
  const validKeys = new Set(variants.map((v) => v.key));

  function onFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFileName(file.name); setErr(""); setResult(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const grid = parseCSV(reader.result);
        if (grid.length < 2) { setErr("The file has no data rows."); setRows(null); return; }
        const headers = grid[0].map((h) => String(h).trim().toLowerCase());
        const idx = (name) => headers.indexOf(name);
        const get = (r, ...names) => { for (const n of names) { const k = idx(n); if (k >= 0) return String(r[k] || "").trim(); } return ""; };
        const data = grid.slice(1).map((r) => ({
          name: get(r, "name", "full_name", "customer"),
          phone: get(r, "phone", "mobile"),
          phone2: get(r, "whatsapp", "phone2"),
          governorate: get(r, "governorate", "gov"),
          street: get(r, "street", "address"),
          area: get(r, "area"),
          landmark: get(r, "landmark"),
          jars: get(r, "jars", "bundle"),
          variant: get(r, "variant", "variant_key"),
          qty: get(r, "qty", "quantity") || "1",
          shipping: get(r, "shipping"),
          discount: get(r, "discount"),
          status: get(r, "status"),
          source: get(r, "source") || "whatsapp",
          note: get(r, "note", "notes"),
        }));
        setRows(data);
      } catch (ex) { setErr("Couldn’t read the file. Make sure it’s a CSV."); setRows(null); }
    };
    reader.readAsText(file);
  }

  function variantKeyFor(r) {
    if (r.variant && validKeys.has(r.variant)) return r.variant;
    const j = parseInt(String(r.jars).replace(/[^0-9]/g, ""), 10);
    if (j && variantByJars[j]) return variantByJars[j];
    return null;
  }

  async function run() {
    if (busy || !rows) return;
    setBusy(true); setResult(null); setErr("");
    const fail = []; let ok = 0;
    for (let n = 0; n < rows.length; n++) {
      setProgress({ done: n, total: rows.length });
      const r = rows[n];
      const rowNo = n + 2; // header is row 1
      if (!r.name) { fail.push({ row: rowNo, reason: "missing name" }); continue; }
      if (!r.phone) { fail.push({ row: rowNo, reason: "missing phone" }); continue; }
      const vkey = variantKeyFor(r);
      if (!vkey) { fail.push({ row: rowNo, reason: "unknown product (set jars = 1, 2 or 3)" }); continue; }
      const payload = {
        source: r.source, status: r.status || "confirmed",
        full_name: r.name, phone: r.phone, phone2: r.phone2, governorate: r.governorate,
        area: r.area, street: r.street, landmark: r.landmark,
        shipping: parseInt(String(r.shipping).replace(/[^0-9]/g, ""), 10) || 0,
        discount: parseInt(String(r.discount).replace(/[^0-9]/g, ""), 10) || 0,
        note: r.note,
        items: [{ variant_key: vkey, qty: Math.max(1, parseInt(String(r.qty).replace(/[^0-9]/g, ""), 10) || 1) }],
      };
      const res = await window.sbRpc("create_manual_order", { payload });
      if (res && res.ok) ok++;
      else fail.push({ row: rowNo, reason: (res && res.error) || "failed" });
    }
    setProgress({ done: rows.length, total: rows.length });
    setBusy(false);
    setResult({ ok, fail });
    if (ok > 0 && onDone) onDone();
  }

  function downloadTemplate() {
    window.downloadCSV("strands-orders-template.csv", TEMPLATE_COLS, [
      ["Mona Adel", "01012345678", "01012345678", "Cairo", "12 Sharia Gamal", "Zamalek", "", "1", "1", "60", "0", "confirmed", "whatsapp", "paid on delivery"],
      ["Salma Ramy", "01198765432", "", "Alexandria", "8 Sharia Fouad", "Sidi Gaber", "Blue building", "2", "1", "0", "0", "confirmed", "instagram", ""],
    ]);
  }

  if (!open) return null;
  return (
    <div>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(30,24,20,.45)", zIndex: 59 }} />
      <aside role="dialog" aria-label="Import orders" style={{ position: "fixed", top: 0, bottom: 0, insetInlineEnd: 0, width: "min(520px,100vw)", background: "var(--cream)", zIndex: 60, overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,.16)" }}>
        <header style={{ position: "sticky", top: 0, background: "var(--cream)", borderBottom: "1px solid var(--rule)", padding: "var(--space-4) var(--space-5)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1 }}>
          <strong style={{ fontSize: 18 }}>Import orders from CSV</strong>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)" }}><Icon name="x" size={20} /></button>
        </header>
        <div style={{ padding: "var(--space-5)", display: "grid", gap: "var(--space-4)" }}>
          <p style={{ fontSize: "var(--text-small)", color: "var(--ink-2)", margin: 0, lineHeight: 1.6 }}>
            Upload a CSV with one order per row. Columns: name, phone, whatsapp, governorate, street, area, landmark, <strong>jars</strong> (1, 2 or 3), qty, shipping, discount, status, source, note. Prices come from the product’s bundles automatically.
          </p>
          <Button variant="quiet" size="sm" onClick={downloadTemplate}>Download template</Button>

          <div style={{ border: "1.5px dashed var(--rule)", borderRadius: "var(--radius-card)", padding: "var(--space-5)", textAlign: "center", background: "var(--white)" }}>
            <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={onFile} style={{ display: "none" }} />
            <Button variant="quiet" onClick={() => inputRef.current && inputRef.current.click()}>Choose CSV file</Button>
            {fileName && <div style={{ marginTop: 10, fontSize: "var(--text-small)", color: "var(--ink-2)" }}>{fileName}{rows ? " · " + rows.length + " rows" : ""}</div>}
          </div>

          {err && <InlineAlert tone="error">{err}</InlineAlert>}

          {rows && !result && (
            <Button fullWidth onClick={run} disabled={busy}>
              {busy && progress ? "Importing " + progress.done + " of " + progress.total + "…" : "Import " + rows.length + " orders"}
            </Button>
          )}

          {result && (
            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              <InlineAlert tone={result.fail.length ? "error" : "ok"}>{result.ok} imported{result.fail.length ? ", " + result.fail.length + " skipped" : ""}.</InlineAlert>
              {result.fail.length > 0 && (
                <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: "var(--radius-card)", padding: "var(--space-4)", maxHeight: 240, overflowY: "auto", fontSize: "var(--text-fine-size)", color: "var(--ink-2)", display: "grid", gap: 4 }}>
                  {result.fail.map((f, i) => <div key={i}>Row {f.row}: {f.reason}</div>)}
                </div>
              )}
              <Button fullWidth variant="quiet" onClick={onClose}>Done</Button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
Object.assign(window, { DashImportOrders: ImportOrders });
