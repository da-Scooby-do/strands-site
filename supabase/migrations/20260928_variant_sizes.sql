-- Sizes: a variant can now be its own jar size (e.g. 500 ml) with its own stock.
--   product_variants.size_ml — the jar size this option sells; null = the product's size_ml.
--   product_variants.stock   — this option's own stock; null = shares products.stock.
-- A variant with its own stock is sold out only when that stock hits 0 (the
-- product's in_stock flag, which tracks the shared 300 ml stock, doesn't apply).

alter table public.product_variants
  add column if not exists size_ml integer,
  add column if not exists stock integer;

update public.product_variants set size_ml = 300 where key = '1jar' and size_ml is null;

-- Make room for the new size right after the single 300 ml jar.
update public.product_variants set sort = sort + 1 where sort >= 2 and key <> '500ml';

insert into public.product_variants
  (product_id, key, jars, size_ml, stock, label_en, label_ar, price_egp, save_egp, sort, active)
select p.id, '500ml', 1, 500, 0, '1 jar', 'علبة واحدة', 700, 0, 2, true
  from public.products p
 where p.id = (select product_id from public.product_variants where key = '1jar' limit 1)
on conflict (product_id, key) do nothing;

create or replace function public.place_order_internal(payload jsonb, v_uid uuid)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public', 'pg_temp'
as $function$
declare
  v_item jsonb; v_variant public.product_variants%rowtype; v_product public.products%rowtype;
  v_qty integer; v_subtotal integer := 0; v_shipping integer := 0; v_discount integer := 0;
  v_total integer; v_ship_cfg jsonb; v_promo public.promo_codes%rowtype; v_promo_code text;
  v_order public.orders%rowtype; v_lang text; v_name text; v_phone text; v_gov text;
  v_street text; v_area text; v_landmark text; v_email text; v_line integer; v_pay text;
  v_size integer; v_avail integer;
