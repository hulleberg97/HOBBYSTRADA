import Link from "next/link";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CheckIcon,
  ChevronRightIcon,
  FlagIcon,
  LayoutGridIcon,
  PenLineIcon,
  PlusIcon,
  ScanSearchIcon,
  ShieldCheckIcon,
  ShirtIcon,
  StarIcon,
} from "lucide-react";
import { HeroFan, Slab } from "@/components/HeroFan";
import { RowPill } from "@/components/RowPill";
import { formatPrice } from "@/lib/format";
import { Eyebrow, btnSecondary } from "@/components/ui";
import { BOOSTS, BOOST_PERKS } from "@/lib/boosts";
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
  // Kortraden: festede kort, alle toppannonser, så Fremhevet og Topp av listen, og til slutt de nyeste – helst med ekte bilde
  const fanPinned = all.filter((l) => l.fanSlot);
  const fanPaid = all.filter((l) => l.frontpage);
  const fanBoosted = all.filter((l) => !l.frontpage && (l.featured || l.bumpedAt));
  const fanFill = [...newest(all.filter((l) => l.image)), ...newest(all.filter((l) => !l.image))];
  const fanList = fanCards(fanPinned, fanPaid, fanBoosted, fanFill);
  return (
    <div className="bg-background">
      {/* TEST ?vis=magasin: magasinforside – stor overskrift til venstre, ett stort kort ut av høyre kant, de andre i en rad under */}
      {fanList[0] && (
        <section className="vis-magasin mag flex flex-col justify-between bg-background">
          <div className="mag-topp mx-auto grid w-full max-w-[1320px] grid-cols-1 items-center gap-6 px-6 pt-6 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-4 lg:pt-6">
            <div className="relative z-10">
              <div className="mt-std">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a8822f]">Norges markedsplass for samlere</p>
                <p className="mag-tittel mt-h mt-3 text-[2.6rem] leading-[0.92] sm:text-[3.6rem] lg:text-[4.2rem]">
                  Kjøp og selg
                  <br />
                  fotballkort
                </p>
              </div>
              {/* TEST ?tittel2=a|b|c|d: nye overskrifter */}
              <div className="mt-a hidden">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a8822f]">Norges markedsplass for fotballkort</p>
                <p className="mt-h mt-3 font-[family-name:var(--t-sora)] text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#0b1426] sm:text-[3.2rem] lg:text-[3.8rem]">
                  Samlingen din
                  <br />
                  <span className="text-[#a8822f]">starter her.</span>
                </p>
              </div>
              <div className="mt-b hidden">
                <p className="mt-h font-[family-name:var(--t-sora)] text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#0b1426] sm:text-[3.2rem] lg:text-[3.8rem]">Fotballkort.</p>
                <p className="mt-1 text-[1.3rem] font-medium leading-snug tracking-[-0.01em] text-[#6b655e] sm:text-[1.6rem] lg:text-[1.9rem]">Kjøpt og solgt av samlere.</p>
              </div>
              <div className="mt-c hidden">
                <p className="mag-tittel mt-h text-[2.8rem] leading-[0.9] tracking-[-0.04em] sm:text-[4.2rem] lg:text-[5.2rem]">Fotballkort</p>
                <p className="mt-hode mx-auto mt-3 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a6a24] sm:text-xs lg:mt-4">
                  <span>Kjøp</span><span aria-hidden="true">·</span><span>Selg</span><span aria-hidden="true">·</span><span>Bytt</span>
                </p>
              </div>
              <div className="mt-e hidden">
                <p className="mt-h font-[family-name:var(--t-sora)] text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#0b1426] sm:text-[3.2rem] lg:text-[3.8rem]">
                  Markedsplassen for
                  <br />
                  <span className="text-[#a8822f]">fotballkort</span>
                </p>
                <p className="mt-3 text-[13px] font-medium text-[#6b655e] sm:text-[15px] lg:text-base">Kjøp og selg kort med samlere i hele Norge.</p>
              </div>
              <div className="mt-f hidden">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a8822f]">Norges markedsplass for fotballkort</p>
                <p className="mt-h mt-3 font-[family-name:var(--t-sora)] text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#0b1426] sm:text-[3.2rem] lg:text-[3.8rem]">
                  Kjøp. Selg.
                  <br />
                  <span className="text-[#a8822f]">Samle.</span>
                </p>
              </div>
              <div className="mt-g hidden">
                <p className="mt-h font-[family-name:var(--t-sora)] text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#0b1426] sm:text-[3.2rem] lg:text-[3.8rem]">
                  Kjøp og selg fotballkort
                  <br />
                  <span className="text-[#a8822f]">med samlere i hele Norge</span>
                </p>
                <p className="mt-3 text-[13px] font-medium text-[#6b655e] sm:text-[15px] lg:text-base">Trygg handel. Logg inn med Vipps.</p>
              </div>
              <div className="mt-d hidden">
                <h1 className="mt-h font-[family-name:var(--t-sora)] text-[2.4rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#0b1426] sm:text-[3.2rem] lg:text-[3.8rem]">
                  Finn ditt <span className="mt-strek">neste</span> kort
                </h1>
                <p className="mt-3 text-[13px] font-medium text-[#6b655e] sm:text-[15px] lg:text-base">Markedsplass for kjøp og salg av fotballkort.</p>
              </div>
              <div className="mag-knapper mt-7 flex flex-wrap gap-2.5">
                <Link className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-black" href="/products">
                  Se alle annonser
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link className="knapp-selg inline-flex h-12 items-center gap-1.5 rounded-full px-6 text-sm font-semibold text-primary ring-1 ring-inset ring-[#0b1426]/30 transition hover:bg-[#0b1426]/5" href="/sell">
                  <PlusIcon className="knapp-pluss hidden h-4 w-4" aria-hidden="true" />
                  Legg ut kort
                </Link>
              </div>
            </div>
            <div className="mag-scene relative">
              <Link href={`/products/${fanList[0].slug}`} className="mag-stort absolute -right-[14%] top-[4%] block rotate-[8deg] sm:-right-[10%] lg:-right-[6%]">
                <Slab l={fanList[0]} />
              </Link>
              <Link href={`/products/${fanList[0].slug}`} className="fan-pill absolute bottom-2 left-0 flex items-center gap-4 rounded-full bg-[#f7f5f0] py-2 pl-5 pr-2 text-left text-[#0b1426] shadow-[0_8px_24px_-14px_rgb(11_20_38/0.35)] ring-1 ring-inset ring-[#ebe6da] lg:bottom-10">
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold leading-tight sm:text-sm">{fanList[0].player}</span>
                  <span className="block truncate text-[11px] text-[#6b6455] sm:text-xs">{fanList[0].set}</span>
                </span>
                <span className="shrink-0 font-heading text-sm font-bold text-[#8a6a24] sm:text-base">{formatPrice(fanList[0].price)}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#cfa653] text-[#0b1426]">
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
              {/* TEST ?stort=vifte: den levende vifta i stedet for det store kortet */}
              <div className="mag-vifte absolute inset-0 hidden">
                <HeroFan cards={fanList} />
              </div>
              {/* TEST ?stort=tre: tre kort i vifte, stillestående */}
              <div className="mag-tre absolute inset-0 hidden">
                {fanList.slice(0, 3).map((l, i) => (
                  <Link
                    key={l.slug}
                    href={`/products/${l.slug}`}
                    className={`absolute block ${i === 0 ? "left-[4%] top-[10%] -rotate-[12deg]" : i === 1 ? "left-[30%] top-[2%] z-10" : "left-[56%] top-[10%] rotate-[12deg]"}`}
                  >
                    <Slab l={l} eager />
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {/* Kortraden glir sakte bortover uten stans (tre kopier, så den aldri får en synlig skjøt). Stopper når musa er over. */}
          <div className="mag-rull-ramme relative mx-auto w-full max-w-[1320px] overflow-hidden px-6 sm:px-8">
            {/* TEST ?pill=midt|topp: prislapp nederst, over speilingen. «midt» følger kortet i midten, «topp» viser toppannonsen. */}
            <div className="pill-midt pointer-events-none absolute inset-x-0 bottom-3 z-10 hidden justify-center px-4 lg:bottom-5 [&>a]:pointer-events-auto">
              <RowPill cards={fanList} />
            </div>
            <div className="pill-topp pointer-events-none absolute inset-x-0 bottom-3 z-10 hidden justify-center px-4 lg:bottom-5">
              <Link
                href={`/products/${fanList[0].slug}`}
                className="fan-pill pointer-events-auto flex items-center gap-4 rounded-full bg-[#f7f5f0] py-2 pl-5 pr-2 text-left text-[#0b1426] shadow-[0_8px_24px_-14px_rgb(11_20_38/0.35)] ring-1 ring-inset ring-[#ebe6da]"
              >
                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a6a24]">Toppannonse</span>
                  <span className="block truncate text-[13px] font-semibold leading-tight sm:text-sm">{fanList[0].player}</span>
                </span>
                <span className="shrink-0 font-heading text-sm font-bold text-[#8a6a24] sm:text-base">{formatPrice(fanList[0].price)}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#cfa653] text-[#0b1426]">
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </div>
            <ul className="mag-rull flex w-max pt-3" aria-label="Flere kort">
              {[0, 1, 2].flatMap((k) =>
                fanList.map((l, i) => (
                  <li key={`${k}-${l.slug}`} data-slug={l.slug} className="relative mr-3 shrink-0 lg:mr-4" aria-hidden={k > 0 ? true : undefined}>
                    <Link href={`/products/${l.slug}`} className="block transition hover:opacity-90" tabIndex={k > 0 ? -1 : undefined}>
                      <Slab l={l} eager={k === 0 && i < 6} />
                    </Link>
                    {/* TEST ?pill=hver: liten prislapp under hvert kort, glir med raden */}
                    <Link
                      href={`/products/${l.slug}`}
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
            </ul>
          </div>
        </section>
      )}
      <section className="vis-vifte bg-background">
        <div className="mx-auto max-w-[1320px] sm:px-6 sm:pt-6 lg:px-8">
          <div
            id="hero"
            data-oppsett="vifte"
            data-tekst="5"
            data-farge="lys"
            className="hero-bg relative overflow-hidden text-white sm:rounded-[28px]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--accent))_50%,transparent)] opacity-60"
            ></div>
            <div className="hero-grid relative grid items-center gap-2 px-6 pt-10 sm:px-10 sm:pt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-0 lg:py-10 lg:pl-16 lg:pr-4">
              <div className="hero-text min-w-0">
                {/* Antallet vises først når det er stort nok til å imponere */}
                {all.length >= 20 && (
                  <p className="hero-badge mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85 ring-1 ring-inset ring-white/15">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
                    {all.length} aktive annonser nå
                  </p>
                )}
                <p className="hero-title font-heading text-[clamp(2.2rem,4.8vw,4.25rem)] font-bold leading-[0.95] tracking-[-0.04em]">
                  Fotballkort.
                  <br className="hero-br" /> <span className="hero-gold text-gold-light">Kjøp og selg.</span>
                </p>
                {/* Overskriften som vises over vifta er sidens h1 */}
                <h1 className="hero-sub mt-5 max-w-md text-[15px] leading-relaxed text-white/85 sm:text-lg">
                  <span>
                    Kjøp og selg <span className="hero-accent">fotballkort</span>
                    <span className="tittel-under">Norges markedsplass for samlere</span>
                  </span>
                </h1>
                <div className="hero-buttons mt-7 flex gap-2.5 sm:mt-8 sm:gap-3">
                  <Link
                    className="hero-primary inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 text-[13px] font-semibold text-primary transition hover:bg-gold-light sm:h-12 sm:px-6 sm:text-sm"
                    href="/products"
                  >
                    Se alle annonser
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    className="hero-ghost inline-flex h-11 items-center whitespace-nowrap rounded-full px-5 text-[13px] font-semibold text-white ring-1 ring-inset ring-white/35 transition hover:bg-white/10 sm:h-12 sm:px-6 sm:text-sm"
                    href="/sell"
                  >
                    Legg ut kort
                  </Link>
                </div>
              </div>
              <div className="mt-10 sm:mt-6 lg:mt-0">
                <HeroFan cards={fanList} />
              </div>
            </div>
            {/* Kortene som glir ut til høyre tones inn i bakgrunnen i stedet for å kuttes av kanten */}
            <div
              aria-hidden="true"
              className="hero-edge pointer-events-none absolute inset-y-0 right-0 z-[300] hidden w-28 bg-[linear-gradient(90deg,transparent,#0b1830_85%)] lg:block"
            ></div>
          </div>
        </div>
      </section>
      <section className="bg-background">
        <div className="mx-auto max-w-[1320px] px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
          <h2 className="sr-only">Kategorier</h2>
          <ul className="kat-rad -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:auto-cols-fr sm:grid-flow-col sm:gap-2 sm:overflow-visible sm:rounded-3xl sm:bg-white sm:p-2 sm:ring-1 sm:ring-slate-300/80">
            {c.autograf > 0 && (
              <li className="shrink-0 snap-start sm:min-w-0">
                <Link
                  className="group flex h-full items-center gap-2 whitespace-nowrap rounded-full bg-[#fff] py-2 pl-3 pr-3.5 shadow-[inset_0_0_0_1px_#e3dccb] transition hover:shadow-[inset_0_0_0_1px_#cfa653] sm:flex-col sm:gap-2.5 sm:whitespace-normal sm:rounded-2xl sm:px-2 sm:py-4 sm:text-center sm:shadow-none sm:hover:bg-slate-100 sm:hover:shadow-none"
                  href="/search?q=autograf"
                >
                  <PenLineIcon className="h-5 w-5 shrink-0 text-primary transition group-hover:text-[hsl(var(--gold-deep))] sm:h-8 sm:w-8" strokeWidth={1.4} aria-hidden="true" />
                  <span className="text-[13px] font-semibold leading-tight text-slate-950 sm:text-sm">Autografkort</span>
                  <span className="text-xs font-medium text-slate-600">
                    <span className="sm:hidden">{c.autograf}</span>
                    <span className="hidden sm:inline">{c.autograf} {c.autograf === 1 ? "annonse" : "annonser"}</span>
                  </span>
                </Link>
              </li>
            )}
            {c.relic > 0 && (
              <li className="shrink-0 snap-start sm:min-w-0">
                <Link
                  className="group flex h-full items-center gap-2 whitespace-nowrap rounded-full bg-[#fff] py-2 pl-3 pr-3.5 shadow-[inset_0_0_0_1px_#e3dccb] transition hover:shadow-[inset_0_0_0_1px_#cfa653] sm:flex-col sm:gap-2.5 sm:whitespace-normal sm:rounded-2xl sm:px-2 sm:py-4 sm:text-center sm:shadow-none sm:hover:bg-slate-100 sm:hover:shadow-none"
                  href="/search?q=relic"
                >
                  <ShirtIcon className="h-5 w-5 shrink-0 text-primary transition group-hover:text-[hsl(var(--gold-deep))] sm:h-8 sm:w-8" strokeWidth={1.4} aria-hidden="true" />
                  <span className="text-[13px] font-semibold leading-tight text-slate-950 sm:text-sm">
                    Patch / relic
                  </span>
                  <span className="text-xs font-medium text-slate-600">
                    <span className="sm:hidden">{c.relic}</span>
                    <span className="hidden sm:inline">{c.relic} {c.relic === 1 ? "annonse" : "annonser"}</span>
                  </span>
                </Link>
              </li>
            )}
            {c.numbered > 0 && (
              <li className="shrink-0 snap-start sm:min-w-0">
                <Link
                  className="group flex h-full items-center gap-2 whitespace-nowrap rounded-full bg-[#fff] py-2 pl-3 pr-3.5 shadow-[inset_0_0_0_1px_#e3dccb] transition hover:shadow-[inset_0_0_0_1px_#cfa653] sm:flex-col sm:gap-2.5 sm:whitespace-normal sm:rounded-2xl sm:px-2 sm:py-4 sm:text-center sm:shadow-none sm:hover:bg-slate-100 sm:hover:shadow-none"
                  href="/search?q=%2F"
                >
                  <span
                    className="flex h-5 shrink-0 items-center justify-center text-[14px] font-medium leading-none tracking-tight text-primary transition group-hover:text-[hsl(var(--gold-deep))] sm:h-8 sm:w-8 sm:text-[22px]"
                    aria-hidden="true"
                  >
                    1/1
                  </span>
                  <span className="text-[13px] font-semibold leading-tight text-slate-950 sm:text-sm">
                    Nummererte kort
                  </span>
                  <span className="text-xs font-medium text-slate-600">
                    <span className="sm:hidden">{c.numbered}</span>
                    <span className="hidden sm:inline">{c.numbered} {c.numbered === 1 ? "annonse" : "annonser"}</span>
                  </span>
                </Link>
              </li>
            )}
            {c.rookie > 0 && (
              <li className="shrink-0 snap-start sm:min-w-0">
                <Link
                  className="group flex h-full items-center gap-2 whitespace-nowrap rounded-full bg-[#fff] py-2 pl-3 pr-3.5 shadow-[inset_0_0_0_1px_#e3dccb] transition hover:shadow-[inset_0_0_0_1px_#cfa653] sm:flex-col sm:gap-2.5 sm:whitespace-normal sm:rounded-2xl sm:px-2 sm:py-4 sm:text-center sm:shadow-none sm:hover:bg-slate-100 sm:hover:shadow-none"
                  href="/search?q=RC"
                >
                  <StarIcon className="h-5 w-5 shrink-0 text-primary transition group-hover:text-[hsl(var(--gold-deep))] sm:h-8 sm:w-8" strokeWidth={1.4} aria-hidden="true" />
                  <span className="text-[13px] font-semibold leading-tight text-slate-950 sm:text-sm">Rookies</span>
                  <span className="text-xs font-medium text-slate-600">
                    <span className="sm:hidden">{c.rookie}</span>
                    <span className="hidden sm:inline">{c.rookie} {c.rookie === 1 ? "annonse" : "annonser"}</span>
                  </span>
                </Link>
              </li>
            )}
            {c.base > 0 && (
              <li className="shrink-0 snap-start sm:min-w-0">
                <Link
                  className="group flex h-full items-center gap-2 whitespace-nowrap rounded-full bg-[#fff] py-2 pl-3 pr-3.5 shadow-[inset_0_0_0_1px_#e3dccb] transition hover:shadow-[inset_0_0_0_1px_#cfa653] sm:flex-col sm:gap-2.5 sm:whitespace-normal sm:rounded-2xl sm:px-2 sm:py-4 sm:text-center sm:shadow-none sm:hover:bg-slate-100 sm:hover:shadow-none"
                  href="/search?q=chrome"
                >
                  <BadgeCheckIcon className="h-5 w-5 shrink-0 text-primary transition group-hover:text-[hsl(var(--gold-deep))] sm:h-8 sm:w-8" strokeWidth={1.4} aria-hidden="true" />
                  <span className="text-[13px] font-semibold leading-tight text-slate-950 sm:text-sm">Base</span>
                  <span className="text-xs font-medium text-slate-600">
                    <span className="sm:hidden">{c.base}</span>
                    <span className="hidden sm:inline">{c.base} {c.base === 1 ? "annonse" : "annonser"}</span>
                  </span>
                </Link>
              </li>
            )}
            <li className="shrink-0 snap-start sm:min-w-0">
              <Link
                className="group flex h-full items-center gap-2 whitespace-nowrap rounded-full bg-[#fff] py-2 pl-3 pr-3.5 shadow-[inset_0_0_0_1px_#e3dccb] transition hover:shadow-[inset_0_0_0_1px_#cfa653] sm:flex-col sm:gap-2.5 sm:whitespace-normal sm:rounded-2xl sm:px-2 sm:py-4 sm:text-center sm:shadow-none sm:hover:bg-slate-100 sm:hover:shadow-none"
                href="/products"
              >
                <LayoutGridIcon className="h-5 w-5 shrink-0 text-primary transition group-hover:text-[hsl(var(--gold-deep))] sm:h-8 sm:w-8" strokeWidth={1.4} aria-hidden="true" />
                <span className="text-[13px] font-semibold leading-tight text-slate-950 sm:text-sm">Alle kort</span>
                <span className="text-xs font-medium text-slate-600">
                  <span className="sm:hidden">{c.all}</span>
                    <span className="hidden sm:inline">{c.all} {c.all === 1 ? "annonse" : "annonser"}</span>
                </span>
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
                <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Utvalgte kort</h2>
                <p className="mt-1 text-sm text-slate-700 sm:text-[15px]">Kort selgerne har løftet frem</p>
              </div>
              <Link
                className="tap inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-slate-900 underline-offset-4 transition hover:underline"
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
      <section className="bg-background">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Nyeste annonser</h2>
              <p className="mt-1 text-sm text-slate-700 sm:text-[15px]">Nylig lagt ut av samlere i hele Norge</p>
            </div>
            <Link
              className="tap inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-slate-900 underline-offset-4 transition hover:underline"
              href="/products"
            >
              Se alle
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ListingGrid listings={latest} />
        </div>
      </section>
      <section className="seksjon-alt bg-background">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <Eyebrow>Slik fungerer det</Eyebrow>
          <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Ingen mellomledd</h2>
          <p className="mt-1 text-sm text-slate-600 sm:text-[15px]">Kjøper og selger avtaler direkte.</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-slate-300/70 sm:p-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6a24]">For kjøpere</p>
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
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-700">Send en melding i chatten rett fra annonsen.</p>
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
                className="mt-8 inline-flex h-11 w-max items-center gap-2 rounded-full px-5 text-sm font-semibold transition bg-white text-primary ring-1 ring-inset ring-slate-300"
                href="/products"
              >
                Utforsk markedet
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-slate-300/70 sm:p-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6a24]">For selgere</p>
              <ol className="mt-5 space-y-6">
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">1</span>
                  <div>
                    <p className="font-semibold text-slate-950">Legg ut kort</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-700">
                      Fyll inn spiller, sett, tilstand og pris, last opp bilder – ferdig på et par minutter.
                    </p>
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
                Legg ut kort
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section id="trygg-handel" className="scroll-mt-24 bg-background">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <Eyebrow>Trygg handel</Eyebrow>
          <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Handle trygt</h2>
          <p className="mt-1 max-w-lg text-sm text-slate-700 sm:text-[15px]">Kjøper og selger avtaler direkte, så ta noen enkle forholdsregler.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-slate-300/70 sm:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                <ScanSearchIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">Se kortet først</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">Be om bilder av begge sider av kortet. Sjekk at nummer og opplag stemmer med annonsen.</p>
            </div>
            <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-slate-300/70 sm:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                <ShieldCheckIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">Betal og send trygt</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">Avtal betaling og frakt, vurder frakt med sporing for best mulig trygghet!</p>
            </div>
            <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-slate-300/70 sm:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                <FlagIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">Rapporter mistenkelige annonser</h3>
              <Link className={`${btnSecondary} mt-5 w-max`} href="/contact">
                Rapporter annonse
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="seksjon-alt bg-background">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Annonseløft</Eyebrow>
              <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Selg raskere</h2>
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
            {(["top", "featured", "frontpage"] as const).map((key) => (
              <Link
                key={key}
                href="/annonseloft"
                className="boost-card group relative flex flex-col rounded-3xl bg-white p-6 text-slate-950 ring-1 ring-slate-300/70 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgb(11_20_38/0.35)] hover:ring-2 hover:ring-[#cfa653] active:translate-y-0 active:scale-[0.99] sm:p-8"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight">{BOOSTS[key].name}</h3>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-800 ring-1 ring-slate-300">{BOOSTS[key].days} dager</span>
                </div>
                <p className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-heading text-5xl font-bold tracking-[-0.05em]">{BOOSTS[key].price}</span>
                  <span className="text-sm font-medium text-slate-700">kr</span>
                </p>
                <ul className="mt-6 space-y-2.5">
                  {BOOST_PERKS[key].map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm text-slate-800">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold text-[#8a6a24]">
                  Velg
                  <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
