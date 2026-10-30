import "server-only";
import { adminClient } from "./supabase-admin";

/** Hvor mange gratisannonser som fyller forsiden når det ikke er nok annonser med løft. Standard 8. */
export const FORSIDE_FYLL = "forside_fyll";

/** Henter en innstilling. Mangler tabellen eller nøkkelen, brukes standardverdien. */
export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const db = adminClient();
  if (!db) return fallback;
  const { data, error } = await db.from("site_settings").select("value").eq("key", key).maybeSingle();
  if (error || !data) return fallback;
  return data.value as T;
}

export async function setSetting(key: string, value: unknown) {
  const db = adminClient();
  if (!db) return { error: "Databasen er ikke tilgjengelig." };
  const { error } = await db.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
  return { error: error?.message ?? null };
}
