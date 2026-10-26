import { createBrowserClient, createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Innloggingskapselen (sb-…-auth-token) fornyes ved hvert besøk og slettes senest 90 dager etter siste besøk.
 * Biblioteket setter alltid 400 dager selv, så levetiden overstyres der kapselen skrives.
 */
export const COOKIE_DAYS = 90;
export const cookieLife = <T extends { maxAge?: number }>(options: T): T => ({ ...options, ...(options.maxAge ? { maxAge: 60 * 60 * 24 * COOKIE_DAYS } : {}) });

/** Klient uten innlogging, for offentlige data. Virker også mens siden bygges. */
export function publicClient() {
  if (!hasSupabase) return null;
  return createClient(supabaseUrl!, supabaseAnonKey!, { auth: { persistSession: false } });
}

export function browserClient() {
  if (!hasSupabase) return null;
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll: () => parseCookieHeader(document.cookie).map((c) => ({ name: c.name, value: c.value ?? "" })),
      setAll: (list) => list.forEach(({ name, value, options }) => (document.cookie = serializeCookieHeader(name, value, cookieLife(options)))),
    },
  });
}

export async function serverClient() {
  if (!hasSupabase) return null;
  const { cookies } = await import("next/headers");
  const store = await cookies();
  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, cookieLife(options)));
        } catch {
          // Kalt fra en serverkomponent – middleware oppdaterer økten.
        }
      },
    },
  });
}
