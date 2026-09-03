/**
 * Line-drawn icon wrapper around the Lucide set (substituted — the brand supplied
 * no icons). Intentional addition: every other component needs a glyph primitive.
 */
export interface IconProps {
  /** Lucide icon name, kebab-case. */
  name: string;
  size?: number;
  /** Stroke width. 1.5 in UI chrome; 2.25 for the circled feature icons. Line-drawn, never filled. */
  stroke?: number;
  color?: string;
  style?: React.CSSProperties;
}
export function Icon(props: IconProps): JSX.Element;
