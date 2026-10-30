import { NextResponse } from "next/server";
import { ACCESS_COOKIE, accessToken, guestToken, sitePassword } from "@/lib/private";

/**
 * Gjestelenke i lukket modus: /api/privat/gjest?n=<nøkkel> gir tilgang i 30 dager uten å skrive passordet.
 * Nøkkelen regnes ut fra passordet, så den slutter å virke når passordet byttes eller lukket modus skrus av.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const password = sitePassword();
  if (!password) return NextResponse.redirect(new URL("/", url.origin), 303);
  const key = url.searchParams.get("n") ?? "";
  if (!key || key !== (await guestToken(password))) {
    return NextResponse.redirect(new URL("/privat?feil=1", url.origin), 303);
  }
  const res = NextResponse.redirect(new URL("/", url.origin), 303);
  res.cookies.set(ACCESS_COOKIE, await accessToken(password), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
