import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";
import { describeFilters, parseFilters, toQuery } from "@/lib/filters";

const MAX = 20;

/** Lagre et søk. Brukeren får e-post når en ny annonse passer. */
export async function POST(req: Request) {
  const db = adminClient();
  const user = await getUser();
  if (!db) return NextResponse.json({ error: "Varsler er ikke slått på ennå." }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Logg inn for å få varsler." }, { status: 401 });
  const { query } = await req.json().catch(() => ({}));
  const f = { ...parseFilters(new URLSearchParams(String(query ?? ""))), page: 1, sort: "newest" };
  const clean = toQuery(f);
  if (!clean) return NextResponse.json({ error: "Velg et søk eller filter først." }, { status: 400 });
  const { count } = await db.from("saved_searches").select("id", { count: "exact", head: true }).eq("user_id", user.id);
  if ((count ?? 0) >= MAX) return NextResponse.json({ error: `Du kan ha maks ${MAX} varsler. Slett et på Min side.` }, { status: 400 });
  const { data: existing } = await db.from("saved_searches").select("id").eq("user_id", user.id).eq("query", clean).maybeSingle();
  if (!existing) {
    const { error } = await db.from("saved_searches").insert({ user_id: user.id, email: user.email, query: clean, label: describeFilters(f) });
    if (error) return NextResponse.json({ error: "Kunne ikke lagre varselet." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const db = adminClient();
  const user = await getUser();
  if (!db || !user) return NextResponse.json({ error: "Du må være logget inn." }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id") ?? "";
  await db.from("saved_searches").delete().eq("id", id).eq("user_id", user.id);
  return NextResponse.json({ ok: true });
}
