/**
 * A small pill — the product-code chip in the buy box, and the topic filters in reviews.
 */
export interface ChipProps {
  children?: React.ReactNode;
  selected?: boolean;
  /** Omit to render a static label rather than a filter. */
  onClick?: () => void;
  tone?: "ink" | "green";
}
export function Chip(props: ChipProps): JSX.Element;
