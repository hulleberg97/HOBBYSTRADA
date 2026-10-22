export const BOOSTS = {
  top: { name: "Topp av listen", days: 3, price: 39 },
  featured: { name: "Fremhevet", days: 7, price: 79 },
  frontpage: { name: "Toppannonse", days: 30, price: 199 },
} as const;

export type BoostKey = keyof typeof BOOSTS;

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
