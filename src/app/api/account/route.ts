import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import { serverClient } from "@/lib/supabase";
import { adminClient } from "@/lib/supabase-admin";

/** Sletter kontoen og alt som hører til den: annonser, bilder, varsler og meldinger til brukeren. */
export async function DELETE() {
  const db = adminClient();
  const user = await getUser();
  if (!db || !user) return NextResponse.json({ error: "Du må være logget inn." }, { status: 401 });

  const { data: listings } = await db.from("listings").select("id, slug").eq("owner_id", user.id);
  for (const l of listings ?? []) {
    const { data: files } = await db.storage.from("listing-images").list(l.slug);
    if (files?.length) await db.storage.from("listing-images").remove(files.map((f) => `${l.slug}/${f.name}`));
  }
  // Annonsene slettes eksplisitt, ellers ville de bli stående uten eier.
  const { error: listingError } = await db.from("listings").delete().eq("owner_id", user.id);
  if (listingError) return NextResponse.json({ error: "Kunne ikke slette annonsene. Prøv igjen." }, { status: 500 });
  await db.from("boost_orders").update({ buyer_email: null }).eq("user_id", user.id);

  // I samtaler vises brukeren som «Slettet bruker». Lagrede søk slettes automatisk sammen med kontoen.
  await db.from("conversations").update({ buyer_name: "Slettet bruker" }).eq("buyer_id", user.id);
  await db.from("conversations").update({ seller_name: "Slettet bruker" }).eq("seller_id", user.id);
  const { error } = await db.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: "Kunne ikke slette kontoen. Prøv igjen." }, { status: 500 });

  await (await serverClient())?.auth.signOut();
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
