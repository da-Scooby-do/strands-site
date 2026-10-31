-- Weslat International (delivery, Sudan), through its "Accurate" shipping API.
-- Paid Sudan orders are sent by the `weslat` edge function; Weslat calls back on
-- every status change (webhook) and a 30-minute job reads statuses as a fallback.
-- Nothing is sent until the owner switches it on in Dashboard → Weslat.

alter table public.orders
  add column if not exists weslat_state     text,        -- null (not handled) | waiting_payment | sent | failed
  add column if not exists weslat_id        integer,     -- Weslat's shipment id
  add column if not exists weslat_code      text,        -- Weslat's shipment code (also tracking_number)
  add column if not exists weslat_status    text,        -- their status code, e.g. OTD
  add column if not exists weslat_error     text,        -- why the last send failed
  add column if not exists weslat_sent_at   timestamptz,
  add column if not exists weslat_synced_at timestamptz;
create index if not exists orders_weslat_idx on public.orders (weslat_state) where weslat_state is not null;
create index if not exists orders_weslat_code_idx on public.orders (weslat_code) where weslat_code is not null;

-- service_id: Weslat's shipping service. zones: our Sudan delivery choice key ->
-- { zone_id, zone_name, subzone_id, subzone_name }. jar_kg: weight per jar sent.
insert into public.settings (key, value)
values ('weslat', '{"enabled": false, "enabled_at": null, "service_id": null, "service_name": null, "zones": {}, "jar_kg": 0.5, "last_sync": null}'::jsonb)
on conflict (key) do nothing;

-- Weslat's webhook carries no signature, so its address carries a random key.
do $$ begin
  if not exists (select 1 from vault.secrets where name = 'weslat_hook_key') then
    perform vault.create_secret(md5(random()::text || clock_timestamp()::text) || md5(random()::text), 'weslat_hook_key', 'Weslat webhook address key');
  end if;
end $$;

create or replace function public.weslat_hook_ok(p_key text)
 returns boolean language sql stable security definer set search_path to 'public', 'pg_temp'
as $$
  select exists (select 1 from vault.decrypted_secrets where name = 'weslat_hook_key' and decrypted_secret = p_key)
$$;
revoke all on function public.weslat_hook_ok(text) from public, anon, authenticated;
grant execute on function public.weslat_hook_ok(text) to service_role;

-- The address to give Weslat — shown to the owner only.
create or replace function public.weslat_hook_url()
 returns text language plpgsql stable security definer set search_path to 'public', 'pg_temp'
as $$
begin
  if not public.is_admin() then return null; end if;
  return 'https://nyltwnzrxzuwmqfvqxef.supabase.co/functions/v1/weslat?key='
    || (select decrypted_secret from vault.decrypted_secrets where name = 'weslat_hook_key');
end $$;
revoke all on function public.weslat_hook_url() from public, anon;
grant execute on function public.weslat_hook_url() to authenticated;

-- Every 30 minutes: send paid orders that are due and read statuses back
-- (same job secret as Flextock's, checked with flextock_cron_ok).
select cron.unschedule(jobid) from cron.job where jobname = 'weslat-sync';
select cron.schedule('weslat-sync', '15,45 * * * *', $job$
  select net.http_post(
    url     := 'https://nyltwnzrxzuwmqfvqxef.supabase.co/functions/v1/weslat',
    headers := jsonb_build_object('Content-Type', 'application/json',
                 'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'flextock_cron_secret')),
    body    := '{"action": "cron"}'::jsonb,
    timeout_milliseconds := 55000)
$job$);
