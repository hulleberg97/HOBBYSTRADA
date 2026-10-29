import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getConversation } from "@/lib/chat";

type Ctx = { params: Promise<{ id: string }> };

/** Samtalens tilstand (godtatt bud og Vipps-lenke for kjøperen). Brukes når et bud blir godtatt mens chatten er åpen. */
export async function GET(_req: Request, { params }: Ctx) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Logg inn." }, { status: 401 });
  const chat = await getConversation((await params).id, user.id, "2999-01-01T00:00:00Z");
  if (!chat) return NextResponse.json({ error: "Fant ikke samtalen." }, { status: 404 });
  const { acceptedOffer, payLink, sellerPhoneMissing } = chat.conversation;
  return NextResponse.json({ acceptedOffer: acceptedOffer ?? null, payLink: payLink ?? null, sellerPhoneMissing: Boolean(sellerPhoneMissing) });
}
