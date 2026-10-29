import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { notifySavedSearches, notifyReview } from "@/lib/notify";

type Ctx = { params: Promise<{ id: string }> };

const OWNER_STATUSES = ["active", "sold", "hidden"];
const ADMIN_STATUSES = ["active", "sold", "hidden", "rejected", "pending"];

async function load(id: string) {
  const db = adminClient();
  const user = await getUser();
  if (!db || !user) return { error: NextResponse.json({ error: "Du må være logget inn." }, { status: 401 }) };
  // owner_listing kommer med supabase/016_innehaver.sql; før det hentes annonsen uten.
  const first = await db.from("listings").select("id, slug, title, owner_id, status, owner_listing").eq("id", id).maybeSingle();
  const listing = first.error && /owner_listing/.test(first.error.message) ? (await db.from("listings").select("id, slug, title, owner_id, status").eq("id", id).maybeSingle()).data : first.data;
  if (!listing) return { error: NextResponse.json({ error: "Fant ikke annonsen." }, { status: 404 }) };
  const admin = isAdmin(user);
  if (listing.owner_id !== user.id && !admin) return { error: NextResponse.json({ error: "Dette er ikke din annonse." }, { status: 403 }) };
  return { db, listing, admin };
}

/** Endre annonsen: pris, tekst, sted og tilstand, eller status (solgt, skjult, aktiv). Admin kan også godkjenne og avvise. */
export async function PATCH(req: Request, { params }: Ctx) {
  const r = await load((await params).id);
  if (r.error) return r.error;
  const { status, price, description, location, condition, fanSlot, club, league, reason } = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (status) {
    const allowed = r.admin ? ADMIN_STATUSES : OWNER_STATUSES;
    if (!allowed.includes(status)) return NextResponse.json({ error: "Ugyldig status." }, { status: 400 });
    // En selger kan ikke publisere en annonse som venter på godkjenning.
    if (!r.admin && ["pending", "rejected"].includes(r.listing.status) && status === "active") {
      return NextResponse.json({ error: "Annonsen venter på godkjenning." }, { status: 403 });
    }
    patch.status = status;
    if (status === "sold")
      Object.assign(patch, { bumped_until: null, featured_until: null, frontpage_until: null, fan_slot: null, sold_at: new Date().toISOString() });
    if (status === "active") patch.sold_at = null;
  }
  if (price !== undefined) {
    const p = Number(price);
    if (!(p > 0)) return NextResponse.json({ error: "Ugyldig pris." }, { status: 400 });
    patch.price = p;
  }
  if (typeof description === "string") patch.description = description.trim().slice(0, 1500);
  if (typeof condition === "string" && condition.trim()) patch.condition = condition.trim().slice(0, 40);
  if (typeof club === "string") patch.club = club.trim().slice(0, 60) || null;
  if (typeof league === "string") patch.league = league.trim().slice(0, 40) || null;
  if (typeof location === "string") {
    if (!location.trim()) return NextResponse.json({ error: "Sted kan ikke være tomt." }, { status: 400 });
    patch.location = location.trim().slice(0, 60);
  }
  if (fanSlot !== undefined) {
    if (!r.admin) return NextResponse.json({ error: "Bare admin kan feste kort på forsiden." }, { status: 403 });
    if (fanSlot !== null && (r.listing as { owner_listing?: boolean | null }).owner_listing)
      return NextResponse.json({ error: "Annonser fra innehaveren av HOBBYSTRADA festes ikke på forsiden." }, { status: 400 });
    if (fanSlot !== null && ![1, 2, 3, 4, 5].includes(fanSlot)) return NextResponse.json({ error: "Ugyldig plass." }, { status: 400 });
    // Plassen kan bare ha ett kort: frigjør den først.
    if (fanSlot !== null) await r.db.from("listings").update({ fan_slot: null }).eq("fan_slot", fanSlot).neq("id", r.listing.id);
    patch.fan_slot = fanSlot;
  }
  let { error } = await r.db.from("listings").update(patch).eq("id", r.listing.id);
  // Databasen er ikke oppdatert med prisarkivet ennå (supabase/002_nye_funksjoner.sql): lagre uten sold_at.
  if (error && "sold_at" in patch && /sold_at/.test(error.message)) {
    delete patch.sold_at;
    ({ error } = await r.db.from("listings").update(patch).eq("id", r.listing.id));
  }
  if (error) return NextResponse.json({ error: "Kunne ikke lagre endringen." }, { status: 500 });
  revalidatePath("/", "layout");
  // Første gang en annonse publiseres: varsle dem som har et lagret søk som passer.
  if (status === "active" && r.listing.status === "pending") after(() => notifySavedSearches(r.db, r.listing.id));
  // Selgeren får beskjed når admin godkjenner eller avviser en ny annonse
  if (r.admin && r.listing.status === "pending" && (status === "active" || status === "rejected"))
    after(() => notifyReview(r.db, r.listing, status === "active", typeof reason === "string" ? reason.slice(0, 120) : ""));
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const r = await load((await params).id);
  if (r.error) return r.error;
  const { error } = await r.db.from("listings").delete().eq("id", r.listing.id);
  if (error) return NextResponse.json({ error: "Kunne ikke slette annonsen." }, { status: 500 });
  const { data: files } = await r.db.storage.from("listing-images").list(r.listing.slug);
  if (files?.length) await r.db.storage.from("listing-images").remove(files.map((f) => `${r.listing.slug}/${f.name}`));
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
