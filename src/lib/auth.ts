import { serverClient } from "./supabase";

export async function getUser() {
  const db = await serverClient();
  if (!db) return null;
  const { data } = await db.auth.getUser();
  if (!data.user) return null;
  const meta = data.user.user_metadata ?? {};
  return { id: data.user.id, email: data.user.email ?? "", name: (meta.username as string) || (meta.name as string) || data.user.email || "" };
}
