"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { displayName } from "@/lib/user-name";

export type ClientUser = { id: string; name: string; fullName: string; email: string };

/** Supabase lagrer innloggingen i en cookie som heter sb-<prosjekt>-auth-token (av og til delt i .0, .1 …). */
const hasAuthCookie = () => /(?:^|;\s*)sb-[^=;]+-auth-token(?:\.\d+)?=/.test(document.cookie);

/**
 * Innlogget bruker, lest i nettleseren slik at sidene kan mellomlagres. undefined mens vi sjekker, null hvis ikke innlogget.
 * Uten innloggingscookie lastes ikke Supabase i det hele tatt, så utloggede besøkende slipper den koden.
 * Sjekkes på nytt ved hvert sidebytte, så innlogging og utlogging fanges opp.
 */
export function useUser() {
  const path = usePathname();
  const [user, setUser] = useState<ClientUser | null | undefined>(process.env.NEXT_PUBLIC_SUPABASE_URL ? undefined : null);
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    if (!hasAuthCookie()) {
      // Satt litt etter, så React ikke må tegne på nytt midt i oppdateringen
      const id = setTimeout(() => setUser(null), 0);
      return () => clearTimeout(id);
    }
    let alive = true;
    let stop = () => {};
    const pick = (u: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null | undefined) =>
      alive &&
      setUser(
        u
          ? {
              id: u.id,
              name: (u.user_metadata?.username as string) || u.email || "",
              fullName: displayName(u.user_metadata, u.email),
              email: u.email ?? "",
            }
          : null,
      );
    import("@/lib/supabase").then(({ browserClient }) => {
      const db = browserClient();
      if (!db || !alive) return;
      db.auth.getSession().then(({ data }) => pick(data.session?.user));
      const { data } = db.auth.onAuthStateChange((_e, session) => pick(session?.user));
      stop = () => data.subscription.unsubscribe();
    });
    return () => {
      alive = false;
      stop();
    };
  }, [path]);
  return user;
}
