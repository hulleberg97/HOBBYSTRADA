import Image from "next/image";
import Link from "next/link";
import { ZapIcon } from "lucide-react";
import { CardArt } from "./CardArt";
import { FavoriteButton } from "./FavoriteButton";
import { CONDITIONS } from "@/lib/conditions";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

/** Kort merkelapp for tilstanden: gradering («PSA 10») hvis kortet er gradert, ellers tilstand («Near Mint»), ellers «Raw». */
function gradeBadge(l: Listing) {
  if (l.grading && !/^ugradert/i.test(l.grading)) return l.grading;
  const c = CONDITIONS.find((x) => x.value === l.condition || x.en === l.condition);
  return c ? c.en : "Raw";
}

/** Produktkort i mørkt tema: bildet i fokus, ren tekst under, gullramme og lyn ved annonseløft. */
export function DarkTile({ listing: l, eager = false }: { listing: Listing; eager?: boolean }) {
  const boosted = l.featured || l.frontpage;
  return (
    <div
      data-boost={boosted ? "true" : undefined}
      className="group relative flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-[0_12px_32px_-12px_rgb(255_255_255/0.08)] data-[boost=true]:border-amber-500/50 data-[boost=true]:hover:border-amber-400/70"
    >
      <FavoriteButton slug={l.slug} title={l.title} />
      <Link className="flex h-full flex-col" href={`/products/${l.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl bg-zinc-950/60">
          <div className="absolute inset-0 px-[14%] pb-[10%] pt-[12%] transition-transform duration-500 ease-out group-hover:scale-[1.04]">
            {l.image ? (
              <Image
                alt={l.title}
                src={l.image}
                width={600}
                height={840}
                loading={eager ? "eager" : "lazy"}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="h-full w-full rounded-md object-contain"
              />
            ) : (
              <div className="h-full w-full">
                <CardArt listing={l} />
              </div>
            )}
          </div>
          <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white ring-1 ring-inset ring-white/10 backdrop-blur">
            {gradeBadge(l)}
          </span>
        </div>
        <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
          <p className="truncate text-sm font-bold text-white">{l.player}</p>
          <p className="mt-0.5 truncate text-xs text-zinc-400">{[l.set, l.season].filter(Boolean).join(" · ") || l.title}</p>
          <p className="mt-auto flex items-center gap-1.5 pt-2 font-heading text-base font-bold text-[var(--aksent)]">
            {formatPrice(l.price)}
            {boosted && <ZapIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-label="Annonseløft" />}
          </p>
        </div>
      </Link>
    </div>
  );
}

/** Kompakt rutenett: 2 kort på mobil, 3 på nettbrett, 5 på PC. */
export function DarkGrid({ listings }: { listings: Listing[] }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {listings.map((l, i) => (
        <DarkTile key={l.slug} listing={l} eager={i < 4} />
      ))}
    </div>
  );
}
