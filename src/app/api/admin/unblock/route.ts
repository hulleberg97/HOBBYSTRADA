import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";

/** Admin: opphever en utestengelse etter klage. Kontoen åpnes, annonsene legges ut igjen, og sperrelisten ryddes. */
export async function POST(req: Request) {
  const db = adminClient();
  if (!db || !isAdmin(await getUser())) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  const { vippsSub } = (await req.json().catch(() => ({}))) as { vippsSub?: string };
  if (!vippsSub) return NextResponse.json({ error: "Mangler id." }, { status: 400 });
  const { data: row } = await db.from("blocked_users").select("user_id, listing_ids").eq("vipps_sub", vippsSub).maybeSingle();
  if (!row) return NextResponse.json({ error: "Fant ikke utestengelsen." }, { status: 404 });
  if (row.user_id) {
    await db.auth.admin.updateUserById(row.user_id as string, { ban_duration: "none" });
    const ids = (row.listing_ids as string[] | null) ?? [];
    if (ids.length) await db.from("listings").update({ status: "active" }).in("id", ids).eq("status", "hidden");
  }
  await db.from("blocked_users").delete().eq("vipps_sub", vippsSub);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
