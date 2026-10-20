"use client";

import { Eyebrow } from "@/components/ui";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { ListingCard } from "./ListingCard";
import { matches } from "@/lib/listings";
import type { Listing } from "@/lib/types";

const POPULAR = ["Autograf", "Messi", "Salah", "Haaland", "Museum Collection", "Rookie", "Patch", "Topps Chrome"];

export function Search({ listings }: { listings: Listing[] }) {
  const router = useRouter();
  const q = useSearchParams().get("q") ?? "";
  const [input, setInput] = useState(q);
  const [prevQ, setPrevQ] = useState(q);
  if (q !== prevQ) {
    setPrevQ(q);
    setInput(q);
  }

  const go = (term: string) => router.replace(term.trim() ? `/search?q=${encodeURIComponent(term.trim())}` : "/search", { scroll: false });
  const query = q === "Rookie" ? "RC" : q;
  const result = q ? listings.filter((l) => matches(l, query)) : listings;

  return (
    <div>
      <section className="border-b border-slate-300/60">
        <div className="mx-auto max-w-[1320px] px-4 pb-8 pt-8 sm:px-6 sm:pt-12 lg:px-8">
          <Eyebrow>Søk</Eyebrow>
          <h1 className="mt-3 font-heading text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-[44px]">
            {q ? (
              <>
                Treff for <span className="text-primary">«{q}»</span>
              </>
            ) : (
              "Søk i alle annonser"
            )}
          </h1>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              go(input);
            }}
            className="mt-6 flex max-w-3xl items-center gap-2 rounded-full border border-slate-300 bg-white p-1.5 pl-5 shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
          >
            <SearchIcon className="h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
            <label htmlFor="search-input" className="sr-only">
              Søk etter spiller, klubb eller sett
            </label>
            <input
              id="search-input"
              type="search"
              placeholder="Spiller, sett eller kortnummer"
              autoFocus
              className="h-11 min-w-0 flex-1 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-500 [&::-webkit-search-cancel-button]:hidden"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {input && (
              <button
                type="button"
                aria-label="Tøm søk"
                onClick={() => {
                  setInput("");
                  go("");
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-primary"
              >
                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button type="submit" className="h-11 shrink-0 rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-black">
              Søk
            </button>
          </form>
          <div className="mt-5">
            <p className="text-xs font-medium text-slate-500">Populære søk</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <button
                  key={p}
                  type="button"
                  data-current={q.toLowerCase() === p.toLowerCase() ? "true" : undefined}
                  onClick={() => go(p)}
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 transition hover:ring-primary data-[current=true]:bg-primary data-[current=true]:text-white data-[current=true]:ring-primary"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-[1320px] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600" aria-live="polite">
            <span className="font-semibold text-slate-950">{result.length}</span> {result.length === 1 ? "annonse" : "annonser"}
          </p>
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 transition hover:border-primary hover:text-primary"
            href={q ? `/products?q=${encodeURIComponent(q)}` : "/products"}
          >
            <SlidersHorizontalIcon className="h-4 w-4" aria-hidden="true" />
            Filtrer på pris og korttype
          </Link>
        </div>
        {result.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {result.map((l) => (
              <ListingCard key={l.slug} listing={l} variant="market" />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-inset ring-slate-300/70">
            <p className="font-heading text-xl font-bold text-slate-950">Ingen treff</p>
            <p className="mt-1.5 text-sm text-slate-600">Prøv et annet navn, sett eller kortnummer.</p>
          </div>
        )}
      </div>
    </div>
  );
}
