-- Flextock (warehouse + delivery, Egypt). Website orders are sent to Flextock
-- automatically by the `flextock` edge function, and their status + tracking is
-- read back every 30 minutes. Nothing is sent until the owner switches it on in
-- Dashboard → Flextock (settings.flextock.enabled) and adds the SKU codes.

-- Flextock's product code for each size (bundles use their size's code × jars).
alter table public.product_variants add column if not exists sku_code text;

alter table public.orders
  add column if not exists flextock_state     text,        -- null (not handled) | waiting_payment | sent | failed | cancelled
  add column if not exists flextock_status    text,        -- Flextock's own status word, as last read
  add column if not exists flextock_error     text,        -- why the last send/cancel failed
  add column if not exists flextock_sent_at   timestamptz,
  add column if not exists flextock_synced_at timestamptz,
  add column if not exists courier_name       text,
  add column if not exists tracking_number    text,
  add column if not exists tracking_url       text;
create index if not exists orders_flextock_idx on public.orders (flextock_state) where flextock_state is not null;

-- enabled_at: only orders placed after switching on are sent automatically, so
-- turning it on never ships old orders. cities: our governorate -> Flextock city name.
insert into public.settings (key, value)
values ('flextock', '{"enabled": false, "enabled_at": null, "cities": {}, "last_sync": null}'::jsonb)
on conflict (key) do nothing;

-- The 30-minute job proves itself to the function with a random secret kept in
-- Vault; the function checks it through this (service-role only) helper.
do $$ begin
  if not exists (select 1 from vault.secrets where name = 'flextock_cron_secret') then
    perform vault.create_secret(md5(random()::text || clock_timestamp()::text) || md5(random()::text), 'flextock_cron_secret', 'Flextock sync job');
  end if;
end $$;

create or replace function public.flextock_cron_ok(p_secret text)
 returns boolean language sql stable security definer set search_path to 'public', 'pg_temp'
as $$
  select exists (select 1 from vault.decrypted_secrets where name = 'flextock_cron_secret' and decrypted_secret = p_secret)
$$;
revoke all on function public.flextock_cron_ok(text) from public, anon, authenticated;
grant execute on function public.flextock_cron_ok(text) to service_role;

-- Every 30 minutes: send anything that's due and read statuses back.
create extension if not exists pg_net;
create extension if not exists pg_cron;
select cron.unschedule(jobid) from cron.job where jobname = 'flextock-sync';
select cron.schedule('flextock-sync', '*/30 * * * *', $job$
  select net.http_post(
    url     := 'https://nyltwnzrxzuwmqfvqxef.supabase.co/functions/v1/flextock',
    headers := jsonb_build_object('Content-Type', 'application/json',
                 'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'flextock_cron_secret')),
    body    := '{"action": "cron"}'::jsonb,
    timeout_milliseconds := 55000)
$job$);
