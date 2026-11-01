import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";
import { deleteWebhook, hasVipps, listWebhooks, registerWebhook } from "@/lib/vipps";
import { readWebhookSetting, saveWebhookSetting } from "@/lib/vipps-webhook";

const site = () => process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no";

/** Admin: GET viser status, POST registrerer varslingen hos Vipps, DELETE fjerner den. */
export async function GET() {
  const db = adminClient();
  if (!db || !isAdmin(await getUser())) return NextResponse.json({ error: "Ingen tilgang." }, { status: 403 });
  const setting = await readWebhookSetting(db);
  const hos = hasVipps() ? await listWebhooks().catch(() => null) : null;
  return NextResponse.json({ registered: Boolean(setting), url: setting?.url ?? null, createdAt: setting?.createdAt ?? null, hosVipps: hos });
}

export async function POST() {
  const db = adminClient();
  if (!db || !isAdmin(await getUser())) return NextResponse.json({ error: "Ingen tilgang." }, { status: 403 });
  if (!hasVipps()) return NextResponse.json({ error: "Vipps-nøklene er ikke lagt inn." }, { status: 400 });
  const url = `${site()}/api/vipps/webhook`;
  try {
    // Fjern en eventuell gammel registrering med samme adresse, så det bare finnes én
    const existing = await listWebhooks();
    for (const w of existing) if (w.url === url) await deleteWebhook(w.id);
    const { id, secret } = await registerWebhook(url);
    await saveWebhookSetting(db, { id, secret, url, createdAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: `Vipps avviste registreringen: ${(e as Error).message}` }, { status: 502 });
  }
}

export async function DELETE() {
  const db = adminClient();
  if (!db || !isAdmin(await getUser())) return NextResponse.json({ error: "Ingen tilgang." }, { status: 403 });
  const setting = await readWebhookSetting(db);
  if (setting) await deleteWebhook(setting.id).catch(() => {});
  await saveWebhookSetting(db, null);
  return NextResponse.json({ ok: true });
}
