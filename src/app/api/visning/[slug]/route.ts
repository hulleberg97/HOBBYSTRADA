import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";

/**
 * Teller en visning av en annonse. Kalles fra annonsesiden i nettleseren, siden selve siden mellomlagres.
 * Selgerens egne visninger telles ikke. Ingenting om den besøkende lagres, bare tallet.
 */
export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const db = adminClient();
  const { slug } = await params;
  if (!db || !/^[a-z0-9-]{1,120}$/.test(slug)) return NextResponse.json({ ok: false });
  const user = await getUser();
  if (user) {
    const { data } = await db.from("listings").select("owner_id").eq("slug", slug).maybeSingle();
    if (data?.owner_id === user.id) return NextResponse.json({ ok: true, own: true });
  }
  const { error } = await db.rpc("increment_views", { p_slug: slug });
  return NextResponse.json({ ok: !error });
}
