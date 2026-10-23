-- Betalinger for annonseløft beholdes i 5 år (bokføringsloven), også når annonsen slettes.
-- Annonsens tittel lagres på bestillingen, så kvitteringen gir mening etter at annonsen er borte.
alter table public.boost_orders add column if not exists listing_title text;
update public.boost_orders o set listing_title = l.title from public.listings l where l.id = o.listing_id and o.listing_title is null;
alter table public.boost_orders alter column listing_id drop not null;
alter table public.boost_orders drop constraint if exists boost_orders_listing_id_fkey;
alter table public.boost_orders add constraint boost_orders_listing_id_fkey
  foreign key (listing_id) references public.listings(id) on delete set null;

-- Telefonnummeret fra Vipps brukes ikke, så det hentes ikke lenger. Fjern det som er lagret.
update public.profiles set phone = null where phone is not null;
