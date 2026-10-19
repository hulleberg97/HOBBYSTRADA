import "server-only";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { adminClient } from "./supabase-admin";

/** IP-adressen til den som spør (Vercel legger den i x-forwarded-for). */
export async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "ukjent").trim();
}

/**
 * Stopper spam: teller handlinger med samme nøkkel (f.eks. «chat:<bruker>») innenfor et tidsvindu.
 * Returnerer et ferdig 429-svar hvis grensen er nådd, ellers null (og handlingen telles).
 */
export async function rateLimit(
  key: string,
  max: number,
  windowSeconds: number,
  message = "Du har gjort dette for mange ganger på kort tid. Vent litt og prøv igjen.",
) {
  const db = adminClient();
  if (!db) return null;
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();
  const { count, error } = await db.from("rate_events").select("key", { count: "exact", head: true }).eq("key", key).gte("created_at", since);
  // Mangler tabellen (eller databasen svarer ikke), slipper vi forespørselen gjennom heller enn å stoppe alle
  if (error) return null;
  if ((count ?? 0) >= max) return NextResponse.json({ error: message }, { status: 429 });
  await db.from("rate_events").insert({ key });
  return null;
}
