-- HOBBYSTRADA – oppdatering 6: fest kort til kortvifta på forsiden.
-- Kjør én gang i Supabase: SQL Editor → New query → lim inn → Run.

-- Plass i vifta: 1 = midten, 2 = venstre, 3 = høyre, 4 = ytterst venstre, 5 = ytterst høyre
alter table public.listings add column if not exists fan_slot smallint check (fan_slot between 1 and 5);
create unique index if not exists listings_fan_slot on public.listings (fan_slot) where fan_slot is not null;
grant select (fan_slot) on public.listings to anon, authenticated;
