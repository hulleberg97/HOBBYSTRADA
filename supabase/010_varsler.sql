-- Varsler på nettsiden (bjella øverst): annonse godkjent/avvist, løft aktivert eller snart utløpt, nye kort som passer et søk.
-- Slettes automatisk etter 90 dager av den daglige oppryddingen.
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_created on public.notifications (user_id, created_at desc);
alter table public.notifications enable row level security;
grant all on public.notifications to service_role;
