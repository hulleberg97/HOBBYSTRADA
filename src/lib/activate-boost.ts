import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BOOSTS, boostDate, type BoostKey } from "./boosts";
import { addNotification } from "./notifications";
import { isPlaceholderEmail, sendEmail } from "./email";
import { boostConfirmation } from "./boost-mail";

/** Aktiverer en betalt bestilling: setter løftet på annonsen og markerer bestillingen som betalt. */
export async function activateBoost(db: SupabaseClient, orderId: string) {
  const { data: order } = await db.from("boost_orders").select("id, listing_id, user_id, plan, status").eq("id", orderId).maybeSingle();
  if (!order || order.status === "paid") return;
  const days = BOOSTS[order.plan as BoostKey].days;
  const until = new Date(Date.now() + days * 864e5).toISOString();
  const { data: l } = order.listing_id ? await db.from("listings").select("slug, title").eq("id", order.listing_id).maybeSingle() : { data: null };
  const patch: Record<string, string> = { bumped_until: until };
  if (order.plan !== "top") patch.featured_until = until;
  if (order.plan === "frontpage") patch.frontpage_until = until;
  // Bekreftelse på e-post sendes før løftet aktiveres (angrerettloven § 18, ehandelsloven § 12)
  const { data: u } = order.user_id ? await db.auth.admin.getUserById(order.user_id) : { data: { user: null } };
  if (u.user?.email && !isPlaceholderEmail(u.user.email)) {
    const amount = Number((await db.from("boost_orders").select("amount").eq("id", order.id).maybeSingle()).data?.amount ?? BOOSTS[order.plan as BoostKey].price);
    await sendEmail({ to: u.user.email, ...boostConfirmation({ plan: order.plan as BoostKey, title: l?.title ?? "annonsen", amount, orderId: order.id, until }) });
  }
  if (order.listing_id) await db.from("listings").update(patch).eq("id", order.listing_id);
  await db.from("boost_orders").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", order.id);
  await addNotification(db, order.user_id, {
    kind: "boost",
    title: "Hurra! Annonsen din er løftet!",
    body: `${BOOSTS[order.plan as BoostKey].name} på «${l?.title ?? "annonsen"}» varer til ${boostDate(until)}.`,
    href: l ? `/products/${l.slug}` : "/account",
  });
}
