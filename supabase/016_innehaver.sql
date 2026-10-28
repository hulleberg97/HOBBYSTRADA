-- Annonser fra innehaveren av HOBBYSTRADA merkes, og kan verken løftes eller festes i kortraden.
alter table public.listings add column if not exists owner_listing boolean not null default false;
grant select (owner_listing) on public.listings to anon, authenticated;
-- Selgerens erklæring på /sell: «Jeg selger som privatperson, ikke som ledd i næringsvirksomhet.»
alter table public.listings add column if not exists private_seller_at timestamptz;
-- Tidspunkt for hver av de to bekreftelsene i kassen for annonseløft (angrerettloven §§ 19 og 22 c).
alter table public.boost_orders add column if not exists consent_start_at timestamptz;
alter table public.boost_orders add column if not exists consent_loss_at timestamptz;

-- Innehaverens annonser: kontoen som eier Haaland-annonsen, og kontoer med innehaverens e-post.
update public.listings set owner_listing = true
where owner_id in (
  select owner_id from public.listings where slug like 'erling-braut-haaland-topps-museum-ucc-ma%' and owner_id is not null
  union
  select id from auth.users where lower(email) in ('hulleberg97@gmail.com', 'post@hobbystrada.no')
);

-- Innehaverens annonser løsnes fra kortraden og mister alle løft (inkl. Toppannonsen på Haaland-annonsen).
update public.listings set fan_slot = null, frontpage_until = null, featured_until = null, bumped_until = null
where owner_listing or slug like 'erling-braut-haaland-topps-museum-ucc-ma%';
