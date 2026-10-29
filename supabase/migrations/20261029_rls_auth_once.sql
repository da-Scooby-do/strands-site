-- Same rules, faster: evaluate auth.uid() once per query instead of once per row
-- (Supabase advisor "auth_rls_initplan").
alter policy "own profile read"      on public.profiles     using ((select auth.uid()) = user_id);
alter policy "own profile insert"    on public.profiles     with check ((select auth.uid()) = user_id);
alter policy "own profile update"    on public.profiles     using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "own orders read"       on public.orders       using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
alter policy "own order items read"  on public.order_items  using (exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = (select auth.uid())));
alter policy "own order events read" on public.order_events using (exists (select 1 from public.orders o where o.id = order_events.order_id and o.user_id = (select auth.uid())));
