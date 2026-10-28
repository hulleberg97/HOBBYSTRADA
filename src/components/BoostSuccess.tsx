import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { CardArt } from "./CardArt";
import { BOOSTS, BOOST_EFFECT, boostDate, type BoostKey } from "@/lib/boosts";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

/** Bekreftelsen kunden ser når et annonseløft er betalt og aktivert. */
export function BoostSuccess({ plan, until, listing }: { plan: BoostKey; until: string | null; listing: Listing }) {
  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center ring-1 ring-slate-200 sm:p-10">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[0_10px_24px_-10px_rgb(207_166_83/0.9)]">
        <CheckIcon className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-bold tracking-[-0.02em] text-slate-950 sm:text-[28px]">Hurra! Annonsen din er løftet!</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {BOOSTS[plan].name} er aktivert{until ? ` og varer til ${boostDate(until)}` : ""}. {BOOST_EFFECT[plan]}
      </p>
      <Link href={`/annonse/${listing.slug}`} className="group mt-6 flex items-center gap-4 rounded-2xl p-3 text-left ring-1 ring-slate-200 transition hover:ring-slate-400">
        <div className="h-[84px] w-[60px] shrink-0 overflow-hidden rounded-md bg-slate-100">
          {listing.image ? (
            <Image alt="" src={listing.image} width={120} height={168} className="h-full w-full object-cover" />
          ) : (
            <CardArt listing={listing} />
          )}
        </div>
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-semibold text-slate-950 group-hover:underline">{listing.title}</p>
          <p className="mt-1 text-sm font-bold text-[#8a6a24]">{formatPrice(listing.price)}</p>
        </div>
      </Link>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href={`/annonse/${listing.slug}`} className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-black">
          Se annonsen
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link href="/account" className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-primary ring-1 ring-inset ring-slate-300 transition hover:ring-slate-500">
          Til Min side
        </Link>
      </div>
      <p className="mt-6 text-xs text-slate-500">Betalingen finner du i Vipps-appen.</p>
    </div>
  );
}
