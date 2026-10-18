import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { unreadCount } from "@/lib/chat";

/** Antall samtaler med uleste meldinger, til merket i toppmenyen. */
export async function GET() {
  const user = await getUser();
  return NextResponse.json({ count: user ? await unreadCount(user.id) : 0 }, { headers: { "cache-control": "no-store" } });
}
