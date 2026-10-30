import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";

/** Aktive annonser brukeren kan løfte (administratoren ser alle). */
export async function GET() {
  const db = adminClient();
  const user = await getUser();
  if (!db || !user) return NextResponse.json({ listings: [] }, { status: user ? 503 : 401 });
  let q = db
    .from("listings")
    .select("slug, title, price, images, bumped_until, featured_until, frontpage_until, owner_listing")
    .eq("status", "active")
    // Eksempelannonser kan ikke løftes, og vises ikke i kassen
    .eq("owner_listing", false)
    .order("created_at", { ascending: false })
    .limit(100);
  if (!isAdmin(user)) q = q.eq("owner_id", user.id);
  const { data } = await q;
  const now = Date.now();
  const active = (d: string | null) => Boolean(d && new Date(d).getTime() > now);
  return NextResponse.json({
    listings: (data ?? []).map((l) => ({
      slug: l.slug,
      title: l.title,
      price: Number(l.price),
      image: l.images?.[0] ?? null,
      boost: active(l.frontpage_until) ? "Toppannonse" : active(l.featured_until) ? "Fremhevet" : active(l.bumped_until) ? "Topp av listen" : null,
    })),
  });
}
