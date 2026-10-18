"use client";

import { useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase";
import { displayName } from "@/lib/user-name";

export type ClientUser = { id: string; name: string; fullName: string; email: string };

/** Innlogget bruker, lest i nettleseren slik at sidene kan mellomlagres. undefined mens vi sjekker, null hvis ikke innlogget. */
export function useUser() {
  const [user, setUser] = useState<ClientUser | null | undefined>(process.env.NEXT_PUBLIC_SUPABASE_URL ? undefined : null);
  useEffect(() => {
    const db = browserClient();
    if (!db) return;
    const pick = (u: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null | undefined) =>
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
    db.auth.getSession().then(({ data }) => pick(data.session?.user));
    const { data } = db.auth.onAuthStateChange((_e, session) => pick(session?.user));
    return () => data.subscription.unsubscribe();
  }, []);
  return user;
}
