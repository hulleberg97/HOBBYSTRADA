-- Klage på avvist annonse: en avvist annonse slettes automatisk etter 30 dager, men ikke mens en klage er under behandling.
alter table public.listings add column if not exists complaint_at timestamptz;
alter table public.listings add column if not exists complaint_resolved_at timestamptz;
