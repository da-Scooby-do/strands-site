/**
 * Dropdown — the reviews sort control, delivery governorate, quantity.
 */
export interface SelectOption { value: string; label: string }
export interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  /** Strings or {value,label} pairs. */
  options?: Array<string | SelectOption>;
  style?: React.CSSProperties;
}
export function Select(props: SelectProps): JSX.Element;
