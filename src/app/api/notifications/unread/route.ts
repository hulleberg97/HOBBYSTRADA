import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { unreadNotifications } from "@/lib/notifications";

/** Antall uleste varsler, til prikken på bjella i toppmenyen. */
export async function GET() {
  const user = await getUser();
  return NextResponse.json({ count: user ? await unreadNotifications(user.id) : 0 }, { headers: { "cache-control": "no-store" } });
}
