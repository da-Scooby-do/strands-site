/**
 * Small status mark — "Verified buyer", "In stock", "Save 50 EGP".
 */
export interface BadgeProps {
  children?: React.ReactNode;
  /** Optional leading Lucide glyph. */
  icon?: string;
  tone?: "green" | "purple";
}
export function Badge(props: BadgeProps): JSX.Element;
