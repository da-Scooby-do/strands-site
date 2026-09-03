/**
 * The brand's container: tinted or white ground, 1px hairline, 16px radius, no shadow.
 */
export interface CardProps {
  children?: React.ReactNode;
  tone?: "white" | "green" | "purple" | "cream";
  pad?: string;
  radius?: string;
  style?: React.CSSProperties;
}
export function Card(props: CardProps): JSX.Element;
