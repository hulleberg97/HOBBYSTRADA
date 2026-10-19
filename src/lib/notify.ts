import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { applyFilters, parseFilters } from "./filters";
import { fromRow } from "./listings";
import { brandedEmail, kr, sendEmail } from "./email";

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
  }
}
