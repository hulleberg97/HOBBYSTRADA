"use client";

import { useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase";

/** Innlogget bruker, lest i nettleseren slik at sidene kan mellomlagres. */
export function useUser() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  useEffect(() => {
    const db = browserClient();
    if (!db) return;
    const pick = (u: { email?: string; user_metadata?: Record<string, unknown> } | null | undefined) =>
      setUser(u ? { name: (u.user_metadata?.username as string) || u.email || "" } : null);
    db.auth.getSession().then(({ data }) => pick(data.session?.user));
    const { data } = db.auth.onAuthStateChange((_e, session) => pick(session?.user));
    return () => data.subscription.unsubscribe();
  }, []);
  return user;
}
