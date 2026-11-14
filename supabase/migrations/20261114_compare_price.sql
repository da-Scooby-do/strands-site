-- "Price before" (compare-at price). When it is higher than the selling price the
-- shop shows it struck through, with a -% badge and how much the customer saves.
-- Display only: orders are still priced from price_egp / market_variants.price.
alter table public.product_variants add column if not exists compare_price_egp integer
  check (compare_price_egp is null or compare_price_egp > 0);
alter table public.market_variants add column if not exists compare_price integer
  check (compare_price is null or compare_price > 0);
