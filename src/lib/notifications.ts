import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { adminClient } from "./supabase-admin";

/** Typer varsel. Styrer ikonet i varsellisten. */
export type NotificationKind = "approved" | "rejected" | "boost" | "boost_expiring" | "saved_search";

export type Notification = { id: string; kind: NotificationKind; title: string; body: string | null; href: string | null; read: boolean; createdAt: string };

/**
 * Legger til et varsel. Feiler stille hvis tabellen ikke finnes ennå (supabase/010_varsler.sql), så ingenting
 * annet stopper av at varsler mangler.
 */
export async function addNotification(db: SupabaseClient, userId: string | null | undefined, n: { kind: NotificationKind; title: string; body?: string; href?: string }) {
  if (!userId) return;
  const { error } = await db.from("notifications").insert({ user_id: userId, kind: n.kind, title: n.title, body: n.body ?? null, href: n.href ?? null });
  if (error) console.error("Kunne ikke lagre varsel", error.message);
}

/** De siste varslene til brukeren, nyeste først. */
export async function listNotifications(userId: string): Promise<Notification[]> {
  const db = adminClient();
  if (!db) return [];
  const { data, error } = await db.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50);
  if (error) return [];
  return (data ?? []).map((r) => ({ id: r.id, kind: r.kind, title: r.title, body: r.body, href: r.href, read: Boolean(r.read_at), createdAt: r.created_at }));
}

/** Antall uleste varsler, til prikken på bjella. */
export async function unreadNotifications(userId: string) {
  const db = adminClient();
  if (!db) return 0;
  const { count, error } = await db.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId).is("read_at", null);
  return error ? 0 : (count ?? 0);
}

/** Merker alle varslene som lest (når varsellisten åpnes). */
export async function markNotificationsRead(userId: string) {
  const db = adminClient();
  if (!db) return;
  await db.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", userId).is("read_at", null);
}
