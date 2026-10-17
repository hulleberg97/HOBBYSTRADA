import type { Metadata } from "next";
import { Suspense } from "react";
import { Search } from "@/components/Search";
import { getListings } from "@/lib/listings";

export const revalidate = 60;
export const metadata: Metadata = { title: "Søk" };

export default async function SearchPage() {
  const listings = await getListings();
  return (
    <Suspense>
      <Search listings={listings} />
    </Suspense>
  );
}
