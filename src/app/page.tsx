import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CheckIcon,
  ChevronRightIcon,
  FlagIcon,
  HistoryIcon,
  MessageCircleIcon,
  PackageCheckIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Slab } from "@/components/HeroFan";
import { MagRull } from "@/components/MagRull";
import { AccordionItem } from "@/components/Accordion";
import { formatPrice } from "@/lib/format";
import { Eyebrow } from "@/components/ui";
import { frontpageRow } from "@/lib/frontpage-row";
import { ListingGrid } from "@/components/ListingCard";
import { getListings } from "@/lib/listings";

export const revalidate = 60;

export const metadata = { alternates: { canonical: "/" } };

/** Kategoriene øverst. Rulles sidelengs på mobil. */
const CATEGORIES = [
  ["/marked", "Alle kort"],
  ["/marked?type=Autograf", "Autografer"],
  ["/marked?type=Patch", "Patch/relic"],
  ["/marked?type=Nummerert", "Nummererte"],
  ["/marked?q=gradert", "Graderte (PSA/BGS)"],
  ["/marked?type=Rookie", "Rookies"],
  ["/marked?q=norske%20spillere", "Norske spillere"],
  ["/marked?q=lot", "Samlinger/lots"],
] as const;

/** «Populært nå»: valgt for hånd til det finnes nok søkestatistikk. */
const POPULAR = ["Haaland", "Ødegaard", "Nusa", "Sørloth", "Messi", "Ronaldo"];

/** Bare det tjenesten faktisk tilbyr. */
const TRUST = ["Bare fotballkort", "Alle logger inn med Vipps", "Gratis å legge ut"];

/** Om oss på forsiden. Bytt ut navn, bilde og tekst med deres egne før siden åpnes. */
const ABOUT = {
  name: "[Navn på grunnleggeren]",
  role: "Samler og grunnlegger",
  image: null as string | null,
  text: "[To setninger om hvorfor dere startet Hobbystrada. For eksempel: Vi samler selv på fotballkort og savnet et sted bare for denne hobbyen. Derfor laget vi en markedsplass der samlere i hele Norge kan finne hverandre.]",
};

const FAQ = [
  ["Koster det å legge ut?", "Nei, det er gratis å legge ut kort. Vil du selge raskere, kan du kjøpe annonseløft, men det er et valg og ikke et krav."],
  [
    "Hvordan betaler vi?",
    "Det finnes ingen betalingsløsning for kort på siden. Når selgeren godtar budet ditt i chatten, får du en knapp som åpner Vipps med selgeren valgt, og pengene går rett til selgeren. Sjekk at navnet i Vipps er det samme som i chatten.",
  ],
  [
    "Er det trygt?",
    "Alle som legger ut kort eller sender meldinger, logger inn med Vipps, så dere vet hvem dere handler med. Be om bilder av begge sider av kortet, avtal alt i chatten og rapporter annonser som virker mistenkelige. Hobbystrada er ikke part i handelen.",
  ],
  [
    "Hvordan sender jeg?",
    "Dere avtaler frakt eller henting selv. Legg kortet i en plastlomme og en toploader, send det i en polstret konvolutt, og velg sending med sporing for verdifulle kort.",
  ],
] as const;

