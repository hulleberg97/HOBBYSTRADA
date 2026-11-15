import type { Metadata } from "next";
import { Suspense } from "react";
import { Search } from "@/components/Search";
import { getListings } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Søk etter fotballkort",
  description: "Søk blant fotballkort til salgs i Norge. Finn kort på spiller, sett eller kortnummer, og filtrer på korttype, pris, gradering og opplag.",
  alternates: { canonical: "/sok" },
};

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
