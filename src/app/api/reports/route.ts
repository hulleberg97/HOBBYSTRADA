import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/email";
import { getUser } from "@/lib/auth";
import { getListing } from "@/lib/listings";
import { REPORT_REASONS } from "@/lib/reports";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Ugyldig forespørsel." }, { status: 400 });
  if (b._hp) return NextResponse.json({ ok: true });
  const reason = clean(b.reason, 80);
  const details = clean(b.details, 2000);
  const email = (await getUser())?.email || clean(b.email, 320) || null;
  if (!REPORT_REASONS.includes(reason)) return NextResponse.json({ error: "Velg hva som er galt." }, { status: 400 });
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "E-postadressen ser ikke riktig ut." }, { status: 400 });
  const listing = await getListing(clean(b.listing, 200));
  if (!listing) return NextResponse.json({ error: "Fant ikke annonsen." }, { status: 404 });

  const db = adminClient();
  if (db) {
    const { error } = await db.from("reports").insert({ listing_slug: listing.slug, reason, details, reporter_email: email });
    // Tabellen finnes ikke før supabase/003_juridisk.sql er kjørt: lagre som henvendelse i stedet.
    if (error)
      await db
        .from("contact_messages")
        .insert({ name: "Rapport", email: email ?? "ukjent", topic: "Rapporter annonse", body: `${reason}\n${listing.slug}\n\n${details}` });
  }
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const mailed = process.env.ADMIN_EMAIL
    ? await sendEmail({
        to: process.env.ADMIN_EMAIL,
        replyTo: email ?? undefined,
        subject: `Rapport: ${reason} – ${listing.title}`,
        text: `${listing.title}\n${site}/products/${listing.slug}\n\nGrunn: ${reason}\n\n${details}\n\nBehandle rapporten: ${site}/admin`,
      })
    : false;
  if (!db && !mailed) return NextResponse.json({ error: "Rapportering er ikke slått på ennå." }, { status: 503 });
  return NextResponse.json({ ok: true });
}
