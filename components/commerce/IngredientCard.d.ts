/**
 * One of the three cards in the science block: figure on top, ingredient name,
 * two lines on what it does. White card on cream, hairline, no shadow.
 */
export interface IngredientCardProps {
  name: string;
  children?: React.ReactNode;
  /** Photograph of the ingredient, cropped 16:10. */
  image?: string;
  /** Arabic name, set beneath the English. */
  arabic?: string;
  /** Placeholder caption shown until real photography or a diagram is supplied. */
  figureLabel?: string;
}
export function IngredientCard(props: IngredientCardProps): JSX.Element;
