"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon, BadgeCheckIcon, ChevronLeftIcon, ChevronRightIcon, CrownIcon } from "lucide-react";
import { CardArt } from "@/components/CardArt";
import { FavoriteButton } from "@/components/FavoriteButton";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { spring } from "./motion";

/** Annonsekort for den nye forsiden. Hele kortet lenker til annonsen. */
export function NyKort({ listing, eager = false }: { listing: Listing; eager?: boolean }) {
  const images = listing.images?.length ? listing.images : listing.image ? [listing.image] : [];
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  const step = (dir: 1 | -1) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((p) => (p + dir + images.length) % images.length);
  };

  // Betalt plassering skal merkes tydelig (markedsføringsloven § 8)
  const paidLabel = listing.isExample ? null : listing.frontpage ? "Toppannonse" : listing.featured || listing.bumpedAt ? "Annonseløft" : null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={spring}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setCurrent(0);
      }}
      onFocus={() => setHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(false);
      }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <Link href={`/annonse/${listing.slug}`} className="block focus-visible:outline-none">
        {/* Bildeområde – fast 4:5, ingen layout-skift */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100">
          {images.length > 0 ? (
            <>
              {!loaded[current] && <Shimmer />}
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={current}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: loaded[current] ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 px-[12%] pb-[12%] pt-[14%] transition-transform duration-500 group-hover:scale-105"
                >
                  <Image
                    src={images[current]}
                    alt={`${listing.title}${images.length > 1 ? ` – bilde ${current + 1} av ${images.length}` : ""}`}
                    width={600}
                    height={840}
                    loading={eager && current === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    onLoad={() => setLoaded((l) => ({ ...l, [current]: true }))}
                    className="h-full w-full rounded-md object-contain drop-shadow-[0_18px_22px_rgba(15,23,42,0.28)]"
                  />
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <div className="absolute inset-0 px-[16%] pb-[12%] pt-[14%] transition-transform duration-500 group-hover:scale-105">
              <div className="h-full w-full shadow-[0_18px_30px_-18px_rgba(15,23,42,0.6)]">
                <CardArt listing={listing} />
              </div>
            </div>
          )}

          {/* Merker */}
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5 pr-12">
            {listing.isExample && (
              <span title="Lagt ut av HOBBYSTRADA for å vise hvordan siden fungerer. Ikke til salgs." className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                Eksempelannonse
              </span>
            )}
            {paidLabel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                {listing.frontpage && <CrownIcon className="h-3 w-3" aria-hidden="true" />}
                {paidLabel}
              </span>
            )}
            {listing.numbered && (
              <span className="rounded-full bg-zinc-900/85 px-2 py-0.5 text-[10px] font-semibold tabular-nums tracking-wide text-white backdrop-blur-sm">{listing.numbered}</span>
            )}
          </div>

          {/* Bla mellom bilder */}
          <AnimatePresence>
            {hovered && images.length > 1 && (
              <>
                <motion.button
                  type="button"
                  aria-label="Forrige bilde"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={spring}
                  whileTap={{ scale: 0.9 }}
                  onClick={step(-1)}
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-zinc-800 backdrop-blur-sm hover:bg-white"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </motion.button>
                <motion.button
                  type="button"
                  aria-label="Neste bilde"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={spring}
                  whileTap={{ scale: 0.9 }}
                  onClick={step(1)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-zinc-800 backdrop-blur-sm hover:bg-white"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </motion.button>
              </>
            )}
          </AnimatePresence>

          {/* Sideindikator */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1" aria-hidden="true">
              {images.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-4 bg-zinc-900" : "w-1.5 bg-zinc-900/25"}`} />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="mb-1.5 flex h-5 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-xs font-medium text-zinc-500">{listing.seller}</span>
              {listing.sellerVerified && (
                <span title="Selgeren har bekreftet navnet sitt med Vipps" className="shrink-0 text-[#ff5b24]">
                  <BadgeCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">Verifisert med Vipps</span>
                </span>
              )}
            </div>
            {listing.grading && !/ugradert|raw/i.test(listing.grading) && (
              <span className="shrink-0 rounded-md bg-zinc-100 px-1.5 text-[10px] font-semibold text-zinc-700">{listing.grading}</span>
            )}
          </div>

          <h3 className="line-clamp-1 text-sm font-semibold text-zinc-800 transition-colors group-hover:text-black">{listing.title}</h3>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-base font-bold tabular-nums text-zinc-900">{formatPrice(listing.price)}</p>

            {/* Glidende handlingsknapp */}
            <div className="relative h-8 w-24 overflow-hidden">
              <AnimatePresence initial={false}>
                {hovered ? (
                  <motion.span
                    key="se"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={spring}
                    className="absolute inset-0 flex items-center justify-center gap-1 rounded-lg bg-primary text-xs font-medium text-white shadow-sm"
                  >
                    Se kortet
                    <ArrowRightIcon className="h-3 w-3" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="sted"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 top-1/2 max-w-full -translate-y-1/2 truncate text-xs text-zinc-400"
                  >
                    {listing.location ?? listing.condition ?? ""}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Link>

      {/* Ekte favorittknapp fra siden (lagres på samme måte som ellers) */}
      <FavoriteButton slug={listing.slug} title={listing.title} />
    </motion.article>
  );
}

export function Shimmer() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-zinc-100" aria-hidden="true">
      <div className="ny-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}
