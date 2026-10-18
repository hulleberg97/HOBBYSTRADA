-- HOBBYSTRADA – oppdatering 3: rapporter og samtykke ved annonseløft.
-- Kjør én gang i Supabase: SQL Editor → New query → lim inn → Run.

-- Rapporterte annonser
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  listing_slug text not null,
  reason text not null,
  details text not null default '',
  reporter_email text,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
grant all on public.reports to service_role;

-- Når kunden samtykket i at løftet starter straks (og angreretten faller bort)
alter table public.boost_orders add column if not exists consent_at timestamptz;
