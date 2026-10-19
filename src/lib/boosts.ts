export const BOOSTS = {
  top: { name: "Topp av listen", days: 3, price: 39 },
  featured: { name: "Fremhevet", days: 7, price: 79 },
  frontpage: { name: "Toppannonse", days: 30, price: 199 },
} as const;

export type BoostKey = keyof typeof BOOSTS;
