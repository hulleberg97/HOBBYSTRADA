import { fanCards } from "./fan";
import { newest } from "./listings";
import type { Listing } from "./types";

/** Flest plasser admin kan feste kort på. */
export const FAN_SLOTS = 10;

/**
 * Raden på forsiden: festede kort på sin plass, alle toppannonser, så Fremhevet, og til slutt de nyeste
 * gratisannonsene opp til `fill` kort. Brukes av forsiden og av forsidemenyen i admin, så de viser det samme.
 */
export function frontpageRow(all: Listing[], fill: number) {
  const active = all.filter((l) => l.status === "active");
  const pinned = active.filter((l) => l.fanSlot);
  const paid = active.filter((l) => l.frontpage);
  const boosted = active.filter((l) => !l.frontpage && l.featured);
  // Helst kort med ekte bilde først
  const fillList = [...newest(active.filter((l) => l.image)), ...newest(active.filter((l) => !l.image))];
  return fanCards(pinned, paid, boosted, fillList, fill);
}

/** Hva som gir kortet plassen i raden, til visning i admin. */
export function rowLabel(l: Listing) {
  if (l.fanSlot) return `Festet · plass ${l.fanSlot}`;
  if (l.frontpage) return "Toppannonse";
  if (l.featured) return "Fremhevet";
  return "Nyeste uten løft";
}
