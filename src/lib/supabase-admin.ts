import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Klient med service-nøkkel. Brukes bare på serveren, for ting vanlige brukere ikke har lov til. */
export function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
