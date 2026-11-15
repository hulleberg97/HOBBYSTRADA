import type { Metadata } from "next";
import { SoldArchive } from "@/components/SoldArchive";
import { getSoldListings } from "@/lib/listings";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Solgte kort – prisarkiv",
  description: "Prisarkiv for fotballkort i Norge. Se hva solgte kort var lagt ut for, og søk på spiller, sett eller kortnummer før du setter pris.",
  alternates: { canonical: "/solgt" },
};

export default async function SoldPage() {
  return <SoldArchive listings={await getSoldListings()} />;
}
