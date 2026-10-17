import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";
import { activateBoost } from "@/lib/activate-boost";

/** Admin markerer en bestilling som betalt (f.eks. betalt med Vipps) og aktiverer løftet. */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = adminClient();
  if (!db || !isAdmin(await getUser())) return NextResponse.json({ error: "Ingen tilgang." }, { status: 403 });
  await activateBoost(db, (await params).id);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
