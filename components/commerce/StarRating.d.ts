/**
 * Five stars in green, filled to the rating, with an optional review count.
 */
export interface StarRatingProps {
  /** 0–5. */
  value?: number;
  size?: number;
  /** Review count rendered after the stars. */
  count?: number;
  color?: string;
}
export function StarRating(props: StarRatingProps): JSX.Element;
