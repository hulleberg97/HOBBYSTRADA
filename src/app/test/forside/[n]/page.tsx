import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, ShieldCheckIcon } from "lucide-react";
import { HeroFan } from "@/components/HeroFan";
import { ListingCard, ListingGrid } from "@/components/ListingCard";
import { Annonseloft, Kategorier, Nyeste, SlikFungerer, TryggHandel, Utvalgte, forsideData } from "@/components/forside/Seksjoner";
import { Hylle, Knapper, Kortbilde, Linje, Overtittel, Populaere, SeksjonTopp, Sok, Tittel, antall, kategorier, wrap } from "@/components/forside/Byggeklosser";
import { OPPSETT } from "../oppsett";
import { formatPrice } from "@/lib/format";
import { newest } from "@/lib/listings";

export const revalidate = 60;
export const metadata: Metadata = { title: "Test av forside", robots: { index: false, follow: false } };
export const generateStaticParams = () => OPPSETT.map((_, i) => ({ n: String(i + 1) }));

type Data = Awaited<ReturnType<typeof forsideData>>;

/** 1. Søk først – som eBay og FINN: søket er det viktigste, så det står øverst og størst. */
function Sokfoerst({ d }: { d: Data }) {
  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className={`${wrap} max-w-3xl py-12 text-center sm:py-20`}>
          <Overtittel />
          <Tittel className="mt-3 text-[2.2rem] leading-[1.02] sm:text-[3.25rem]" />
          <Sok stor className="mx-auto mt-8 max-w-2xl" />
          <Populaere center className="mt-5" />
        </div>
      </section>
      <Kategorier c={d.c} />
      <Nyeste latest={d.latest} />
      <Utvalgte featured={d.featured} />
      <SlikFungerer />
      <TryggHandel />
    </>
  );
}

/** 2. Feed – som Vinted og Tise: kortene kommer med en gang, nesten uten topp. */
function Feed({ d }: { d: Data }) {
  const liste = [...d.featured, ...d.latest].slice(0, 12);
  return (
    <>
      <section className="bg-white">
        <div className={`${wrap} flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-8`}>
          <div>
            <Overtittel />
            <Tittel className="mt-1.5 text-[1.75rem] leading-tight sm:text-[2.25rem]" />
          </div>
          <Knapper />
        </div>
      </section>
      <div className="-mt-8 sm:-mt-10">
        <Kategorier c={d.c} />
      </div>
      <section className={`${wrap} py-10`}>
        <SeksjonTopp tittel="Nyeste annonser" under="Nylig lagt ut av samlere i hele Norge" />
        <ListingGrid listings={liste} />
        <div className="mt-10 flex justify-center">
          <Link className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-black" href="/products">
            Se alle annonser
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
      <SlikFungerer />
      <TryggHandel />
    </>
  );
}

/** 3. Hyller – som Amazon og Netflix: én rad per kategori som blas til siden. */
function Hyller({ d }: { d: Data }) {
  return (
    <>
      <section className="bg-white">
        <div className={`${wrap} grid grid-cols-1 gap-6 py-10 sm:py-14 lg:grid-cols-[1fr_1fr] lg:items-end`}>
          <div>
            <Overtittel />
            <Tittel className="mt-3 text-[2.2rem] leading-[1.02] sm:text-[3rem]" />
          </div>
          <Sok stor />
        </div>
      </section>
      <Hylle tittel="Utvalgte kort" under="Kort selgerne har løftet frem" listings={d.featured} />
      <Hylle tittel="Nyeste annonser" under="Nylig lagt ut av samlere i hele Norge" listings={d.latest} />
      {kategorier(d.all).map((k) => (
        <Hylle key={k.navn} tittel={k.navn} under={antall(k.liste.length)} listings={newest(k.liste).slice(0, 10)} href={k.href} />
      ))}
      <SlikFungerer />
    </>
  );
}

