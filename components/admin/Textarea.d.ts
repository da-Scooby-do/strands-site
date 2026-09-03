/**
 * Multi-line field — ingredients, review quotes, the internal note on an order.
 * Pass dir="rtl" for Arabic.
 */
export interface TextareaProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  placeholder?: string;
  dir?: "ltr" | "rtl";
  style?: React.CSSProperties;
}
export function Textarea(props: TextareaProps): JSX.Element;
