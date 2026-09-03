/**
 * Order status as a pill. Placed/Confirmed read purple, Packed/With courier
 * green-tint, Delivered solid green, Cancelled outlined and quiet.
 */
export interface StatusPillProps {
  status?: "Placed" | "Confirmed" | "Packed" | "With courier" | "Delivered" | "Cancelled";
  /** Render as a neutral chip — used for the status row on an order and as filters. */
  quiet?: boolean;
  /** Selected state when quiet. */
  active?: boolean;
  onClick?: () => void;
}
export function StatusPill(props: StatusPillProps): JSX.Element;
