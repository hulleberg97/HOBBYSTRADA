import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";
import { BOOSTS, type BoostKey } from "@/lib/boosts";
import { sendEmail } from "@/lib/email";
import { createPayment, hasVipps } from "@/lib/vipps";

const site = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const plan = body.plan as BoostKey;
  if (!(plan in BOOSTS)) return NextResponse.json({ error: "Ukjent pakke." }, { status: 400 });
  if (body.consent !== true) return NextResponse.json({ error: "Bekreft at løftet kan starte med en gang." }, { status: 400 });

  const db = adminClient();
  const user = await getUser();
  if (!db) return NextResponse.json({ error: "Annonseløft er ikke slått på ennå." }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Logg inn for å løfte annonsen din." }, { status: 401 });

  // Godta både lenke og tittel
  const text = String(body.listing ?? "").trim();
  const slug = text.match(/\/products\/([^/?#\s]+)/)?.[1] ?? text;
  let { data: listing } = await db.from("listings").select("id, slug, title, owner_id").eq("slug", slug).maybeSingle();
  if (!listing) {
    const found = await db.from("listings").select("id, slug, title, owner_id").eq("owner_id", user.id).ilike("title", `%${text}%`).limit(1).maybeSingle();
    listing = found.data;
  }
  if (!listing) return NextResponse.json({ error: "Fant ikke annonsen. Lim inn lenken til den." }, { status: 404 });

  if (listing.owner_id !== user.id && !isAdmin(user)) {
    return NextResponse.json({ error: "Du kan bare løfte dine egne annonser." }, { status: 403 });
  }

  const b = BOOSTS[plan];
  const row = { listing_id: listing.id, user_id: user.id, buyer_email: user.email, plan, amount: b.price, status: "pending" };
  let { data: order, error } = await db
    .from("boost_orders")
    .insert({ ...row, listing_title: listing.title, consent_at: new Date().toISOString() })
    .select("id")
    .single();
  // Databasen mangler consent_at til supabase/003_juridisk.sql er kjørt.
  // Databasen mangler listing_title til supabase/009_betalinger_personvern.sql er kjørt.
  if (error && /listing_title/.test(error.message))
    ({ data: order, error } = await db.from("boost_orders").insert({ ...row, consent_at: new Date().toISOString() }).select("id").single());
  if (error && /consent_at/.test(error.message)) ({ data: order, error } = await db.from("boost_orders").insert(row).select("id").single());
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
