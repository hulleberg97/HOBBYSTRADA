import { NextResponse } from "next/server";
import { ACCESS_COOKIE, accessToken, sitePassword } from "@/lib/private";

/** Tar imot passordet fra /privat og gir tilgang i 90 dager. */
export async function POST(req: Request) {
  const form = await req.formData();
  const next = String(form.get("neste") || "/");
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const password = sitePassword();
  if (!password) return NextResponse.redirect(new URL(safeNext, req.url), 303);
  if (String(form.get("passord") || "") !== password) {
    const back = new URL("/privat", req.url);
    back.searchParams.set("neste", safeNext);
    back.searchParams.set("feil", "1");
    return NextResponse.redirect(back, 303);
  }
  const res = NextResponse.redirect(new URL(safeNext, req.url), 303);
  res.cookies.set(ACCESS_COOKIE, await accessToken(password), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  return res;
}
