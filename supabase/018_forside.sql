-- Innstillinger for nettsiden som admin endrer fra adminsiden (f.eks. hvor mange gratisannonser som fyller forsiden).
-- Leses og skrives bare med service-nøkkelen, så ingen rettigheter gis til anon/authenticated.
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
