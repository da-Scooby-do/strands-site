/**
 * Numbered pager. Reviews paginate — never infinite-scroll.
 */
export interface PaginationProps {
  page?: number;
  pages?: number;
  onChange?: (page: number) => void;
}
export function Pagination(props: PaginationProps): JSX.Element;
