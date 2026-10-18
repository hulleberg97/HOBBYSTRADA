import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/email";
import { getUser } from "@/lib/auth";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Ugyldig forespørsel." }, { status: 400 });
  if (b._hp) return NextResponse.json({ ok: true });
  // Innlogget: navn og e-post hentes fra kontoen, ikke fra skjemaet.
  const user = await getUser();
  const name = user ? user.fullName.slice(0, 200) : [clean(b.first_name, 100), clean(b.last_name, 99)].filter(Boolean).join(" ");
  const email = user ? user.email : clean(b.email, 320);
  const topic = clean(b.topic, 60) || "Annet";
  const message = clean(b.message, 4900);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) {
    return NextResponse.json({ error: "Fyll inn navn, en gyldig e-postadresse og en melding." }, { status: 400 });
  }
  const db = adminClient();
  if (db) {
    const { error } = await db.from("contact_messages").insert({ name, email, topic, body: message });
    if (error) console.error("Kunne ikke lagre kontaktmelding", error.message);
  }
  const mailed = process.env.ADMIN_EMAIL
    ? await sendEmail({ to: process.env.ADMIN_EMAIL, replyTo: email, subject: `[${topic}] fra ${name}`, text: `${name} (${email})\n\n${message}` })
    : false;
  if (!db && !mailed) return NextResponse.json({ error: "Kontaktskjemaet er ikke slått på ennå." }, { status: 503 });
  return NextResponse.json({ ok: true });
}
