-- HOBBYSTRADA – oppdatering 7: grenser mot spam, og sanntid i chatten.
-- Kjør én gang i Supabase: SQL Editor → New query → lim inn → Run.

-- Teller handlinger per bruker/IP, så vi kan stoppe spam (ryddes daglig)
create table if not exists public.rate_events (
  key text not null,
  created_at timestamptz not null default now()
);
create index if not exists rate_events_key_time on public.rate_events (key, created_at desc);
alter table public.rate_events enable row level security;
grant all on public.rate_events to service_role;

-- Sanntid: innloggede brukere kan lese sine egne samtaler og meldinger (og ingen andres)
grant select on public.conversations to authenticated;
grant select on public.chat_messages to authenticated;
drop policy if exists "Egne samtaler" on public.conversations;
create policy "Egne samtaler" on public.conversations for select to authenticated
  using (auth.uid() = buyer_id or auth.uid() = seller_id);
drop policy if exists "Meldinger i egne samtaler" on public.chat_messages;
create policy "Meldinger i egne samtaler" on public.chat_messages for select to authenticated
  using (exists (select 1 from public.conversations c where c.id = conversation_id and (auth.uid() = c.buyer_id or auth.uid() = c.seller_id)));
do $$ begin
  alter publication supabase_realtime add table public.chat_messages;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.conversations;
exception when duplicate_object then null; end $$;
