const { Eyebrow, IngredientCard } = window.StrandsDesignSystem_6d0a65;
function Science() {
  const phone = window.useIsPhone();
  const ar = window.useLang() === "AR";
  return (
    <section id="ingredients" style={{ background: "var(--cream)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter)" : "var(--section-y) var(--gutter)", display: "grid", gap: phone ? "var(--space-6)" : "var(--space-7)" }}>
        <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: phone ? "var(--space-4)" : "var(--space-8)", alignItems: "end" }}>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Eyebrow>{window.copy("science.eyebrow", "18 ingredients", "١٨ مكوّن")}</Eyebrow>
            <h2 className="strands-hgrad" style={{ fontSize: phone ? "var(--display-3)" : "var(--display-2)" }}>{window.copy("science.heading", "Softness that holds through the week.", "نعومة تفضل طول الأسبوع.")}</h2>
          </div>
          <p style={{ color: "var(--ink-2)", maxWidth: "var(--measure)", whiteSpace: "pre-line" }}>
            {window.copy("science.body", "18 carefully curated ingredients, each chosen with a purpose.\nA balanced blend designed to deeply hydrate, soften, and smooth the hair.\nHelps reduce frizz, dryness, and breakage for softer, easier-to-manage strands.", "١٨ مكوّن مختارين بعناية، كل واحد ليه هدف.\nتركيبة متوازنة معمولة عشان ترطّب الشعر بعمق وتنعّمه وتفرده.\nبتساعد في تقليل الهيشان والجفاف والتقصّف، لشعر أنعم وأسهل في التحكم.")}
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "repeat(3,1fr)"), gap: "var(--space-4)" }}>
          <IngredientCard name={window.copy("ing.mango.name", "Mango Butter", "زبدة المانجو")} arabic={ar ? "" : "زبدة المانجو"} image="../../assets/photography/ingredient-mango-butter.jpg">{window.copy("ing.mango.desc", "Rich botanical nourishment that helps replenish dry strands and restore a silky, supple feel.", "تغذية نباتية غنية بتساعد على تعويض الشعر الجاف واستعادة ملمس حريري ناعم.")}</IngredientCard>
          <IngredientCard name={window.copy("ing.flax.name", "Flaxseed", "بذور الكتان")} arabic={ar ? "" : "بذور الكتان"} image="../../assets/photography/ingredient-flaxseed.jpg">{window.copy("ing.flax.desc", "Helps lock in moisture, smooth the hair, and leave every strand feeling soft and manageable.", "بيساعد على حبس الترطيب وتنعيم الشعر وترك كل شعرة ناعمة وسهلة في التسريح.")}</IngredientCard>
          <IngredientCard name={window.copy("ing.hibiscus.name", "Hibiscus", "الكركديه")} arabic={ar ? "" : "الكركديه"} image="../../assets/photography/ingredient-hibiscus.jpg">{window.copy("ing.hibiscus.desc", "Naturally helps nourish, soften, and enhance the hair’s natural shine.", "بيغذّي الشعر وينعّمه ويزوّد لمعانه الطبيعي.")}</IngredientCard>
          <IngredientCard name={window.copy("ing.b5.name", "Pro-Vitamin B5", "بروفيتامين ب5")} arabic={ar ? "" : "بروفيتامين ب5"} figureLabel={window.copy("ing.b5.name", "Pro-Vitamin B5", "بروفيتامين ب5")}>{window.copy("ing.b5.desc", "Deeply hydrates for smooth, silky hair.", "بيرطّب بعمق لشعر ناعم وحريري.")}</IngredientCard>
          <IngredientCard name={window.copy("ing.e.name", "Vitamin E", "فيتامين هـ")} arabic={ar ? "" : "فيتامين هـ"} figureLabel={window.copy("ing.e.name", "Vitamin E", "فيتامين هـ")}>{window.copy("ing.e.desc", "Antioxidant care for healthy-looking, radiant hair.", "عناية مضادة للأكسدة لشعر صحي ولامع.")}</IngredientCard>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { StrandsScience: Science });
