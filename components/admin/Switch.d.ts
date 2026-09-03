/**
 * Published / active / enabled toggle. Green when on.
 */
export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
}
export function Switch(props: SwitchProps): JSX.Element;
