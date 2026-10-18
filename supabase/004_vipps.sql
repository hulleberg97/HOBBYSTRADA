-- HOBBYSTRADA – oppdatering 4: Vipps-innlogging og «Verifisert med Vipps».
-- Kjør én gang i Supabase: SQL Editor → New query → lim inn → Run.

-- Bekreftet identitet fra Vipps, én rad per bruker
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  vipps_sub text unique,
  verified_name text,
  phone text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
grant all on public.profiles to service_role;

-- Merke på annonsen: selgeren er verifisert med Vipps
alter table public.listings add column if not exists seller_verified boolean not null default false;
grant select (seller_verified) on public.listings to anon, authenticated;
