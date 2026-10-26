-- Sperreliste: Vipps-ID for utestengte brukere, så de ikke kan lage ny konto. Slettes etter 2 år (cron).
create table if not exists public.blocked_users (
  vipps_sub text primary key,
  blocked_at timestamptz not null default now(),
  rule text not null
);
alter table public.blocked_users enable row level security;
grant all on public.blocked_users to service_role;

-- Kjøperens navn på betalingen, så kvitteringen gir mening etter at kontoen er slettet (bokføringsloven).
alter table public.boost_orders add column if not exists buyer_name text;
