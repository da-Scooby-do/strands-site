/**
 * Single checkbox — "Available to order" takes the product off sale.
 */
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
}
export function Checkbox(props: CheckboxProps): JSX.Element;
