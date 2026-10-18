import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { notifySavedSearches } from "@/lib/notify";

type Ctx = { params: Promise<{ id: string }> };

const OWNER_STATUSES = ["active", "sold", "hidden"];
const ADMIN_STATUSES = ["active", "sold", "hidden", "rejected", "pending"];

async function load(id: string) {
  const db = adminClient();
  const user = await getUser();
  if (!db || !user) return { error: NextResponse.json({ error: "Du må være logget inn." }, { status: 401 }) };
  const { data: listing } = await db.from("listings").select("id, slug, owner_id, status").eq("id", id).maybeSingle();
  if (!listing) return { error: NextResponse.json({ error: "Fant ikke annonsen." }, { status: 404 }) };
  const admin = isAdmin(user);
  if (listing.owner_id !== user.id && !admin) return { error: NextResponse.json({ error: "Dette er ikke din annonse." }, { status: 403 }) };
  return { db, listing, admin };
}

/** Endre annonsen: pris, tekst, sted og tilstand, eller status (solgt, skjult, aktiv). Admin kan også godkjenne og avvise. */
export async function PATCH(req: Request, { params }: Ctx) {
  const r = await load((await params).id);
  if (r.error) return r.error;
  const { status, price, description, location, condition } = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (status) {
    const allowed = r.admin ? ADMIN_STATUSES : OWNER_STATUSES;
    if (!allowed.includes(status)) return NextResponse.json({ error: "Ugyldig status." }, { status: 400 });
    // En selger kan ikke publisere en annonse som venter på godkjenning.
    if (!r.admin && ["pending", "rejected"].includes(r.listing.status) && status === "active") {
      return NextResponse.json({ error: "Annonsen venter på godkjenning." }, { status: 403 });
    }
    patch.status = status;
    if (status === "sold") Object.assign(patch, { bumped_until: null, featured_until: null, frontpage_until: null, sold_at: new Date().toISOString() });
    if (status === "active") patch.sold_at = null;
  }
  if (price !== undefined) {
    const p = Number(price);
    if (!(p > 0)) return NextResponse.json({ error: "Ugyldig pris." }, { status: 400 });
    patch.price = p;
  }
  if (typeof description === "string") patch.description = description.trim().slice(0, 1500);
  if (typeof condition === "string" && condition.trim()) patch.condition = condition.trim().slice(0, 40);
  if (typeof location === "string") {
    if (!location.trim()) return NextResponse.json({ error: "Sted kan ikke være tomt." }, { status: 400 });
    patch.location = location.trim().slice(0, 60);
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
