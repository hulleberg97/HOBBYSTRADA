import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase-admin";
import { settlePending } from "@/lib/settle-boost";
import { addNotification } from "@/lib/notifications";
import { INACTIVE_DELETE_DAYS, INACTIVE_WARN_DAYS, deleteAccount } from "@/lib/account";
import { brandedEmail, isPlaceholderEmail, sendEmail } from "@/lib/email";

/**
 * Daglig opprydding (Vercel Cron, kl. 03:17 UTC). Sletter data vi ikke lenger trenger:
 * - meldinger, samtaler og henvendelser eldre enn 12 måneder
 * - avviste annonser (med bilder) eldre enn 30 dager
 * - rapporter som er ferdigbehandlet for over 12 måneder siden
 * - bilder som ikke lenger hører til en samtale eller annonse
 * - sperrelisten: utestengte Vipps-ID-er eldre enn 2 år
 * - inaktive kontoer: e-postvarsel etter 23 måneder uten innlogging, sletting etter 24
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

  await del("notifications", db.from("notifications").delete({ count: "exact" }).lt("created_at", new Date(Date.now() - 90 * 864e5).toISOString()));

  // Løft som går ut det neste døgnet: én påminnelse til selgeren
  const soon = new Date(Date.now() + 864e5).toISOString();
  const { data: expiring } = await db.from("listings").select("slug, title, owner_id, bumped_until").eq("status", "active").gt("bumped_until", new Date().toISOString()).lte("bumped_until", soon);
  let reminded = 0;
  for (const l of expiring ?? []) {
    const href = `/products/${l.slug}`;
    const { count } = await db.from("notifications").select("id", { count: "exact", head: true }).eq("kind", "boost_expiring").eq("href", href).gt("created_at", new Date(Date.now() - 3 * 864e5).toISOString());
    if (count) continue;
    await addNotification(db, l.owner_id, { kind: "boost_expiring", title: "Løftet går ut snart", body: `Løftet på «${l.title}» går ut i løpet av det neste døgnet. Du kan løfte annonsen igjen når du vil.`, href: `/annonseloft?annonse=${l.slug}` });
    reminded++;
  }
  result.reminded = reminded;

  await del("blocked_users", db.from("blocked_users").delete({ count: "exact" }).lt("blocked_at", months(24)));
  Object.assign(result, await inactiveAccounts(db));

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

/**
 * Inaktive kontoer. Varsel på e-post når siste innlogging er over 23 måneder siden, sletting når den er over 24 måneder
 * og varselet ble sendt for minst 30 dager siden. Innlogging nullstiller varselet (se Vipps-callback).
 */
async function inactiveAccounts(db: NonNullable<ReturnType<typeof adminClient>>) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no";
  const admin = process.env.ADMIN_EMAIL?.toLowerCase();
  let warned = 0;
  let deleted = 0;
  const now = Date.now();
  for (let page = 1; page < 50; page++) {
    const { data } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    const users = data?.users ?? [];
    for (const u of users) {
      if (!u.email || u.email.toLowerCase() === admin) continue;
      const lastSeen = new Date(u.last_sign_in_at ?? u.created_at).getTime();
      const idleDays = (now - lastSeen) / 864e5;
      const meta = u.user_metadata ?? {};
      const warnedAt = meta.inactivity_warned_at ? new Date(meta.inactivity_warned_at as string).getTime() : 0;
      if (idleDays >= INACTIVE_DELETE_DAYS && (warnedAt ? now - warnedAt >= 30 * 864e5 : isPlaceholderEmail(u.email))) {
        if (!(await deleteAccount(db, u.id))) deleted++;
      } else if (idleDays >= INACTIVE_WARN_DAYS && !warnedAt && !isPlaceholderEmail(u.email)) {
        const intro = "Du har ikke logget inn på HOBBYSTRADA på nesten to år. Kontoen din slettes om 30 dager, sammen med annonsene dine. Vil du beholde den, er det nok å logge inn.";
        const ok = await sendEmail({
          to: u.email,
          subject: "Kontoen din slettes om 30 dager",
          text: `${intro}\n\nLogg inn: ${site}/auth/login`,
          html: brandedEmail({ title: "Kontoen din slettes om 30 dager", intro, button: "Logg inn og behold kontoen", url: `${site}/auth/login`, outro: "Gjør du ingenting, slettes kontoen automatisk. Betalinger beholder vi uendret så lenge bokføringsloven krever." }),
        });
        if (ok) {
          await db.auth.admin.updateUserById(u.id, { user_metadata: { ...meta, inactivity_warned_at: new Date(now).toISOString() } });
          warned++;
        }
      }
    }
    if (users.length < 1000) break;
  }
  return { inactive_warned: warned, inactive_deleted: deleted };
}