/** 4. Spotlight – som auksjonshusene (Goldin, Catawiki): ett kort får hele scenen. */
function Spotlight({ d }: { d: Data }) {
  const l = d.fanList[0];
  return (
    <>
      <section className="bg-[linear-gradient(180deg,#fff,#f3f4f7)]">
        <div className={`${wrap} grid grid-cols-1 items-center gap-10 py-10 sm:py-16 lg:grid-cols-[1fr_1fr]`}>
          <div className="text-center lg:text-left">
            <Overtittel />
            <Tittel className="mt-3 text-[2.4rem] leading-[1] sm:text-[3.5rem]" />
            <Knapper className="mt-7 justify-center lg:justify-start" />
          </div>
          {l && (
            <Link href={`/products/${l.slug}`} className="group mx-auto flex w-full max-w-[420px] flex-col items-center">
              <Kortbilde l={l} eager sizes="(max-width: 640px) 70vw, 340px" className="w-[66%] transition duration-500 group-hover:-translate-y-1" />
              <div className="mt-6 flex w-full items-center justify-between gap-4 rounded-full bg-white py-2.5 pl-5 pr-2.5 shadow-[0_18px_34px_-14px_rgb(11_20_38/0.35)] ring-1 ring-slate-200">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">{l.player}</p>
                  <p className="truncate text-xs text-slate-500">{l.set}</p>
                </div>
                <p className="shrink-0 text-[15px] font-bold text-[#8a6a24]">{formatPrice(l.price)}</p>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          )}
        </div>
      </section>
      <Kategorier c={d.c} />
      <Utvalgte featured={d.featured} />
      <Nyeste latest={d.latest} />
      <SlikFungerer />
    </>
  );
}

/** 5. Bento – som Apple: alt viktig i en rutenett-oversikt på første skjerm. */
function Bento({ d }: { d: Data }) {
  const k = kategorier(d.all).slice(0, 4);
  const fire = d.latest.slice(0, 4);
  return (
    <>
      <section className={`${wrap} py-6 sm:py-8`}>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
          <div className="flex flex-col justify-between rounded-[28px] bg-white p-7 ring-1 ring-slate-200 sm:p-10 lg:col-span-2 lg:row-span-2">
            <div>
              <Overtittel />
              <Tittel className="mt-3 text-[2.2rem] leading-[1.02] sm:text-[3.25rem]" />
            </div>
            <div className="mt-8">
              <Sok />
              <Knapper className="mt-4" />
            </div>
          </div>
          <Link href="/products" className="group rounded-[28px] bg-[#eef0f4] p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-950">Nyeste annonser</p>
              <ChevronRightIcon className="h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {fire.map((l, i) => (
                <Kortbilde key={l.slug} l={l} eager={i < 4} sizes="140px" />
              ))}
            </div>
          </Link>
          {k.slice(0, 2).map((x) => (
            <Link key={x.navn} href={x.href} className="group flex flex-col justify-between rounded-[28px] bg-white p-5 ring-1 ring-slate-200 transition hover:ring-slate-400">
              <p className="text-sm font-semibold text-slate-950">{x.navn}</p>
              <p className="mt-6 text-xs font-medium text-slate-600">{antall(x.liste.length)}</p>
            </Link>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {k.slice(2).map((x) => (
            <Link key={x.navn} href={x.href} className="flex items-center justify-between rounded-[28px] bg-white p-5 ring-1 ring-slate-200 transition hover:ring-slate-400">
              <p className="text-sm font-semibold text-slate-950">{x.navn}</p>
              <p className="text-xs font-medium text-slate-600">{antall(x.liste.length)}</p>
            </Link>
          ))}
          <Link href="/annonseloft" className="flex items-center justify-between rounded-[28px] bg-primary p-5 text-white transition hover:bg-black">
            <p className="text-sm font-semibold">Selg raskere</p>
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="#trygg-handel" className="flex items-center justify-between rounded-[28px] bg-white p-5 ring-1 ring-slate-200 transition hover:ring-slate-400">
            <p className="text-sm font-semibold text-slate-950">Handle trygt</p>
            <ShieldCheckIcon className="h-5 w-5 text-slate-700" aria-hidden="true" />
          </Link>
        </div>
      </section>
      <Utvalgte featured={d.featured} />
      <Nyeste latest={d.latest} />
      <TryggHandel />
    </>
  );
}

/** 6. To dører – kjøp eller selg: begge veiene er like synlige fra start. */
function ToDoerer({ d }: { d: Data }) {
  return (
    <>
      <section className={`${wrap} py-10 sm:py-14`}>
        <div className="text-center">
          <Overtittel />
          <Tittel className="mt-3 text-[2.2rem] leading-[1.02] sm:text-[3.25rem]" />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col rounded-[28px] bg-white p-7 ring-1 ring-slate-200 sm:p-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6a24]">For kjøpere</p>
            <p className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Finn kortet</p>
            <p className="mt-1 text-sm text-slate-700">Søk på spiller, sett eller kortnummer.</p>
            <Sok className="mt-6" />
            <Link className="mt-4 inline-flex w-max items-center gap-1 text-sm font-semibold text-slate-900 underline-offset-4 hover:underline" href="/products">
              Se alle annonser
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="flex flex-col rounded-[28px] bg-primary p-7 text-white sm:p-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light">For selgere</p>
            <p className="mt-3 text-xl font-semibold tracking-tight">Legg ut kort</p>
            <p className="mt-1 text-sm text-white/80">Fyll inn spiller, sett, tilstand og pris, last opp bilder – ferdig på et par minutter.</p>
            <Link className="mt-6 inline-flex h-12 w-max items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-primary transition hover:bg-gold-light" href="/sell">
              Legg ut kort
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <Kategorier c={d.c} />
      <Utvalgte featured={d.featured} />
      <Nyeste latest={d.latest} />
      <TryggHandel />
    </>
  );
}

