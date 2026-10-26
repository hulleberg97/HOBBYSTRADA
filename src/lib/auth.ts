import { serverClient } from "./supabase";
import { displayName } from "./user-name";

export async function getUser() {
  const db = await serverClient();
  if (!db) return null;
  const { data } = await db.auth.getUser();
  if (!data.user) return null;
  const meta = data.user.user_metadata ?? {};
  return {
    id: data.user.id,
    email: data.user.email ?? "",
    name: (meta.username as string) || (meta.name as string) || data.user.email || "",
    fullName: displayName(meta, data.user.email),
    location: (meta.location as string) || "",
    // Over 18 (fra Vipps). null når vi ikke vet det ennå, f.eks. kontoer fra før alderssjekken.
    adult: typeof meta.adult === "boolean" ? (meta.adult as boolean) : null,
  };
}

/** Administrator er brukeren med samme e-post som ADMIN_EMAIL. */
export function isAdmin(user: { email: string } | null) {
  const admin = process.env.ADMIN_EMAIL?.toLowerCase();
  return Boolean(user && admin && user.email.toLowerCase() === admin);
}

/** Bekreftet identitet fra Vipps, eller null. Tåler at profiles-tabellen ikke finnes ennå. */
export async function getVerification(userId: string) {
  const { adminClient } = await import("./supabase-admin");
  const db = adminClient();
  if (!db) return null;
  const { data, error } = await db.from("profiles").select("verified_name, verified_at").eq("id", userId).maybeSingle();
  if (error || !data?.verified_at) return null;
  return { name: data.verified_name as string, at: data.verified_at as string };
}

/** Med Vipps slått på må alle være verifisert med Vipps for å legge ut kort og sende meldinger. */
export async function needsVipps(userId: string) {
  const { hasVippsLogin } = await import("./vipps-login");
  return hasVippsLogin() && !(await getVerification(userId));
}
