-- Bank transfer (Saudi Arabia / Sudan) is a payment method; the orders check
-- constraint only allowed cod, card and instapay. Applied 2026-10-14.
alter table public.orders drop constraint if exists orders_payment_method_check;
alter table public.orders add constraint orders_payment_method_check
  check (payment_method = any (array['cod','card','instapay','bank']));
