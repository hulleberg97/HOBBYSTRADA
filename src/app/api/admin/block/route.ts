import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUser, isAdmin } from "@/lib/auth";
import { BLOCK_RULES } from "@/lib/account";
import { brandedEmail, isPlaceholderEmail, sendEmail } from "@/lib/email";
import { COMPANY } from "@/lib/company";
import { adminClient } from "@/lib/supabase-admin";

/**
 * Stenger ute eieren av en annonse: kontoen sperres for innlogging, annonsene skjules, Vipps-ID-en legges på sperrelisten (2 år),
 * og brukeren får e-post med begrunnelse og klageadgang. Kontoen slettes etter 30 dager (cron), eller når en klage er avgjort.
 */
export async function POST(req: Request) {
  const db = adminClient();
  const admin = await getUser();
  if (!db || !isAdmin(admin)) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  const { listingId, rule, reason } = (await req.json().catch(() => ({}))) as { listingId?: string; rule?: string; reason?: string };
  if (!listingId || !rule || !(BLOCK_RULES as readonly string[]).includes(rule)) return NextResponse.json({ error: "Mangler annonse eller regel." }, { status: 400 });
  const begrunnelse = typeof reason === "string" ? reason.trim().slice(0, 600) : "";
  if (!begrunnelse) return NextResponse.json({ error: "Skriv en konkret begrunnelse: hva brukeren har gjort, og hvilken annonse eller samtale det gjelder." }, { status: 400 });

  const { data: listing } = await db.from("listings").select("owner_id").eq("id", listingId).maybeSingle();
  const userId = listing?.owner_id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Fant ikke eieren av annonsen." }, { status: 404 });
  if (userId === admin!.id) return NextResponse.json({ error: "Du kan ikke stenge ute deg selv." }, { status: 400 });

  const { data: profile } = await db.from("profiles").select("vipps_sub").eq("id", userId).maybeSingle();
  const { data: active } = await db.from("listings").select("id").eq("owner_id", userId).in("status", ["active", "pending"]);
  const listingIds = (active ?? []).map((l) => l.id as string);
  const deleteAfter = new Date(Date.now() + 30 * 864e5).toISOString();
  const { error } = await db.from("blocked_users").upsert({
    vipps_sub: profile?.vipps_sub ?? `konto-${userId}`,
    rule,
    blocked_at: new Date().toISOString(),
    user_id: userId,
    delete_after: deleteAfter,
    listing_ids: listingIds,
  });
  if (error) return NextResponse.json({ error: `Sperrelisten mangler: ${error.message}` }, { status: 500 });

  if (listingIds.length) await db.from("listings").update({ status: "hidden" }).in("id", listingIds);
  const { error: banError } = await db.auth.admin.updateUserById(userId, { ban_duration: "87600h" });
  if (banError) return NextResponse.json({ error: `Kunne ikke sperre kontoen: ${banError.message}` }, { status: 500 });

  const { data: u } = await db.auth.admin.getUserById(userId);
  const email = u.user?.email;
  if (email && !isPlaceholderEmail(email)) {
    const intro = `Kontoen din på HOBBYSTRADA er stengt fordi den bryter brukervilkårene: ${rule.toLowerCase()}. Annonsene dine er skjult, og du kan ikke logge inn. Kontoen og annonsene slettes om 30 dager, eller når en klage er avgjort. Du kan ikke lage ny konto før det har gått to år.`;
    const quote = `Begrunnelse: ${begrunnelse}.\n\nAvgjørelsen er tatt av et menneske.`;
    const outro = `Mener du dette er feil, kan du klage innen 30 dager ved å svare på denne e-posten eller skrive til ${COMPANY.email}. Vi svarer innen én måned. Får du medhold, åpner vi kontoen igjen.`;
    await sendEmail({
      to: email,
      subject: "Kontoen din er stengt",
      text: `${intro}\n\n${quote}\n\n${outro}`,
      html: brandedEmail({ title: "Kontoen din er stengt", intro, quote, outro, reason: "Du får denne e-posten fordi kontoen din på HOBBYSTRADA er stengt." }),
      replyTo: COMPANY.email,
    });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
