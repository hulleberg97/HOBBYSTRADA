import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BOOSTS, boostDate, type BoostKey } from "./boosts";
import { addNotification } from "./notifications";
import { isPlaceholderEmail, sendEmail } from "./email";
import { boostReceipt } from "./boost-mail";

/**
 * Aktiverer en betalt bestilling. Rekkefølge: bestillingen merkes betalt (salgsdokumentet får nummer),
 * kvitteringen sendes på e-post, og først da settes løftet på annonsen (angrerettloven § 18).
 */
export async function activateBoost(db: SupabaseClient, orderId: string) {
  const { data: order } = await db.from("boost_orders").select("id, listing_id, user_id, plan, status, amount").eq("id", orderId).maybeSingle();
  if (!order || order.status === "paid") return;
  const plan = order.plan as BoostKey;
  const days = BOOSTS[plan].days;
  const paidAt = new Date().toISOString();
  const until = new Date(Date.now() + days * 864e5).toISOString();
  const { data: l } = order.listing_id ? await db.from("listings").select("slug, title").eq("id", order.listing_id).maybeSingle() : { data: null };

  // Betinget oppdatering: betalingssiden, Min side og cron kan kalle dette samtidig, men bare én får merke bestillingen betalt
  const { data: paid } = await db.from("boost_orders").update({ status: "paid", paid_at: paidAt }).eq("id", order.id).neq("status", "paid").select("invoice_no").maybeSingle();
  if (!paid) return;

  const { data: u } = order.user_id ? await db.auth.admin.getUserById(order.user_id) : { data: { user: null } };
  if (u.user?.email && !isPlaceholderEmail(u.user.email)) {
    const amount = Number(order.amount ?? BOOSTS[plan].price);
    const title = l?.title ?? "annonsen";
    await sendEmail({ to: u.user.email, ...(await boostReceipt({ plan, title, amount, orderId: order.id, invoiceNo: paid?.invoice_no ?? null, paidAt, until })) });
  }

  const patch: Record<string, string> = { bumped_until: until };
  if (plan !== "top") patch.featured_until = until;
  if (plan === "frontpage") patch.frontpage_until = until;
  if (order.listing_id) await db.from("listings").update(patch).eq("id", order.listing_id);
  await addNotification(db, order.user_id, {
    kind: "boost",
    title: "Hurra! Annonsen din er løftet!",
    body: `${BOOSTS[plan].name} på «${l?.title ?? "annonsen"}» varer til ${boostDate(until)}.`,
    href: l ? `/annonse/${l.slug}` : "/account",
  });
}
