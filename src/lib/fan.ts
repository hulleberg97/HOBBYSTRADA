import type { Listing } from "./types";
import { examplesLast } from "./filters";

/** Når ingen kort er valgt eller løftet, fylles raden med så mange av de nyeste annonsene, så forsiden ikke står tom. */
export const FALLBACK_FILL = 8;

/**
 * Kortene i raden på forsiden, i rekkefølgen de vises frem.
 * 1. Toppannonser (betalt «Først på forsiden»).
 * 2. Fremhevede annonser.
 * 3. Kort admin har valgt til forsiden, i rekkefølgen de ble valgt (fanSlot).
 * 4. Er raden tom etter det, de nyeste annonsene opp til FALLBACK_FILL.
 * Eksempelannonser vises alltid etter alle ekte annonser i raden.
 */
export function fanCards(pinned: Listing[], paid: Listing[], boosted: Listing[], fill: Listing[]) {
  const chosen = [...pinned].sort((a, b) => (a.fanSlot ?? 0) - (b.fanSlot ?? 0));
  const placed = new Set<string>();
  const out: Listing[] = [];
  const take = (list: Listing[], cap: number) => {
    for (const l of list) {
      if (placed.has(l.slug) || out.length >= cap) continue;
      placed.add(l.slug);
      out.push(l);
    }
  };
  take(paid, Infinity);
  take(boosted, Infinity);
  take(chosen, Infinity);
  if (!out.length) take(examplesLast(fill), FALLBACK_FILL);
  return examplesLast(out);
}
