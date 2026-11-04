import Image from "next/image";
import Link from "next/link";
import { ClockIcon, CrownIcon, EyeIcon } from "lucide-react";
import { CardArt } from "./CardArt";
import { FavoriteButton } from "./FavoriteButton";
import { VerifiedBadge } from "./VerifiedBadge";
import { TidSiden } from "./TidSiden";
import { formatPrice } from "@/lib/format";
import { graderOf, runOf } from "@/lib/filters";
import type { Listing } from "@/lib/types";

/** Samlertittel i fast rekkefølge: år · sett · spiller · nummerering · gradering. Faller tilbake til selgerens tittel. */
export function collectorTitle(l: Listing) {
  if (!l.set && !l.season) return l.title;
  const year = l.season?.match(/\d{4}(\/\d{2})?/)?.[0];
  const set = l.set ? (l.set.toLowerCase().startsWith(l.producer.toLowerCase()) ? l.set : `${l.producer} ${l.set}`) : l.producer;
  const run = runOf(l);
  const grade = graderOf(l.grading) !== "raw" ? l.grading : null;
  return [year, set, l.player, run ? (l.numbered ?? `/${run}`) : null, grade].filter(Boolean).join(" ");
}

/** Korte merker samlere ser etter: Auto, /99, PSA 10, RC, Patch. */
function badges(l: Listing) {
  const out: string[] = [];
  if (l.types.includes("Autograf")) out.push("Auto");
  if (l.types.includes("Patch") || l.types.includes("Relic")) out.push("Patch");
  const run = runOf(l);
  if (run) out.push(`/${run}`);
  if (graderOf(l.grading) !== "raw" && l.grading) out.push(l.grading);
  if (l.types.includes("Rookie")) out.push("RC");
  return out;
}

/** Annonsekort. «home» brukes på forsiden, «market» i markedet og søk. */
/** «eager»: kort øverst på siden lastes med en gang i stedet for når de rulles inn. */
export function ListingCard({ listing, variant = "home", eager = false }: { listing: Listing; variant?: "home" | "market"; eager?: boolean }) {
  const market = variant === "market";
  return (
    <div data-featured={listing.featured ? "true" : undefined} className="group relative flex h-full flex-col">
      <FavoriteButton slug={listing.slug} title={listing.title} />
      <Link className="flex h-full flex-col" href={`/annonse/${listing.slug}`}>
        <div
          className={`card-frame relative aspect-[5/7] overflow-hidden rounded-2xl ring-1 ring-inset group-data-[featured=true]:ring-2 group-data-[featured=true]:ring-accent ${market ? "bg-slate-100 ring-slate-200" : "bg-slate-200/80 ring-slate-300"}`}
        >
          <div className="absolute inset-0 px-[9%] pb-[10%] pt-[16%] transition-transform duration-500 ease-out group-hover:scale-[1.04]">
            {listing.image ? (
              <Image
                alt={listing.title}
                src={listing.image}
                width={600}
                height={840}
                loading={eager ? "eager" : "lazy"}
                fetchPriority={eager ? "high" : "auto"}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="h-full w-full rounded-md object-cover shadow-[0_18px_30px_-18px_rgba(15,23,42,0.6)]"
              />
            ) : (
              <div className="h-full w-full shadow-[0_18px_30px_-18px_rgba(15,23,42,0.6)]">
                <CardArt listing={listing} />
              </div>
            )}
          </div>
          <div className="absolute left-2.5 top-2.5 z-10 flex gap-1.5 sm:left-3 sm:top-3">
            {/* Eksempelannonser er ikke til salgs og merkes tydelig */}
            {listing.isExample && (
              <span title="Lagt ut av HOBBYSTRADA for å vise hvordan siden fungerer. Ikke til salgs." className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white">
                Eksempelannonse
              </span>
            )}
            {/* Betalt plassering merkes tydelig (markedsføringsloven § 8). Kort admin har valgt til forsiden har ikke eget merke. */}
            {(listing.featured || listing.bumpedAt) && (
              <span
                title={listing.frontpage ? "Toppannonse" : listing.featured ? "Fremhevet" : "Topp av listen"}
                className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground"
              >
                {listing.frontpage && <CrownIcon className="h-3 w-3" aria-hidden="true" />}
                Annonseløft
              </span>
            )}
            {/* Kjøperne ser bare aktive annonser, så bare «Solgt» trenger et merke */}
            {listing.status === "sold" && <span className="rounded-full bg-slate-700 px-2.5 py-1 text-[11px] font-semibold text-white">Solgt</span>}
          </div>
          {market && (
            <span className="absolute bottom-2.5 right-2.5 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200 backdrop-blur sm:bottom-3 sm:right-3">
              {listing.tag}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col px-0.5 pt-3">
          {/* Tittelen tar alltid plass til to linjer, så prisen står på samme høyde på alle kortene */}
          <p className={`card-title line-clamp-2 min-h-[2.75em] text-[15px] font-medium leading-snug group-hover:underline ${market ? "text-slate-900" : "text-slate-950"}`}>
            {market ? listing.title : collectorTitle(listing)}
          </p>
          {!market && badges(listing).length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {badges(listing).map((b) => (
                <span key={b} className="rounded-[5px] bg-[#0b1426] px-1.5 py-[3px] text-[10px] font-bold uppercase leading-none tracking-wide text-[#f3dfae]">
                  {b}
                </span>
              ))}
            </div>
          )}
          {/* Pris til venstre, visninger til høyre på samme linje, så de ikke trenger plass i raden under */}
          <div className="mt-1.5 flex items-baseline justify-between gap-2 text-lg font-bold tracking-tight text-slate-950">
            <span className={market ? "font-heading text-lg font-semibold tracking-tight" : undefined}>{formatPrice(listing.price)}</span>
            {!listing.soldAt && (listing.views ?? 0) > 0 && (
              <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-slate-500" title={`${listing.views} visninger`}>
                <EyeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {listing.views}
              </span>
            )}
          </div>
          <div className={`card-meta mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1.5 text-xs ${market ? "text-slate-500" : "font-medium text-slate-700"}`}>
            {(listing.location || (!market && listing.seller)) && <span className="inline-flex items-center gap-1">{listing.location || listing.seller}</span>}
            {/* Eksempelannonser ser ut som vanlige annonser (tid, Vipps-merke, visninger). Bare merket «Eksempelannonse» skiller dem. */}
            {listing.sellerVerified && <VerifiedBadge compact />}
            <span className="card-time inline-flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {listing.soldAt ? (
                <span>
                  Solgt <TidSiden iso={listing.soldAt} lowercase />
                </span>
              ) : (
                <TidSiden iso={listing.createdAt} />
              )}
              {!listing.soldAt && (
                <span className="card-time-short hidden" suppressHydrationWarning>
                  {/* Mobil: «5 dager», ellers «5 dager siden» */}
                  <span className="sm:hidden"><TidSiden iso={listing.createdAt} variant="kort" /></span>
                  <span className="hidden sm:inline"><TidSiden iso={listing.createdAt} variant="utenFor" /></span>
                </span>
              )}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function ListingGrid({ listings, variant = "home" }: { listings: Listing[]; variant?: "home" | "market" }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
      {listings.map((l) => (
        <ListingCard key={l.slug} listing={l} variant={variant} />
      ))}
    </div>
  );
}
