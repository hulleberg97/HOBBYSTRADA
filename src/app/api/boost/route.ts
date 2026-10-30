import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";
import { BOOSTS, FRONTPAGE_SLOTS, type BoostKey } from "@/lib/boosts";
import { frontpageAvailability } from "@/lib/frontpage";
import { sendEmail } from "@/lib/email";
import { createPayment, hasVipps } from "@/lib/vipps";
import { rateLimit } from "@/lib/rate-limit";

const site = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const plan = body.plan as BoostKey;
  if (!(plan in BOOSTS)) return NextResponse.json({ error: "Ukjent pakke." }, { status: 400 });
  if (body.consent !== true || body.consentLoss !== true) return NextResponse.json({ error: "Kryss av for begge punktene om angrerett." }, { status: 400 });
  // Tidspunktet kunden krysset av for hver bekreftelse, så det kan dokumenteres (angrerettloven §§ 19 og 22 c)
  const stamp = (v: unknown) => {
    const t = new Date(String(v ?? "")).getTime();
    return Number.isFinite(t) && t <= Date.now() + 60e3 ? new Date(t).toISOString() : new Date().toISOString();
  };
  const consentStartAt = stamp(body.consentAt);
  const consentLossAt = stamp(body.consentLossAt);

  const db = adminClient();
  const user = await getUser();
  if (!db) return NextResponse.json({ error: "Annonseløft er ikke slått på ennå." }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Logg inn for å løfte annonsen din." }, { status: 401 });
  if (user.adult === false) return NextResponse.json({ error: "Du må være 18 år for å kjøpe annonseløft." }, { status: 403 });
  const limited = await rateLimit(`boost:${user.id}`, 10, 3600, "Du har startet mange bestillinger på kort tid. Vent litt og prøv igjen.");
  if (limited) return limited;

  // Godta både lenke og tittel
  const text = String(body.listing ?? "").trim();
  const slug = text.match(/\/annonse\/([^/?#\s]+)/)?.[1] ?? text;
  type Found = { id: string; slug: string; title: string; owner_id: string | null; status?: string | null; owner_listing?: boolean | null; frontpage_until?: string | null };
  // owner_listing kommer med supabase/016_innehaver.sql; før det hentes annonsen uten.
  const find = async (cols: string) => {
    const bySlug = await db.from("listings").select(cols).eq("slug", slug).maybeSingle();
    if (bySlug.data) return bySlug;
    return db.from("listings").select(cols).eq("owner_id", user.id).ilike("title", `%${text}%`).limit(1).maybeSingle();
  };
  let found = await find("id, slug, title, owner_id, status, owner_listing, frontpage_until");
  if (found.error && /owner_listing/.test(found.error.message)) found = await find("id, slug, title, owner_id, status, frontpage_until");
  const listing = found.data as unknown as Found | null;
  if (!listing) return NextResponse.json({ error: "Velg en av annonsene dine øverst på siden." }, { status: 404 });

  if (listing.owner_id !== user.id && !isAdmin(user)) {
    return NextResponse.json({ error: "Du kan bare løfte dine egne annonser." }, { status: 403 });
  }
  if (listing.owner_listing) return NextResponse.json({ error: "Eksempelannonser kan ikke få annonseløft." }, { status: 403 });
  // Bare aktive annonser kan løftes. Skjulte, solgte og ikke godkjente annonser vises ikke, så et løft ville vært bortkastet.
  if (listing.status && listing.status !== "active") return NextResponse.json({ error: "Annonsen må være aktiv for å kunne løftes." }, { status: 400 });

  // Ikke flere aktive toppannonser enn det er faste plasser på forsiden
  if (plan === "frontpage") {
    const live = listing.frontpage_until && new Date(listing.frontpage_until).getTime() > Date.now();
    const slots = await frontpageAvailability(db);
    if (!live && slots.taken >= FRONTPAGE_SLOTS) {
      return NextResponse.json({ error: `Toppannonse er utsolgt. Det er allerede ${FRONTPAGE_SLOTS} aktive toppannonser, ledig fra ${slots.nextFreeText}.` }, { status: 409 });
    }
  }

  const b = BOOSTS[plan];
  const full: Record<string, unknown> = {
    listing_id: listing.id,
    user_id: user.id,
    buyer_email: user.email,
    plan,
    amount: b.price,
    status: "pending",
    listing_title: listing.title,
    buyer_name: user.fullName,
    consent_at: consentStartAt,
    consent_start_at: consentStartAt,
    consent_loss_at: consentLossAt,
  };
  // Kolonner som kommer med senere SQL-filer (003, 009, 011, 016): mangler en, lagres bestillingen uten den.
  const later = ["consent_start_at", "consent_loss_at", "buyer_name", "listing_title", "consent_at"];
  let { data: order, error } = await db.from("boost_orders").insert(full).select("id").single();
  while (error) {
    const missing = later.find((c) => error && error.message.includes(c));
    if (!missing || !(missing in full)) break;
    delete full[missing];
    ({ data: order, error } = await db.from("boost_orders").insert(full).select("id").single());
  }
  if (error || !order) return NextResponse.json({ error: "Kunne ikke opprette bestillingen." }, { status: 500 });

  if (hasVipps()) {
    try {
      const url = await createPayment({
        reference: order.id,
        amount: b.price,
        description: `${b.name}: ${listing.title}`,
        returnUrl: `${site()}/annonseloft/betaling?ordre=${order.id}`,
      });
      return NextResponse.json({ url });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: "Vipps-betalingen kunne ikke startes. Prøv igjen." }, { status: 502 });
    }
  }

  // Uten Vipps-avtale: varsle administrator, som sender Vipps-forespørsel og aktiverer løftet manuelt.
  if (process.env.ADMIN_EMAIL) {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      replyTo: user.email,
      subject: `Bestilling: ${b.name} – ${listing.title}`,
      text: `${user.name} (${user.email}) har bestilt ${b.name} (${b.price} kr) for «${listing.title}».\n\n${site()}/admin`,
    });
  }
  return NextResponse.json({
    ok: true,
    message: `Bestillingen er mottatt. Du får en betalingsforespørsel på Vipps, og løftet starter når ${b.price} kr er betalt.`,
  });
}
