/**
 * Single-line text field. White ground, hairline border, 8px radius on marketing
 * pages (the store's own forms use var(--radius-store), 2px).
 */
export interface InputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "search";
  hint?: string;
  id?: string;
  style?: React.CSSProperties;
}
export function Input(props: InputProps): JSX.Element;
