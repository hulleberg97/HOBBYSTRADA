import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { PageHeader, SellCta, btnPrimary, btnSecondary } from "@/components/ui";
import { BadgeCheckIcon, HandshakeIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";

export const metadata: Metadata = { title: "Om HOBBYSTRADA", robots: { index: false } };

export default function OmPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Om HOBBYSTRADA"
        title="Laget for fotballkortsamlere"
        lead="HOBBYSTRADA er en norsk markedsplass bare for fotballkort. Her møtes samlere for å kjøpe, selge og finne kortene som mangler i samlingen."
      >
        <div className="mt-7 flex flex-wrap gap-2.5">
          <Link className={btnPrimary} href="/products">
            Se markedet
          </Link>
          <Link className={btnSecondary} href="/sell">
            Legg ut kort
          </Link>
        </div>
      </PageHeader>
      <section className="mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Hva er HOBBYSTRADA?</h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              Fotballkort er en hobby i sterk vekst i Norge. Likevel har kortene vært spredt på generelle annonsesider, Facebook-grupper og
              utenlandske nettsteder – der det er vanskelig å finne fram og vanskelig å vite hvem man handler med.
            </p>
            <p>
              HOBBYSTRADA samler alt på ett sted. Siden er bygget for akkurat denne hobbyen: med søk på spiller, sett og kortnummer, filtre for
              nummererte og graderte kort, og en prisoversikt over kort som er solgt.
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-inset ring-slate-300/70 sm:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
              <BadgeCheckIcon className="h-6 w-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-950">Bare fotballkort</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
              Ingen støy fra andre varer. Alt på siden handler om fotballkort – fra base og rookies til autografer, patch og 1/1.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-inset ring-slate-300/70 sm:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
              <HandshakeIcon className="h-6 w-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-950">Direkte mellom samlere</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
              Det er gratis å legge ut kort. Kjøper og selger avtaler pris, betaling og frakt i chatten, uten mellomledd.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-inset ring-slate-300/70 sm:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
              <ZapIcon className="h-6 w-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-950">Synlighet når du vil</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
              Vil du selge raskere, kan du løfte annonsen til toppen, gi den gullmerke eller vise den i kortvifta på forsiden.
            </p>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto grid max-w-[1320px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Dette finner du her</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                className="rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-800 ring-1 ring-inset ring-slate-300 transition hover:ring-primary"
                href="/search?q=Autografkort"
              >
                Autografkort
              </Link>
              <Link
                className="rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-800 ring-1 ring-inset ring-slate-300 transition hover:ring-primary"
                href="/search?q=Relic"
              >
                Patch / relic
              </Link>
              <Link
                className="rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-800 ring-1 ring-inset ring-slate-300 transition hover:ring-primary"
                href="/search?q=Rookies"
              >
                Rookies
              </Link>
              <Link
                className="rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-800 ring-1 ring-inset ring-slate-300 transition hover:ring-primary"
                href="/search?q=Nummererte"
              >
                Nummererte kort
              </Link>
              <Link
                className="rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-800 ring-1 ring-inset ring-slate-300 transition hover:ring-primary"
                href="/search?q=Graderte"
              >
                Graderte kort
              </Link>
              <Link
                className="rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-800 ring-1 ring-inset ring-slate-300 transition hover:ring-primary"
                href="/search?q=Base"
              >
                Base
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-8">
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="h-6 w-6 text-emerald-600" strokeWidth={1.75} aria-hidden="true" />
              <h2 className="font-heading text-xl font-bold tracking-tight text-slate-950">Trygg handel</h2>
            </div>
            <p className="mt-2 text-[15px] text-slate-600">Fordi handelen skjer direkte, er det lurt å følge noen enkle regler.</p>
            <ul className="mt-5 divide-y divide-slate-100">
              <li className="flex items-start gap-4 py-3.5 text-[15px] text-slate-800">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-primary">1</span>
                <span className="pt-0.5">Be om bilder av kortet foran og bak før du betaler.</span>
              </li>
              <li className="flex items-start gap-4 py-3.5 text-[15px] text-slate-800">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-primary">2</span>
                <span className="pt-0.5">Sjekk at navnet på mottakeren stemmer med selgeren før du betaler.</span>
              </li>
              <li className="flex items-start gap-4 py-3.5 text-[15px] text-slate-800">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-primary">3</span>
                <span className="pt-0.5">Vurder frakt med sporing for best mulig trygghet.</span>
              </li>
              <li className="flex items-start gap-4 py-3.5 text-[15px] text-slate-800">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-primary">4</span>
                <span className="pt-0.5">Hold samtalen i chatten på HOBBYSTRADA.</span>
              </li>
              <li className="flex items-start gap-4 py-3.5 text-[15px] text-slate-800">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-primary">5</span>
                <span className="pt-0.5">Rapporter annonser som virker mistenkelige.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SellCta />
        <p className="mt-6 text-center text-xs text-slate-500">
          HOBBYSTRADA drives av {COMPANY.name}, org.nr. {COMPANY.orgnr}.
        </p>
      </section>
    </div>
  );
}
