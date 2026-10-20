import Image from "next/image";
import Link from "next/link";
import { ClockIcon, CrownIcon } from "lucide-react";
import { CardArt } from "./CardArt";
import { FavoriteButton } from "./FavoriteButton";
import { VerifiedBadge } from "./VerifiedBadge";
import { formatPrice, timeAgo } from "@/lib/format";
import type { Listing } from "@/lib/types";

/** Annonsekort. «home» brukes på forsiden, «market» i markedet og søk. */
export function ListingCard({ listing, variant = "home" }: { listing: Listing; variant?: "home" | "market" }) {
  const market = variant === "market";
  return (
    <div data-featured={listing.featured ? "true" : undefined} className="group relative flex h-full flex-col">
      <FavoriteButton slug={listing.slug} title={listing.title} />
      <Link className="flex h-full flex-col" href={`/products/${listing.slug}`}>
        <div
          className={`card-frame relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-inset group-data-[featured=true]:ring-2 group-data-[featured=true]:ring-accent ${market ? "bg-slate-100 ring-slate-200" : "bg-slate-200/80 ring-slate-300"}`}
        >
          <div className="absolute inset-0 px-[14%] pb-[8%] pt-[18%] transition-transform duration-500 ease-out group-hover:scale-[1.04] sm:px-[12%] sm:pt-[14%]">
            {listing.image ? (
              <Image
                alt={listing.title}
                src={listing.image}
                width={600}
                height={840}
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
            {listing.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                {listing.frontpage && <CrownIcon className="h-3 w-3" aria-hidden="true" />}
                {listing.frontpage ? "Toppannonse" : "Fremhevet"}
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
          <h3 className={`card-title line-clamp-2 text-[15px] font-medium leading-snug group-hover:underline ${market ? "text-slate-900" : "text-slate-950"}`}>
            {listing.title}
          </h3>
          {market ? (
            <div className="mt-1.5 text-lg font-bold tracking-tight text-slate-950">
              <span className="font-heading text-lg font-semibold tracking-tight">{formatPrice(listing.price)}</span>
            </div>
          ) : (
            <p className="mt-1.5 text-lg font-bold tracking-tight text-slate-950">{formatPrice(listing.price)}</p>
          )}
          <div className={`mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1.5 text-xs ${market ? "text-slate-500" : "font-medium text-slate-700"}`}>
            {listing.location && <span className="inline-flex items-center gap-1">{listing.location}</span>}
            {listing.sellerVerified && <VerifiedBadge compact />}
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <span suppressHydrationWarning>{listing.soldAt ? `Solgt ${timeAgo(listing.soldAt).toLowerCase()}` : timeAgo(listing.createdAt)}</span>
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