begin
  if exists (select 1 from public.orders o where o.user_id = v_uid and o.created_at > now() - interval '25 seconds') then
    return jsonb_build_object('ok', false, 'error', 'too_fast'); end if;
  if (select count(*) from public.orders o where o.user_id = v_uid and o.created_at > now() - interval '1 hour') >= 10 then
    return jsonb_build_object('ok', false, 'error', 'rate_limited'); end if;
  v_lang := coalesce(nullif(trim(payload->>'lang'),''), 'en');
  if v_lang not in ('en','ar') then v_lang := 'en'; end if;
  v_name := nullif(trim(payload->>'full_name'),''); v_phone := nullif(trim(payload->>'phone'),'');
  v_gov := nullif(trim(payload->>'governorate'),''); v_street := nullif(trim(payload->>'street'),'');
  v_area := nullif(trim(payload->>'area'),''); v_landmark := nullif(trim(payload->>'landmark'),'');
  v_email := nullif(trim(payload->>'email'),'');
  if v_email is null then select email into v_email from auth.users where id = v_uid; end if;
  v_pay := coalesce(nullif(trim(payload->>'payment_method'),''),'cod');
  if v_pay not in ('cod','instapay') then v_pay := 'cod'; end if;
  if v_name is null or length(v_name) < 2 then return jsonb_build_object('ok', false, 'error', 'name_required'); end if;
  if v_phone is null or length(regexp_replace(v_phone,'\D','','g')) < 10 then return jsonb_build_object('ok', false, 'error', 'phone_invalid'); end if;
  if v_gov is null then return jsonb_build_object('ok', false, 'error', 'governorate_required'); end if;
  if v_street is null or length(v_street) < 4 then return jsonb_build_object('ok', false, 'error', 'address_required'); end if;
  if jsonb_typeof(payload->'items') <> 'array' or jsonb_array_length(payload->'items') = 0 then return jsonb_build_object('ok', false, 'error', 'cart_empty'); end if;
  for v_item in select * from jsonb_array_elements(payload->'items') loop
    select * into v_variant from public.product_variants where key = v_item->>'variant_key' and active limit 1;
    if not found then return jsonb_build_object('ok', false, 'error', 'variant_not_found'); end if;
    select * into v_product from public.products where id = v_variant.product_id and active;
    if not found then return jsonb_build_object('ok', false, 'error', 'product_unavailable'); end if;
    if v_variant.stock is not null then
      v_avail := v_variant.stock;
      if v_avail <= 0 then return jsonb_build_object('ok', false, 'error', 'out_of_stock'); end if;
    else
      v_avail := coalesce(v_product.stock, 20);
      if coalesce(v_product.stock, 0) <= 0 or v_product.in_stock = false then
        return jsonb_build_object('ok', false, 'error', 'out_of_stock'); end if;
    end if;
    v_qty := greatest(1, least(v_avail, coalesce((v_item->>'qty')::int, 1)));
    v_subtotal := v_subtotal + (v_variant.price_egp * v_qty);
  end loop;
  select value into v_ship_cfg from public.settings where key = 'shipping';
  v_shipping := public.shipping_for(v_gov);
  if v_ship_cfg ? 'free_over_egp' and v_subtotal >= (v_ship_cfg->>'free_over_egp')::int then v_shipping := 0; end if;
  v_promo_code := upper(nullif(trim(payload->>'promo_code'),''));
  if v_promo_code is not null then
    select * into v_promo from public.promo_codes
      where code = v_promo_code and active and (expires_at is null or expires_at > now())
        and (max_uses is null or uses < max_uses) and v_subtotal >= min_subtotal limit 1;
    if found then
      if exists (select 1 from public.orders o where o.user_id = v_uid and upper(o.promo_code) = v_promo_code) then
        return jsonb_build_object('ok', false, 'error', 'promo_already_used'); end if;
      if v_promo.kind = 'percent' then v_discount := floor(v_subtotal * v_promo.value / 100.0)::int;
      elsif v_promo.kind = 'fixed' then v_discount := least(v_promo.value, v_subtotal);
      elsif v_promo.kind = 'free_shipping' then v_shipping := 0; end if;
    else v_promo_code := null; end if;
  end if;
  v_total := v_subtotal - v_discount + v_shipping;
  insert into public.orders (user_id, lang, full_name, phone, phone2, email, governorate, area, street, landmark,
     payment_method, subtotal, shipping, discount, total, promo_code)
  values (v_uid, v_lang, v_name, v_phone, nullif(trim(payload->>'phone2'),''), v_email,
     v_gov, v_area, v_street, v_landmark, v_pay, v_subtotal, v_shipping, v_discount, v_total, v_promo_code)
  returning * into v_order;
  for v_item in select * from jsonb_array_elements(payload->'items') loop
    select * into v_variant from public.product_variants where key = v_item->>'variant_key' and active limit 1;
    select * into v_product from public.products where id = v_variant.product_id;
    v_avail := case when v_variant.stock is not null then v_variant.stock else coalesce(v_product.stock, 20) end;
    v_qty := greatest(1, least(v_avail, coalesce((v_item->>'qty')::int, 1)));
    v_line := v_variant.price_egp * v_qty;
    v_size := coalesce(v_variant.size_ml, v_product.size_ml);
    insert into public.order_items (order_id, product_id, variant_key, title_en, title_ar, meta_en, meta_ar, unit_price, qty, line_total)
    values (v_order.id, v_product.id, v_variant.key, v_product.name_en, v_product.name_ar,
       v_size || ' ml · ' || v_variant.label_en, v_size || ' مل · ' || v_variant.label_ar,
       v_variant.price_egp, v_qty, v_line);
    if v_variant.stock is not null then
      update public.product_variants set stock = stock - v_qty
       where id = v_variant.id and stock >= v_qty;
    else
      update public.products
         set stock = stock - v_qty, in_stock = (stock - v_qty) > 0
       where id = v_product.id and stock >= v_qty;
    end if;
    if not found then raise exception 'insufficient_stock';
    end if;
  end loop;
  insert into public.order_events (order_id, status, note_en, note_ar) values (v_order.id, 'confirmed', 'Order confirmed', 'تم تأكيد الطلب');
  if v_promo_code is not null then update public.promo_codes set uses = uses + 1 where code = v_promo_code; end if;
  update public.profiles set full_name = coalesce(v_name, full_name), phone = coalesce(v_phone, phone),
         email = coalesce(v_email, email), governorate = v_gov, area = v_area, street = v_street, landmark = v_landmark, lang = v_lang
   where user_id = v_uid;
  return jsonb_build_object('ok', true, 'order_number', v_order.order_number, 'total', v_order.total,
    'subtotal', v_order.subtotal, 'shipping', v_order.shipping, 'discount', v_order.discount, 'phone', v_order.phone);
