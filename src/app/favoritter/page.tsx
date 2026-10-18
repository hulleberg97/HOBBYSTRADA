import type { Metadata } from "next";
import { Favorites } from "@/components/Favorites";
import { getListings } from "@/lib/listings";

export const revalidate = 60;
export const metadata: Metadata = { title: "Favoritter", robots: { index: false } };

export default async function FavoritesPage() {
  return <Favorites listings={await getListings()} />;
}
