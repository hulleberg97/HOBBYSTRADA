import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { BOOSTS, type BoostKey } from "@/lib/boosts";
import { COMPANY } from "@/lib/company";
import { brandedEmail, isPlaceholderEmail, sendEmail } from "@/lib/email";
import { adminClient } from "@/lib/supabase-admin";
import { angreDato, refusjon } from "@/lib/angrerett";

/**
 * Kunden bruker angreretten fra kvitteringen. Tillatt til og med angredatoen (slutten av perioden eller 14 dager etter betaling, det som kommer først).
 * Refusjonen regnes i hele timer (se src/lib/angrerett.ts). Kunden får straks bekreftelse på e-post (angrerettloven § 20), og admin får beskjed om å refundere i Vipps.
 */
export async function POST(req: Request) {
  const db = adminClient();
  const user = await getUser();
  if (!db || !user) return NextResponse.json({ error: "Logg inn først." }, { status: 401 });
  const { orderId } = (await req.json().catch(() => ({}))) as { orderId?: string };
  if (!orderId) return NextResponse.json({ error: "Mangler bestilling." }, { status: 400 });
  const { data: o } = await db.from("boost_orders").select("id, user_id, plan, amount, paid_at, invoice_no, listing_title, withdraw_requested_at").eq("id", orderId).eq("status", "paid").maybeSingle();
  if (!o || o.user_id !== user.id) return NextResponse.json({ error: "Fant ikke kjøpet." }, { status: 404 });
  if (o.withdraw_requested_at) return NextResponse.json({ error: "Du har allerede meldt fra. Vi behandler saken." }, { status: 400 });
  const plan = BOOSTS[o.plan as BoostKey];
  const receivedAt = Date.now();
  if (receivedAt > angreDato(o.paid_at, plan.days).getTime()) return NextResponse.json({ error: "Angrefristen er ute." }, { status: 400 });
  const { totalHours, usedHours, refund } = refusjon(Number(o.amount), plan.days, o.paid_at, receivedAt);
  if (usedHours >= totalHours) return NextResponse.json({ error: "Perioden er over, så løftet er levert fullt ut." }, { status: 400 });

  const { error } = await db.from("boost_orders").update({ withdraw_requested_at: new Date().toISOString() }).eq("id", o.id);
  if (error) console.error("Kunne ikke lagre angring", error.message);

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no";
  const when = new Date().toLocaleString("nb-NO", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Oslo" });
  const intro = `Vi har mottatt meldingen din om at du bruker angreretten på ${plan.name} for «${o.listing_title ?? "annonsen"}» (salgsdokument nr. ${o.invoice_no ?? "–"}), ${when}.`;
  const outro = `Løftet stoppes. Det har vært aktivt i ${usedHours} av ${totalHours} timer. Vi betaler tilbake ${refund} kr til samme betalingsmåte senest 14 dager etter denne meldingen. Spørsmål? Svar på denne e-posten eller skriv til ${COMPANY.email}.`;
  if (!isPlaceholderEmail(user.email)) {
    await sendEmail({ to: user.email, subject: "Bekreftelse: vi har mottatt angringen din", text: `${intro}\n\n${outro}`, html: brandedEmail({ title: "Vi har mottatt angringen din", intro, outro }), replyTo: COMPANY.email });
  }
  const admin = process.env.ADMIN_EMAIL;
  if (admin) await sendEmail({ to: admin, subject: `Angrerett: refunder ${refund} kr (nr. ${o.invoice_no ?? "–"})`, text: `${user.fullName} (${user.email}) angrer ${plan.name} for «${o.listing_title}». Løftet har vært aktivt i ${usedHours} av ${totalHours} timer. Refunder ${refund} kr i Vipps-portalen innen 14 dager, og stopp løftet.\n\n${site}/admin` });

  // Løftet stoppes med en gang
  const { data: order } = await db.from("boost_orders").select("listing_id").eq("id", o.id).maybeSingle();
  if (order?.listing_id) await db.from("listings").update({ bumped_until: null, featured_until: null, frontpage_until: null }).eq("id", order.listing_id);
  return NextResponse.json({ ok: true, refund, usedHours, totalHours });
}
