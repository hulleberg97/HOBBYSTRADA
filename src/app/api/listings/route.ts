import { NextResponse } from "next/server";
import { getUser, getVerification } from "@/lib/auth";
import { hasVippsLogin } from "@/lib/vipps-login";
import { adminClient } from "@/lib/supabase-admin";
import { slugify } from "@/lib/format";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

const TYPE_MAP: Record<string, string> = {
  Autograf: "Autograf",
  Patch: "Patch",
  Relic: "Patch",
  "Patch / relic": "Patch",
  "Relic / patch": "Patch",
  Rookie: "Rookie",
  Nummerert: "Nummerert",
  "Base / innstikk": "Base",
  Base: "Base",
  Annet: "Annet",
};
const MAX_BYTES = 4 * 1024 * 1024;

const str = (f: FormData, k: string, max: number) =>
  String(f.get(k) ?? "")
    .trim()
    .slice(0, max);

export async function POST(req: Request) {
  const db = adminClient();
  if (!db) return NextResponse.json({ error: "Annonser kan ikke legges ut ennå. Prøv igjen senere." }, { status: 503 });

  const f = await req.formData();
  if (f.get("_hp")) return NextResponse.json({ ok: true });
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Logg inn for å legge ut kort." }, { status: 401 });
  const limited = await rateLimit(`annonse:${user.id}`, 15, 3600, "Du har lagt ut mange annonser den siste timen. Prøv igjen senere.");
  if (limited) return limited;
  const verified = await getVerification(user.id);
  if (hasVippsLogin() && !verified) {
    return NextResponse.json({ error: "Bekreft deg med Vipps før du legger ut kort." }, { status: 403 });
  }

  const player = str(f, "player", 80);
  const set = str(f, "set", 100);
  const price = Number(str(f, "price", 9));
  const username = str(f, "username", 40);
  const location = str(f, "location", 60);
  const email = user.email;
  const name = user.name;
  if (!player || !set || !price || price < 1 || !username || !location || !email || !name || !f.get("confirm")) {
    return NextResponse.json({ error: "Fyll inn alle feltene som er merket med *." }, { status: 400 });
  }

  const files = [f.get("front"), f.get("back"), ...f.getAll("extra")].filter((x): x is File => x instanceof File && x.size > 0).slice(0, 6);
  if (!(f.get("front") instanceof File)) return NextResponse.json({ error: "Legg til et bilde av forsiden." }, { status: 400 });
  if (files.some((x) => !x.type.startsWith("image/") || x.size > MAX_BYTES)) {
    return NextResponse.json({ error: "Bildene må være bildefiler under 4 MB." }, { status: 400 });
  }

  const code = str(f, "code", 30) || null;
  const num = str(f, "num", 20) || null;
  // Flere typer kan velges, f.eks. Autograf + Patch
  const picked = [
    ...new Set(
      f
        .getAll("type")
        .map((t) => TYPE_MAP[String(t).slice(0, 30)])
        .filter(Boolean),
    ),
  ];
  if (!picked.length) picked.push("Annet");
  const types = [...picked, ...(num && !picked.includes("Nummerert") ? ["Nummerert"] : [])];
  const typeLabel = (picked.filter((t) => t !== "Nummerert").join(" + ") || picked[0]).slice(0, 40);
  const grader = str(f, "grader", 30);
  const grade = str(f, "grade", 10);
  const grading = !grader || grader.startsWith("Ugradert") ? "Ugradert (raw)" : `${grader} ${grade}`.trim();
  const condition = { Mint: "Mint", "Near Mint": "Near Mint / Mint" }[str(f, "cond", 20)] ?? str(f, "cond", 20);
  const title = `${player} – ${set}${code || num ? ` (${code ?? num})` : ""}`;
  const slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`;

  const images: string[] = [];
  for (const [i, file] of files.entries()) {
    const path = `${slug}/${i}-${Date.now()}.${file.type === "image/png" ? "png" : "jpg"}`;
    const { error } = await db.storage.from("listing-images").upload(path, file, { contentType: file.type });
    if (error) {
      console.error("Opplasting feilet", error.message);
      return NextResponse.json({ error: "Bildene kunne ikke lastes opp. Prøv igjen." }, { status: 500 });
    }
    images.push(db.storage.from("listing-images").getPublicUrl(path).data.publicUrl);
  }

  const row = {
    slug,
    title,
    player,
    set_name: set,
    season: str(f, "season", 20) || null,
    club: str(f, "club", 60) || null,
    league: str(f, "league", 40) || null,
    card_number: code,
    numbered: num,
    producer: set.split(" ")[0] || "Topps",
    types,
    tag: typeLabel,
    grading,
    condition,
    description: str(f, "notes", 1500),
    price,
    images,
    seller_name: username,
    location,
    owner_id: user.id,
    contact_name: name,
    contact_email: email,
    contact_phone: str(f, "phone", 20) || null,
    status: "pending",
  };
  let { error } = await db.from("listings").insert({ ...row, seller_verified: Boolean(verified) });
  // Databasen mangler seller_verified til supabase/004_vipps.sql er kjørt.
  if (error && /seller_verified/.test(error.message)) ({ error } = await db.from("listings").insert(row));
  if (error) {
    console.error("Kunne ikke lagre annonse", error.message);
    return NextResponse.json({ error: "Annonsen ble ikke lagret. Prøv igjen." }, { status: 500 });
  }

  // Husk stedet på kontoen, så det fylles inn neste gang.
  if (location !== user.location) {
    const { data } = await db.auth.admin.getUserById(user.id);
    await db.auth.admin.updateUserById(user.id, { user_metadata: { ...data.user?.user_metadata, location } });
  }

  if (process.env.ADMIN_EMAIL) {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `Ny annonse til godkjenning: ${title}`,
      text: `${name} (${email}) har lagt ut «${title}» for ${price} kr.\n\nGodkjenn den her: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin`,
    });
  }
  return NextResponse.json({ ok: true, slug });
}
