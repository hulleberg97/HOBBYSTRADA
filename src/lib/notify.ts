import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { applyFilters, parseFilters } from "./filters";
import { fromRow } from "./listings";
import { brandedEmail, kr, sendEmail } from "./email";
import { addNotification } from "./notifications";
import { COMPANY } from "./company";
import { BOOSTS, type BoostKey } from "./boosts";
import { refusjon } from "./angrerett";

/** Sender e-post til alle med et lagret søk som passer en nylig publisert annonse. */
export async function notifySavedSearches(db: SupabaseClient, listingId: string) {
  const { data: row } = await db.from("listings").select("*").eq("id", listingId).maybeSingle();
  if (!row || row.status !== "active") return;
  const listing = fromRow(row);
  const { data: searches } = await db.from("saved_searches").select("id, user_id, email, query, label");
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  for (const s of searches ?? []) {
    if (s.user_id === listing.ownerId) continue;
    if (!applyFilters([listing], parseFilters(new URLSearchParams(s.query))).length) continue;
    const sent = await sendEmail({
      to: s.email,
      subject: `Nytt kort: ${listing.title}`,
      text: `Et nytt kort passer søket ditt «${s.label}»:\n\n${listing.title}\n${kr(listing.price)}\n${site}/annonse/${listing.slug}\n\nSe alle treff: ${site}/marked?${s.query}\n\nDu får denne e-posten fordi du har slått på varsler. Slå dem av på ${site}/account`,
      html: brandedEmail({
        title: "Nytt kort som passer søket ditt",
        intro: `Et nytt kort passer søket ditt «${s.label}».`,
        item: { title: listing.title, image: listing.image, price: listing.price, url: `${site}/annonse/${listing.slug}` },
        button: "Se kortet",
        url: `${site}/annonse/${listing.slug}`,
        outro: `Se alle treff på søket: ${site}/marked?${s.query}`,
        reason: "Du får denne e-posten fordi du har slått på varsler for et søk. Slå dem av under Min side.",
      }),
    });
    if (sent) await db.from("saved_searches").update({ last_sent_at: new Date().toISOString() }).eq("id", s.id);
    await addNotification(db, s.user_id, { kind: "saved_search", title: "Nytt kort som passer søket ditt", body: `${listing.title} · ${kr(listing.price)} · «${s.label}»`, href: `/annonse/${listing.slug}` });
  }
}

/**
 * Gir selgeren beskjed på nettsiden og på e-post når en ny annonse er godkjent eller avvist.
 * Ved avvisning må administrator oppgi hvilket vilkår som er brutt (rule) og en konkret begrunnelse (reason).
 */
export async function notifyReview(db: SupabaseClient, listing: { slug: string; title: string; owner_id: string | null }, approved: boolean, rule = "", reason = "") {
  if (!listing.owner_id) return;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const url = `${site}/annonse/${listing.slug}`;
  const title = approved ? "Annonsen din er publisert" : "Annonsen din ble ikke godkjent";
  const body = approved ? `«${listing.title}» er godkjent og ligger nå i markedet.` : `«${listing.title}» ble ikke publisert fordi den bryter vilkårene: ${rule}.`;
  await addNotification(db, listing.owner_id, { kind: approved ? "approved" : "rejected", title, body, href: approved ? `/annonse/${listing.slug}` : "/selg" });
  const { data } = await db.auth.admin.getUserById(listing.owner_id);
  const to = data.user?.email;
  if (!to) return;
  if (approved) {
    await sendEmail({
      to,
      subject: `Publisert: ${listing.title}`,
      text: `${title}\n\n${body}\n\n${url}`,
      html: brandedEmail({ title, intro: body, item: { title: listing.title, url }, button: "Se annonsen", url, outro: "Du får beskjed når noen sender deg en melding om kortet." }),
    });
    return;
  }
  const begrunnelse = `Begrunnelse: ${reason}.`;
  const rest = [
    "Du kan legge ut kortet på nytt når opplysningene er rettet.",
    `Mener du at avgjørelsen er feil, kan du klage innen 30 dager ved å svare på denne e-posten eller skrive til ${COMPANY.email}. Vi svarer innen én måned. Får du medhold, publiserer vi annonsen.`,
    "Avgjørelsen er tatt av et menneske.",
  ];
  await sendEmail({
    to,
    subject: `Ikke godkjent: ${listing.title}`,
    text: `${title}\n\n${body}\n\n${begrunnelse}\n\n${rest.join("\n\n")}\n\nLegg ut kort: ${site}/selg`,
    html: brandedEmail({ title, intro: body, quote: begrunnelse, button: "Legg ut kort", url: `${site}/selg`, outro: rest.join("\n\n") }),
    replyTo: COMPANY.email,
  });
}

