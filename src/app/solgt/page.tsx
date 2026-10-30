import type { Metadata } from "next";
import { SoldArchive } from "@/components/SoldArchive";
import { getSoldListings } from "@/lib/listings";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Solgte kort – prisarkiv",
  description: "Se hva solgte fotballkort var lagt ut for i Norge. Søk på spiller, sett eller kortnummer.",
  alternates: { canonical: "/solgt" },
};

export default async function SoldPage() {
  return <SoldArchive listings={await getSoldListings()} />;
}
