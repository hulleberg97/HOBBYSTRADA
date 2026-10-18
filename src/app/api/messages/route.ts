import { NextResponse } from "next/server";
import { getListing } from "@/lib/listings";
import { adminClient } from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { getUser } from "@/lib/auth";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Ugyldig forespørsel." }, { status: 400 });
  if (body.website) return NextResponse.json({ ok: true }); // felle for roboter

  // Innlogget: navn og e-post hentes fra kontoen, ikke fra skjemaet.
  const user = await getUser();
  const name = user ? user.fullName.slice(0, 100) : clean(body.name, 100);
  const email = user ? user.email : clean(body.email, 320);
  const message = clean(body.message, 1500);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) {
    return NextResponse.json({ error: "Fyll inn navn, en gyldig e-postadresse og en melding." }, { status: 400 });
  }

  const offer = body.offer ? Number(String(body.offer).replace(/\D/g, "")) : null;
  if (offer !== null && !(offer > 0)) return NextResponse.json({ error: "Skriv inn budet i hele kroner." }, { status: 400 });
  const text = offer ? `Bud: ${formatPrice(offer)}\n\n${message}` : message;
  const listing = await getListing(clean(body.listing, 200));
  if (!listing || listing.status !== "active") return NextResponse.json({ error: "Annonsen finnes ikke lenger." }, { status: 404 });
  if (user && listing.ownerId === user.id) return NextResponse.json({ error: "Dette er din egen annonse." }, { status: 400 });

  const db = adminClient();
  let sellerEmail = process.env.ADMIN_EMAIL ?? null;
  if (db) {
    const { error } = await db.from("messages").insert({
      listing_slug: listing.slug,
      seller_id: listing.ownerId ?? null,
      sender_name: name,
      sender_email: email,
      body: text,
    });
    if (error) {
      console.error("Kunne ikke lagre melding", error.message);
      return NextResponse.json({ error: "Meldingen ble ikke sendt. Prøv igjen om litt." }, { status: 500 });
    }
    if (listing.ownerId) {
      const { data } = await db.auth.admin.getUserById(listing.ownerId);
      sellerEmail = data.user?.email ?? sellerEmail;
    }
  }

  const mailed = sellerEmail
    ? await sendEmail({
        to: sellerEmail,
        replyTo: email,
        subject: offer ? `Nytt bud på «${listing.title}»: ${formatPrice(offer)}` : `Ny melding om «${listing.title}»`,
        text: `${name} (${email}) skriver om annonsen din:\n\n${text}\n\nSvar ved å svare på denne e-posten.\n\n${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/products/${listing.slug}`,
      })
    : false;

  if (!db && !mailed) {
    return NextResponse.json({ error: "Meldinger er ikke slått på ennå. Prøv igjen senere." }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
