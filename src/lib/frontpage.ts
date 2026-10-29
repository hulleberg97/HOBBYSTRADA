import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { boostDate, FRONTPAGE_SLOTS } from "./boosts";

/** Hvor mange faste plasser på forsiden som er tatt av aktive toppannonser, og når den første blir ledig. */
export async function frontpageAvailability(db: SupabaseClient) {
  const now = new Date().toISOString();
  const { data } = await db.from("listings").select("frontpage_until").eq("status", "active").gt("frontpage_until", now).order("frontpage_until", { ascending: true });
  const rows = (data ?? []) as { frontpage_until: string }[];
  const taken = rows.length;
  const nextFree = rows[0]?.frontpage_until ?? null;
  return { taken, slots: FRONTPAGE_SLOTS, soldOut: taken >= FRONTPAGE_SLOTS, nextFree, nextFreeText: nextFree ? boostDate(nextFree) : "" };
}