/** 7. Kategorifliser – som Facebook Marketplace og Etsy: store bilder du velger fra. */
function Fliser({ d }: { d: Data }) {
  // Hver flis får sitt eget kort, helst med ekte bilde
  const brukt = new Set<string>();
  const k = kategorier(d.all).map((x) => {
    const valg = [...newest(x.liste.filter((y) => y.image)), ...newest(x.liste)];
    const l = valg.find((y) => !brukt.has(y.slug)) ?? valg[0];
    brukt.add(l.slug);
    return { ...x, l };
  });
  return (
    <>
      <section className={`${wrap} py-10 sm:py-14`}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Overtittel />
            <Tittel className="mt-3 text-[2.2rem] leading-[1.02] sm:text-[3rem]" />
          </div>
          <Sok stor />
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {k.map((x, i) => {
            const l = x.l;
            return (
              <li key={x.navn}>
                <Link href={x.href} className="group block overflow-hidden rounded-[24px] bg-[#eef0f4] ring-1 ring-slate-200 transition hover:ring-slate-400">
                  <div className="flex justify-center px-[18%] pt-6">
                    <Kortbilde l={l} eager={i < 5} sizes="(max-width: 640px) 30vw, 160px" className="w-full transition duration-500 group-hover:-translate-y-1" />
                  </div>
                  <div className="bg-white px-4 py-3">
                    <p className="text-sm font-semibold text-slate-950">{x.navn}</p>
                    <p className="text-xs font-medium text-slate-600">{antall(x.liste.length)}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <Utvalgte featured={d.featured} />
      <Nyeste latest={d.latest} />
      <SlikFungerer />
    </>
  );
}

/** 8. Vifte + søk – dagens vifte på hvit bakgrunn, med søket rett under overskriften. */
function VifteSok({ d }: { d: Data }) {
  return (
    <>
      <section className="overflow-x-clip bg-[linear-gradient(180deg,#fff,#f3f4f7)]">
        <div className={`${wrap} pt-10 text-center sm:pt-14`}>
          <Overtittel />
          <Tittel className="mt-3 text-[2.2rem] leading-[1.02] sm:text-[3.25rem]" />
          <Sok className="mx-auto mt-7 max-w-xl" />
        </div>
        <div className="mx-auto mt-6 max-w-[1100px] pb-6">
          <HeroFan cards={d.fanList} />
        </div>
      </section>
      <Kategorier c={d.c} />
      <Utvalgte featured={d.featured} />
      <Nyeste latest={d.latest} />
      <SlikFungerer />
    </>
  );
}

/** 9. Markedsliste – som StockX og Cardmarket: nyeste annonser med pris i en ryddig liste. */
function Markedsliste({ d }: { d: Data }) {
  return (
    <>
      <section className="bg-white">
        <div className={`${wrap} grid grid-cols-1 gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_1fr] lg:items-center`}>
          <div>
            <Overtittel />
            <Tittel className="mt-3 text-[2.2rem] leading-[1.02] sm:text-[3.25rem]" />
            <Sok className="mt-7" />
            <Populaere className="mt-4" />
          </div>
          <div className="rounded-[28px] bg-white p-4 ring-1 ring-slate-200 sm:p-6">
            <SeksjonTopp tittel="Nyeste annonser" />
            <div className="mt-3 divide-y divide-slate-100">
              {d.latest.slice(0, 6).map((l) => (
                <Linje key={l.slug} l={l} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <Kategorier c={d.c} />
      <Utvalgte featured={d.featured} />
      <SlikFungerer />
      <TryggHandel />
    </>
  );
}

/** 10. Galleri – rolig og redaksjonelt: stor typografi og få, store kort. */
function Galleri({ d }: { d: Data }) {
  const fire = [...d.featured, ...d.latest].slice(0, 4);
  return (
    <>
      <section className="bg-white">
        <div className={`${wrap} py-14 sm:py-24`}>
          <Overtittel />
          <h1 className="mt-4 max-w-4xl font-heading text-[3rem] font-bold leading-[0.95] tracking-[-0.05em] text-slate-950 sm:text-[5.5rem]">
            Kjøp og selg <span className="text-slate-400">fotballkort</span>
          </h1>
          <Knapper className="mt-9" />
        </div>
      </section>
      <section className={`${wrap} pb-14 pt-2`}>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {fire.map((l, i) => (
            <ListingCard key={l.slug} listing={l} eager={i < 4} />
          ))}
        </div>
      </section>
      <Kategorier c={d.c} />
      <Nyeste latest={d.latest} />
      <SlikFungerer />
      <TryggHandel />
    </>
  );
}

const VISNING = [Sokfoerst, Feed, Hyller, Spotlight, Bento, ToDoerer, Fliser, VifteSok, Markedsliste, Galleri];

export default async function TestForside({ params }: { params: Promise<{ n: string }> }) {
  const i = Number((await params).n) - 1;
  const Visning = VISNING[i];
  if (!Visning) notFound();
  const d = await forsideData();
  return (
    <div className="bg-background">
      {/* Testlinje: navigasjon mellom oppsettene. Ikke en del av designet. */}
      <div className="flex items-center justify-between gap-3 bg-amber-100 px-4 py-2 text-[13px] font-medium text-amber-950">
        <Link className="inline-flex items-center gap-1" href={`/test/forside/${i === 0 ? VISNING.length : i}`}>
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          Forrige
        </Link>
        <Link className="truncate text-center" href="/test/forside">
          Test {i + 1}/10: {OPPSETT[i].navn}
        </Link>
        <Link className="inline-flex items-center gap-1" href={`/test/forside/${i === VISNING.length - 1 ? 1 : i + 2}`}>
          Neste
          <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <Visning d={d} />
      <Annonseloft />
    </div>
  );
}
