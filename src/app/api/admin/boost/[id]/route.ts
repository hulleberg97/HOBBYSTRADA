import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";
import { activateBoost } from "@/lib/activate-boost";
import { settleBoost } from "@/lib/settle-boost";

/**
 * Admin: ?check=1 spør Vipps om status (når kunden lukket vinduet før de kom tilbake).
 * Uten check markeres bestillingen som betalt manuelt, f.eks. etter en Vipps-forespørsel fra appen.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = adminClient();
  if (!db || !isAdmin(await getUser())) return NextResponse.json({ error: "Ingen tilgang." }, { status: 403 });
  const id = (await params).id;
  if (new URL(req.url).searchParams.get("check")) {
    const result = await settleBoost(db, id).catch(() => "waiting" as const);
    revalidatePath("/", "layout");
    return NextResponse.json({ result });
  }
  await activateBoost(db, id);
  revalidatePath("/", "layout");
  return NextResponse.json({ result: "paid" });
}
