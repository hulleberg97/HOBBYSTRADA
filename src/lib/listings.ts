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
    bumpedAt: r.bumped_until && new Date(r.bumped_until) > new Date() ? r.bumped_until : null,
    status: r.status,
    ownerId: r.owner_id,
  };
}

export const PUBLIC_COLUMNS =
  "id, slug, title, player, set_name, season, card_number, numbered, producer, types, tag, club, league, grading, condition, description, price, featured_until, bumped_until, frontpage_until, images, seller_name, location, owner_id, status, created_at";

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

export function newest(list: Listing[]) {
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

export function matches(l: Listing, q: string) {
  const hay = norm([l.title, l.player, l.set, l.club, l.league, l.cardNumber, l.numbered, l.types.join(" "), l.season].filter(Boolean).join(" "));
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (q.trim() === "/") return Boolean(l.numbered);
  if (/^rc$/i.test(q.trim())) return l.types.includes("Rookie") || / RC\b/.test(l.title);
  if (/^relic$/i.test(q.trim())) return l.types.includes("Relic") || l.types.includes("Patch");
  return terms.every((t) => hay.includes(t) || (t === "autograf" && hay.includes("autograph")));
}

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
