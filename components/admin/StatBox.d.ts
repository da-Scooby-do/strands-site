/**
 * A large number and a caption. The dashboard's only reporting device — no
 * charts, no funnels, no cohort tables.
 */
export interface StatBoxProps {
  value: React.ReactNode;
  /** Plain-language caption, lowercase. */
  caption: string;
  /** green for the number that needs her attention. */
  tone?: "ink" | "green";
}
export function StatBox(props: StatBoxProps): JSX.Element;
