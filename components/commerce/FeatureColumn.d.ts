/**
 * One column of the three-up row: a circular outlined icon at 2.75 stroke, a short
 * bold heading, and two lines of body. The icon is green on both grounds — on purple
 * it uses --green-bright, the only lightened green in the system, because base green
 * on purple measures about 1.7:1. Body text stays lilac on purple.
 */
export interface FeatureColumnProps {
  /** Lucide icon name. */
  icon: string;
  title: string;
  children?: React.ReactNode;
  /** dark = on purple (lilac body), light = on cream. */
  tone?: "dark" | "light";
  align?: "start" | "center";
}
export function FeatureColumn(props: FeatureColumnProps): JSX.Element;
