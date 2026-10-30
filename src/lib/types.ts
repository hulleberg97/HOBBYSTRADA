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
  /** Valgt til forsiden av admin. Tallet gir rekkefølgen blant de valgte (lavest først). Ikke merket på kortet. */
  fanSlot?: number | null;
  /** Eksempelannonse fra HOBBYSTRADA (kolonnen owner_listing). Viser hvordan siden fungerer, er ikke til salgs, kan ikke løftes, kontaktes eller merkes solgt. */
  isExample?: boolean;
};
