/**
 * The circular S monogram — the standalone mark used where the full logotype is
 * too wide (favicons, avatars, badges, jar lids).
 */
export interface MonogramProps {
  /** Diameter in px. Default 72. */
  size?: number;
  /** Roundel ground. Default lilac. */
  ground?: string;
}
export function Monogram(props: MonogramProps): JSX.Element;
