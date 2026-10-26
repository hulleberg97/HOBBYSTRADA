-- Salgsdokument for annonseløft: fortløpende nummer settes automatisk når bestillingen blir betalt.
create sequence if not exists public.boost_invoice_seq start 1001;
alter table public.boost_orders add column if not exists invoice_no integer unique;
create or replace function public.assign_invoice_no() returns trigger language plpgsql as $$
begin
  if new.status = 'paid' and new.invoice_no is null then
    new.invoice_no := nextval('public.boost_invoice_seq');
  end if;
  return new;
end $$;
drop trigger if exists boost_orders_invoice on public.boost_orders;
create trigger boost_orders_invoice before insert or update on public.boost_orders
  for each row execute function public.assign_invoice_no();
-- Bestillinger som allerede er betalt får nummer nå
update public.boost_orders set status = status where status = 'paid' and invoice_no is null;
