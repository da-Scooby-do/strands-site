const { DamaskPanel, Eyebrow, ComparisonTable } = window.StrandsDesignSystem_6d0a65;
function Compare() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  const columns = ar
    ? ["Strands", phone ? "الصالون" : "علاج الصالون", phone ? "الصيدلية" : "ماسك الصيدلية"]
    : ["Strands", phone ? "Salon" : "Salon treatment", phone ? "Drugstore" : "Drugstore mask"];
  const rows = ar ? [
    { label: "تسع مكونات، كلها مذكورة بالاسم", values: [true, false, false] },
    { label: "يشتغل قبل الغسيل وكبلسم", values: [true, true, false] },
    { label: "مناسب لكل أنواع الشعر", values: [true, true, true] },
    { label: "من غير معاد ولا حجز", values: [true, false, true] },
    { label: "أقل من ٤٠٠ جنيه", values: [true, false, true] },
  ] : [
    { label: "Nine ingredients, all named", values: [true, false, false] },
    { label: "Works as a pre-wash and a conditioner", values: [true, true, false] },
    { label: "Suitable for all hair types", values: [true, true, true] },
    { label: "No appointment needed", values: [true, false, true] },
    { label: "Under 400 EGP", values: [true, false, true] },
  ];
  return (
    <DamaskPanel pad={phone ? "var(--section-y-mobile) var(--gutter)" : undefined}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)", display: "grid", gridTemplateColumns: window.cols(phone, "minmax(240px,1fr) 1.7fr"), gap: phone ? "var(--space-5)" : "var(--space-8)", alignItems: "start" }}>
        <div style={{ display: "grid", gap: "var(--space-4)" }}>
          <Eyebrow tone="lilac">{ar ? "المقارنة" : "How it compares"}</Eyebrow>
          <h2 style={{ color: "var(--white)", fontSize: phone ? "var(--display-3)" : "var(--display-2)" }}>{ar ? "علبة واحدة، ثلاث روتينات، من غير صالون." : "One jar, three routines, no salon visit."}</h2>
        </div>
        <div className="strands-compare" style={{ minWidth: 0 }}><ComparisonTable columns={columns} rows={rows} /></div>
      </div>
    </DamaskPanel>
  );
}
Object.assign(window, { StrandsCompare: Compare });
