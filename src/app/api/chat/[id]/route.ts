import { NextResponse } from "next/server";
import { getUser, needsVipps } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { addMessage, getConversation, MAX_MESSAGE } from "@/lib/chat";

type Ctx = { params: Promise<{ id: string }> };

/** Nye meldinger i samtalen (etter ?etter=tidspunkt). Merker samtalen som lest. */
export async function GET(req: Request, { params }: Ctx) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Logg inn." }, { status: 401 });
  const after = new URL(req.url).searchParams.get("etter") ?? undefined;
  const chat = await getConversation((await params).id, user.id, after && !isNaN(Date.parse(after)) ? after : undefined);
  if (!chat) return NextResponse.json({ error: "Fant ikke samtalen." }, { status: 404 });
  return NextResponse.json({ messages: chat.messages });
}

export async function POST(req: Request, { params }: Ctx) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Logg inn." }, { status: 401 });
  if (await needsVipps(user.id)) return NextResponse.json({ error: "Bekreft deg med Vipps for å sende meldinger.", vipps: true }, { status: 403 });
  const limited = await rateLimit(`chat:${user.id}`, 20, 60, "Du sender meldinger for raskt. Vent litt og prøv igjen.");
  if (limited) return limited;
  const body = await req.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE) : "";
  if (!message) return NextResponse.json({ error: "Skriv en melding." }, { status: 400 });
  const offer = body?.offer ? Number(String(body.offer).replace(/\D/g, "")) : null;
  if (offer !== null && !(offer > 0)) return NextResponse.json({ error: "Skriv inn budet i hele kroner." }, { status: 400 });
  const sent = await addMessage((await params).id, user.id, message, offer);
  if (!sent) return NextResponse.json({ error: "Meldingen ble ikke sendt. Prøv igjen." }, { status: 500 });
  return NextResponse.json({ message: sent });
}
