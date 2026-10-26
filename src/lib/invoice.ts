import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BOOSTS, type BoostKey } from "./boosts";

/** Et salgsdokument for et betalt annonseløft (bokføringsforskriften § 5-1-1). */
export type Invoice = {
  id: string;
  no: number | null;
  paidAt: string;
  buyerName: string;
  buyerEmail: string | null;
  userId: string | null;
  plan: string;
  days: number;
  listingTitle: string;
  amount: number;
};

const toInvoice = (o: Record<string, unknown>): Invoice => {
  const plan = BOOSTS[o.plan as BoostKey];
  const l = o.listings as { title: string } | null;
  return {
    id: o.id as string,
    no: (o.invoice_no as number | null) ?? null,
    paidAt: (o.paid_at as string) ?? (o.created_at as string),
    buyerName: (o.buyer_name as string) || "Kunde",
    buyerEmail: (o.buyer_email as string) || null,
    userId: (o.user_id as string) ?? null,
    plan: plan?.name ?? String(o.plan),
    days: plan?.days ?? 0,
    listingTitle: l?.title ?? (o.listing_title as string) ?? "Slettet annonse",
    amount: Number(o.amount),
  };
};

const COLS = "id, invoice_no, paid_at, created_at, buyer_name, buyer_email, user_id, plan, amount, listing_title, listings(title)";

export async function getInvoice(db: SupabaseClient, id: string) {
  const { data } = await db.from("boost_orders").select(COLS).eq("id", id).eq("status", "paid").maybeSingle();
  return data ? toInvoice(data as Record<string, unknown>) : null;
}

/** Alle betalte bestillinger i et tidsrom, eldste først. Til salgsrapporten. */
export async function listInvoices(db: SupabaseClient, from?: string, to?: string) {
  let q = db.from("boost_orders").select(COLS).eq("status", "paid").order("paid_at", { ascending: true });
  if (from) q = q.gte("paid_at", from);
  if (to) q = q.lt("paid_at", to);
  const { data } = await q;
  return ((data ?? []) as Record<string, unknown>[]).map(toInvoice);
}

export const invoiceDate = (d: string) => new Date(d).toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Oslo" });
