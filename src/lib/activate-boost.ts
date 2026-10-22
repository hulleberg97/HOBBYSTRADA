import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BOOSTS, BOOST_EFFECT, boostDate, type BoostKey } from "./boosts";
import { brandedEmail, sendEmail } from "./email";
import { fromRow } from "./listings";

/**
 * Aktiverer en betalt bestilling: setter løftet på annonsen, markerer bestillingen som betalt
 * og sender kunden en bekreftelse på e-post.
 */
export async function activateBoost(db: SupabaseClient, orderId: string) {
  const { data: order } = await db.from("boost_orders").select("id, listing_id, plan, status, buyer_email").eq("id", orderId).maybeSingle();
  if (!order || order.status === "paid") return;
  const plan = order.plan as BoostKey;
  const until = new Date(Date.now() + BOOSTS[plan].days * 864e5).toISOString();
  const patch: Record<string, string> = { bumped_until: until };
  if (plan !== "top") patch.featured_until = until;
  if (plan === "frontpage") patch.frontpage_until = until;
  await db.from("listings").update(patch).eq("id", order.listing_id);
  await db.from("boost_orders").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", order.id);

  // Bekreftelse på e-post, så kunden får beskjed også når løftet ble aktivert etter at vinduet ble lukket
  const { data: row } = await db.from("listings").select("*").eq("id", order.listing_id).maybeSingle();
  if (!row || !order.buyer_email) return;
  const l = fromRow(row);
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no";
  const url = `${site}/products/${l.slug}`;
  const intro = `${BOOSTS[plan].name} er aktivert og varer til ${boostDate(until)}. ${BOOST_EFFECT[plan]}`;
  await sendEmail({
    to: order.buyer_email,
    subject: "Hurra! Annonsen din er løftet",
    text: `Hurra! Annonsen din er løftet!\n\n${intro}\n\n${l.title}\n${url}\n\nBetalingen finner du i Vipps-appen.`,
    html: brandedEmail({
      title: "Hurra! Annonsen din er løftet!",
      intro,
      item: { title: l.title, image: l.image, price: l.price, url },
      button: "Se annonsen",
      url,
      outro: "Betalingen finner du i Vipps-appen.",
    }),
  }).catch((e) => console.error(e));
}
