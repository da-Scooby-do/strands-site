/**
 * Every dashboard page opens with this: a small uppercase label, a large serif
 * heading, and at most one filled button on the opposite side of the row.
 */
export interface PageHeaderProps {
  label?: string;
  title: React.ReactNode;
  /** One button, filled. The next action is the only loud thing on a screen. */
  action?: React.ReactNode;
}
export function PageHeader(props: PageHeaderProps): JSX.Element;
