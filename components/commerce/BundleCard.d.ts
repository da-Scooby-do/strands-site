/**
 * The bundle upsell at the bottom of the buy box — thumbnail, offer line, price,
 * compact Add button, on a green-tint ground.
 */
export interface BundleCardProps {
  title: string;
  /** e.g. "Save 50 EGP". */
  saving?: string;
  price: string;
  onAdd?: () => void;
  thumbLabel?: string;
}
export function BundleCard(props: BundleCardProps): JSX.Element;
