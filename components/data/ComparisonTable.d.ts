/**
 * The comparison block on a purple ground: attributes down the left, three
 * columns across, Strands highlighted with a lighter purple panel. Filled green
 * check for yes, hollow lilac ring for no — no text in the cells. Five or six rows max.
 */
export interface ComparisonRow { label: string; values: boolean[] }
export interface ComparisonTableProps {
  /** Column headers, e.g. ["Strands","Salon treatment","Drugstore mask"]. */
  columns?: string[];
  rows?: ComparisonRow[];
  /** Index of the highlighted column. Default 0. */
  highlight?: number;
}
export function ComparisonTable(props: ComparisonTableProps): JSX.Element;
