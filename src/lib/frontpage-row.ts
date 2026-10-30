import { fanCards } from "./fan";
import { newest } from "./listings";
import type { Listing } from "./types";

/**
 * Raden på forsiden: toppannonser, så Fremhevet, så kort admin har valgt. Er det ingen av delene, vises de nyeste.
 * Brukes av forsiden og av forsidemenyen i admin, så de viser det samme.
 */
export function frontpageRow(all: Listing[]) {
  const active = all.filter((l) => l.status === "active");
  const pinned = active.filter((l) => l.fanSlot);
  const paid = active.filter((l) => l.frontpage);
  const boosted = active.filter((l) => !l.frontpage && l.featured);
  // Helst kort med ekte bilde først
  const fillList = [...newest(active.filter((l) => l.image)), ...newest(active.filter((l) => !l.image))];
  return fanCards(pinned, paid, boosted, fillList);
}

/** Hva som gir kortet plassen i raden, til visning i admin. */
export function rowLabel(l: Listing) {
  if (l.fanSlot) return "Valgt til forsiden";
  if (l.frontpage) return "Toppannonse";
  if (l.featured) return "Fremhevet";
  return "Nyeste (reserve når ingen er valgt)";
}
