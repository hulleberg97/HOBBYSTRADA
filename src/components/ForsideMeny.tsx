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
  isExample: boolean;
};

/**
 * Admin: velg hvilke kort som vises på forsiden. Viser raden slik den er nå, lar admin velge hvor mange
 * gratisannonser som fyller opp, og slå av og på hvert kort. Valgte kort vises først, i rekkefølgen de ble valgt.
 */
export function ForsideMeny({ row, listings }: { row: ForsideKort[]; listings: ForsideKort[] }) {
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

  const setOn = (id: string, on: boolean) => call(id, `/api/listings/${id}`, { fanSlot: on ? true : null });

  const q = search.trim().toLowerCase();
  const shown = q ? listings.filter((l) => l.title.toLowerCase().includes(q)) : listings;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Slik er forsiden nå</p>
        {row.length ? (
          <ol className="mt-2 flex gap-3 overflow-x-auto pb-2">
            {row.map((l) => (
              <li key={l.id} className="w-[88px] shrink-0">
                <ListingThumb image={l.image} title={l.title} />
                <p className="mt-1 truncate text-[11px] font-semibold text-slate-900" title={l.title}>
                  {l.title}
                </p>
                <p className="truncate text-[10px] text-slate-500">{l.label}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-slate-600">Ingen kort på forsiden nå. Slå på kort under.</p>
        )}
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Velg kort til forsiden</p>
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
                <p className="text-xs text-slate-500">{l.fanSlot ? "Valgt til forsiden" : l.label.startsWith("Nyeste") ? "Ikke valgt" : l.label}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(l.fanSlot)}
                aria-label={`På forsiden: ${l.title}`}
                disabled={busy === l.id}
                onClick={() => setOn(l.id, !l.fanSlot)}
                className="relative h-7 w-12 shrink-0 rounded-full bg-slate-300 transition aria-checked:bg-emerald-600 disabled:opacity-50"
              >
                <span className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition [[aria-checked=true]_&]:translate-x-5" />
              </button>
            </li>
          ))}
          {!shown.length && <li className="px-3 py-3 text-sm text-slate-500">Ingen treff.</li>}
        </ul>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
