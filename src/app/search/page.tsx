import type { Metadata } from "next";
import { Suspense } from "react";
import { Search } from "@/components/Search";
import { getListings } from "@/lib/listings";

export const metadata: Metadata = { title: "Søk" };

// Søket leses på serveren, så treffene står der fra første bilde i stedet for at siden hopper
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await searchParams;
  const listings = await getListings();
  return (
    <Suspense>
      <Search listings={listings} />
    </Suspense>
  );
}
