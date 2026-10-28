import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { igImage, imageDataUri } from "@/lib/ig-image";
import { adminClient } from "@/lib/supabase-admin";

/** Admin: Instagram-bilde (1080 x 1350) av en annonse, lastes ned som PNG. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const db = adminClient();
  const user = await getUser();
  if (!db || !isAdmin(user)) return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  const { slug } = await params;
  const { data: l } = await db.from("listings").select("player, set_name, price, images").eq("slug", slug).maybeSingle();
  if (!l) return NextResponse.json({ error: "Fant ikke annonsen." }, { status: 404 });
  const res = await igImage({ player: l.player, set: l.set_name ?? "", price: formatPrice(Number(l.price)), image: await imageDataUri(l.images?.[0] ?? null) });
  res.headers.set("content-disposition", `attachment; filename="instagram-${slug}.png"`);
  res.headers.set("cache-control", "no-store");
  return res;
}
