-- Angrerett på annonseløft: når kunden meldte fra (bekreftelse sendes automatisk), og når refusjonen er gjort.
alter table public.boost_orders add column if not exists withdraw_requested_at timestamptz;
alter table public.boost_orders add column if not exists refunded_at timestamptz;
