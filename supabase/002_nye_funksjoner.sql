-- HOBBYSTRADA – oppdatering 2: lagrede søk og prisarkiv.
-- Kjør én gang i Supabase: SQL Editor → New query → lim inn → Run.

-- Lagrede søk («Varsle meg om nye kort»)
create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  query text not null,
  label text not null,
  last_sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists saved_searches_user_idx on public.saved_searches (user_id);
alter table public.saved_searches enable row level security;
grant all on public.saved_searches to service_role;

-- Prisarkiv: når kortet ble solgt
alter table public.listings add column if not exists sold_at timestamptz;
grant select (sold_at) on public.listings to anon, authenticated;
update public.listings set sold_at = updated_at where status = 'sold' and sold_at is null;