/**
 * E-post når administrator skjuler eller sletter en publisert annonse (E4 i Låvlis instruks).
 * rule og reason er obligatoriske. warning legger til advarselssetningen. Hadde annonsen aktivt løft, sier e-posten
 * om løftet refunderes (beløp regnet i hele timer fra fjerningstidspunktet) eller ikke.
 */
export async function notifyRemoved(
  db: SupabaseClient,
  listing: { id: string; slug: string; title: string; owner_id: string | null },
  input: { rule: string; reason: string; warning?: boolean; refundBoost?: boolean | null },
) {
  if (!listing.owner_id) return;
  const { data } = await db.auth.admin.getUserById(listing.owner_id);
  const to = data.user?.email;
  // Aktivt løft på annonsen? Siste betalte bestilling, hvis løftet fortsatt varer
  const { data: row } = await db.from("listings").select("bumped_until, featured_until, frontpage_until").eq("id", listing.id).maybeSingle();
  const now = Date.now();
  const live = [row?.bumped_until, row?.featured_until, row?.frontpage_until].some((d) => d && new Date(d as string).getTime() > now);
  let refundLine = "";
  let refund = 0;
  if (live) {
    const { data: order } = await db
      .from("boost_orders")
      .select("id, plan, amount, paid_at, invoice_no")
      .eq("listing_id", listing.id)
      .eq("status", "paid")
      .order("paid_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (order) {
      const plan = BOOSTS[order.plan as BoostKey];
      refund = refusjon(Number(order.amount), plan.days, order.paid_at as string, now).refund;
      refundLine = input.refundBoost
        ? `Annonsen hadde aktivt annonseløft. Du får tilbake ${refund} kr for den delen av perioden som ikke er brukt.`
        : "Annonsen hadde aktivt annonseløft. Løftet refunderes ikke, fordi bruddet er alvorlig eller gjentatt.";
      const admin = process.env.ADMIN_EMAIL;
      if (input.refundBoost && admin) {
        await sendEmail({
          to: admin,
          subject: `Fjernet annonse: refunder ${refund} kr (nr. ${order.invoice_no ?? "–"})`,
          text: `«${listing.title}» er fjernet med refusjon av løftet. Refunder ${refund} kr i Vipps-portalen innen 14 dager.`,
        });
      }
    }
    // Løftet stoppes når annonsen fjernes
    await db.from("listings").update({ bumped_until: null, featured_until: null, frontpage_until: null, fan_slot: null }).eq("id", listing.id);
  }
  await addNotification(db, listing.owner_id, { kind: "rejected", title: "Annonsen din er fjernet", body: `«${listing.title}» er fjernet fra markedet fordi den bryter vilkårene: ${input.rule}.`, href: "/account" });
  if (!to) return;
  await sendEmail({ to, ...removedEmail(listing.title, input, refundLine), replyTo: COMPANY.email });
}

/** E-posten «Fjernet: [tittel]» til selgeren. Egen funksjon, så den kan vises frem uten å sendes. */
export function removedEmail(listingTitle: string, input: { rule: string; reason: string; warning?: boolean }, refundLine = "") {
  const title = "Annonsen din er fjernet";
  const intro = `Vi har fjernet «${listingTitle}» fra markedet fordi den bryter vilkårene: ${input.rule}.`;
  const begrunnelse = `Begrunnelse: ${input.reason}.`;
  const rest = [
    ...(input.warning ? ["Dette er en advarsel. Gjentatte brudd kan føre til at kontoen stenges."] : []),
    ...(refundLine ? [refundLine] : []),
    `Mener du at dette er feil, kan du klage innen 30 dager ved å svare på denne e-posten eller skrive til ${COMPANY.email}. Vi svarer innen én måned. Får du medhold, legger vi ut annonsen igjen.`,
    "Avgjørelsen er tatt av et menneske.",
  ];
  return {
    subject: `Fjernet: ${listingTitle}`,
    text: `${title}\n\n${intro}\n\n${begrunnelse}\n\n${rest.join("\n\n")}`,
    html: brandedEmail({ title, intro, quote: begrunnelse, outro: rest.join("\n\n"), reason: "Du får denne e-posten fordi en annonse du har lagt ut på HOBBYSTRADA, er fjernet." }),
  };
}
