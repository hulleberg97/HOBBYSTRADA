import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/email";

const MAX_BYTES = 4 * 1024 * 1024;
const MAX_IMAGES = 6;
const BUCKET = "listing-images";

/**
 * Bytt bildene på en annonse. Skjemaet sender «keep» (eksisterende bilder i ønsket rekkefølge) og «add» (nye filer).
 * Første bilde blir forsidebildet. Endrer en selger bildene på en aktiv annonse, må den godkjennes på nytt.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = adminClient();
  const user = await getUser();
  if (!db || !user) return NextResponse.json({ error: "Du må være logget inn." }, { status: 401 });
  const { id } = await params;
  const { data: listing } = await db.from("listings").select("id, slug, title, owner_id, status, images").eq("id", id).maybeSingle();
  if (!listing) return NextResponse.json({ error: "Fant ikke annonsen." }, { status: 404 });
  const admin = isAdmin(user);
  if (listing.owner_id !== user.id && !admin) return NextResponse.json({ error: "Dette er ikke din annonse." }, { status: 403 });

  const f = await req.formData();
  const current: string[] = listing.images ?? [];
  // Bare bilder som allerede hører til annonsen kan beholdes
  const keep = f
    .getAll("keep")
    .map(String)
    .filter((u) => current.includes(u));
  const files = f.getAll("add").filter((x): x is File => x instanceof File && x.size > 0);
  if (files.some((x) => !x.type.startsWith("image/") || x.size > MAX_BYTES)) {
    return NextResponse.json({ error: "Bildene må være bilder på maks 4 MB." }, { status: 400 });
  }
  if (keep.length + files.length === 0) return NextResponse.json({ error: "Annonsen må ha minst ett bilde." }, { status: 400 });
  if (keep.length + files.length > MAX_IMAGES) return NextResponse.json({ error: `Maks ${MAX_IMAGES} bilder.` }, { status: 400 });

  const added: string[] = [];
  for (const [i, file] of files.entries()) {
    const path = `${listing.slug}/${Date.now()}-${i}.${file.type === "image/png" ? "png" : "jpg"}`;
    const { error } = await db.storage.from(BUCKET).upload(path, file, { contentType: file.type });
    if (error) {
      console.error("Opplasting feilet", error.message);
      return NextResponse.json({ error: "Bildene kunne ikke lastes opp. Prøv igjen." }, { status: 500 });
    }
    added.push(db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
  }

  // Rekkefølgen fra skjemaet: «order» peker på keep:N eller add:N
  const order = f.getAll("order").map(String);
  const images = order.length
    ? order.map((o) => (o.startsWith("keep:") ? keep[Number(o.slice(5))] : added[Number(o.slice(4))])).filter(Boolean)
    : [...keep, ...added];

  const reapprove = !admin && listing.status === "active";
  const { error } = await db
    .from("listings")
    .update({ images, updated_at: new Date().toISOString(), ...(reapprove ? { status: "pending" } : {}) })
    .eq("id", listing.id);
  if (error) return NextResponse.json({ error: "Kunne ikke lagre bildene." }, { status: 500 });

  // Slett bilder som ikke brukes lenger
  const marker = `/object/public/${BUCKET}/`;
  const removed = current.filter((u) => !images.includes(u) && u.includes(marker)).map((u) => decodeURIComponent(u.split(marker)[1]));
  if (removed.length) await db.storage.from(BUCKET).remove(removed);

  if (reapprove && process.env.ADMIN_EMAIL) {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `Nye bilder til godkjenning: ${listing.title}`,
      text: `Selgeren har byttet bilder på «${listing.title}». Annonsen er skjult til den er godkjent igjen.\n\n${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin`,
    });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, images, pending: reapprove });
}
