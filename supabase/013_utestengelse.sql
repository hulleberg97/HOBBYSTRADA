-- Utestengelse med 30 dagers frist: kontoen stenges og annonsene skjules straks, slettes etter 30 dager eller når en klage er avgjort.
alter table public.blocked_users add column if not exists user_id uuid;
alter table public.blocked_users add column if not exists delete_after timestamptz;
alter table public.blocked_users add column if not exists listing_ids uuid[];