export default async function Home() {
  const all = await getListings();
  // «Nylig lagt ut»: bare de nyeste, uten at betalte annonser rykker frem
  const latest = [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 12);
  // Forsideraden: toppannonser, så Fremhevet, så kort admin har valgt. Nyeste bare som reserve.
  const fanList = frontpageRow(all);
  return (
    <div className="forside bg-background">
      {/* 1–2. Kort hero med overskrift, knapper og tillitsmerker, og kortraden rett under */}
      <section className="vis-magasin mag flex flex-col bg-background">
        <div className="mag-topp mx-auto w-full max-w-[1320px] px-5 pt-6 text-center sm:px-8 lg:pt-10">
          <h1 className="mt-h font-[family-name:var(--t-sora)] text-[2rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#0b1426] sm:text-[2.8rem] lg:text-[3.4rem]">
            Fotballkort fra <span className="mt-strek">samlere</span> i hele Norge
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[14px] font-medium text-[#5d564d] sm:text-[16px]">
            Annonser for fotballkort i Norge. Kjøper og selger gjør avtalen direkte.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <Link className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-black" href="/marked">
              Se kortene
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              className="inline-flex h-12 items-center rounded-full bg-white/60 px-6 text-sm font-semibold text-primary ring-1 ring-inset ring-[#0b1426]/25 backdrop-blur transition hover:bg-white"
              href="/selg"
            >
              Legg ut kort
            </Link>
          </div>
          {/* Ikke <ul>/<li> her: .mag ul li er satt opp for kortraden */}
          <p className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[12px] font-semibold text-[#3d3730] sm:text-[13px]">
            {TRUST.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-3.5 w-3.5 text-[#a07c2c]" strokeWidth={3} aria-hidden="true" />
                {t}
              </span>
            ))}
          </p>
        </div>
        {fanList[0] && (
          /* Forsideraden glir sakte bortover uten stans (tre kopier, så den aldri får en synlig skjøt). Stopper når musa er over, og kan sveipes på mobil. */
          <div className="mag-rull-ramme relative mx-auto mt-5 w-full max-w-[1320px] select-none overflow-hidden px-6 [touch-action:pan-y] sm:px-8">
            <MagRull className="mag-rull flex w-max pt-3" aria-label="Utvalgte kort">
              {[0, 1, 2].flatMap((k) =>
                fanList.map((l, i) => (
                  <li key={`${k}-${l.slug}`} data-slug={l.slug} className="relative mr-3 shrink-0 lg:mr-4" aria-hidden={k > 0 ? true : undefined}>
                    <Link href={`/annonse/${l.slug}`} className="block transition hover:opacity-90" tabIndex={k > 0 ? -1 : undefined}>
                      <Slab l={l} eager={k === 0 && i < 6} />
                    </Link>
                    <Link
                      href={`/annonse/${l.slug}`}
                      tabIndex={-1}
                      className="pill-hver fan-pill absolute left-1/2 top-full z-10 mt-2 hidden -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#f7f5f0] py-1 pl-3 pr-1 text-[12px] font-semibold text-[#0b1426] shadow-[0_8px_24px_-14px_rgb(11_20_38/0.35)] ring-1 ring-inset ring-[#ebe6da]"
                    >
                      <span className="text-[#8a6a24]">{formatPrice(l.price)}</span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#cfa653]">
                        <ArrowRightIcon className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                )),
              )}
            </MagRull>
          </div>
        )}
      </section>

      {/* 3. Kategorier */}
      <nav aria-label="Kategorier" className="border-b border-[#e6dccb] bg-[#f8f4ec]">
        <ul className="mx-auto flex max-w-[1320px] snap-x gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:px-6 lg:px-8">
          {CATEGORIES.map(([href, label]) => (
            <li key={label} className="shrink-0 snap-start">
              <Link
                href={href}
                className="inline-flex h-9 items-center whitespace-nowrap rounded-full bg-white px-4 text-[13px] font-semibold text-[#0b1426] ring-1 ring-inset ring-[#e3d8c4] transition hover:ring-[#cfa653]"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 4. Nylig lagt ut */}
      <section>
        <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Nylig lagt ut</h2>
            <Link className="tap inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-slate-900 underline-offset-4 transition hover:underline" href="/marked">
              Se alle kort
              <ArrowRightIcon className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ListingGrid listings={latest} />
        </div>
      </section>

      {/* 5. Slik handler du trygt */}
      <section id="trygg-handel" className="seksjon-alt scroll-mt-24">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <Eyebrow>Trygg handel</Eyebrow>
          <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Slik handler du trygt</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
            <div className="studio-bilde relative min-h-[200px] overflow-hidden rounded-3xl md:col-span-3 lg:col-span-1">
              <Image src="/forside/trygg.webp" alt="" fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
            </div>
            {(
              [
                [BadgeCheckIcon, "1. Alle logger inn med Vipps", "Den som legger ut kort eller sender meldinger, har logget inn med Vipps. Du ser hvem du handler med."],
                [PackageCheckIcon, "2. Se kortet og send med sporing", "Be om bilder av begge sider av kortet, avtal alt i chatten og velg sporbar sending for verdifulle kort."],
                [FlagIcon, "3. Rapporter det som virker feil", "Ser du en mistenkelig annonse eller bruker, trykk «Rapporter annonse», så ser vi på den."],
              ] as const
            ).map(([Icon, title, text]) => (
              <div key={title} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-slate-300/70 sm:p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{text}</p>
              </div>
            ))}
          </div>
          <Link className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#8a6a24] underline-offset-4 hover:underline" href="/sporsmal">
            Les mer om trygg handel
            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* 6–7. Populært nå og solgte kort */}
      <section>
        <div className="mx-auto grid max-w-[1320px] gap-4 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-16 lg:px-8">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-300/70 sm:p-8">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6a24]">
              <TrendingUpIcon className="h-4 w-4" aria-hidden="true" />
              Populært nå
            </p>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950">Spillerne samlere ser etter</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <li key={p}>
                  <Link
                    href={`/marked?q=${encodeURIComponent(p)}`}
                    className="inline-flex h-10 items-center rounded-full bg-[#0b1426] px-4 text-sm font-semibold text-white transition hover:bg-black"
                  >
                    {p}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/solgt" className="group flex flex-col rounded-3xl bg-[#0b1426] p-6 text-white ring-1 ring-[#cfa653]/30 transition hover:ring-[#cfa653] sm:p-8">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e2c27a]">
              <HistoryIcon className="h-4 w-4" aria-hidden="true" />
              Solgte kort
            </p>
            <h2 className="loft-tittel mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-white">Hva er kortet ditt verdt?</h2>
            <p className="mt-2 max-w-md text-sm text-white/75">Se hva lignende kort er solgt for, med pris og dato, i arkivet over solgte kort.</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-[#e2c27a]">
              Se solgte kort
              <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </section>

      {/* 8. Selgerblokk */}
      <section className="seksjon-alt">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="loft-banner relative grid overflow-hidden rounded-3xl bg-[#0b1426] text-white md:grid-cols-[1.1fr_1fr]">
            <div className="relative z-10 flex flex-col justify-center gap-5 p-7 sm:p-10">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e2c27a]">For selgere</p>
                <h2 className="loft-tittel mt-3 font-heading text-3xl font-bold tracking-[-0.03em] text-white sm:text-[40px]">Har du dubletter? Legg ut på 2 minutter</h2>
                <p className="mt-3 max-w-md text-sm text-white/75 sm:text-[15px]">
                  Fyll inn spiller, sett og pris, last opp bilder, og kjøperne tar kontakt med deg i chatten. Det er gratis å legge ut.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link className="inline-flex h-11 w-max items-center gap-2 rounded-full bg-[#cfa653] px-5 text-sm font-semibold text-[#0b1426] transition hover:bg-[#e2c27a]" href="/selg">
                  Legg ut kort
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline" href="/annonseloft">
                  Vil du selge raskere? Annonseløft er et valg, ikke et krav.
                </Link>
              </div>
            </div>
            <div className="relative min-h-[220px] md:min-h-[340px]">
              <Image src="/forside/selger.webp" alt="" fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0b1426] via-transparent to-transparent md:bg-gradient-to-r md:from-[#0b1426] md:via-[#0b1426]/10" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Om oss */}
      <section>
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="grid items-center gap-6 rounded-3xl bg-white p-6 ring-1 ring-slate-300/70 sm:p-8 md:grid-cols-[180px_1fr] md:gap-10">
            <div className="relative mx-auto aspect-square w-36 overflow-hidden rounded-full bg-[#0b1426] md:w-full">
              {ABOUT.image ? (
                <Image src={ABOUT.image} alt={ABOUT.name} fill sizes="180px" className="object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-center text-xs font-semibold text-white/60">Bilde av grunnleggeren</span>
              )}
            </div>
            <div>
              <Eyebrow>Om oss</Eyebrow>
              <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[28px]">Startet av samlere</h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-700">{ABOUT.text}</p>
              <p className="mt-4 text-sm font-semibold text-slate-950">
                {ABOUT.name} <span className="font-normal text-slate-600">· {ABOUT.role}</span>
              </p>
              <Link className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#8a6a24] underline-offset-4 hover:underline" href="/om-oss">
                Mer om Hobbystrada
                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Spørsmål og svar, med «Slik kjøper du» og «Slik selger du» */}
      <section className="seksjon-alt">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <Eyebrow>Spørsmål og svar</Eyebrow>
          <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Lurer du på noe?</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
            <div className="rounded-3xl bg-white px-5 ring-1 ring-slate-300/70 sm:px-7">
              {FAQ.map(([q, a]) => (
                <AccordionItem key={q} q={q}>
                  {a}
                </AccordionItem>
              ))}
            </div>
            {(
              [
                ["/forside/kjoper.webp", "Slik kjøper du", ["Søk på spiller, sett eller kortnummer.", "Send en melding eller gi et bud i chatten.", "Avtal betaling og frakt eller henting."], "/marked", "Se kortene"],
                ["/forside/loft.webp", "Slik selger du", ["Logg inn med Vipps og trykk «Legg ut kort».", "Fyll inn kortet, pris og bilder.", "Svar kjøperne i chatten og avtal handelen."], "/selg", "Legg ut kort"],
              ] as const
            ).map(([img, title, steps, href, cta]) => (
              <div key={title} className="flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-300/70">
                <div className="relative aspect-[16/10]">
                  <Image src={img} alt="" fill sizes="(max-width: 1024px) 100vw, 400px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
                  <ol className="mt-3 space-y-2.5">
                    {steps.map((s, i) => (
                      <li key={s} className="flex gap-3 text-sm text-slate-700">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                  <Link className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-[#8a6a24] underline-offset-4 hover:underline" href={href}>
                    {cta}
                    <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Link className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#8a6a24] underline-offset-4 hover:underline" href="/sporsmal">
            <MessageCircleIcon className="h-4 w-4" aria-hidden="true" />
            Alle spørsmål og svar
          </Link>
        </div>
      </section>
    </div>
  );
}
