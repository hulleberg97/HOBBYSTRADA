"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutGridIcon,
  SearchIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { ListingCard } from "./ListingCard";
import { matches } from "@/lib/listings";
import type { Listing } from "@/lib/types";

const PAGE_SIZE = 13;
const TYPES = ["Autograf", "Relic", "Patch", "Rookie", "Nummerert", "Base"];
const PRICES: Record<string, [number, number]> = {
  "0-300": [0, 300],
  "300-700": [300, 700],
  "700-1000": [700, 1000],
  "1000-": [1000, Infinity],
};

const hasType = (l: Listing, t: string) => (t === "Nummerert" ? Boolean(l.numbered) || l.types.includes(t) : l.types.includes(t));

export function Market({ listings }: { listings: Listing[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const [input, setInput] = useState(q);
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [types, setTypes] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const result = useMemo(() => {
    let list = listings.filter((l) => (!q || matches(l, q)) && types.every((t) => hasType(l, t)));
    if (price) {
      const [min, max] = PRICES[price];
      list = list.filter((l) => l.price >= min && l.price < max);
    }
    if (sort === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title, "nb"));
    return list;
  }, [listings, q, types, price, sort]);

  const pages = Math.max(1, Math.ceil(result.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = result.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    router.replace(input.trim() ? `/products?q=${encodeURIComponent(input.trim())}` : "/products", { scroll: false });
  };
  const toggle = (t: string) => {
    setPage(1);
    setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  };
  const goto = (p: number) => {
    setPage(p);
    document.getElementById("annonser")?.scrollIntoView({ behavior: "smooth" });
  };
  const pagerBtn =
    "flex h-10 min-w-10 items-center justify-center rounded-lg border border-border bg-white px-3 font-mono-data text-sm transition hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-40 data-[current=true]:border-primary data-[current=true]:bg-primary data-[current=true]:text-primary-foreground";

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1320px] px-4 pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <nav aria-label="Brødsmuler" className="mb-4 flex items-center gap-1.5 text-sm text-slate-500">
          <Link className="hover:text-primary hover:underline" href="/">
            Forside
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900">Alle kort</span>
        </nav>
        <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-9 text-white sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" aria-hidden="true"></div>
          <div className="pointer-events-none absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-white/5 blur-2xl" aria-hidden="true"></div>
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <h1 className="font-heading text-3xl font-bold tracking-[-0.03em] sm:text-[44px] sm:leading-[1.05]">Alle kort til salgs</h1>
              <p className="mt-3 text-[15px] leading-relaxed text-white/75">
                Autografkort, relic og patch, rookies og nummererte kort fra Topps Chrome, Museum Collection og Inception, lagt ut av samlere i hele Norge.
              </p>
            </div>
            <form role="search" onSubmit={submit} className="flex h-14 w-full items-center gap-2 rounded-full bg-white pl-5 pr-1.5 shadow-lg lg:w-[420px]">
              <SearchIcon className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
              <label htmlFor="market-search" className="sr-only">
                Søk etter spiller eller sett
              </label>
              <input
                id="market-search"
                placeholder="Søk etter spiller, sett eller kortnummer"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="h-11 shrink-0 rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90">
                Søk
              </button>
            </form>
          </div>
        </section>
      </div>
      <div className="z-20 mt-6 border-b border-slate-200 bg-white/95 backdrop-blur md:sticky md:top-[72px]">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center lg:px-8">
          <nav aria-label="Kategorier" className="min-w-0 flex-1">
            <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <li>
                <button
                  aria-current={types.length === 0 ? "true" : undefined}
                  onClick={() => {
                    setTypes([]);
                    setPage(1);
                  }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 aria-[current=true]:border-primary aria-[current=true]:bg-primary aria-[current=true]:text-white"
                >
                  <LayoutGridIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  Alle kort
                </button>
              </li>
            </ul>
          </nav>
          <div className="flex flex-wrap items-center gap-2 md:justify-end md:gap-3">
            <p className="w-full text-sm text-slate-500 md:hidden" aria-live="polite">
              {result.length} annonser
            </p>
            <div className="relative shrink-0">
              <label htmlFor="products-price" className="sr-only">
                Pris
              </label>
              <select
                id="products-price"
                value={price}
                data-active={price ? "true" : undefined}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setPage(1);
                }}
                className="h-10 appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-9 text-sm font-medium text-slate-800 hover:border-slate-400 focus:border-primary focus:outline-none data-[active=true]:border-primary data-[active=true]:text-primary"
              >
                <option value="">Alle priser</option>
                <option value="0-300">Under 300 kr</option>
                <option value="300-700">300–700 kr</option>
                <option value="700-1000">700–1 000 kr</option>
                <option value="1000-">Over 1 000 kr</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            </div>
            <div className="relative shrink-0">
              <label htmlFor="products-sort" className="sr-only">
                Sorter
              </label>
              <select
                id="products-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-9 text-sm font-medium text-slate-800 hover:border-slate-400 focus:border-primary focus:outline-none"
              >
                <option value="newest">Nyeste først</option>
                <option value="price-low">Pris: lav til høy</option>
                <option value="price-high">Pris: høy til lav</option>
                <option value="name">Navn: A–Å</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1320px] items-center gap-2 px-4 pb-3 sm:px-6 lg:px-8">
          <span className="hidden shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500 sm:inline-flex">
            <SlidersHorizontalIcon className="h-3.5 w-3.5" aria-hidden="true" /> Korttype
          </span>
          <ul className="-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Korttype">
            {TYPES.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  aria-pressed={types.includes(t)}
                  onClick={() => toggle(t)}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-700 transition hover:border-slate-400 aria-pressed:border-primary aria-pressed:bg-primary/5 aria-pressed:text-primary aria-pressed:ring-1 aria-pressed:ring-primary"
                >
                  {t}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div id="annonser" className="mx-auto max-w-[1320px] scroll-mt-40 px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 md:gap-3">
          <h2 className="hidden font-heading text-xl font-bold tracking-tight text-slate-950 md:block">{q ? `Treff for «${q}»` : "Alle annonser"}</h2>
          <span className="hidden text-sm text-slate-500 md:inline" aria-live="polite">
            {result.length} treff
          </span>
        </div>
        {shown.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {shown.map((l) => (
              <ListingCard key={l.slug} listing={l} variant="market" />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-slate-50 px-6 py-16 text-center ring-1 ring-inset ring-slate-200">
            <p className="font-heading text-xl font-bold text-slate-950">Ingen annonser passer</p>
            <p className="mt-1.5 text-sm text-slate-600">Prøv et annet søk eller fjern noen filtre.</p>
          </div>
        )}
        {pages > 1 && (
          <div className="mt-12">
            <nav aria-label="Sider" className="flex items-center justify-center gap-2">
              <button disabled={current === 1} onClick={() => goto(current - 1)} aria-label="Forrige side" className={pagerBtn}>
                <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  aria-current={p === current ? "page" : undefined}
                  data-current={p === current ? "true" : "false"}
                  onClick={() => goto(p)}
                  className={pagerBtn}
                >
                  {p}
                </button>
              ))}
              <button disabled={current === pages} onClick={() => goto(current + 1)} aria-label="Neste side" className={pagerBtn}>
                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </nav>
          </div>
        )}
        <section className="mt-16 grid gap-6 overflow-hidden rounded-3xl bg-slate-50 p-6 ring-1 ring-inset ring-slate-200 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              Selg kortene dine
            </p>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-3xl">Har du kort som ligger i skuffen?</h2>
            <p className="mt-2 max-w-lg text-[15px] text-slate-600">
              Legg ut kortet på et par minutter og nå samlere i hele landet. Fremhev annonsen med annonseløft for å komme øverst.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
            <Link
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary/90"
              href="/sell"
            >
              Legg ut kort <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-800 transition hover:border-slate-500"
              href="/annonseloft"
            >
              Se annonseløft
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
