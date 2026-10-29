export type ListingStatus = "pending" | "active" | "sold" | "hidden" | "rejected";

export type Listing = {
  id?: string;
  slug: string;
  title: string;
  player: string;
  set: string | null;
  season: string | null;
  cardNumber: string | null;
  numbered: string | null;
  producer: string;
  types: string[];
  tag: string;
  club: string | null;
  league: string | null;
  grading: string | null;
  condition: string | null;
  description: string;
  price: number;
  featured: boolean;
  frontpage?: boolean;
  image: string | null;
  images?: string[];
  seller: string;
  sellerVerified?: boolean;
  location: string | null;
  createdAt: string;
  bumpedAt?: string | null;
  soldAt?: string | null;
  status: ListingStatus;
  ownerId?: string | null;
  /** Fast plass i kortraden på forsiden (1 = først), satt av admin. Merkes «Valgt av HOBBYSTRADA». */
  fanSlot?: number | null;
  /** Annonse fra innehaveren av HOBBYSTRADA. Merkes, og kan verken løftes eller festes. */
  ownerListing?: boolean;
  /** Selgeren har godtatt et bud i chatten. Vises som «Reservert» til kortet merkes solgt. */
  reserved?: boolean;
};
