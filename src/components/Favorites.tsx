"use client";

import { Eyebrow } from "@/components/ui";
import Link from "next/link";
import { HeartIcon } from "lucide-react";
import { ListingCard } from "./ListingCard";
import { useFavorites } from "@/lib/favorites";
import type { Listing } from "@/lib/types";

export function Favorites({ listings }: { listings: Listing[] }) {
  const slugs = useFavorites();
  const saved = slugs.map((s) => listings.find((l) => l.slug === s)).filter(Boolean) as Listing[];
  const gone = slugs.length - saved.length;
  return (
    <div>
      <section className="border-b border-slate-300/60">
        <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Eyebrow>Lagret</Eyebrow>
          <h1 className="mt-3 font-heading text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-[44px]">Favoritter</h1>
          <p className="mt-3 max-w-xl text-base text-slate-600 sm:text-lg">Kortene du har trykket hjerte på. De lagres i denne nettleseren.</p>
        </div>
      </section>
      <div className="mx-auto max-w-[1320px] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        {saved.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {saved.map((l) => (
              <ListingCard key={l.slug} listing={l} variant="market" />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-inset ring-slate-300/70">
            <HeartIcon className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
            <p className="mt-4 font-heading text-xl font-bold text-slate-950">Ingen favoritter ennå</p>
            <p className="mt-1.5 text-sm text-slate-600">Trykk på hjertet på et kort for å lagre det her.</p>
            <Link
              href="/marked"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-black"
            >
              Utforsk markedet
            </Link>
          </div>
        )}
        {saved.length === 0 && listings.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950">Nyeste annonser</h2>
            <p className="mt-1 text-sm text-slate-600">Kanskje noe for deg?</p>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
              {[...listings]
                .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
                .slice(0, 4)
                .map((l) => (
                  <ListingCard key={l.slug} listing={l} variant="market" />
                ))}
            </div>
          </div>
        )}
        {gone > 0 && (
          <p className="mt-8 text-sm text-slate-500">
            {gone} {gone === 1 ? "lagret kort er" : "lagrede kort er"} solgt eller fjernet.
          </p>
        )}
      </div>
    </div>
  );
}
