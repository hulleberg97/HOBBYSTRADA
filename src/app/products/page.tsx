import type { Metadata } from "next";
import { Suspense } from "react";
import { Market } from "@/components/Market";
import { getListings } from "@/lib/listings";

export const revalidate = 60;
export const metadata: Metadata = { title: "Alle kort til salgs" };

export default async function ProductsPage() {
  const listings = await getListings();
  return (
    <Suspense>
      <Market listings={listings} />
    </Suspense>
  );
}
