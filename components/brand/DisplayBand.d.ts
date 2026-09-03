/**
 * The closing band: two or three words set very large in outlined display type,
 * letterforms hollow, clipped by the viewport. Purely typographic — no photo, no link.
 */
export interface DisplayBandProps {
  children?: React.ReactNode;
  ground?: string;
  /** Stroke colour of the hollow letterforms. */
  stroke?: string;
  /** Font size in px. Default 200 — large enough to clip on small screens. */
  size?: number;
}
export function DisplayBand(props: DisplayBandProps): JSX.Element;
