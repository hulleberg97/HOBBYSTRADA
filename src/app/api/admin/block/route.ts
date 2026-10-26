import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUser, isAdmin } from "@/lib/auth";
import { BLOCK_RULES, deleteAccount } from "@/lib/account";
import { brandedEmail, isPlaceholderEmail, sendEmail } from "@/lib/email";
import { COMPANY } from "@/lib/company";
import { adminClient } from "@/lib/supabase-admin";

/**
 * Stenger ute eieren av en annonse: Vipps-ID-en legges på sperrelisten (2 år), brukeren får e-post med begrunnelse
 * og klageadgang, og kontoen med annonser slettes på samme måte som når brukeren sletter selv.
 */
export async function POST(req: Request) {
  const db = adminClient();
  const admin = await getUser();
  if (!db || !isAdmin(admin)) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  const { listingId, rule } = (await req.json().catch(() => ({}))) as { listingId?: string; rule?: string };
  if (!listingId || !rule || !(BLOCK_RULES as readonly string[]).includes(rule)) return NextResponse.json({ error: "Mangler annonse eller regel." }, { status: 400 });

  const { data: listing } = await db.from("listings").select("owner_id").eq("id", listingId).maybeSingle();
  if (!listing?.owner_id) return NextResponse.json({ error: "Fant ikke eieren av annonsen." }, { status: 404 });
  if (listing.owner_id === admin!.id) return NextResponse.json({ error: "Du kan ikke stenge ute deg selv." }, { status: 400 });

  const { data: profile } = await db.from("profiles").select("vipps_sub").eq("id", listing.owner_id).maybeSingle();
  if (profile?.vipps_sub) {
    const { error } = await db.from("blocked_users").upsert({ vipps_sub: profile.vipps_sub, rule, blocked_at: new Date().toISOString() });
    if (error) return NextResponse.json({ error: `Sperrelisten mangler: ${error.message}` }, { status: 500 });
  }

  const { data: u } = await db.auth.admin.getUserById(listing.owner_id);
  const email = u.user?.email;
  if (email && !isPlaceholderEmail(email)) {
    const intro = `Kontoen din på HOBBYSTRADA er stengt fordi den bryter brukervilkårene: ${rule.toLowerCase()}. Annonsene dine er fjernet, og du kan ikke lage ny konto.`;
    await sendEmail({
      to: email,
      subject: "Kontoen din er stengt",
      text: `${intro}\n\nMener du dette er feil, kan du klage ved å svare på denne e-posten eller skrive til ${COMPANY.email}. Vi svarer innen én måned.`,
      html: brandedEmail({
        title: "Kontoen din er stengt",
        intro,
        outro: `Mener du dette er feil, kan du klage ved å svare på denne e-posten eller skrive til ${COMPANY.email}. Vi svarer innen én måned.`,
        reason: "Du får denne e-posten fordi kontoen din på HOBBYSTRADA er stengt.",
      }),
      replyTo: COMPANY.email,
    });
  }

  const failed = await deleteAccount(db, listing.owner_id);
  if (failed) return NextResponse.json({ error: failed }, { status: 500 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
