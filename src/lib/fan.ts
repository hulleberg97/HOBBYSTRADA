import type { Listing } from "./types";

/** Gratisannonser fyller bare opp til dette antallet, så raden ikke står tom. */
const MIN_CARDS = 8;

/**
 * Kortene i raden på forsiden, i rekkefølgen de vises frem.
 * 1. Kort admin har festet står på sin faste plass (1 = først).
 * 2. Toppannonser er alltid med hele perioden, uansett hvor mange de er.
 * 3. Fremhevede annonser er alltid med hele perioden, etter toppannonsene.
 * 4. Nyeste gratisannonser fyller bare opp til MIN_CARDS.
 */
export function fanCards(pinned: Listing[], paid: Listing[], boosted: Listing[], fill: Listing[]) {
  const placed = new Set(pinned.map((l) => l.slug));
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
  take(fill, MIN_CARDS);
  const size = Math.max(pinned.length + rest.length, ...pinned.map((l) => l.fanSlot ?? 0));
  const ranked: (Listing | undefined)[] = Array(size).fill(undefined);
  for (const l of pinned) if (l.fanSlot) ranked[l.fanSlot - 1] = l;
  for (let i = 0; i < size; i++) if (!ranked[i]) ranked[i] = rest.shift();
  return ranked.filter(Boolean) as Listing[];
}
