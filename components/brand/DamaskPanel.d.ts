/**
 * A full-bleed purple ground with the damask pattern behind it, one shade lighter
 * than the ground. The anchor section of any page — use two or three per page, never more.
 * @startingPoint section="Brand" subtitle="Full-bleed purple damask section" viewport="700x260"
 */
export interface DamaskPanelProps {
  children?: React.ReactNode;
  /** purple ground (default) or lilac for quiet accents. */
  tone?: "purple" | "lilac";
  /** Inner padding shorthand. Default "var(--section-y) var(--gutter)". */
  pad?: string;
  /** Corner radius in px. 0 for full-bleed sections, 16 for cards. */
  radius?: number;
  /** Pattern opacity, 0–1. Omit to use --damask-opacity (.18). Keep inside 0.12–0.25 — the artwork is cream on deep purple, so anything louder reads as wallpaper and white text loses contrast. */
  contrast?: number;
  style?: React.CSSProperties;
}
export function DamaskPanel(props: DamaskPanelProps): JSX.Element;
