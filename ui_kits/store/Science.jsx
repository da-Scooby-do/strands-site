const { Eyebrow, IngredientCard } = window.StrandsDesignSystem_6d0a65;
function Science() {
  const phone = window.useIsPhone();
  return (
    <section id="ingredients" style={{ background: "var(--cream)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: phone ? "var(--section-y-mobile) var(--gutter)" : "var(--section-y) var(--gutter)", display: "grid", gap: phone ? "var(--space-6)" : "var(--space-7)" }}>
        <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "1fr 1fr"), gap: phone ? "var(--space-4)" : "var(--space-8)", alignItems: "end" }}>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Eyebrow>Nine ingredients</Eyebrow>
            <h2 style={{ fontSize: phone ? "var(--display-3)" : "var(--display-2)" }}>Softness that holds through the week.</h2>
          </div>
          <p style={{ color: "var(--ink-2)", maxWidth: "var(--measure)" }}>
            Three of the nine do most of the work: one softens, one seals, one holds water in the cuticle. The rest support them. Nothing in the jar is there to thicken the texture.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: window.cols(phone, "repeat(3,1fr)"), gap: "var(--space-4)" }}>
          <IngredientCard name="Mango butter" arabic="زبدة المانجو" image="../../assets/photography/ingredient-mango-butter.jpg">Softens the strand and seals the cuticle after washing.</IngredientCard>
          <IngredientCard name="Flaxseed gel" arabic="جل بذور الكتان" image="../../assets/photography/ingredient-flaxseed.jpg">Holds water against the hair so the curl keeps its shape.</IngredientCard>
          <IngredientCard name="Hibiscus extract" arabic="منقوع الكركديه" image="../../assets/photography/ingredient-hibiscus.jpg">Keeps the scalp comfortable and the ends from splitting further.</IngredientCard>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { StrandsScience: Science });
