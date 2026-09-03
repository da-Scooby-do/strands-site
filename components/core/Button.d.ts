/**
 * The page's action. One filled button per section, never more.
 * @startingPoint section="Core" subtitle="Filled, outlined and text buttons" viewport="700x150"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** filled = purple (primary), quiet = purple outline, text = green label only. */
  variant?: "filled" | "quiet" | "text";
  /** lg = 52px (page CTAs), sm = 40px (compact / in-card actions). */
  size?: "lg" | "sm";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit";
  style?: React.CSSProperties;
}
export function Button(props: ButtonProps): JSX.Element;
