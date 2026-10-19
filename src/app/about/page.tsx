import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { ArrowRightIcon, BadgeCheckIcon, HandshakeIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";

export const metadata: Metadata = { title: "Markedsplassen for fotballkort i Norge" };

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1320px] px-4 pt-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[28px] bg-primary px-6 py-14 text-white sm:px-12 sm:py-20">
          <div className="bg-grid-navy absolute inset-0 opacity-60" aria-hidden="true"></div>
          <div className="relative max-w-2xl">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-inset ring-white/15">
              Om oss · HOBBYSTRADA
            </span>
            <h1 className="mt-5 font-heading text-[2.25rem] font-bold leading-[1.02] tracking-[-0.035em] sm:text-[56px]">
              Markedsplassen for fotballkort i Norge
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              Her kjøper og selger samlere fotballkort direkte med hverandre – fra rookies og nummererte kort til autografkort og patch.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-primary transition hover:bg-slate-100"
                href="/products"
              >
                Se markedet
              </Link>
              <Link
                className="inline-flex h-12 items-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition hover:brightness-105"
                href="/sell"
              >
                Legg ut kort
              </Link>
            </div>
          </div>
        </section>
      </div>
      <section className="mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Slik fungerer markedet</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-inset ring-slate-200 sm:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
              <BadgeCheckIcon className="h-6 w-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-950">Enkelt å annonsere</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-600">Du beskriver kortet, setter pris og legger ved bilder.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-inset ring-slate-200 sm:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
              <HandshakeIcon className="h-6 w-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-950">Direkte mellom samlere</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
              Kjøper og selger avtaler betaling, frakt eller henting i chatten. Vi er ikke part i handelen.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-inset ring-slate-200 sm:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
              <ZapIcon className="h-6 w-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-950">Annonseløft for synlighet</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
              Vil du nå flere, kan du løfte annonsen til toppen av listen, gi den gullmerke eller vise den på forsiden.
            </p>
          </div>
        </div>
      </section>
      <section className="border-y border-slate-200 bg-slate-50/70">
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
                <span className="pt-0.5">Bruk frakt med sporing for dyrere kort.</span>
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
        <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-amber-50 p-8 ring-1 ring-inset ring-accent/40 sm:p-10 md:flex-row md:items-center">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">Har du kort i skuffen?</h2>
            <p className="mt-2 text-[15px] text-slate-700">Legg ut annonsen og nå samlere i hele Norge.</p>
          </div>
          <Link
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-black"
            href="/sell"
          >
            Legg ut kort
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          HOBBYSTRADA drives av {COMPANY.name}, org.nr. {COMPANY.orgnr}.
        </p>
      </section>
    </div>
  );
}
