import { createBrowserClient, createServerClient } from "@supabase/ssr";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

export function browserClient() {
  if (!hasSupabase) return null;
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
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
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Kalt fra en serverkomponent – middleware oppdaterer økten.
        }
      },
    },
  });
}
