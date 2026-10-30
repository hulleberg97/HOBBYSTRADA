-- Forsiden: kort velges med en bryter, ikke plassnummer 1–5. fan_slot er nå bare rekkefølgen blant de valgte,
-- så grensen på 1–5 og kravet om unike numre fjernes.
alter table public.listings drop constraint if exists listings_fan_slot_check;
drop index if exists public.listings_fan_slot;
