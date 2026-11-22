import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, PlusIcon, SearchIcon } from "lucide-react";
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

/** Buen øverst har alltid sju kort. Færre enn tre egne kort med bilde: buen vises ikke. */
const I_BUEN = 7;

/**
 * Forsiden på telefon og nettbrett: overskrift, en bue med kort som glir forbi, søk, faner og annonsene.
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
    // Annonsene ligger under buen, så bildene deres hentes når de nærmer seg skjermen. Kortet midt i buen har førsteprioritet.
    .map((l) => ({ id: l.slug, faner: iFane.get(l.slug)!, node: <ListingCard listing={l} /> }));
  // Pynten i «Selg kortene dine» er bare HOBBYSTRADAs egne kort (eksempelannonsene), aldri andres annonsebilder
  const egne = eks.flatMap((l) => (l.image ? [l.image] : []));
  const bilder = egne.slice(0, 2);
  // Buen er også pynt og bruker bare egne kort. Har vi færre enn sju, går de samme kortene rundt flere ganger.
  const buen = egne.length >= 3 ? Array.from({ length: I_BUEN }, (_, i) => egne[i % Math.min(egne.length, I_BUEN)]) : [];
  const ord = (tekst: string, start: number) =>
    tekst.split(" ").flatMap((w, i) => [
      i ? " " : null,
      <span key={w} style={{ animationDelay: `${(0.05 + (start + i) * 0.08).toFixed(2)}s` }}>
        {w}
      </span>,
    ]);

  return (
    <section className="kun-mobil pb-2">
      <div className="fb-topp">
        <h1 className="fb-h1">
          {ord("Finn ditt", 0)}
          <br />
          {ord("neste kort", 2)}
        </h1>
      </div>
      {buen.length > 0 && (
        <>
          {/* Kortene glir jevnt langs en slak bue. Ren pynt: skjult for skjermlesere, og et trykk går til markedet. */}
          <Link href="/marked" tabIndex={-1} aria-hidden="true" className="fb-bue">
            {buen.map((src, j) => (
              <span key={j} style={{ animationDelay: `${j * 3 - 31.5}s` }}>
                <Image src={src} alt="" width={300} height={420} sizes="174px" loading="eager" preload={j === 0} fetchPriority={j === 0 ? "high" : "low"} />
              </span>
            ))}
          </Link>
          <div className="fb-spor fb-opp" style={{ animationDelay: "0.4s" }} aria-hidden="true">
            <i />
          </div>
        </>
      )}
      <div className="fb-under fb-opp" style={{ animationDelay: "0.45s" }}>
        <form action="/sok" role="search" className="fb-sok">
          <SearchIcon className="h-[19px] w-[19px] shrink-0 text-slate-950" aria-hidden="true" />
          <label className="contents">
            <span className="sr-only">Søk etter spiller, sett eller kortnummer</span>
            <input type="search" name="q" enterKeyHint="search" autoComplete="off" placeholder="Søk spiller, sett eller nummer" />
          </label>
          <button type="submit" aria-label="Søk">
            <ArrowRightIcon className="h-[17px] w-[17px]" aria-hidden="true" />
          </button>
        </form>
        <div className="fb-to">
          <Link href="/marked">
            Se alle annonser
            <ArrowRightIcon className="h-[17px] w-[17px]" aria-hidden="true" />
          </Link>
          <Link href="/selg" prefetch={false}>
            <PlusIcon className="h-[17px] w-[17px]" aria-hidden="true" />
            Legg ut kort
          </Link>
        </div>
      </div>
      {kort.length > 0 && (
        <div className="pt-3">
          <ForsideFaner faner={faner} kort={kort} />
        </div>
      )}
      <div className="px-4 pt-9 sm:px-6">
        <div className={`relative overflow-hidden rounded-2xl bg-[#f5f1e8] p-5 ${bilder.length ? "min-h-[140px] pr-[158px]" : ""}`}>
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
