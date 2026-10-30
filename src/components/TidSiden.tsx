"use client";

import { useSyncExternalStore } from "react";
import { timeAgo } from "@/lib/format";

/**
 * Relativ tid («For 3 timer siden») som regnes ut i nettleseren og oppdateres hvert minutt.
 * Sidene mellomlagres på serveren, så en tid som bare ble regnet ut der, ville stått stille.
 * «kort»: uten «For» og «siden» («3 timer»), «utenFor»: uten «For» («3 timer siden»).
 */
const MINUTT = 60_000;
const subscribe = (tick: () => void) => {
  const id = setInterval(tick, MINUTT);
  return () => clearInterval(id);
};
// Nå, avrundet til hele minutter, så alle tidene på siden oppdateres samtidig
const naa = () => Math.floor(Date.now() / MINUTT) * MINUTT;
// På serveren (og under hydrering) brukes gjengivelsestidspunktet; etterpå tar minuttklokken over
const paaServer = () => Date.now();

export function TidSiden({ iso, variant = "full", lowercase = false }: { iso: string; variant?: "full" | "utenFor" | "kort"; lowercase?: boolean }) {
  const now = useSyncExternalStore(subscribe, naa, paaServer);
  let t = timeAgo(iso, now);
  if (variant !== "full") t = t.replace(/^For /, "");
  if (variant === "kort") t = t.replace(/ siden$/, "");
  if (lowercase) t = t.toLowerCase();
  return <span suppressHydrationWarning>{t}</span>;
}
