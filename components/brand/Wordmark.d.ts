/**
 * The STRANDS logotype set in the display serif, with the HAIR CARE descriptor
 * beneath it. Green on light grounds. On purple use green only at display sizes on
 * flat ground; over the damask, or under ~32px, pass color="var(--green-tint)" —
 * green on purple measures about 1.7:1. Never purple.
 * @startingPoint section="Brand" subtitle="Logotype with descriptor" viewport="700x200"
 */
export interface WordmarkProps {
  /** Logotype colour. var(--green) on light grounds, var(--green-tint) on purple and over the damask. Default var(--green). */
  color?: string;
  /** Cap height of the logotype in px. Default 32. */
  size?: number;
  /** Show the HAIR CARE descriptor. Never omit it in brand contexts. Default true. */
  descriptor?: boolean;
  align?: "center" | "start";
}
export function Wordmark(props: WordmarkProps): JSX.Element;
