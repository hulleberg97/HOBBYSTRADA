-- Bud i chatten kan godtas eller avslås av selgeren. Når et bud er godtatt, får kjøperen en Vipps-knapp til selgeren.
alter table public.chat_messages add column if not exists offer_status text check (offer_status in ('accepted', 'declined'));
alter table public.chat_messages add column if not exists offer_decided_at timestamptz;
-- Godtatt bud på samtalen (beløp og tidspunkt), og om annonsen er reservert
alter table public.conversations add column if not exists accepted_offer numeric;
alter table public.conversations add column if not exists accepted_at timestamptz;
alter table public.listings add column if not exists reserved_at timestamptz;
grant select (reserved_at) on public.listings to anon, authenticated;
