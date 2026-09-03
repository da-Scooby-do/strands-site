/**
 * Hairline-separated disclosure row — the buy-box rows (Benefits, Ingredients,
 * How to use, Shipping & returns) and the numbered "over time" accordion.
 * First row open, the rest closed.
 */
export interface CollapsibleRowProps {
  title: React.ReactNode;
  children?: React.ReactNode;
  /** Controlled open state. Omit for self-managed. */
  open?: boolean;
  defaultOpen?: boolean;
  onToggle?: (next: boolean) => void;
  /** Renders a zero-padded number in green before the title. */
  number?: number;
}
export function CollapsibleRow(props: CollapsibleRowProps): JSX.Element;
