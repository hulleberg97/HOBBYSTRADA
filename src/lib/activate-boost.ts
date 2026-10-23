import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BOOSTS, type BoostKey } from "./boosts";

/** Aktiverer en betalt bestilling: setter løftet på annonsen og markerer bestillingen som betalt. */
export async function activateBoost(db: SupabaseClient, orderId: string) {
  const { data: order } = await db.from("boost_orders").select("id, listing_id, plan, status").eq("id", orderId).maybeSingle();
  if (!order || order.status === "paid") return;
  const days = BOOSTS[order.plan as BoostKey].days;
  const until = new Date(Date.now() + days * 864e5).toISOString();
  const patch: Record<string, string> = { bumped_until: until };
  if (order.plan !== "top") patch.featured_until = until;
  if (order.plan === "frontpage") patch.frontpage_until = until;
  if (order.listing_id) await db.from("listings").update(patch).eq("id", order.listing_id);
  await db.from("boost_orders").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", order.id);
}
