import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminClient } from "@/lib/supabase-admin";
import { settleBoost } from "@/lib/settle-boost";
import { readWebhookSetting, verifyWebhook } from "@/lib/vipps-webhook";

/**
 * Mottar meldinger fra Vipps om betalinger (registrert fra adminpanelet). Vi stoler ikke på innholdet alene:
 * signaturen kontrolleres, og deretter spør settleBoost Vipps om status før løftet aktiveres.
 */
export async function POST(req: Request) {
  const db = adminClient();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  const body = await req.text();
  const setting = await readWebhookSetting(db);
  if (!setting || !verifyWebhook(req, body, setting.secret)) return NextResponse.json({ error: "Ugyldig signatur." }, { status: 401 });
  let reference = "";
  try {
    reference = String((JSON.parse(body) as { reference?: string }).reference ?? "");
  } catch {
    return NextResponse.json({ error: "Ugyldig innhold." }, { status: 400 });
  }
  if (!/^[0-9a-f-]{36}$/.test(reference)) return NextResponse.json({ ok: true, ignored: true });
  const result = await settleBoost(db, reference).catch((e) => {
    console.error("Vipps-webhook", e);
    return "waiting" as const;
  });
  if (result === "paid") revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, result });
}
