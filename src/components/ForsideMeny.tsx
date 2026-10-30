"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ListingThumb } from "@/components/Chat";

export type ForsideKort = {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  fanSlot: number | null;
  /** Hva som gir kortet plassen: Toppannonse, Fremhevet, Festet eller Nyeste. */
  label: string;
  ownerListing: boolean;
};

/**
 * Admin: velg hvilke kort som vises på forsiden. Viser raden slik den er nå, lar admin velge hvor mange
 * gratisannonser som fyller opp, og feste enkeltkort på plass 1–10.
 */
export function ForsideMeny({ row, listings, fill, slots }: { row: ForsideKort[]; listings: ForsideKort[]; fill: number; slots: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const call = async (key: string, url: string, body: unknown) => {
    setBusy(key);
    setError("");
    const res = await fetch(url, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    setBusy(null);
    if (!res?.ok) {
      setError(data.error ?? "Noe gikk galt. Prøv igjen.");
      return;
    }
    router.refresh();
  };

  const setFill = (n: number) => call("fill", "/api/admin/forside", { fill: n });
  const setSlot = (id: string, slot: number | null) => call(id, `/api/listings/${id}`, { fanSlot: slot });

  const q = search.trim().toLowerCase();
  const shown = q ? listings.filter((l) => l.title.toLowerCase().includes(q)) : listings;
  const select = "h-9 rounded-full border border-slate-300 bg-white px-3 text-xs font-semibold disabled:opacity-50";

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Slik er raden nå ({row.length} kort)</p>
        {row.length ? (
          <ol className="mt-2 flex gap-3 overflow-x-auto pb-2">
            {row.map((l, i) => (
              <li key={l.id} className="w-[88px] shrink-0">
                <div className="relative">
                  <ListingThumb image={l.image} title={l.title} />
                  <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">{i + 1}</span>
                </div>
                <p className="mt-1 truncate text-[11px] font-semibold text-slate-900" title={l.title}>
                  {l.title}
                </p>
                <p className="truncate text-[10px] text-slate-500">{l.label}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-slate-600">Ingen kort på forsiden nå. Fest kort under, eller la gratisannonser fylle opp.</p>
        )}
      </div>

      <label className="flex flex-wrap items-center gap-3 text-sm">
        <span className="font-semibold text-slate-900">Fyll opp med nyeste annonser uten løft</span>
        <select value={fill} disabled={busy === "fill"} onChange={(e) => setFill(Number(e.target.value))} className={select}>
          {[0, 2, 4, 6, 8, 10, 12].map((n) => (
            <option key={n} value={n}>
              {n === 0 ? "Ingen (bare festede og betalte)" : `Opp til ${n} kort`}
            </option>
          ))}
        </select>
        <span className="text-xs text-slate-500">Festede kort, toppannonser og fremhevede vises alltid.</span>
      </label>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Fest kort på forsiden ({listings.length} aktive)</p>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Søk i annonser"
            className="h-9 w-56 rounded-full border border-slate-300 bg-white px-3 text-xs outline-none focus:border-slate-900"
          />
        </div>
        <ul className="mt-2 divide-y divide-slate-200 rounded-2xl ring-1 ring-slate-200">
          {shown.map((l) => (
            <li key={l.id} className="flex items-center gap-3 px-3 py-2">
              <ListingThumb image={l.image} title={l.title} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{l.title}</p>
                <p className="text-xs text-slate-500">
                  {l.fanSlot ? `Festet på plass ${l.fanSlot}` : l.label === "Nyeste uten løft" ? "Ikke festet" : l.label}
                  {l.ownerListing && " · din annonse, vises uten «Valgt av HOBBYSTRADA»"}
                </p>
              </div>
              <select value={l.fanSlot ?? ""} disabled={busy === l.id} onChange={(e) => setSlot(l.id, e.target.value ? Number(e.target.value) : null)} className={select}>
                <option value="">Ikke festet</option>
                {Array.from({ length: slots }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n === 1 ? "Plass 1 · først" : `Plass ${n}`}
                  </option>
                ))}
              </select>
            </li>
          ))}
          {!shown.length && <li className="px-3 py-3 text-sm text-slate-500">Ingen treff.</li>}
        </ul>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
