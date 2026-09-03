/**
 * One review: avatar, name, Verified buyer badge, stars, right-aligned date,
 * bold one-line title, body, and a "Was this helpful?" row with thumb counts.
 */
export interface ReviewCardProps {
  name: string;
  initials?: string;
  rating?: number;
  date?: string;
  /** One line, bold. */
  title?: string;
  children?: React.ReactNode;
  helpful?: number;
  notHelpful?: number;
  verified?: boolean;
}
export function ReviewCard(props: ReviewCardProps): JSX.Element;
