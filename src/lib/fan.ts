import type { Listing } from "./types";

/** Gratisannonser fyller bare opp til dette antallet, så raden ikke står tom. Admin kan endre tallet. */
export const DEFAULT_FILL = 8;

/**
 * Kortene i raden på forsiden, i rekkefølgen de vises frem.
 * 1. Kort admin har valgt til forsiden kommer først, i rekkefølgen de ble valgt (fanSlot).
 * 2. Toppannonser er alltid med hele perioden, uansett hvor mange de er.
 * 3. Fremhevede annonser er alltid med hele perioden, etter toppannonsene.
 * 4. Nyeste gratisannonser fyller bare opp til fillMax (standard DEFAULT_FILL).
 */
export function fanCards(pinned: Listing[], paid: Listing[], boosted: Listing[], fill: Listing[], fillMax = DEFAULT_FILL) {
  const first = [...pinned].sort((a, b) => (a.fanSlot ?? 0) - (b.fanSlot ?? 0));
  const placed = new Set(first.map((l) => l.slug));
  const rest: Listing[] = [];
  const take = (list: Listing[], cap: number) => {
    for (const l of list) {
      if (placed.has(l.slug)) continue;
      if (pinned.length + rest.length >= cap) return;
      placed.add(l.slug);
      rest.push(l);
    }
  };
  take(paid, Infinity);
  take(boosted, Infinity);
  take(fill, fillMax);
  return [...first, ...rest];
}
