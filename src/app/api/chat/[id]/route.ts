import { NextResponse } from "next/server";
import { getUser, needsVipps } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { addMessage, decidedOffers, getConversation, MAX_IMAGE_BYTES, MAX_MESSAGE } from "@/lib/chat";

type Ctx = { params: Promise<{ id: string }> };

/** Nye meldinger i samtalen (etter ?etter=tidspunkt), besvarte bud og godtatt bud med Vipps-lenke. Merker samtalen som lest. */
export async function GET(req: Request, { params }: Ctx) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Logg inn." }, { status: 401 });
  const after = new URL(req.url).searchParams.get("etter") ?? undefined;
  const chat = await getConversation((await params).id, user.id, after && !isNaN(Date.parse(after)) ? after : undefined);
  if (!chat) return NextResponse.json({ error: "Fant ikke samtalen." }, { status: 404 });
  const { acceptedOffer, payLink, sellerPhoneMissing } = chat.conversation;
  const decided = await decidedOffers((await params).id);
  return NextResponse.json({
    messages: chat.messages,
    decided,
    acceptedOffer: acceptedOffer ?? null,
    payLink: payLink ?? null,
    sellerPhoneMissing: Boolean(sellerPhoneMissing),
  });
}

export async function POST(req: Request, { params }: Ctx) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Logg inn." }, { status: 401 });
  if (await needsVipps(user.id)) return NextResponse.json({ error: "Bekreft deg med Vipps for å sende meldinger.", vipps: true }, { status: 403 });
  const limited = await rateLimit(`chat:${user.id}`, 20, 60, "Du sender meldinger for raskt. Vent litt og prøv igjen.");
  if (limited) return limited;
  // Meldinger med bilde sendes som skjema, vanlige meldinger som JSON
  const form = req.headers.get("content-type")?.includes("multipart/form-data") ? await req.formData().catch(() => null) : null;
  const body = form ? Object.fromEntries(form) : await req.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE) : "";
  const image = form?.get("image");
  const file = image instanceof File && image.size > 0 ? image : null;
  if (file && (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > MAX_IMAGE_BYTES)) {
    return NextResponse.json({ error: "Bildet må være JPG, PNG eller WebP på maks 4 MB." }, { status: 400 });
  }
  if (!message && !file) return NextResponse.json({ error: "Skriv en melding." }, { status: 400 });
  if (file) {
    const tooMany = await rateLimit(`chatbilde:${user.id}`, 30, 3600, "Du har sendt mange bilder på kort tid. Vent litt og prøv igjen.");
    if (tooMany) return tooMany;
  }
  const offer = body?.offer ? Number(String(body.offer).replace(/\D/g, "")) : null;
  if (offer !== null && !(offer > 0)) return NextResponse.json({ error: "Skriv inn budet i hele kroner." }, { status: 400 });
  const sent = await addMessage((await params).id, user.id, message, offer, file);
  if (!sent) return NextResponse.json({ error: "Meldingen kan ikke sendes. Er dette en eksempelannonse, er kortet ikke til salgs." }, { status: 403 });
  if (!sent) return NextResponse.json({ error: "Meldingen ble ikke sendt. Prøv igjen." }, { status: 500 });
  return NextResponse.json({ message: sent });
}
