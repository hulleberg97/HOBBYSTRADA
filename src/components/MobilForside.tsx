import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, BadgeCheckIcon, LayoutGridIcon, PenLineIcon, PlusIcon, SearchIcon, ShirtIcon, StarIcon } from "lucide-react";
import { ForsideFaner, type Fane } from "./ForsideFaner";
import { KortBue } from "./KortBue";
import { KortKarusell } from "./KortKarusell";
import { KortScene } from "./KortScene";
import { ListingCard } from "./ListingCard";
import { TYPES, hasType } from "@/lib/filters";
import { formatPrice } from "@/lib/format";
import { frontpageRow } from "@/lib/frontpage-row";
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

/** Ikonene på fanene er de samme som i kategoriraden på PC. Nummerert har «1/1» i stedet for et ikon, som der. */
const ikon = "h-[18px] w-[18px] shrink-0";
const IKON: Record<string, React.ReactNode> = {
  alle: <LayoutGridIcon className={ikon} strokeWidth={1.6} aria-hidden="true" />,
  Autograf: <PenLineIcon className={ikon} strokeWidth={1.6} aria-hidden="true" />,
  Patch: <ShirtIcon className={ikon} strokeWidth={1.6} aria-hidden="true" />,
  Rookie: <StarIcon className={ikon} strokeWidth={1.6} aria-hidden="true" />,
  Nummerert: (
    <span className="text-xs font-bold leading-none tracking-tight" aria-hidden="true">
      1/1
    </span>
  ),
  Base: <BadgeCheckIcon className={ikon} strokeWidth={1.6} aria-hidden="true" />,
};

/**
 * BRYTER for toppen av telefonforsiden. Bytt verdien og sett live for å bytte tilbake:
 * «flis»: serif-overskrift med forklarende linje, og en karusell av liggende fliser med kort, navn, pris, type og sted.
 * «bue»:  stor midtstilt overskrift, og en bue med kort som glir forbi (slik forsiden var før 22. november kl. 20).
 * «scene»: samme overskrift som «flis», og en scene der kortene står på rekke i et panel som tar farge etter kortet,
 *          og et felt med sett, navn, pris, type og sted under.
 */
const TOPP = "scene" as "flis" | "bue" | "scene";
/** Infofeltet under scenen: «full» (sett, sted, navn, pris, type og opplag), «kompakt» (smal linje med ramme) eller «ren» (uten ramme, midtstilt). */
const INFO = "kompakt" as "full" | "kompakt" | "ren";

/** Buen har alltid sju kort. Færre enn tre egne kort med bilde: buen vises ikke. */
const I_BUEN = 7;

/** Karusellen øverst viser så mange kort fra forsideraden (Toppannonser, Fremhevet, så kortene admin har valgt). */
const I_KARUSELLEN = 6;

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

  const faner: Fane[] = [{ key: "alle", label: "Alle", href: "/marked", alle: "Se alle annonser", ikon: IKON.alle }];
  const iFane = new Map<string, string[]>();
  const merk = (key: string, list: Listing[]) => utvalg(list).forEach((l) => iFane.set(l.slug, [...(iFane.get(l.slug) ?? []), key]));
  merk("alle", rekke);
  for (const t of TYPES) {
    const treff = rekke.filter((l) => hasType(l, t));
    if (!treff.length) continue;
    faner.push({ key: t, label: t, href: `/marked?type=${t}`, alle: ALLE[t] ?? "Se alle", ikon: IKON[t] });
    merk(t, treff);
  }
  const kort = rekke
    .filter((l) => iFane.has(l.slug))
    // Med flisene øverst synes de to første annonsene når siden åpnes, så bildene deres hentes med en gang.
    // Med buen ligger annonsene lenger ned, og bildene hentes når de nærmer seg skjermen.
    .map((l, i) => ({ id: l.slug, faner: iFane.get(l.slug)!, node: <ListingCard listing={l} eager={TOPP === "flis" && i < 2} /> }));
  // Pynten i «Selg kortene dine» og buen er bare HOBBYSTRADAs egne kort (eksempelannonsene), aldri andres annonsebilder
  const egne = eks.flatMap((l) => (l.image ? [{ src: l.image, href: `/annonse/${l.slug}` }] : []));
  const bilder = egne.slice(0, 2).map((k) => k.src);
  // Har vi færre enn sju egne kort, går de samme kortene rundt flere ganger i buen
  const buen = TOPP === "bue" && egne.length >= 3 ? Array.from({ length: I_BUEN }, (_, i) => egne[i % Math.min(egne.length, I_BUEN)]) : [];
  // Karusellen øverst viser samme kort som kortraden på PC, i samme rekkefølge: betalt plassering først, så kortene admin har valgt
  const karusell = (TOPP !== "bue" ? frontpageRow(all) : [])
    .filter((l) => l.image)
    .slice(0, I_KARUSELLEN)
    .map((l) => ({
      href: `/annonse/${l.slug}`,
      src: l.image!,
      navn: l.player,
      sett: l.set ?? "",
      pris: formatPrice(l.price),
      sted: l.location ?? "",
      // Typen uten «Nummerert» (opplaget står ved siden av), høyst to typer
      type: l.types.filter((t) => t !== "Nummerert").slice(0, 2).join(" + "),
      opplag: l.numbered ?? "",
      eksempel: Boolean(l.isExample),
      loft: l.frontpage ? "Toppannonse" : l.featured ? "Fremhevet" : "",
      l,
    }));
  const ord = (tekst: string, start: number) =>
    tekst.split(" ").flatMap((w, i) => [
      i ? " " : null,
      <span key={w} style={{ animationDelay: `${(0.05 + (start + i) * 0.08).toFixed(2)}s` }}>
        {w}
      </span>,
    ]);

  return (
    <section className="kun-mobil pb-2">
      {/* Den opprinnelige overskriften, som på PC: serif, «neste» i kursiv med gull strek under, og underteksten */}
      <div className="fb-topp" data-topp="original">
        <h1 className="fb-h1 fb-h1-serif">
          {ord("Finn ditt", 0)} <em className="mt-strek">{ord("neste", 2)}</em> {ord("kort", 3)}
        </h1>
        <p className="fb-ut fb-opp" style={{ animationDelay: "0.3s" }}>
          Markedsplass for kjøp og salg av fotballkort.
        </p>
      </div>
      {TOPP === "bue" ? (
        // Kortene glir jevnt langs en slak bue. Et trykk åpner annonsen, og buen kan dras sidelengs.
        buen.length > 0 && <KortBue kort={buen} />
      ) : TOPP === "scene" ? (
        // Scenen uten boks, med kortene i holderen: kortet i midten er fremme, raden sveipes, og feltet under viser navn og pris
        karusell.length > 0 && <KortScene kort={karusell} apen holder info={INFO} />
      ) : (
        karusell.length > 0 && <KortKarusell kort={karusell} />
      )}
      <div className="fb-under fb-opp" style={{ animationDelay: "0.35s" }}>
        <form action="/sok" role="search" className="fb-sok">
          <SearchIcon className="h-[19px] w-[19px] shrink-0 text-slate-950" aria-hidden="true" />
          <label className="contents">
            <span className="sr-only">Søk etter spiller, sett eller kortnummer</span>
            <input type="search" name="q" enterKeyHint="search" autoComplete="off" placeholder="Søk spiller, sett eller nummer" className="outline-none" />
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
