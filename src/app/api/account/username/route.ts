import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";

const RULE = /^[a-zA-Z0-9æøåÆØÅ][a-zA-Z0-9æøåÆØÅ._-]{1,19}$/;

/** Setter brukernavnet. Det vises på alle annonsene til brukeren, så de oppdateres samtidig. */
export async function POST(req: Request) {
  const db = adminClient();
  const user = await getUser();
  if (!db || !user) return NextResponse.json({ error: "Logg inn først." }, { status: 401 });
  const username = String(((await req.json().catch(() => ({}))) as { username?: string }).username ?? "").trim();
  if (!RULE.test(username)) return NextResponse.json({ error: "Brukernavnet må ha 2 til 20 tegn: bokstaver, tall, punktum, bindestrek eller understrek." }, { status: 400 });
  if (/@/.test(username)) return NextResponse.json({ error: "Brukernavnet kan ikke være en e-postadresse." }, { status: 400 });

  const { data: taken } = await db.from("profiles").select("id").ilike("username", username).neq("id", user.id).maybeSingle();
  if (taken) return NextResponse.json({ error: "Brukernavnet er opptatt. Prøv et annet." }, { status: 409 });

  const { error } = await db.from("profiles").upsert({ id: user.id, username });
  if (error) return NextResponse.json({ error: /username/.test(error.message) ? "Kjør supabase/015_brukernavn.sql først." : "Kunne ikke lagre. Prøv igjen." }, { status: 500 });
  const { data: u } = await db.auth.admin.getUserById(user.id);
  await db.auth.admin.updateUserById(user.id, { user_metadata: { ...(u.user?.user_metadata ?? {}), username } });
  await db.from("listings").update({ seller_name: username }).eq("owner_id", user.id);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, username });
}
