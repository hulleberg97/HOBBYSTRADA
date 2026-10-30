import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { FORSIDE_FYLL, setSetting } from "@/lib/settings";

/** Admin: hvor mange gratisannonser som fyller forsiden når det ikke er nok annonser med løft. */
export async function PATCH(req: Request) {
  const user = await getUser();
  if (!isAdmin(user)) return NextResponse.json({ error: "Bare admin." }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const fill = Number(body?.fill);
  if (!Number.isInteger(fill) || fill < 0 || fill > 12) return NextResponse.json({ error: "Ugyldig antall." }, { status: 400 });
  const { error } = await setSetting(FORSIDE_FYLL, fill);
  if (error) return NextResponse.json({ error: `Kunne ikke lagre. Har du kjørt supabase/018_forside.sql? (${error})` }, { status: 500 });
  return NextResponse.json({ ok: true, fill });
}
