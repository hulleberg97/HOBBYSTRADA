import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";

/** Merker en rapport som behandlet. */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = adminClient();
  if (!db || !isAdmin(await getUser())) return NextResponse.json({ error: "Ingen tilgang." }, { status: 403 });
  await db
    .from("reports")
    .update({ handled: true })
    .eq("id", (await params).id);
  return NextResponse.json({ ok: true });
}
