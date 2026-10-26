import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BOOSTS, boostDate, type BoostKey } from "./boosts";
import { addNotification } from "./notifications";
import { brandedEmail, isPlaceholderEmail, sendEmail } from "./email";
import { boostDate as fmt } from "./boosts";
import { COMPANY } from "./company";

const COMPANY_NAME = COMPANY.name;
const COMPANY_EMAIL = COMPANY.email;

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
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no";
    const plan = BOOSTS[order.plan as BoostKey];
    const amount = Number((await db.from("boost_orders").select("amount, invoice_no").eq("id", order.id).maybeSingle()).data?.amount ?? plan.price);
    const intro = `Takk for kjøpet. ${plan.name} på «${l?.title ?? "annonsen"}» aktiveres nå og varer til ${fmt(until)}.`;
    const details = `Dette kjøpte du: ${plan.name}, ${plan.days} dager, ${amount} kr uten merverdiavgift (${COMPANY_NAME} er ikke mva-registrert). Betalt med Vipps. Levering startet ${fmt(new Date().toISOString())}.`;
    const consent = "Ved bestillingen ba du om at løftet skulle starte med en gang, og bekreftet at angreretten går tapt når løftet er levert fullt ut, altså når perioden er over.";
    const withdrawal = `Angrerett: du har 14 dager fra kjøpet. Angrer du før perioden er over, betaler du for dagene som er brukt og får resten tilbake til samme betalingsmåte senest 14 dager etter at vi har fått beskjed. Du angrer med knappen «Angre kjøpet» på kvitteringen, med angreskjemaet (${site}/angreskjema) eller ved å skrive til ${COMPANY_EMAIL}.`;
    await sendEmail({
      to: u.user.email,
      subject: `Bekreftelse: ${plan.name}`,
      text: `${intro}\n\n${details}\n\n${consent}\n\n${withdrawal}\n\nKvittering: ${site}/kvittering/${order.id}\nSalgsvilkår: ${site}/salgsvilkar`,
      html: brandedEmail({
        title: "Bekreftelse på annonseløft",
        intro,
        quote: `${details}\n\n${consent}\n\n${withdrawal}`,
        button: "Se kvitteringen",
        url: `${site}/kvittering/${order.id}`,
        outro: `Salgsvilkårene finner du på ${site}/salgsvilkar. Ta vare på denne e-posten, den er bekreftelsen på avtalen.`,
      }),
    });
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
