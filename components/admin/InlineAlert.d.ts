/**
 * A one-line result message in the place where the action happened. Nothing in
 * the dashboard fails silently: a refused save, a failed email or a blocked
 * status change says so here, in words she can act on — never in database language.
 */
export interface InlineAlertProps {
  /** ok = green confirmation, error = the action did not happen and why. */
  tone?: "ok" | "error";
  children?: React.ReactNode;
}
export function InlineAlert(props: InlineAlertProps): JSX.Element;
