import { NextResponse } from "next/server";
import { getListings } from "@/lib/listings";
import { lineOf } from "@/lib/filters";

export const revalidate = 300;

/** Spillere, sett og klubber med antall annonser – brukes til søkeforslag. */
export async function GET() {
  const listings = await getListings();
  const count = (vals: (string | null)[]) => {
    const m = new Map<string, number>();
    vals.filter(Boolean).forEach((v) => m.set(v!, (m.get(v!) ?? 0) + 1));
    return [...m.entries()];
  };
  const items = [
    ...count(listings.map((l) => l.player)).map(([label, n]) => ({ label, kind: "Spiller", n })),
    ...count(listings.map((l) => lineOf(l.set))).map(([label, n]) => ({ label, kind: "Sett", n })),
    ...count(listings.map((l) => l.club)).map(([label, n]) => ({ label, kind: "Klubb", n })),
  ];
  return NextResponse.json(items);
}
