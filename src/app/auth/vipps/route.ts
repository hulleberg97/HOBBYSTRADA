import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { authorizeUrl, hasVippsLogin } from "@/lib/vipps-login";

/** Starter innlogging med Vipps. ?next= er siden brukeren sendes til etterpå. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!hasVippsLogin()) return NextResponse.redirect(new URL("/auth/login", url.origin));
  const next = url.searchParams.get("next") ?? "/account";
  const adult = url.searchParams.get("alder") === "1"; // egenerklæring om 18 år, kreves for nye kontoer
  const state = randomBytes(16).toString("hex");
  const nonce = randomBytes(16).toString("hex");
  const res = NextResponse.redirect(await authorizeUrl({ state, nonce, origin: url.origin }));
  res.cookies.set("vipps_oidc", JSON.stringify({ state, nonce, adult, next: next.startsWith("/") ? next : "/account" }), {
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "lax",
    maxAge: 600,
    path: "/auth/vipps",
  });
  return res;
}
