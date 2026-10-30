import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase-admin";
import { displayName } from "@/lib/user-name";
import { getUser, needsVipps } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { getListing } from "@/lib/listings";
import { addMessage, adminUserId, MAX_MESSAGE, openConversation } from "@/lib/chat";

const clean = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, MAX_MESSAGE) : "");

/** Starter (eller fortsetter) en samtale med selgeren om en annonse. */
export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Logg inn for å sende melding." }, { status: 401 });
  if (await needsVipps(user.id)) return NextResponse.json({ error: "Bekreft deg med Vipps for å sende meldinger.", vipps: true }, { status: 403 });
  const limited =
    (await rateLimit(`chat:${user.id}`, 20, 60, "Du sender meldinger for raskt. Vent litt og prøv igjen.")) ??
    (await rateLimit(`ny-samtale:${user.id}`, 30, 3600, "Du har startet mange samtaler den siste timen. Prøv igjen senere."));
  if (limited) return limited;
  const body = await req.json().catch(() => null);
  const message = clean(body?.message);
  if (!message) return NextResponse.json({ error: "Skriv en melding." }, { status: 400 });
  const offer = body?.offer ? Number(String(body.offer).replace(/\D/g, "")) : null;
  if (offer !== null && !(offer > 0)) return NextResponse.json({ error: "Skriv inn budet i hele kroner." }, { status: 400 });

  const listing = await getListing(typeof body?.listing === "string" ? body.listing.slice(0, 200) : "");
  if (!listing || listing.status !== "active") return NextResponse.json({ error: "Annonsen finnes ikke lenger." }, { status: 404 });
  if (listing.isExample) return NextResponse.json({ error: "Dette er en eksempelannonse. Kortet er ikke til salgs." }, { status: 403 });
  const sellerId = listing.ownerId ?? (await adminUserId());
  if (!sellerId) return NextResponse.json({ error: "Meldinger er ikke slått på ennå." }, { status: 503 });
  if (sellerId === user.id) return NextResponse.json({ error: "Dette er din egen annonse." }, { status: 400 });

  // I chatten vises navnet fra Vipps, ikke brukernavnet
  const sellerName = await realName(sellerId, listing.seller);
  const id = await openConversation({
    listing: { slug: listing.slug, title: listing.title, image: listing.image, seller: sellerName },
    sellerId,
    buyer: { id: user.id, name: user.fullName },
  });
  if (!id || !(await addMessage(id, user.id, message, offer))) {
    return NextResponse.json({ error: "Meldingen ble ikke sendt. Prøv igjen om litt." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id });
}

/** Fullt navn på en bruker (fra Vipps), med brukernavnet som reserve. */
async function realName(userId: string, fallback: string) {
  const db = adminClient();
  if (!db) return fallback;
  const { data } = await db.auth.admin.getUserById(userId);
  return data.user ? displayName(data.user.user_metadata, data.user.email ?? "") || fallback : fallback;
}
