import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";
import { BOOSTS, type BoostKey } from "@/lib/boosts";
import { sendEmail } from "@/lib/email";

const site = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const plan = body.plan as BoostKey;
  if (!(plan in BOOSTS)) return NextResponse.json({ error: "Ukjent pakke." }, { status: 400 });

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
  const { data: order, error } = await db
    .from("boost_orders")
    .insert({ listing_id: listing.id, user_id: user.id, plan, amount: b.price, status: "pending" })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: "Kunne ikke opprette bestillingen." }, { status: 500 });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey) {
    const form = new URLSearchParams({
      mode: "payment",
      success_url: `${site()}/account?loft=ok`,
      cancel_url: `${site()}/annonseloft?annonse=${listing.slug}`,
      customer_email: user.email,
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "nok",
      "line_items[0][price_data][unit_amount]": String(b.price * 100),
      "line_items[0][price_data][product_data][name]": `${b.name} – ${listing.title}`,
      "metadata[order_id]": order.id,
    });
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { authorization: `Bearer ${stripeKey}`, "content-type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const session = await res.json();
    if (!res.ok) {
      console.error("Stripe-feil", session);
      return NextResponse.json({ error: "Betalingen kunne ikke startes. Prøv igjen." }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  }

  // Uten nettbetaling: varsle administrator, som aktiverer løftet manuelt etter betaling.
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
    message: `Bestillingen er mottatt. Vi sender deg betalingsinformasjon på e-post, og løftet starter når ${b.price} kr er betalt.`,
  });
}