end $function$;

create or replace function public.create_manual_order(payload jsonb)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public', 'pg_temp'
as $function$
declare
  v_item jsonb; v_variant public.product_variants%rowtype; v_product public.products%rowtype;
  v_qty integer; v_subtotal integer := 0; v_shipping integer; v_discount integer;
  v_total integer; v_order public.orders%rowtype; v_line integer;
  v_source text; v_status text; v_name text; v_phone text; v_size integer;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  v_source := lower(coalesce(nullif(trim(payload->>'source'),''), 'whatsapp'));
  if v_source not in ('website','whatsapp','instagram','phone','other') then v_source := 'whatsapp'; end if;
  v_status := lower(coalesce(nullif(trim(payload->>'status'),''), 'confirmed'));
  if v_status not in ('placed','confirmed','packed','with_courier','delivered','cancelled') then v_status := 'confirmed'; end if;

  v_name  := nullif(trim(payload->>'full_name'),'');
  v_phone := nullif(trim(payload->>'phone'),'');
  if v_name is null then return jsonb_build_object('ok', false, 'error', 'name_required'); end if;
  if v_phone is null then return jsonb_build_object('ok', false, 'error', 'phone_required'); end if;
  if jsonb_typeof(payload->'items') <> 'array' or jsonb_array_length(payload->'items') = 0 then
    return jsonb_build_object('ok', false, 'error', 'items_required'); end if;

  for v_item in select * from jsonb_array_elements(payload->'items') loop
    select * into v_variant from public.product_variants where key = v_item->>'variant_key' limit 1;
    if not found then return jsonb_build_object('ok', false, 'error', 'variant_not_found'); end if;
    v_qty := greatest(1, least(100, coalesce((v_item->>'qty')::int, 1)));
    v_subtotal := v_subtotal + (v_variant.price_egp * v_qty);
  end loop;

  v_shipping := coalesce((payload->>'shipping')::int, 0);
  v_discount := coalesce((payload->>'discount')::int, 0);
  v_total := v_subtotal - v_discount + v_shipping;

  insert into public.orders
    (user_id, source, lang, full_name, phone, phone2, email, governorate, area, street, landmark,
     payment_method, subtotal, shipping, discount, total, status, admin_note)
  values
    (null, v_source, coalesce(nullif(payload->>'lang',''),'ar'), v_name, v_phone,
     nullif(trim(payload->>'phone2'),''), nullif(trim(payload->>'email'),''),
     nullif(trim(payload->>'governorate'),''), nullif(trim(payload->>'area'),''),
     nullif(trim(payload->>'street'),''), nullif(trim(payload->>'landmark'),''),
     'cod', v_subtotal, v_shipping, v_discount, v_total, v_status, nullif(trim(payload->>'note'),''))
  returning * into v_order;

  for v_item in select * from jsonb_array_elements(payload->'items') loop
    select * into v_variant from public.product_variants where key = v_item->>'variant_key' limit 1;
    select * into v_product from public.products where id = v_variant.product_id;
    v_qty  := greatest(1, least(100, coalesce((v_item->>'qty')::int, 1)));
    v_line := v_variant.price_egp * v_qty;
    v_size := coalesce(v_variant.size_ml, v_product.size_ml);
    insert into public.order_items
      (order_id, product_id, variant_key, title_en, title_ar, meta_en, meta_ar, unit_price, qty, line_total)
    values (v_order.id, v_product.id, v_variant.key, v_product.name_en, v_product.name_ar,
       v_size || ' ml · ' || v_variant.label_en, v_size || ' مل · ' || v_variant.label_ar,
       v_variant.price_egp, v_qty, v_line);
  end loop;

  insert into public.order_events (order_id, status, note_en, note_ar, notify_result)
  values (v_order.id, v_status, 'Recorded manually (' || v_source || ')', 'تم التسجيل يدويًا (' || v_source || ')', 'manual');

  return jsonb_build_object('ok', true, 'order_number', v_order.order_number, 'total', v_order.total);
end $function$;
