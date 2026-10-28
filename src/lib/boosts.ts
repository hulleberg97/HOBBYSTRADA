export const BOOSTS = {
  top: { name: "Topp av listen", days: 3, price: 39 },
  featured: { name: "Fremhevet", days: 7, price: 79 },
  frontpage: { name: "Toppannonse", days: 30, price: 199 },
} as const;

export type BoostKey = keyof typeof BOOSTS;

/** Faste plasser for toppannonser i kortraden på forsiden. Flere aktive toppannonser enn dette selges ikke. */
export const FRONTPAGE_SLOTS = 5;

/** Hva hver pakke gir, med samme ordlyd på /annonseloft, forsiden og i salgsvilkårene. */
export const BOOST_PERKS: Record<BoostKey, string[]> = {
  top: ["Foran vanlige annonser", "Kan vises i kortraden på forsiden"],
  featured: ["Gullmerke og gullramme", "Foran Topp av listen og vanlige annonser", "Kan vises i kortraden på forsiden"],
  frontpage: ["Alt i Fremhevet", "Først i markedet", "Fast plass i kortraden på forsiden"],
};

/** Hva løftet gjør, slik det står i bekreftelsen til kunden. Samme løfter som på annonseløft-siden. */
export const BOOST_EFFECT: Record<BoostKey, string> = {
  top: "Annonsen ligger nå over alle vanlige annonser i markedet.",
  featured: "Annonsen har nå gullmerke og gullramme, og vises foran annonser med Topp av listen og vanlige annonser.",
  frontpage: "Annonsen har nå fast plass i kortraden på forsiden, og ligger først i markedet.",
};

/** Dato i norsk tid, f.eks. «25. oktober». */
export const boostDate = (d: string) => new Date(d).toLocaleDateString("nb-NO", { day: "numeric", month: "long", timeZone: "Europe/Oslo" });

type BoostDates = { frontpage_until?: string | null; featured_until?: string | null; bumped_until?: string | null };

/** Det sterkeste aktive løftet på en annonse, og når det varer til. */
export function activeBoost(r: BoostDates) {
  const live = (d?: string | null) => (d && new Date(d).getTime() > Date.now() ? d : null);
  const f = live(r.frontpage_until), m = live(r.featured_until), t = live(r.bumped_until);
  if (f) return { name: BOOSTS.frontpage.name, until: f };
  if (m) return { name: BOOSTS.featured.name, until: m };
  if (t) return { name: BOOSTS.top.name, until: t };
  return null;
}
