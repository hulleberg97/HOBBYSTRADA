import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { decideOffer } from "@/lib/chat";

type Ctx = { params: Promise<{ id: string }> };

/** Selgeren godtar eller avslår et bud i samtalen. */
export async function POST(req: Request, { params }: Ctx) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Logg inn." }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { messageId?: string; accept?: boolean };
  if (!body.messageId || typeof body.accept !== "boolean") return NextResponse.json({ error: "Mangler bud." }, { status: 400 });
  const r = await decideOffer((await params).id, body.messageId, user.id, body.accept);
  if ("error" in r) return NextResponse.json({ error: r.error }, { status: 400 });
  return NextResponse.json(r);
}
