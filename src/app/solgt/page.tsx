import type { Metadata } from "next";
import { SoldArchive } from "@/components/SoldArchive";
import { getSoldListings } from "@/lib/listings";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Solgte kort – prisarkiv",
  description: "Se hva fotballkort faktisk har solgt for i Norge. Søk på spiller, sett eller kortnummer.",
};

export default async function SoldPage() {
  return <SoldArchive listings={await getSoldListings()} />;
}
