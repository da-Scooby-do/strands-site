/**
 * Hero gallery: one large image on a purple-tint ground, 16px radius, with a row of
 * 4–6 80×80 thumbnails beneath. The main frame is 4:5 — the shots are
 * portrait, and a square crop loses the jar. Set each image's `position` so the jar
 * sits centred in the frame. No carousel, no autoplay.
 */
export interface GalleryNote {
  /** The handwritten label. */
  text: string;
  /** Position within the frame, as CSS lengths or percentages. */
  top: string;
  left: string;
  /** Degrees of tilt. Keep small — 4 to 10. */
  tilt?: number;
  /** Font size in px. Default 30. */
  size?: number;
  /** Put the arrow before the text, pointing back to the left. */
  flip?: boolean;
}
export interface GalleryImage {
  src?: string;
  label?: string;
  ground?: string;
  /** object-position for the main frame, e.g. "center 30%" to lift a tall shot. */
  position?: string;
  /** Handwritten purple annotations drawn over this photograph, each with an arrow. */
  notes?: GalleryNote[];
}
export interface ProductGalleryProps {
  /** 4–6 items: the jar, the box, a lifestyle shot, a texture shot, the ingredients panel. */
  images?: GalleryImage[];
  alt?: string;
  /** Aspect ratio of the main frame. Default "4 / 5". */
  ratio?: string;
  /** object-fit for the main image. Default "cover"; "contain" letterboxes the whole photograph instead. */
  fit?: "contain" | "cover";
}
export function ProductGallery(props: ProductGalleryProps): JSX.Element;
