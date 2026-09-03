/**
 * The small uppercase line above a headline. 10px, .18em tracking, green on light
 * grounds, lilac on purple.
 */
export interface EyebrowProps {
  children?: React.ReactNode;
  tone?: "green" | "lilac";
  style?: React.CSSProperties;
}
export function Eyebrow(props: EyebrowProps): JSX.Element;
