/**
 * Price, large, with an optional struck-through original and a one-line
 * reassurance beneath — "Cash on delivery, 2–4 days". Always above the fold.
 */
export interface PriceBlockProps {
  price: string | number;
  /** Original price, struck through. */
  was?: string | number;
  /** One-line delivery or payment promise. */
  note?: string;
  currency?: string;
}
export function PriceBlock(props: PriceBlockProps): JSX.Element;
