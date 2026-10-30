-- Visninger per annonse: et tall, ingen personopplysninger. Telles når annonsesiden åpnes av andre enn selgeren.
alter table public.listings add column if not exists views integer not null default 0;
grant select (views) on public.listings to anon, authenticated;

create or replace function public.increment_views(p_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.listings set views = views + 1 where slug = p_slug and status = 'active';
$$;
revoke all on function public.increment_views(text) from public;
grant execute on function public.increment_views(text) to service_role;
