/**
 * Search input with a leading glyph — sits above the review list.
 */
export interface SearchFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}
export function SearchField(props: SearchFieldProps): JSX.Element;
