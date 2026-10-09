-- Marketplace Profit Clarity V1. RLS is the database authorization boundary.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 120),
  platform_preset text not null check (platform_preset in ('etsy', 'shopify', 'ebay', 'amazon', 'custom')),
  currency_code text not null default 'USD' check (currency_code in ('USD', 'EUR', 'GBP', 'CAD', 'AUD')),
  selling_price numeric(12, 2) not null default 0 check (selling_price >= 0),
  shipping_charged_to_customer numeric(12, 2) not null default 0 check (shipping_charged_to_customer >= 0),
  product_cost numeric(12, 2) not null default 0 check (product_cost >= 0),
  packaging_cost numeric(12, 2) not null default 0 check (packaging_cost >= 0),
  labor_cost numeric(12, 2) not null default 0 check (labor_cost >= 0),
  labor_minutes numeric(10, 2) null check (labor_minutes is null or labor_minutes >= 0),
  labor_hourly_rate numeric(12, 2) null check (labor_hourly_rate is null or labor_hourly_rate >= 0),
  shipping_cost_seller numeric(12, 2) not null default 0 check (shipping_cost_seller >= 0),
  platform_fee_percent numeric(6, 3) not null default 0 check (platform_fee_percent between 0 and 100),
  platform_fee_fixed numeric(12, 2) not null default 0 check (platform_fee_fixed >= 0),
  payment_fee_percent numeric(6, 3) not null default 0 check (payment_fee_percent between 0 and 100),
  payment_fee_fixed numeric(12, 2) not null default 0 check (payment_fee_fixed >= 0),
  listing_fee numeric(12, 2) not null default 0 check (listing_fee >= 0),
  advertising_cost_per_unit numeric(12, 2) not null default 0 check (advertising_cost_per_unit >= 0),
  returns_allowance_percent numeric(6, 3) not null default 0 check (returns_allowance_percent between 0 and 100),
  returns_allowance_fixed numeric(12, 2) not null default 0 check (returns_allowance_fixed >= 0),
  tax_enabled boolean not null default false,
  tax_rate_percent numeric(6, 3) not null default 0 check (tax_rate_percent between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_user_id_idx on public.products(user_id);
create index if not exists products_user_created_idx on public.products(user_id, created_at desc);
create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email) on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
alter table public.profiles enable row level security;
alter table public.products enable row level security;
create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "products_select_own" on public.products for select to authenticated using ((select auth.uid()) = user_id);
create policy "products_insert_own" on public.products for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "products_update_own" on public.products for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "products_delete_own" on public.products for delete to authenticated using ((select auth.uid()) = user_id);
grant select, insert, update, delete on public.products to authenticated;
grant select, update on public.profiles to authenticated;
