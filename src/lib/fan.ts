import type { Listing } from "./types";

const MAX_CARDS = 10;

/**
 * Kortene i vifta, i rekkefølgen de vises frem. Kort admin har festet står på sin faste plass (1 = først).
 * Toppannonser er med hele perioden – er de flere enn de ledige plassene, blir vifta lengre. Resten er de nyeste.
 */
export function fanCards(pinned: Listing[], paid: Listing[], fill: Listing[]) {
  const taken = new Set(pinned.map((l) => l.slug));
  const free = 5 - pinned.length;
  const extra = paid.length > free ? paid.slice(0, MAX_CARDS - pinned.length) : [...paid, ...fill];
  const candidates = extra.filter((l, i, all) => !taken.has(l.slug) && all.findIndex((x) => x.slug === l.slug) === i);
  const size = Math.max(5, pinned.length + Math.min(candidates.length, MAX_CARDS - pinned.length));
  const ranked: (Listing | undefined)[] = Array(size).fill(undefined);
  for (const l of pinned) if (l.fanSlot) ranked[l.fanSlot - 1] = l;
  for (let i = 0; i < size; i++) if (!ranked[i]) ranked[i] = candidates.shift();
  return ranked.filter(Boolean) as Listing[];
}
