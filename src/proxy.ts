import { createServerClient } from "@supabase/ssr";
import { cookieLife } from "@/lib/supabase";
import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, accessToken, sitePassword } from "@/lib/private";

// Sider som leser innloggingen på serveren. Resten mellomlagres og leser innloggingen i nettleseren.
const AUTH_PATHS = ["/account", "/meldinger", "/admin", "/sell", "/api/", "/auth/", "/annonseloft/betaling"];
// Åpne selv i lukket modus: passordsiden, cron-jobben (har egen nøkkel), lenker fra e-post og Vipps, og de juridiske sidene.
const OPEN_PATHS = ["/privat", "/api/privat", "/api/cron/", "/auth/callback", "/auth/vipps/callback", "/robots.txt"];
const LEGAL_PATHS = ["/terms", "/privacy", "/salgsvilkar", "/refund-policy", "/cookie-policy", "/angreskjema"];

const startsWith = (path: string, list: string[]) =>
  list.some((p) => (p.endsWith("/") ? path.startsWith(p) : path === p || path.startsWith(`${p}/`)));

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const password = sitePassword();
  // Lesetilgang uten passord på vercel.app-adressen, så juridiske verktøy kan gå gjennom hele nettsiden før lansering
  const openHost = req.nextUrl.hostname.endsWith(".vercel.app");
  if (password && !openHost && !startsWith(path, OPEN_PATHS) && !startsWith(path, LEGAL_PATHS) && req.cookies.get(ACCESS_COOKIE)?.value !== (await accessToken(password))) {
    if (path.startsWith("/api/")) return NextResponse.json({ error: "Nettsiden er ikke åpnet ennå." }, { status: 401 });
    const gate = new URL("/privat", req.url);
    gate.searchParams.set("neste", path + req.nextUrl.search);
    return NextResponse.redirect(gate);
  }
  return startsWith(path, AUTH_PATHS) ? refreshSession(req) : NextResponse.next();
}

/** Fornyer innloggingen, slik Supabase anbefaler. */
async function refreshSession(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let res = NextResponse.next({ request: req });
  if (!url || !key) return res;
  const db = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, cookieLife(options)));
      },
    },
  });
  await db.auth.getUser();
  return res;
}

// Alle sider unntatt byggefiler og bilder.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|opengraph-image|.*\\.(?:jpe?g|png|webp|svg|gif|ico)$).*)"],
};
