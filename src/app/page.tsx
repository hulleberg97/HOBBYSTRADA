import Link from "next/link";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CheckIcon,
  ChevronRightIcon,
  FlagIcon,
  LayoutGridIcon,
  PenLineIcon,
  ScaleIcon,
  ScanSearchIcon,
  ShieldCheckIcon,
  ShirtIcon,
  StarIcon,
} from "lucide-react";
import { HeroFan } from "@/components/HeroFan";
import { fanCards } from "@/lib/fan";
import { ListingGrid } from "@/components/ListingCard";
import { categoryCounts, getListings, newest } from "@/lib/listings";

export const revalidate = 60;

export default async function Home() {
  const all = await getListings();
  const featured = all
    .filter((l) => l.featured)
    .sort((a, b) => Number(Boolean(b.frontpage)) - Number(Boolean(a.frontpage)))
    .slice(0, 4);
  const latest = newest(all.filter((l) => !l.featured)).slice(0, 8);
  const c = categoryCounts(all);
  // Kortvifta: alle toppannonser, deretter de nyeste – helst med ekte bilde
  const fanPinned = all.filter((l) => l.fanSlot);
  const fanPaid = all.filter((l) => l.frontpage);
  const fanFill = [...newest(all.filter((l) => l.image)), ...newest(all.filter((l) => !l.image))].slice(0, 10);
  const fanList = fanCards(fanPinned, fanPaid, fanFill);
  return (
    <div className="bg-background">
      <section className="bg-background">
        <div className="mx-auto max-w-[1320px] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[20px] bg-[radial-gradient(120%_120%_at_85%_10%,hsl(var(--ink-soft))_0%,hsl(var(--ink-raised))_45%,hsl(var(--ink))_100%)] text-white sm:rounded-[28px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgba(255,255,255,0.9)_0.6px,transparent_0.6px)] [background-size:4px_4px]"
            ></div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--accent))_50%,transparent)] opacity-60"
            ></div>
            <div className="relative grid items-center gap-2 px-6 pt-10 sm:px-10 sm:pt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-0 lg:py-10 lg:pl-16 lg:pr-4">
              <div className="min-w-0">
                {/* Antallet vises først når det er stort nok til å imponere */}
                {all.length >= 20 && (
                  <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85 ring-1 ring-inset ring-white/15">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
                    {all.length} aktive annonser nå
                  </p>
                )}
                <h1 className="font-heading text-[clamp(2.2rem,4.8vw,4.25rem)] font-bold leading-[0.95] tracking-[-0.04em]">
                  Fotballkort.
                  <br />
                  <span className="text-gold-light">Kjøp og selg.</span>
                </h1>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/85 sm:text-lg">Markedsplassen for fotballkort.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-primary transition hover:bg-gold-light"
                    href="/products"
                  >
                    Se alle annonser
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    className="inline-flex h-12 items-center rounded-full px-6 text-sm font-semibold text-white ring-1 ring-inset ring-white/35 transition hover:bg-white/10"
                    href="/sell"
                  >
                    Legg ut annonse
                  </Link>
                </div>
              </div>
              <HeroFan cards={fanList} />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-background">
        <div className="mx-auto max-w-[1320px] px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
          <h2 className="sr-only">Kategorier</h2>
          <ul className="-mx-4 flex snap-x gap-1 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-6 sm:gap-2 sm:overflow-visible sm:rounded-3xl sm:bg-white sm:p-2 sm:ring-1 sm:ring-slate-300/80">
            <li className="w-[104px] shrink-0 snap-start sm:w-auto">
              <Link
                className="group flex flex-col items-center gap-2.5 rounded-2xl bg-white px-2 py-4 text-center ring-1 ring-slate-300/80 transition hover:bg-slate-100 sm:ring-0"
                href="/search?q=autograf"
              >
                <PenLineIcon className="h-8 w-8 text-primary transition group-hover:text-[hsl(var(--gold-deep))]" strokeWidth={1.4} aria-hidden="true" />
                <span className="text-sm font-semibold leading-tight text-slate-950">Autografkort</span>
                <span className="text-xs font-medium text-slate-700">{c.autograf} annonser</span>
              </Link>
            </li>
            <li className="w-[104px] shrink-0 snap-start sm:w-auto">
              <Link
                className="group flex flex-col items-center gap-2.5 rounded-2xl bg-white px-2 py-4 text-center ring-1 ring-slate-300/80 transition hover:bg-slate-100 sm:ring-0"
                href="/search?q=relic"
              >
                <ShirtIcon className="h-8 w-8 text-primary transition group-hover:text-[hsl(var(--gold-deep))]" strokeWidth={1.4} aria-hidden="true" />
                <span className="text-sm font-semibold leading-tight text-slate-950">Relic og patch</span>
                <span className="text-xs font-medium text-slate-700">{c.relic} annonser</span>
              </Link>
            </li>
            <li className="w-[104px] shrink-0 snap-start sm:w-auto">
              <Link
                className="group flex flex-col items-center gap-2.5 rounded-2xl bg-white px-2 py-4 text-center ring-1 ring-slate-300/80 transition hover:bg-slate-100 sm:ring-0"
                href="/search?q=%2F"
              >
                <span
                  className="h-8 w-8 text-primary transition group-hover:text-[hsl(var(--gold-deep))] flex items-center justify-center text-[22px] font-medium leading-none tracking-tight"
                  aria-hidden="true"
                >
                  1/1
                </span>
                <span className="text-sm font-semibold leading-tight text-slate-950">Nummererte kort</span>
                <span className="text-xs font-medium text-slate-700">{c.numbered} annonser</span>
              </Link>
            </li>
            <li className="w-[104px] shrink-0 snap-start sm:w-auto">
              <Link
                className="group flex flex-col items-center gap-2.5 rounded-2xl bg-white px-2 py-4 text-center ring-1 ring-slate-300/80 transition hover:bg-slate-100 sm:ring-0"
                href="/search?q=RC"
              >
                <StarIcon className="h-8 w-8 text-primary transition group-hover:text-[hsl(var(--gold-deep))]" strokeWidth={1.4} aria-hidden="true" />
                <span className="text-sm font-semibold leading-tight text-slate-950">Rookies</span>
                <span className="text-xs font-medium text-slate-700">{c.rookie} annonser</span>
              </Link>
            </li>
            <li className="w-[104px] shrink-0 snap-start sm:w-auto">
              <Link
                className="group flex flex-col items-center gap-2.5 rounded-2xl bg-white px-2 py-4 text-center ring-1 ring-slate-300/80 transition hover:bg-slate-100 sm:ring-0"
                href="/search?q=chrome"
              >
                <BadgeCheckIcon className="h-8 w-8 text-primary transition group-hover:text-[hsl(var(--gold-deep))]" strokeWidth={1.4} aria-hidden="true" />
                <span className="text-sm font-semibold leading-tight text-slate-950">Base</span>
                <span className="text-xs font-medium text-slate-700">{c.base} annonser</span>
              </Link>
            </li>
            <li className="w-[104px] shrink-0 snap-start sm:w-auto">
              <Link
                className="group flex flex-col items-center gap-2.5 rounded-2xl bg-white px-2 py-4 text-center ring-1 ring-slate-300/80 transition hover:bg-slate-100 sm:ring-0"
                href="/products"
              >
                <LayoutGridIcon className="h-8 w-8 text-primary transition group-hover:text-[hsl(var(--gold-deep))]" strokeWidth={1.4} aria-hidden="true" />
                <span className="text-sm font-semibold leading-tight text-slate-950">Alle kort</span>
                <span className="text-xs font-medium text-slate-700">{c.all} annonser</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
      {featured.length > 0 && (
        <section className="bg-background">
          <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Fremhevede annonser</h2>
                <p className="mt-1 text-sm text-slate-700 sm:text-[15px]">Løftet av selgerne – vises først i markedet</p>
              </div>
              <Link
                className="inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-slate-900 underline-offset-4 transition hover:underline"
                href="/products"
              >
                Se alle
                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ListingGrid listings={featured} />
          </div>
        </section>
      )}
      <section className="border-y border-slate-300/70 bg-white">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Nyeste annonser</h2>
              <p className="mt-1 text-sm text-slate-700 sm:text-[15px]">Nylig lagt ut av samlere i hele Norge</p>
            </div>
            <Link
              className="inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-slate-900 underline-offset-4 transition hover:underline"
              href="/products"
            >
              Se alle
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ListingGrid listings={latest} />
        </div>
      </section>
      <section className="bg-primary">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-white sm:text-[32px]">Slik fungerer det</h2>
          <p className="mt-1 text-sm text-white/85 sm:text-[15px]">Ingen mellomledd. Kjøper og selger avtaler direkte.</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col rounded-3xl bg-white p-6 sm:p-9">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">For kjøpere</p>
              <ol className="mt-5 space-y-6">
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">1</span>
                  <div>
                    <p className="font-semibold text-slate-950">Finn kortet</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-700">Søk på spiller, sett eller kortnummer.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">2</span>
                  <div>
                    <p className="font-semibold text-slate-950">Kontakt selgeren</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-700">Send melding direkte fra annonsen.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">3</span>
                  <div>
                    <p className="font-semibold text-slate-950">Gjør avtalen</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-700">Avtal pris, betaling og frakt eller henting dere imellom.</p>
                  </div>
                </li>
              </ol>
              <Link
                className="mt-8 inline-flex h-11 w-max items-center gap-2 rounded-full px-5 text-sm font-semibold transition bg-slate-200 text-primary hover:bg-slate-300"
                href="/products"
              >
                Utforsk markedet
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="flex flex-col rounded-3xl bg-white p-6 sm:p-9">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">For selgere</p>
              <ol className="mt-5 space-y-6">
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">1</span>
                  <div>
                    <p className="font-semibold text-slate-950">Legg ut annonse</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-700">Spiller, sett, tilstand, pris og bilder på et par minutter.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">2</span>
                  <div>
                    <p className="font-semibold text-slate-950">Bli kontaktet</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-700">Kjøperne tar kontakt med deg. Du bestemmer selv.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">3</span>
                  <div>
                    <p className="font-semibold text-slate-950">Løft annonsen</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-700">Vil du selge raskere, kan du fremheve den eller legge den øverst.</p>
                  </div>
                </li>
              </ol>
              <Link
                className="mt-8 inline-flex h-11 w-max items-center gap-2 rounded-full px-5 text-sm font-semibold transition bg-primary text-white hover:bg-black"
                href="/sell"
              >
                Legg ut annonse
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section id="trygg-handel" className="scroll-mt-24 bg-background">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Trygg handel</h2>
          <p className="mt-1 max-w-lg text-sm text-slate-700 sm:text-[15px]">Kjøper og selger avtaler direkte, så ta noen enkle forholdsregler.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-slate-300 sm:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                <ScanSearchIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">Se kortet først</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">Be om bilder av kortet foran og bak, og sjekk kortnummer og opplag mot annonsen.</p>
            </div>
            <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-slate-300 sm:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                <ScaleIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">Sjekk prisen</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                Sammenlign med lignende annonser. Pris langt under markedet bør du være skeptisk til.
              </p>
            </div>
            <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-slate-300 sm:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                <ShieldCheckIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">Betal og send trygt</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                Det er vanlig å betale med Vipps før kortet sendes. Sjekk at navnet i Vipps stemmer med selgeren, og bruk frakt med sporing for dyrere kort.
              </p>
            </div>
            <div className="flex flex-col rounded-3xl bg-primary p-6 text-white sm:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <FlagIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">Rapporter mistenkelige annonser</h3>
              <Link
                className="mt-auto inline-flex h-11 w-max items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-primary transition hover:bg-slate-200"
                href="/contact"
              >
                Rapporter annonse
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Annonseløft</h2>
              <p className="mt-1 max-w-lg text-sm text-slate-700 sm:text-[15px]">
                Vil du selge raskere, løfter du annonsen til toppen eller gir den gullmerke.
              </p>
            </div>
            <Link
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-black"
              href="/annonseloft"
            >
              Løft annonsen din
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="group relative flex flex-col rounded-3xl bg-slate-100 p-6 text-slate-950 ring-1 ring-slate-300 sm:p-8 data-[highlight=true]:bg-primary data-[highlight=true]:text-white data-[highlight=true]:ring-0">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">Topp av listen</h3>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-800 ring-1 ring-slate-300">3 dager</span>
              </div>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="font-heading text-5xl font-bold tracking-[-0.05em]">39</span>
                <span className="text-sm font-medium text-slate-700 group-data-[highlight=true]:text-white/85">kr</span>
              </p>
              <ul className="mt-6 space-y-2.5">
                <li className="flex items-start gap-2.5 text-sm text-slate-800 group-data-[highlight=true]:text-white/90">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep group-data-[highlight=true]:text-accent" aria-hidden="true" />
                  Først i markedet
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-800 group-data-[highlight=true]:text-white/90">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep group-data-[highlight=true]:text-accent" aria-hidden="true" />
                  Først i søkeresultater
                </li>
              </ul>
            </div>
            <div
              data-highlight="true"
              className="group relative flex flex-col rounded-3xl bg-slate-100 p-6 text-slate-950 ring-1 ring-slate-300 sm:p-8 data-[highlight=true]:bg-primary data-[highlight=true]:text-white data-[highlight=true]:ring-0"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">Fremhevet annonse</h3>
                <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">Mest valgt</span>
              </div>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="font-heading text-5xl font-bold tracking-[-0.05em]">79</span>
                <span className="text-sm font-medium text-slate-700 group-data-[highlight=true]:text-white/85">kr / 7 dager</span>
              </p>
              <ul className="mt-6 space-y-2.5">
                <li className="flex items-start gap-2.5 text-sm text-slate-800 group-data-[highlight=true]:text-white/90">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep group-data-[highlight=true]:text-accent" aria-hidden="true" />
                  Gullmerke og gullramme
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-800 group-data-[highlight=true]:text-white/90">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep group-data-[highlight=true]:text-accent" aria-hidden="true" />
                  Egen seksjon på forsiden
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-800 group-data-[highlight=true]:text-white/90">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep group-data-[highlight=true]:text-accent" aria-hidden="true" />
                  Først i markedet
                </li>
              </ul>
            </div>
            <div className="group relative flex flex-col rounded-3xl bg-slate-100 p-6 text-slate-950 ring-1 ring-slate-300 sm:p-8 data-[highlight=true]:bg-primary data-[highlight=true]:text-white data-[highlight=true]:ring-0">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">Toppannonse</h3>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-800 ring-1 ring-slate-300">30 dager</span>
              </div>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="font-heading text-5xl font-bold tracking-[-0.05em]">199</span>
                <span className="text-sm font-medium text-slate-700 group-data-[highlight=true]:text-white/85">kr</span>
              </p>
              <ul className="mt-6 space-y-2.5">
                <li className="flex items-start gap-2.5 text-sm text-slate-800 group-data-[highlight=true]:text-white/90">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep group-data-[highlight=true]:text-accent" aria-hidden="true" />
                  Plass i kortvifta øverst på forsiden
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-800 group-data-[highlight=true]:text-white/90">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep group-data-[highlight=true]:text-accent" aria-hidden="true" />
                  Gullmerke hele perioden
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-800 group-data-[highlight=true]:text-white/90">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep group-data-[highlight=true]:text-accent" aria-hidden="true" />
                  Størst synlighet
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-background">
        <div className="mx-auto max-w-[1320px] px-4 pb-16 pt-4 sm:px-6 md:pb-24 lg:px-8">
          <div className="relative overflow-hidden rounded-[20px] bg-[radial-gradient(120%_140%_at_10%_0%,hsl(var(--ink-soft))_0%,hsl(var(--ink))_70%)] px-6 py-12 text-white sm:rounded-[28px] sm:px-12 sm:py-16 lg:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgba(255,255,255,0.9)_0.6px,transparent_0.6px)] [background-size:4px_4px]"
            ></div>
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="max-w-2xl font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1] tracking-[-0.04em]">
                  Har du kort i skuffen? <span className="text-gold-light">Gjør dem til penger.</span>
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">Legg ut annonsen på et par minutter. Kjøperne kontakter deg direkte.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-primary transition hover:bg-gold-light"
                  href="/sell"
                >
                  Legg ut kort
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  className="inline-flex h-12 items-center rounded-full px-6 text-sm font-semibold ring-1 ring-inset ring-white/35 transition hover:bg-white/10"
                  href="/faq"
                >
                  Spørsmål og svar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
