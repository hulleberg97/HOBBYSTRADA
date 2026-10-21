import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ChevronRightIcon, ClockIcon, SearchIcon } from "lucide-react";
import { CardArt } from "@/components/CardArt";
import { ListingCard } from "@/components/ListingCard";
import { formatPrice, timeAgo } from "@/lib/format";
import { matches } from "@/lib/listings";
import { POPULAR } from "@/lib/popular";
import type { Listing } from "@/lib/types";

/** Byggeklosser for testoppsettene av forsiden. Bare tekst som allerede finnes på siden. */

export const wrap = "mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8";

export function Overtittel({ className = "" }: { className?: string }) {
  return <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 ${className}`}>Norges markedsplass for samlere</p>;
}

export function Tittel({ className = "" }: { className?: string }) {
  return <h1 className={`font-heading font-bold tracking-[-0.04em] text-slate-950 ${className}`}>Kjøp og selg fotballkort</h1>;
}

export function Knapper({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2.5 ${className}`}>
      <Link className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-black" href="/products">
        Se alle annonser
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </Link>
      <Link className="inline-flex h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-primary ring-1 ring-inset ring-slate-300 transition hover:ring-slate-500" href="/sell">
        Legg ut kort
      </Link>
    </div>
  );
}

/** Søkefelt som sender til søkesiden. */
export function Sok({ stor = false, className = "" }: { stor?: boolean; className?: string }) {
  return (
    <form
      role="search"
      action="/search"
      className={`flex w-full items-center gap-2 rounded-full border border-slate-300 bg-white p-1.5 pl-5 shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 ${className}`}
    >
      <SearchIcon className="h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
      <label className="sr-only" htmlFor="forside-sok">
        Søk etter spiller, klubb eller sett
      </label>
      <input
        id="forside-sok"
        name="q"
        type="search"
        placeholder="Spiller, sett eller kortnummer"
        className={`min-w-0 flex-1 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-500 ${stor ? "h-12" : "h-10"}`}
      />
      <button type="submit" className={`shrink-0 rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-black ${stor ? "h-12" : "h-10"}`}>
        Søk
      </button>
    </form>
  );
}

/** Populære søk som små knapper. */
export function Populaere({ className = "", center = false }: { className?: string; center?: boolean }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${center ? "justify-center" : ""} ${className}`}>
      {POPULAR.map((p) => (
        <li key={p}>
          <Link className="inline-flex h-9 items-center rounded-full bg-[#eceef2] px-3.5 text-[13px] font-medium text-slate-800 transition hover:bg-slate-200" href={`/search?q=${encodeURIComponent(p)}`}>
            {p}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SeksjonTopp({ tittel, under, href = "/products" }: { tittel: string; under?: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[28px]">{tittel}</h2>
        {under && <p className="mt-1 text-sm text-slate-700 sm:text-[15px]">{under}</p>}
      </div>
      <Link className="tap inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-slate-900 underline-offset-4 transition hover:underline" href={href}>
        Se alle
        <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

/** En vannrett rad med annonser som kan blas til siden. */
export function Hylle({ tittel, under, listings, href }: { tittel: string; under?: string; listings: Listing[]; href?: string }) {
  if (!listings.length) return null;
  return (
    <section className={`${wrap} py-8 sm:py-10`}>
      <SeksjonTopp tittel={tittel} under={under} href={href} />
      <ul className="-mx-4 mt-5 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {listings.map((l) => (
          <li key={l.slug} className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[calc((100%-4rem)/5)]">
            <ListingCard listing={l} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Kortbilde i plastholder, brukt der et enkelt kort skal fremheves. */
export function Kortbilde({ l, sizes, eager = false, className = "" }: { l: Listing; sizes: string; eager?: boolean; className?: string }) {
  return (
    <div className={`aspect-[5/7] overflow-hidden rounded-lg shadow-[0_30px_60px_-25px_rgba(2,6,23,0.6)] ring-1 ring-black/5 ${className}`}>
      {l.image ? (
        <Image alt={l.title} src={l.image} width={600} height={840} sizes={sizes} loading={eager ? "eager" : "lazy"} className="h-full w-full object-cover" />
      ) : (
        <CardArt listing={l} />
      )}
    </div>
  );
}

/** Kompakt annonselinje: bilde, tittel, pris og tid. */
export function Linje({ l }: { l: Listing }) {
  return (
    <Link href={`/products/${l.slug}`} className="group flex items-center gap-4 rounded-2xl px-2 py-2.5 transition hover:bg-slate-50">
      <div className="h-[72px] w-[52px] shrink-0">
        <Kortbilde l={l} sizes="52px" className="!rounded-md !shadow-none" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-slate-950 group-hover:underline">{l.title}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
          <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span suppressHydrationWarning>{timeAgo(l.createdAt)}</span>
        </p>
      </div>
      <p className="shrink-0 text-[15px] font-bold tracking-tight text-slate-950">{formatPrice(l.price)}</p>
    </Link>
  );
}

/** Kategoriene med søk og hvilke annonser som hører til. */
export function kategorier(all: Listing[]) {
  return [
    { navn: "Autografkort", href: "/search?q=autograf", liste: all.filter((l) => matches(l, "autograf")) },
    { navn: "Patch / relic", href: "/search?q=relic", liste: all.filter((l) => matches(l, "relic")) },
    { navn: "Nummererte kort", href: "/search?q=%2F", liste: all.filter((l) => matches(l, "/")) },
    { navn: "Rookies", href: "/search?q=RC", liste: all.filter((l) => matches(l, "RC")) },
    { navn: "Base", href: "/search?q=chrome", liste: all.filter((l) => l.types.includes("Base")) },
  ].filter((k) => k.liste.length > 0);
}

export const antall = (n: number) => `${n} ${n === 1 ? "annonse" : "annonser"}`;
