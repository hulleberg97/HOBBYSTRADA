import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { deleteAccount } from "@/lib/account";
import { adminClient } from "@/lib/supabase-admin";

type Db = NonNullable<ReturnType<typeof adminClient>>;

/** Sletter alle rader i en tabell og returnerer antallet. */
async function wipe(db: Db, table: string) {
  const { count } = await db.from(table).select("*", { count: "exact", head: true });
  const { error } = await db.from(table).delete().not("id", "is", null);
  if (error) throw new Error(`${table}: ${error.message}`);
  return count ?? 0;
}

/** Sletter alle filer i mappene som ikke er i bruk. Mappenavnet er samtale-id eller annonse-slug. */
async function sweep(db: Db, bucket: string, inUse: (folder: string) => boolean) {
  const { data: folders } = await db.storage.from(bucket).list("", { limit: 1000 });
  let removed = 0;
  for (const f of folders ?? []) {
    if (f.id || inUse(f.name)) continue;
    const { data: files } = await db.storage.from(bucket).list(f.name, { limit: 1000 });
    if (!files?.length) continue;
    await db.storage.from(bucket).remove(files.map((x) => `${f.name}/${x.name}`));
    removed += files.length;
  }
  return removed;
}

/**
 * Admin, før lansering: sletter testdata (what = "data") eller en konto (what = "konto", id).
 * Aktive annonser og kontoer beholdes. Admin kan ikke slette seg selv.
 */
export async function POST(req: Request) {
  const db = adminClient();
  const user = await getUser();
  if (!db || !isAdmin(user)) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  const body = (await req.json().catch(() => ({}))) as { what?: string; id?: string };

  if (body.what === "konto") {
    if (!body.id || body.id === user!.id) return NextResponse.json({ error: "Kan ikke slette denne kontoen." }, { status: 400 });
    const err = await deleteAccount(db, body.id);
    return err ? NextResponse.json({ error: err }, { status: 500 }) : NextResponse.json({ ok: true });
  }

  if (body.what !== "data") return NextResponse.json({ error: "Ukjent handling." }, { status: 400 });
  try {
    const deleted: Record<string, number> = {};
    // Annonser som ikke er aktive, med bildene sine
    const { data: old } = await db.from("listings").select("id, slug").neq("status", "active");
    for (const l of old ?? []) {
      const { data: files } = await db.storage.from("listing-images").list(l.slug);
      if (files?.length) await db.storage.from("listing-images").remove(files.map((f) => `${l.slug}/${f.name}`));
    }
    if (old?.length) await db.from("listings").delete().neq("status", "active");
    deleted["annonser (ikke aktive)"] = old?.length ?? 0;
    for (const t of ["boost_orders", "chat_messages", "conversations", "messages", "notifications", "saved_searches", "reports", "contact_messages", "blocked_users", "rate_events"]) {
      deleted[t] = await wipe(db, t).catch((e: Error) => {
        // Tabeller som ikke finnes i denne databasen hoppes over
        if (/does not exist|schema cache/.test(e.message)) return 0;
        throw e;
      });
    }
    // Bilder: chatbilder slettes helt, annonsebilder bare for annonser som ikke finnes lenger
    const { data: live } = await db.from("listings").select("slug");
    const slugs = new Set((live ?? []).map((l) => l.slug));
    deleted["chatbilder"] = await sweep(db, "chat-images", () => false);
    deleted["annonsebilder uten annonse"] = await sweep(db, "listing-images", (f) => slugs.has(f));
    return NextResponse.json({ ok: true, deleted });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
