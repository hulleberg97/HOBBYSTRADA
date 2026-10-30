import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";
import { safePath } from "@/lib/safe-path";

/** Mottar lenker fra e-post (bekreft konto, nytt passord) og logger brukeren inn. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = safePath(url.searchParams.get("next"));
  const db = await serverClient();
  if (code && db) await db.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(next, url.origin));
}
