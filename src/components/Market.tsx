"use client";

import { Eyebrow, SellCta } from "./ui";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, LayoutGridIcon, SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { ListingCard } from "./ListingCard";
import { EMPTY, TYPES, typeLabel, activeCount, applyFilters, parseFilters, sortListings, toQuery, type Filters } from "@/lib/filters";
import { FilterPanel } from "./FilterPanel";
import { SearchSuggest } from "./SearchSuggest";
import { SaveSearchButton } from "./SaveSearchButton";
import type { Listing } from "@/lib/types";

const PAGE_SIZE = 13;
const PRICES: Record<string, [number | null, number | null]> = {
  "0-500": [null, 500],
  "500-1000": [500, 1000],
  "1000-5000": [1000, 5000],
  "5000-": [5000, null],
};

export function Market({ listings }: { listings: Listing[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const f = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);
  const [input, setInput] = useState(f.q);
  const [prevQ, setPrevQ] = useState(f.q);
  if (f.q !== prevQ) {
    setPrevQ(f.q);
    setInput(f.q);
  }
  const [panel, setPanel] = useState(false);

  const go = (next: Filters) => {
    const qs = toQuery(next);
    router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
  };
  const update = (patch: Partial<Filters>) => go({ ...f, ...patch, page: patch.page ?? 1 });

  const result = useMemo(() => sortListings(applyFilters(listings, f), f.sort), [listings, f]);
  const pages = Math.max(1, Math.ceil(result.length / PAGE_SIZE));
  const current = Math.min(f.page, pages);
  const shown = result.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const priceKey = Object.entries(PRICES).find(([, [min, max]]) => min === f.min && max === f.max)?.[0] ?? (f.min !== null || f.max !== null ? "custom" : "");
  const count = activeCount(f);

  const submit = (e?: React.FormEvent, term = input) => {
    e?.preventDefault();
    update({ q: term.trim() });
  };
  const toggle = (t: string) => update({ types: f.types.includes(t) ? f.types.filter((x) => x !== t) : [...f.types, t] });
  const goto = (page: number) => {
    go({ ...f, page });
    document.getElementById("annonser")?.scrollIntoView({ behavior: "smooth" });
  };
  const chips: [string, Partial<Filters>][] = [
    ...(f.q ? [[`«${f.q}»`, { q: "" }] as [string, Partial<Filters>]] : []),
    ...f.types.map((t) => [t, { types: f.types.filter((x) => x !== t) }] as [string, Partial<Filters>]),
    ...(
      [
        [f.club, { club: "" }],
        [f.league, { league: "" }],
        [f.line, { line: "" }],
        [f.grader && (f.grader === "raw" ? "Ugradert" : f.grader), { grader: "" }],
        [f.min !== null || f.max !== null ? `${f.min ?? 0}–${f.max ?? "∞"} kr` : "", { min: null, max: null }],
        [f.run !== null ? (f.run === 1 ? "1/1" : `Opplag ≤ /${f.run}`) : "", { run: null }],
        [f.place, { place: "" }],
        [f.photo ? "Med bilde" : "", { photo: false }],
      ] as [string, Partial<Filters>][]
    ).filter(([l]) => l),
  ];
  const pagerBtn =
    "flex h-10 min-w-10 items-center justify-center rounded-lg border border-border bg-white px-3 font-mono-data text-sm transition hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-40 data-[current=true]:border-primary data-[current=true]:bg-primary data-[current=true]:text-primary-foreground";

  return (
    <div>
      <div className="mx-auto max-w-[1320px] px-4 pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <nav aria-label="Brødsmuler" className="mb-4 flex items-center gap-1.5 text-sm text-slate-500">
          <Link className="hover:text-primary hover:underline" href="/">
            Forside
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900">Markedet</span>
        </nav>
        <section className="flex flex-col gap-6 pb-2 pt-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <Eyebrow>Markedet</Eyebrow>
            <h1 className="mt-3 font-heading text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-[44px]">Finn ditt neste kort</h1>
            <p className="mt-3 text-base text-slate-600 sm:text-lg">Fotballkort fra samlere i hele Norge.</p>
          </div>
          <form
            role="search"
            onSubmit={submit}
            className="hidden h-14 w-full md:flex items-center gap-2 rounded-full bg-white pl-5 pr-1.5 ring-1 ring-slate-300 transition focus-within:ring-2 focus-within:ring-primary/30 lg:w-[420px]"
          >
            <SearchIcon className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
            <label htmlFor="market-search" className="sr-only">
              Søk etter spiller, klubb eller sett
            </label>
            <SearchSuggest
              value={input}
              onChange={setInput}
              onPick={(v) => submit(undefined, v)}
              listClassName="-left-10"
              inputProps={{
                id: "market-search",
                placeholder: "Søk etter spiller, klubb eller sett",
                className: "w-full bg-transparent text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none",
              }}
            />
            <button type="submit" className="h-11 shrink-0 rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90">
              Søk
            </button>
          </form>
        </section>
      </div>
      <div className="z-20 mt-6 border-b border-slate-200 bg-background/95 backdrop-blur md:sticky md:top-[72px]">
        <div className="mx-auto flex max-w-[1320px] flex-row items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <nav aria-label="Kategorier" className="min-w-0 flex-1">
            <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <li className="hidden md:block">
                <button
                  aria-current={count === 0 && !f.q ? "true" : undefined}
                  onClick={() => go({ ...EMPTY, sort: f.sort })}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 aria-[current=true]:border-primary aria-[current=true]:bg-primary aria-[current=true]:text-white"
                >
                  <LayoutGridIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  Alle kort
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setPanel(true)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
                >
                  <SlidersHorizontalIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  <span className="md:hidden">Filter</span>
                  <span className="hidden md:inline">Flere filtre</span>
                  {count > 0 && <span className="ml-0.5 rounded-full bg-primary px-1.5 font-mono-data text-[11px] text-white">{count}</span>}
                </button>
              </li>
            </ul>
          </nav>
          <div className="flex flex-wrap items-center gap-2 md:justify-end md:gap-3">
            <div className="relative hidden shrink-0 md:block">
              <label htmlFor="products-price" className="sr-only">
                Pris
              </label>
              <select
                id="products-price"
                value={priceKey}
                data-active={priceKey ? "true" : undefined}
                onChange={(e) => {
                  const [min, max] = PRICES[e.target.value] ?? [null, null];
                  if (e.target.value !== "custom") update({ min, max });
                }}
                className="h-10 appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-9 text-sm font-medium text-slate-800 hover:border-slate-400 focus:border-primary focus:outline-none data-[active=true]:border-primary data-[active=true]:text-primary"
              >
                <option value="">Alle priser</option>
                <option value="0-500">Under 500 kr</option>
                <option value="500-1000">500–1 000 kr</option>
                <option value="1000-5000">1 000–5 000 kr</option>
                <option value="5000-">Over 5 000 kr</option>
                {priceKey === "custom" && <option value="custom">{`${f.min ?? 0}–${f.max ?? "∞"} kr`}</option>}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            </div>
            <div className="relative shrink-0">
              <label htmlFor="products-sort" className="sr-only">
                Sorter
              </label>
              <select
                id="products-sort"
                value={f.sort}
                onChange={(e) => update({ sort: e.target.value, page: f.page })}
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
                  aria-pressed={f.types.includes(t)}
                  onClick={() => toggle(t)}
                  className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-700 transition hover:border-slate-400 aria-pressed:border-primary aria-pressed:bg-primary/5 aria-pressed:text-primary aria-pressed:ring-1 aria-pressed:ring-primary"
                >
                  {typeLabel(t)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div id="annonser" className="mx-auto max-w-[1320px] scroll-mt-40 px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 md:gap-3">
          <h2 className="hidden font-heading text-xl font-bold tracking-tight text-slate-950 md:block">
            {f.q ? `Treff for «${f.q}»` : count ? "Filtrerte annonser" : "Alle annonser"}
          </h2>
          <span className="text-sm text-slate-500" aria-live="polite">
            {result.length} treff
          </span>
          <Link href="/solgt" className="ml-auto text-sm font-medium text-slate-600 underline-offset-4 hover:text-primary hover:underline">
            Se hva kort har solgt for
          </Link>
        </div>
        {chips.length > 0 && (
          <div className="-mt-2 mb-6 flex flex-wrap items-center gap-2">
            {chips.map(([l, patch]) => (
              <button
                key={l}
                type="button"
                onClick={() => update(patch)}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1.5 text-[13px] font-medium text-primary ring-1 ring-inset ring-primary/30 transition hover:bg-primary/10"
              >
                {l}
                <XIcon className="h-3.5 w-3.5" aria-label="Fjern" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => go({ ...EMPTY, sort: f.sort })}
              className="px-2 text-[13px] font-medium text-slate-500 underline underline-offset-2 hover:text-primary"
            >
              Nullstill alle
            </button>
            <span className="sm:ml-auto">
              <SaveSearchButton />
            </span>
          </div>
        )}
        {shown.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {shown.map((l, i) => (
              <ListingCard key={l.slug} listing={l} variant="market" eager={i < 4} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-inset ring-slate-300/70">
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
        <FilterPanel
          open={panel}
          onClose={() => setPanel(false)}
          listings={listings}
          f={f}
          update={update}
          reset={() => go({ ...EMPTY, q: f.q, sort: f.sort })}
          resultCount={result.length}
        />
        <div className="mt-16">
          <SellCta secondary={{ href: "/annonseloft", label: "Se annonseløft" }} />
        </div>
      </div>
    </div>
  );
}
