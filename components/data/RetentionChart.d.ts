/**
 * The science section's centrepiece chart: a filled green area curve against a
 * flat grey line, curves labelled directly on the chart rather than in a legend.
 */
export interface RetentionChartProps {
  /** [x, y] points, y as 0–100. The highlighted (green) curve. */
  series?: Array<[number, number]>;
  /** The comparison (grey) curve. */
  flat?: Array<[number, number]>;
  /** X-axis annotations, e.g. the three use methods. */
  marks?: Array<{ x: number; label: string }>;
  xLabel?: string;
  yLabel?: string;
  height?: number;
}
export function RetentionChart(props: RetentionChartProps): JSX.Element;
