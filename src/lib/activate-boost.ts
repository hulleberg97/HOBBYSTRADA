import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BOOSTS, boostDate, type BoostKey } from "./boosts";
import { addNotification } from "./notifications";
import { brandedEmail, isPlaceholderEmail, sendEmail } from "./email";
import { boostDate as fmt } from "./boosts";

/** Aktiverer en betalt bestilling: setter løftet på annonsen og markerer bestillingen som betalt. */
export async function activateBoost(db: SupabaseClient, orderId: string) {
  const { data: order } = await db.from("boost_orders").select("id, listing_id, user_id, plan, status").eq("id", orderId).maybeSingle();
  if (!order || order.status === "paid") return;
  const days = BOOSTS[order.plan as BoostKey].days;
  const until = new Date(Date.now() + days * 864e5).toISOString();
  const patch: Record<string, string> = { bumped_until: until };
  if (order.plan !== "top") patch.featured_until = until;
  if (order.plan === "frontpage") patch.frontpage_until = until;
  if (order.listing_id) await db.from("listings").update(patch).eq("id", order.listing_id);
  await db.from("boost_orders").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", order.id);
  const { data: l } = order.listing_id ? await db.from("listings").select("slug, title").eq("id", order.listing_id).maybeSingle() : { data: null };
  // Bekreftelse på e-post med lenke til kvitteringen (ehandelsloven § 12)
  const { data: u } = order.user_id ? await db.auth.admin.getUserById(order.user_id) : { data: { user: null } };
  if (u.user?.email && !isPlaceholderEmail(u.user.email)) {
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no";
    const plan = BOOSTS[order.plan as BoostKey];
    const intro = `Takk for kjøpet. ${plan.name} på «${l?.title ?? "annonsen"}» er aktivert og varer til ${fmt(until)}.`;
    await sendEmail({
      to: u.user.email,
      subject: `Bekreftelse: ${plan.name}`,
      text: `${intro}\n\nKvittering: ${site}/kvittering/${order.id}\n\nLøftet startet etter ditt ønske, og angreretten opphørte da det ble aktivert. Vilkår: ${site}/salgsvilkar`,
      html: brandedEmail({
        title: "Bekreftelse på annonseløft",
        intro,
        button: "Se kvitteringen",
        url: `${site}/kvittering/${order.id}`,
        outro: `Løftet startet etter ditt ønske, og angreretten opphørte da det ble aktivert. Vilkår: ${site}/salgsvilkar`,
      }),
    });
  }
  await addNotification(db, order.user_id, {
    kind: "boost",
    title: "Hurra! Annonsen din er løftet!",
    body: `${BOOSTS[order.plan as BoostKey].name} på «${l?.title ?? "annonsen"}» varer til ${boostDate(until)}.`,
    href: l ? `/products/${l.slug}` : "/account",
  });
}
