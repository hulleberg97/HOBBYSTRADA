import type { RealtimeChannel } from "@supabase/supabase-js";
import { browserClient } from "./supabase";

/**
 * Lytter på endringer i databasen i sanntid. Venter til innloggingen er lest inn før kanalen kobles til,
 * ellers kobler den seg til som utlogget og får ingen meldinger (databasen viser bare egne samtaler).
 * Returnerer en funksjon som kobler fra.
 */
export function listen(name: string, setup: (channel: RealtimeChannel) => RealtimeChannel) {
  const db = browserClient();
  if (!db) return () => {};
  let channel: RealtimeChannel | null = null;
  let stopped = false;
  db.auth.getSession().then(({ data }) => {
    if (stopped || !data.session) return;
    db.realtime.setAuth(data.session.access_token);
    channel = setup(db.channel(name)).subscribe();
  });
  return () => {
    stopped = true;
    if (channel) db.removeChannel(channel);
  };
}
