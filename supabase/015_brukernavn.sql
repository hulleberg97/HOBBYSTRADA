-- Brukernavn som brukeren velger selv på Min side. Vises på annonsene. Unikt uten hensyn til store/små bokstaver.
alter table public.profiles add column if not exists username text;
create unique index if not exists profiles_username_lower on public.profiles (lower(username));
