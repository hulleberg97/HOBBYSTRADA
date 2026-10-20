"use client";

import { PageHeader } from "./ui";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { matches } from "@/lib/filters";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

const date = (iso: string) => new Date(iso).toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" });

function median(nums: number[]) {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function SoldArchive({ listings }: { listings: Listing[] }) {
  const [q, setQ] = useState("");
  const hits = useMemo(() => (q.trim() ? listings.filter((l) => matches(l, q)) : listings), [listings, q]);
  const prices = hits.map((l) => l.price);

  return (
    <div>
      <PageHeader eyebrow="Prisarkiv" title="Solgte kort" lead="Se hva kortene faktisk ble solgt for. Bruk det når du setter pris eller vurderer et kjøp.">
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="mt-6 flex max-w-3xl items-center gap-2 rounded-full border border-slate-300 bg-white p-1.5 pl-5 shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
        >
          <SearchIcon className="h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
          <label htmlFor="sold-search" className="sr-only">
            Søk i solgte kort
          </label>
          <input
            id="sold-search"
            type="search"
            placeholder="Spiller, sett eller kortnummer"
            className="h-11 min-w-0 flex-1 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-500"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
      </PageHeader>
      <div className="mx-auto max-w-[1320px] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        {hits.length > 0 && (
          <dl className="mb-8 grid grid-cols-3 gap-3 sm:max-w-2xl">
            {[
              ["Solgte kort", String(hits.length)],
              ["Medianpris", formatPrice(median(prices))],
              ["Høyeste", formatPrice(Math.max(...prices))],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
                <dt className="text-xs text-slate-500">{k}</dt>
                <dd className="mt-1 font-heading text-lg font-semibold tracking-tight text-slate-950 tabular-nums sm:text-xl">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {hits.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Kort</th>
                  <th className="px-4 py-3 font-semibold">Gradering</th>
                  <th className="px-4 py-3 text-right font-semibold">Solgt for</th>
                  <th className="px-4 py-3 text-right font-semibold">Dato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hits.map((l) => (
                  <tr key={l.slug} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/products/${l.slug}`} className="font-medium text-slate-950 hover:underline">
                        {l.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{l.grading ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-950">{formatPrice(l.price)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-500">{date(l.soldAt ?? l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-3xl bg-slate-50 px-6 py-16 text-center ring-1 ring-inset ring-slate-200">
            <p className="font-heading text-xl font-bold text-slate-950">{q ? "Ingen solgte kort passer søket" : "Ingen kort er solgt ennå"}</p>
            <p className="mt-1.5 text-sm text-slate-600">
              {q ? "Prøv et annet navn eller sett." : "Når selgere merker kort som solgt, havner de her med prisen."}
            </p>
          </div>
        )}
        <p className="mt-6 text-xs text-slate-500">Prisen er det selgeren ba om i annonsen. Den endelige handelsprisen kan ha vært en annen.</p>
      </div>
    </div>
  );
}
