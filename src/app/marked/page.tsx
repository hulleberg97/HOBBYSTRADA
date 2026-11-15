import type { Metadata } from "next";
import { Suspense } from "react";
import { Market, MarketView } from "@/components/Market";
import { getListings } from "@/lib/listings";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Fotballkort til salgs – markedet",
  description: "Se fotballkort til salgs fra samlere i Norge: autografer, patch, rookies og nummererte kort. Avtal direkte med selgeren i chatten.",
  alternates: { canonical: "/marked" },
};

export default async function ProductsPage() {
  const listings = await getListings();
  return (
    // Første bilde = markedet uten filtre, så siden ikke hopper mens filtrene fra adressen leses
    <Suspense fallback={<MarketView listings={listings} search="" />}>
      <Market listings={listings} />
    </Suspense>
  );
}
