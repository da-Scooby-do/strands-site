/**
 * Eyebrow + display-serif headline + optional one-line subhead. Headlines are
 * sentence case with a full stop.
 */
export interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  align?: "start" | "center";
  /** dark = on a purple ground. */
  tone?: "light" | "dark";
  /** CSS font-size for the headline. Default var(--display-2). */
  size?: string;
  style?: React.CSSProperties;
}
export function SectionHeading(props: SectionHeadingProps): JSX.Element;
