/**
 * The dashboard's list device — orders, promo codes, the waitlist. Rows link
 * straight through; hover tints the row cream.
 */
export interface DataColumn {
  key: string;
  label: string;
  align?: "start" | "end";
  /** Tabular figures for money and counts. */
  numeric?: boolean;
  wrap?: boolean;
  maxWidth?: string;
  render?: (row: any) => React.ReactNode;
}
export interface DataTableProps {
  columns?: DataColumn[];
  rows?: any[];
  onRowClick?: (row: any) => void;
  /** Plain-language empty state. */
  empty?: string;
}
export function DataTable(props: DataTableProps): JSX.Element;
