import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { ForsideFaner, type Fane } from "./ForsideFaner";
import { ListingCard } from "./ListingCard";
import { TYPES, hasType } from "@/lib/filters";
import { marketOrder } from "@/lib/listings";
import type { Listing } from "@/lib/types";

/** Hvor mange annonser hver fane viser. Annonser med Toppannonse eller Fremhevet vises alltid, også ut over dette. */
const PER_FANE = 8;
const ALLE: Record<string, string> = {
  Autograf: "Se alle autografkort",
  Patch: "Se alle patch- og relickort",
  Rookie: "Se alle rookiekort",
  Nummerert: "Se alle nummererte kort",
  Base: "Se alle basekort",
};

/**
 * Forsiden på telefon og nettbrett: overskrift, søk, faner og annonsene med en gang, slik de store markedsplassene gjør det.
 * Rekkefølgen er den samme som i markedet (Toppannonse, Fremhevet, Topp av listen, så nyeste, eksempler sist),
 * så betalt plassering «først på forsiden» gjelder også her. PC har fortsatt annonseraden øverst.
 */
export function MobilForside({ all }: { all: Listing[] }) {
  const ordnet = marketOrder(all);
  // Eksempelannonsene kommer sist, i rekkefølgen admin har valgt til forsiden
  const eks = ordnet.filter((l) => l.isExample).sort((a, b) => (a.fanSlot ?? 1e9) - (b.fanSlot ?? 1e9));
  const rekke = [...ordnet.filter((l) => !l.isExample), ...eks];
  const utvalg = (list: Listing[]) => list.filter((l, i) => i < PER_FANE || l.frontpage || l.featured);

  const faner: Fane[] = [{ key: "alle", label: "Alle", href: "/marked", alle: "Se alle annonser" }];
  const iFane = new Map<string, string[]>();
  const merk = (key: string, list: Listing[]) => utvalg(list).forEach((l) => iFane.set(l.slug, [...(iFane.get(l.slug) ?? []), key]));
  merk("alle", rekke);
  for (const t of TYPES) {
    const treff = rekke.filter((l) => hasType(l, t));
    if (!treff.length) continue;
    faner.push({ key: t, label: t, href: `/marked?type=${t}`, alle: ALLE[t] ?? "Se alle" });
    merk(t, treff);
  }
  const kort = rekke
    .filter((l) => iFane.has(l.slug))
    .map((l) => ({ id: l.slug, faner: iFane.get(l.slug)!, node: <ListingCard listing={l} /> }));
  const bilder = rekke.flatMap((l) => (l.image ? [l.image] : [])).slice(0, 2);

  return (
    <section className="kun-mobil pb-2">
      <div className="px-4 pt-5 sm:px-6">
        <h1 className="font-heading text-[26px] font-bold leading-tight tracking-[-0.03em] text-slate-950">Finn ditt neste kort</h1>
        <p className="mt-1 text-sm text-slate-600">Markedsplass for kjøp og salg av fotballkort.</p>
        <form action="/sok" role="search" className="mt-4">
          <label className="relative block">
            <span className="sr-only">Søk etter spiller, sett eller kortnummer</span>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              type="search"
              name="q"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Søk spiller, sett eller kortnummer"
              className="h-12 w-full appearance-none rounded-xl bg-slate-100 pl-11 pr-4 text-base text-slate-950 outline-none placeholder:text-slate-500 focus:bg-[#fff] focus:shadow-[inset_0_0_0_2px_hsl(var(--primary))]"
            />
          </label>
        </form>
      </div>
      {kort.length > 0 && <ForsideFaner faner={faner} kort={kort} />}
      <div className="px-4 pt-9 sm:px-6">
        <div className="relative min-h-[140px] overflow-hidden rounded-2xl bg-[#f5f1e8] p-5 pr-[158px]">
          <h2 className="font-heading text-xl font-bold leading-tight tracking-[-0.02em] text-slate-950">Selg kortene dine</h2>
          <p className="mt-1 text-sm leading-snug text-[#5b5648]">Gratis å legge ut. Kjøperne tar kontakt i chatten.</p>
          <Link href="/selg" prefetch={false} className="mt-3 inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-white">
            Legg ut kort
          </Link>
          {bilder.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={156}
              height={218}
              loading="lazy"
              sizes="78px"
              className={`pointer-events-none absolute h-[109px] w-[78px] rounded-md object-cover shadow-[0_14px_24px_-12px_rgb(11_20_38/0.5)] ${i === 0 ? "right-[66px] top-7 -rotate-[9deg]" : "right-3 top-4 rotate-[7deg]"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
