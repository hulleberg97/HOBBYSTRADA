import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Sletter en konto og alt som hører til den: annonser, bilder, varsler og lagrede søk.
 * Betalinger beholdes i 5 år (bokføringsloven), men e-postadressen fjernes. I samtaler vises brukeren som «Slettet bruker».
 * Brukes når brukeren sletter selv, når en konto stenges ute, og når en inaktiv konto slettes.
 */
export async function deleteAccount(db: SupabaseClient, userId: string): Promise<string | null> {
  const { data: listings } = await db.from("listings").select("id, slug").eq("owner_id", userId);
  for (const l of listings ?? []) {
    const { data: files } = await db.storage.from("listing-images").list(l.slug);
    if (files?.length) await db.storage.from("listing-images").remove(files.map((f) => `${l.slug}/${f.name}`));
  }
  // Annonsene slettes eksplisitt, ellers ville de bli stående uten eier.
  const { error: listingError } = await db.from("listings").delete().eq("owner_id", userId);
  if (listingError) return "Kunne ikke slette annonsene.";
  await db.from("boost_orders").update({ buyer_email: null }).eq("user_id", userId);
  await db.from("conversations").update({ buyer_name: "Slettet bruker" }).eq("buyer_id", userId);
  await db.from("conversations").update({ seller_name: "Slettet bruker" }).eq("seller_id", userId);
  const { error } = await db.auth.admin.deleteUser(userId);
  return error ? "Kunne ikke slette kontoen." : null;
}

/** Vilkårene en bruker kan stenges ute for. Lagres som regelbrudd, ikke som «svindel» (opplysninger om lovbrudd har egne regler). */
export const BLOCK_RULES = [
  "Falske eller villedende annonser",
  "Trakassering eller upassende meldinger",
  "Spam eller reklame",
  "Handel utenom det vilkårene tillater",
  "Flere kontoer eller misbruk av kontoen",
] as const;

/** Inaktive kontoer: varsel etter 23 måneder uten innlogging, sletting etter 24. */
export const INACTIVE_WARN_DAYS = 23 * 30;
export const INACTIVE_DELETE_DAYS = 24 * 30;
