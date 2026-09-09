const PHOTOS = [
  { src: "../../assets/photography/jar-in-hands.jpg", alt: "The masque held in both hands", pos: "center 62%" },
  { src: "../../assets/photography/texture.jpg", alt: "The texture of the masque", pos: "center" },
  { src: "../../assets/photography/three-jars.jpg", alt: "Three jars stacked", pos: "center 55%" },
  { src: "../../assets/photography/jar-and-gift-bag.jpg", alt: "The masque with its gift bag", pos: "center 45%" },
  { src: "../../assets/photography/gift-bag.jpg", alt: "The Strands gift bag", pos: "center 55%" },
  { src: "../../assets/photography/mango-butter-flaxseed.jpg", alt: "Mango butter and flaxseed", pos: "center" },
  { src: "../../assets/photography/ingredient-mango-butter.jpg", alt: "Mango and mango butter", pos: "center" },
  { src: "../../assets/photography/ingredient-flaxseed.jpg", alt: "Flaxseed oil and seed", pos: "center" },
  { src: "../../assets/photography/ingredient-hibiscus.jpg", alt: "Hibiscus extract", pos: "center" },
];
function PhotoStrip({ height = 520, horizontal = false }) {
  const phone = window.useIsPhone();
  const [paused, setPaused] = React.useState(false);
  const loop = PHOTOS.concat(PHOTOS);
  if (horizontal) {
    return (
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          position: "relative", width: "100%", overflow: "hidden",
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
          maskImage: "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
        }}>
        <div style={{ display: "flex", gap: "var(--space-3)", width: "max-content", animation: "strands-strip-x 60s linear infinite", animationPlayState: paused ? "paused" : "running" }}>
          {loop.map((p, i) => (
            <figure key={i} style={{ margin: 0, flex: "0 0 auto", height: phone ? 200 : 300, aspectRatio: "3 / 4", borderRadius: "var(--radius-card)", overflow: "hidden", background: "var(--purple-tint)" }}>
              <img src={p.src} alt={i < PHOTOS.length ? p.alt : ""} aria-hidden={i >= PHOTOS.length}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos, display: "block" }} />
            </figure>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: "relative", height: phone ? 340 : height, overflow: "hidden",
        borderRadius: "var(--radius-card)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)",
        maskImage: "linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)",
      }}>
      <div style={{ display: "grid", gap: "var(--space-3)", animation: "strands-strip 56s linear infinite", animationPlayState: paused ? "paused" : "running" }}>
        {loop.map((p, i) => (
          <figure key={i} style={{ margin: 0, borderRadius: "var(--radius-card)", overflow: "hidden", background: "var(--purple-tint)", aspectRatio: i % 3 === 1 ? "4 / 3" : "3 / 4" }}>
            <img src={p.src} alt={i < PHOTOS.length ? p.alt : ""} aria-hidden={i >= PHOTOS.length}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos, display: "block" }} />
          </figure>
        ))}
      </div>
    </div>
  );
}
Object.assign(window, { StrandsPhotoStrip: PhotoStrip });
