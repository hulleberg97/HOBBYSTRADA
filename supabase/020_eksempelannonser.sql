-- Eksempelannonser: kolonnen owner_listing betyr nå «eksempelannonse fra HOBBYSTRADA, ikke til salgs».
-- Alle annonser fra HOBBYSTRADA-kontoen merkes.
update public.listings set owner_listing = true where owner_id = 'd96e3aa7-0c90-48a7-a985-ff2fc0ec36b5';

-- Samtaler og bud som allerede finnes på eksempelannonser (til gjennomsyn, ikke sletting):
select c.id as samtale, c.listing_slug as annonse, c.listing_title as tittel, c.buyer_name as kjoper, c.accepted_offer as godtatt_bud, c.last_message_at as sist
from public.conversations c
join public.listings l on l.slug = c.listing_slug
where l.owner_listing = true
order by c.last_message_at desc;
