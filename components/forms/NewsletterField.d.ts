/**
 * One input with an arrow button inside its right edge — the footer signup.
 */
export interface NewsletterFieldProps {
  placeholder?: string;
  onSubmit?: (email: string) => void;
  /** onAnchor for the purple footer, light for cream sections. */
  tone?: "onAnchor" | "light";
}
export function NewsletterField(props: NewsletterFieldProps): JSX.Element;
