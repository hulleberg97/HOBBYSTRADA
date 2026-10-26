import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import { deleteAccount } from "@/lib/account";
import { serverClient } from "@/lib/supabase";
import { adminClient } from "@/lib/supabase-admin";

/** Sletter kontoen og alt som hører til den: annonser, bilder, varsler og meldinger til brukeren. */
export async function DELETE() {
  const db = adminClient();
  const user = await getUser();
  if (!db || !user) return NextResponse.json({ error: "Du må være logget inn." }, { status: 401 });
  const failed = await deleteAccount(db, user.id);
  if (failed) return NextResponse.json({ error: `${failed} Prøv igjen.` }, { status: 500 });
  await (await serverClient())?.auth.signOut();
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
