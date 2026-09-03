/**
 * EN / ع switch in the header. Arabic mirrors the whole page; use logical
 * start/end properties everywhere, never left/right.
 */
export interface LanguageToggleProps {
  value?: "EN" | "ع";
  onChange?: (value: string) => void;
  tone?: "ink" | "onAnchor";
}
export function LanguageToggle(props: LanguageToggleProps): JSX.Element;
