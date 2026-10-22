import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase-admin";
import { settlePending } from "@/lib/settle-boost";

/**
 * Daglig opprydding (Vercel Cron, kl. 03:17 UTC). Sletter data vi ikke lenger trenger:
 * - meldinger, samtaler og henvendelser eldre enn 12 måneder
 * - avviste annonser (med bilder) eldre enn 30 dager
 * - rapporter som er ferdigbehandlet for over 12 måneder siden
 * - bilder som ikke lenger hører til en samtale eller annonse
 */
const months = (n: number) => new Date(Date.now() - n * 30 * 864e5).toISOString();

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Ingen tilgang" }, { status: 401 });
  const db = adminClient();
  if (!db) return NextResponse.json({ error: "Ikke satt opp" }, { status: 503 });

  const result: Record<string, number | string> = {};
  const del = async (name: string, q: PromiseLike<{ count: number | null; error: { message: string } | null }>) => {
    const { count, error } = await q;
    result[name] = error ? `feil: ${error.message}` : (count ?? 0);
  };

  await del("messages", db.from("messages").delete({ count: "exact" }).lt("created_at", months(12)));
  await del("conversations", db.from("conversations").delete({ count: "exact" }).lt("last_message_at", months(12)));
  await del(
    "rate_events",
    db
      .from("rate_events")
      .delete({ count: "exact" })
      .lt("created_at", new Date(Date.now() - 864e5).toISOString()),
  );
  await del("contact_messages", db.from("contact_messages").delete({ count: "exact" }).lt("created_at", months(12)));
  await del("reports", db.from("reports").delete({ count: "exact" }).eq("handled", true).lt("created_at", months(12)));

  const { data: rejected } = await db.from("listings").select("slug").eq("status", "rejected").lt("updated_at", months(1));
  for (const l of rejected ?? []) {
    const { data: files } = await db.storage.from("listing-images").list(l.slug);
    if (files?.length) await db.storage.from("listing-images").remove(files.map((f) => `${l.slug}/${f.name}`));
  }
  await del("rejected_listings", db.from("listings").delete({ count: "exact" }).eq("status", "rejected").lt("updated_at", months(1)));

  // Bilder som ikke lenger hører til en samtale eller en annonse (f.eks. etter sletting)
  const { data: convs } = await db.from("conversations").select("id");
  const liveConvs = new Set((convs ?? []).map((c) => c.id as string));
  result.chat_images = await removeOrphans(db, "chat-images", (folder) => liveConvs.has(folder));
  const { data: rows } = await db.from("listings").select("slug, images");
  const marker = "/object/public/listing-images/";
  const usedFolders = new Set<string>();
  for (const r of rows ?? []) {
    usedFolders.add(r.slug);
    for (const u of (r.images ?? []) as string[]) if (u.includes(marker)) usedFolders.add(decodeURIComponent(u.split(marker)[1].split("/")[0]));
  }
  result.listing_images = await removeOrphans(db, "listing-images", (folder) => usedFolders.has(folder));

  // Betalte annonseløft som ikke ble fanget opp underveis
  const activated = await settlePending(db).catch(() => 0);
  return NextResponse.json({ ok: true, deleted: result, activated });
}

/** Sletter alle filer i mapper som ikke er i bruk. Mappenavnet er samtale-id eller annonse-slug. */
async function removeOrphans(db: NonNullable<ReturnType<typeof adminClient>>, bucket: string, inUse: (folder: string) => boolean) {
  const { data: folders } = await db.storage.from(bucket).list("", { limit: 1000 });
  let removed = 0;
  for (const f of folders ?? []) {
    if (f.id || inUse(f.name)) continue; // f.id er satt for filer, ikke mapper
    const { data: files } = await db.storage.from(bucket).list(f.name, { limit: 1000 });
    if (!files?.length) continue;
    await db.storage.from(bucket).remove(files.map((x) => `${f.name}/${x.name}`));
    removed += files.length;
  }
  return removed;
}
