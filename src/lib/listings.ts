import seed from "@/data/listings.json";
import { publicClient } from "./supabase";
import type { Listing } from "./types";

type Row = {
  id: string;
  slug: string;
  title: string;
  player: string;
  set_name: string | null;
  season: string | null;
  card_number: string | null;
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
  featured_until: string | null;
  images: string[] | null;
  seller_name: string;
  location: string | null;
  created_at: string;
  updated_at?: string;
  bumped_until: string | null;
  frontpage_until: string | null;
  status: Listing["status"];
  owner_id: string | null;
};

export function fromRow(r: Row): Listing {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    player: r.player,
    set: r.set_name,
    season: r.season,
    cardNumber: r.card_number,
    numbered: r.numbered,
    producer: r.producer,
    types: r.types ?? [],
    tag: r.tag,
    club: r.club,
    league: r.league,
    grading: r.grading,
    condition: r.condition,
    description: r.description,
    price: Number(r.price),
    featured: Boolean(r.featured_until && new Date(r.featured_until) > new Date()),
    frontpage: Boolean(r.frontpage_until && new Date(r.frontpage_until) > new Date()),
    image: r.images?.[0] ?? null,
    images: r.images ?? [],
    seller: r.seller_name,
    location: r.location,
    createdAt: r.created_at,
    soldAt: r.status === "sold" ? (r.updated_at ?? r.created_at) : null,
    bumpedAt: r.bumped_until && new Date(r.bumped_until) > new Date() ? r.bumped_until : null,
    status: r.status,
    ownerId: r.owner_id,
  };
}

export const PUBLIC_COLUMNS =
  "id, slug, title, player, set_name, season, card_number, numbered, producer, types, tag, club, league, grading, condition, description, price, featured_until, bumped_until, frontpage_until, images, seller_name, location, owner_id, status, created_at, updated_at";

const seedListings = (seed as Listing[]).map((l) => ({ ...l, images: l.image ? [l.image] : [] }));

/** Markedsrekkefølge: løftede annonser («Topp av listen») først, deretter nyeste. */
export function marketOrder(list: Listing[]) {
  const key = (l: Listing) => l.bumpedAt ?? l.createdAt;
  return [...list].sort((a, b) => key(b).localeCompare(key(a)));
}

export async function getListings(): Promise<Listing[]> {
  const db = publicClient();
  if (!db) return marketOrder(seedListings.filter((l) => l.status === "active"));
  const { data, error } = await db.from("listings").select(PUBLIC_COLUMNS).eq("status", "active");
  if (error) {
    console.error("Kunne ikke hente annonser", error.message);
    return marketOrder(seedListings);
  }
  return marketOrder((data as Row[]).map(fromRow));
}

export async function getListing(slug: string): Promise<Listing | null> {
  const db = publicClient();
  if (!db) return seedListings.find((l) => l.slug === slug) ?? null;
  const { data, error } = await db.from("listings").select(PUBLIC_COLUMNS).eq("slug", slug).maybeSingle();
  if (error) return seedListings.find((l) => l.slug === slug) ?? null;
  return data ? fromRow(data as Row) : null;
}

/** Alle aktive og solgte annonser fra én selger. «hobbystrada» er annonsene uten eier (lagt ut av HOBBYSTRADA). */
export async function getSellerListings(sellerId: string): Promise<Listing[]> {
  const db = publicClient();
  const own = sellerId === "hobbystrada";
  if (!db) return own ? marketOrder(seedListings) : [];
  let query = db.from("listings").select(PUBLIC_COLUMNS).in("status", ["active", "sold"]);
  query = own ? query.is("owner_id", null) : query.eq("owner_id", sellerId);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return own ? marketOrder(seedListings) : [];
  return (data as Row[]).map(fromRow);
}

/** Solgte kort, nyeste salg først. Brukes i prisarkivet. */
export async function getSoldListings(): Promise<Listing[]> {
  const db = publicClient();
  if (!db) return [];
  const { data, error } = await db.from("listings").select(PUBLIC_COLUMNS).eq("status", "sold").order("updated_at", { ascending: false }).limit(500);
  if (error) return [];
  return (data as Row[]).map(fromRow);
}

export function newest(list: Listing[]) {
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export { matches } from "./filters";
import { matches } from "./filters";

export type Category = { key: string; label: string; href: string; count: (l: Listing[]) => number };

export function categoryCounts(list: Listing[]) {
  return {
    autograf: list.filter((l) => matches(l, "autograf")).length,
    relic: list.filter((l) => matches(l, "relic")).length,
    numbered: list.filter((l) => matches(l, "/")).length,
    rookie: list.filter((l) => matches(l, "RC")).length,
    base: list.filter((l) => l.types.includes("Base")).length,
    all: list.length,
  };
}
