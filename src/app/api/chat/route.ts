import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getListing } from "@/lib/listings";
import { addMessage, adminUserId, MAX_MESSAGE, openConversation } from "@/lib/chat";

const clean = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, MAX_MESSAGE) : "");

/** Starter (eller fortsetter) en samtale med selgeren om en annonse. */
export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Logg inn for å sende melding." }, { status: 401 });
  const body = await req.json().catch(() => null);
  const message = clean(body?.message);
  if (!message) return NextResponse.json({ error: "Skriv en melding." }, { status: 400 });
  const offer = body?.offer ? Number(String(body.offer).replace(/\D/g, "")) : null;
  if (offer !== null && !(offer > 0)) return NextResponse.json({ error: "Skriv inn budet i hele kroner." }, { status: 400 });

  const listing = await getListing(typeof body?.listing === "string" ? body.listing.slice(0, 200) : "");
  if (!listing || listing.status !== "active") return NextResponse.json({ error: "Annonsen finnes ikke lenger." }, { status: 404 });
  const sellerId = listing.ownerId ?? (await adminUserId());
  if (!sellerId) return NextResponse.json({ error: "Meldinger er ikke slått på ennå." }, { status: 503 });
  if (sellerId === user.id) return NextResponse.json({ error: "Dette er din egen annonse." }, { status: 400 });

  const id = await openConversation({
    listing: { slug: listing.slug, title: listing.title, image: listing.image, seller: listing.seller },
    sellerId,
    buyer: { id: user.id, name: user.fullName },
  });
  if (!id || !(await addMessage(id, user.id, message, offer))) {
    return NextResponse.json({ error: "Meldingen ble ikke sendt. Prøv igjen om litt." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id });
}
