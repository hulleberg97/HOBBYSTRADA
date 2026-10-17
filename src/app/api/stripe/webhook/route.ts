import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase-admin";
import { activateBoost } from "@/lib/activate-boost";

function verify(payload: string, header: string | null, secret: string) {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const expected = createHmac("sha256", secret).update(`${parts.t}.${payload}`).digest("hex");
  const sig = header
    .split(",")
    .filter((p) => p.startsWith("v1="))
    .map((p) => p.slice(3));
  const fresh = Math.abs(Date.now() / 1000 - Number(parts.t)) < 300;
  return fresh && sig.some((s) => s.length === expected.length && timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const db = adminClient();
  if (!secret || !db) return NextResponse.json({ error: "Ikke satt opp" }, { status: 503 });
  const payload = await req.text();
  if (!verify(payload, req.headers.get("stripe-signature"), secret)) return NextResponse.json({ error: "Ugyldig signatur" }, { status: 400 });
  const event = JSON.parse(payload);
  if (event.type === "checkout.session.completed" && event.data.object.payment_status === "paid") {
    await activateBoost(db, event.data.object.metadata.order_id);
  }
  return NextResponse.json({ received: true });
}
