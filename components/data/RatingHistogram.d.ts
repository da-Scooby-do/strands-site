/**
 * Five thin bars, 5★ down to 1★, green on a hairline track, count at the end.
 */
export interface RatingHistogramProps {
  /** Counts indexed 1★→5★, i.e. [oneStar, twoStar, threeStar, fourStar, fiveStar]. */
  counts?: number[];
}
export function RatingHistogram(props: RatingHistogramProps): JSX.Element;
