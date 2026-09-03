/**
 * A bare icon action for headers and toolbars — account, cart, search, close.
 */
export interface IconButtonProps {
  /** Lucide icon name, e.g. "shopping-bag". */
  name: string;
  /** Accessible label — required, the button has no text. */
  label: string;
  onClick?: () => void;
  size?: number;
  /** onAnchor for use on purple grounds. */
  tone?: "ink" | "onAnchor";
  /** Optional count badge (cart items). */
  badge?: number | string;
}
export function IconButton(props: IconButtonProps): JSX.Element;
