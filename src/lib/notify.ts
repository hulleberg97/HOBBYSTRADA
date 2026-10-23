import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { applyFilters, parseFilters } from "./filters";
import { fromRow } from "./listings";
import { brandedEmail, kr, sendEmail } from "./email";
import { addNotification } from "./notifications";

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
      text: `Et nytt kort passer søket ditt «${s.label}»:\n\n${listing.title}\n${kr(listing.price)}\n${site}/products/${listing.slug}\n\nSe alle treff: ${site}/products?${s.query}\n\nDu får denne e-posten fordi du har slått på varsler. Slå dem av på ${site}/account`,
      html: brandedEmail({
        title: "Nytt kort som passer søket ditt",
        intro: `Et nytt kort passer søket ditt «${s.label}».`,
        item: { title: listing.title, image: listing.image, price: listing.price, url: `${site}/products/${listing.slug}` },
        button: "Se kortet",
        url: `${site}/products/${listing.slug}`,
        outro: `Se alle treff på søket: ${site}/products?${s.query}`,
        reason: "Du får denne e-posten fordi du har slått på varsler for et søk. Slå dem av under Min side.",
      }),
    });
    if (sent) await db.from("saved_searches").update({ last_sent_at: new Date().toISOString() }).eq("id", s.id);
    await addNotification(db, s.user_id, { kind: "saved_search", title: "Nytt kort som passer søket ditt", body: `${listing.title} · ${kr(listing.price)} · «${s.label}»`, href: `/products/${listing.slug}` });
  }
}

/** Gir selgeren beskjed på nettsiden og på e-post når en ny annonse er godkjent eller avvist. */
export async function notifyReview(db: SupabaseClient, listing: { slug: string; title: string; owner_id: string | null }, approved: boolean, reason: string) {
  if (!listing.owner_id) return;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const url = `${site}/products/${listing.slug}`;
  const title = approved ? "Annonsen din er publisert" : "Annonsen din ble ikke godkjent";
  const body = approved
    ? `«${listing.title}» er godkjent og ligger nå i markedet.`
    : `«${listing.title}» ble ikke publisert.${reason ? ` Grunn: ${reason}.` : ""} Du kan legge ut kortet på nytt med riktige opplysninger.`;
  await addNotification(db, listing.owner_id, { kind: approved ? "approved" : "rejected", title, body, href: approved ? `/products/${listing.slug}` : "/sell" });
  const { data } = await db.auth.admin.getUserById(listing.owner_id);
  const to = data.user?.email;
  if (!to) return;
  await sendEmail({
    to,
    subject: approved ? `Publisert: ${listing.title}` : `Ikke godkjent: ${listing.title}`,
    text: `${title}\n\n${body}\n\n${approved ? url : `${site}/sell`}`,
    html: brandedEmail({
      title,
      intro: body,
      ...(approved ? { item: { title: listing.title, url } } : {}),
      button: approved ? "Se annonsen" : "Legg ut kort",
      url: approved ? url : `${site}/sell`,
      outro: approved ? "Du får beskjed når noen sender deg en melding om kortet." : "Lurer du på noe, kan du kontakte oss via kontaktskjemaet på nettsiden.",
    }),
  });
}
