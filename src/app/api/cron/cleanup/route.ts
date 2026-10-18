import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase-admin";

/**
 * Daglig opprydding (Vercel Cron, kl. 03:17 UTC). Sletter data vi ikke lenger trenger:
 * - meldinger, samtaler og henvendelser eldre enn 12 måneder
 * - avviste annonser (med bilder) eldre enn 30 dager
 * - rapporter som er ferdigbehandlet for over 12 måneder siden
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
  await del("contact_messages", db.from("contact_messages").delete({ count: "exact" }).lt("created_at", months(12)));
  await del("reports", db.from("reports").delete({ count: "exact" }).eq("handled", true).lt("created_at", months(12)));

  const { data: rejected } = await db.from("listings").select("slug").eq("status", "rejected").lt("updated_at", months(1));
  for (const l of rejected ?? []) {
    const { data: files } = await db.storage.from("listing-images").list(l.slug);
    if (files?.length) await db.storage.from("listing-images").remove(files.map((f) => `${l.slug}/${f.name}`));
  }
  await del("rejected_listings", db.from("listings").delete({ count: "exact" }).eq("status", "rejected").lt("updated_at", months(1)));

  return NextResponse.json({ ok: true, deleted: result });
}
