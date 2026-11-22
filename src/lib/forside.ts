import { formatPrice } from "./format";
import { frontpageRow } from "./frontpage-row";
import type { Listing } from "./types";
import type { KarusellKort } from "@/components/KortKarusell";

/**
 * BRYTER for forsiden på telefon og nettbrett:
 * «original»: forsiden slik den var før 22. november (samme oppsett som PC: overskrift, knapper, kategorier, «Nyeste annonser» osv.),
 *             men med scenen (KortScene) i stedet for den rullende kortraden. Bunnmenyen er med.
 * «ny»:       den nye telefonforsiden i MobilForside.tsx (overskrift, karusell, søk, faner og annonser).
 */
export const MOBIL_FORSIDE = "original" as "original" | "ny";

/** Hvor mange kort karusellen viser fra forsideraden (Toppannonser, Fremhevet, så kortene admin har valgt). */
export const I_KARUSELLEN = 6;

/** Kortene til karusellen: samme kort som kortraden på PC, i samme rekkefølge, med det karusellen trenger å vise. */
export function karusellKort(all: Listing[]): KarusellKort[] {
  return frontpageRow(all)
    .filter((l) => l.image)
    .slice(0, I_KARUSELLEN)
    .map((l) => ({
      href: `/annonse/${l.slug}`,
      src: l.image!,
      navn: l.player,
      sett: l.set ?? "",
      pris: formatPrice(l.price),
      sted: l.location ?? "",
      // Typen uten «Nummerert» (opplaget står ved siden av), høyst to typer
      type: l.types.filter((t) => t !== "Nummerert").slice(0, 2).join(" + "),
      opplag: l.numbered ?? "",
      eksempel: Boolean(l.isExample),
      loft: l.frontpage ? "Toppannonse" : l.featured ? "Fremhevet" : "",
    }));
}
