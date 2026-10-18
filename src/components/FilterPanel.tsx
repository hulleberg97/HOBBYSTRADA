"use client";

import { useEffect } from "react";
import { XIcon } from "lucide-react";
import { TYPES, typeLabel, activeCount, facet, type Filters } from "@/lib/filters";
import type { Listing } from "@/lib/types";

const RUNS = [1, 5, 10, 25, 50, 99];
const label = "mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500";
const chip =
  "rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-700 transition hover:border-slate-400 aria-pressed:border-primary aria-pressed:bg-primary/5 aria-pressed:text-primary aria-pressed:ring-1 aria-pressed:ring-primary";
const select =
  "h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white bg-[length:16px] bg-[right_0.9rem_center] bg-no-repeat px-3.5 pr-9 text-sm text-slate-800 outline-none focus:border-primary";
const arrow = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
};

function FacetSelect({
  id,
  title,
  value,
  options,
  onChange,
  all,
}: {
  id: string;
  title: string;
  value: string;
  options: [string, number][];
  onChange: (v: string) => void;
  all: string;
}) {
  if (!options.length && !value) return null;
  return (
    <div>
      <label htmlFor={id} className={label}>
        {title}
      </label>
      <select id={id} className={select} style={arrow} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{all}</option>
        {value && !options.some(([v]) => v === value) && <option value={value}>{value}</option>}
        {options.map(([v, n]) => (
          <option key={v} value={v}>
            {v} ({n})
          </option>
        ))}
      </select>
    </div>
  );
}

export function FilterPanel({
  open,
  onClose,
  listings,
  f,
  update,
  reset,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  listings: Listing[];
  f: Filters;
  update: (patch: Partial<Filters>) => void;
  reset: () => void;
  resultCount: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const graders = facet(listings, f, "grader");
  const toggleType = (t: string) => update({ types: f.types.includes(t) ? f.types.filter((x) => x !== t) : [...f.types, t] });
  const price = (k: "min" | "max") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "");
    update({ [k]: v ? Number(v) : null });
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-slate-950/45 transition-opacity duration-300 motion-reduce:transition-none ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      ></div>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filtre"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col overflow-hidden rounded-t-3xl bg-white text-slate-900 transition-[transform,visibility] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:inset-x-auto sm:inset-y-3 sm:right-3 sm:max-h-none sm:w-[440px] sm:rounded-3xl ${open ? "visible translate-y-0 sm:translate-x-0" : "invisible translate-y-full sm:translate-x-[calc(100%+1rem)] sm:translate-y-0"}`}
      >
        <div className="flex items-center justify-between px-5 pb-4 pt-5 sm:px-6">
          <h2 className="font-heading text-[22px] font-bold tracking-[-0.03em] text-primary">Filtre</h2>
          <button
            type="button"
            aria-label="Lukk filtre"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 hover:text-slate-950"
          >
            <XIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto overscroll-contain border-t border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <p className={label}>Korttype</p>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button key={typeLabel(t)} type="button" aria-pressed={f.types.includes(t)} onClick={() => toggleType(t)} className={chip}>
                  {typeLabel(t)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={label}>Pris (kr)</p>
            <div className="grid grid-cols-2 gap-3">
              <input
                aria-label="Pris fra"
                inputMode="numeric"
                placeholder="Fra"
                value={f.min ?? ""}
                onChange={price("min")}
                className={`${select} bg-none font-mono-data`}
              />
              <input
                aria-label="Pris til"
                inputMode="numeric"
                placeholder="Til"
                value={f.max ?? ""}
                onChange={price("max")}
                className={`${select} bg-none font-mono-data`}
              />
            </div>
          </div>
          <FacetSelect id="f-club" title="Klubb" all="Alle klubber" value={f.club} options={facet(listings, f, "club")} onChange={(club) => update({ club })} />
          <FacetSelect
            id="f-league"
            title="Liga"
            all="Alle ligaer"
            value={f.league}
            options={facet(listings, f, "league")}
            onChange={(league) => update({ league })}
          />
          <FacetSelect id="f-line" title="Sett" all="Alle sett" value={f.line} options={facet(listings, f, "line")} onChange={(line) => update({ line })} />
          {(graders.length > 0 || f.grader) && (
            <div>
              <p className={label}>Gradering</p>
              <div className="flex flex-wrap gap-2">
                {graders.map(([g, n]) => (
                  <button key={g} type="button" aria-pressed={f.grader === g} onClick={() => update({ grader: f.grader === g ? "" : g })} className={chip}>
                    {g === "raw" ? "Ugradert" : g} <span className="text-slate-400">{n}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className={label}>Opplag</p>
            <div className="flex flex-wrap gap-2">
              {RUNS.map((r) => (
                <button key={r} type="button" aria-pressed={f.run === r} onClick={() => update({ run: f.run === r ? null : r })} className={chip}>
                  {r === 1 ? "1/1" : `/${r} eller lavere`}
                </button>
              ))}
            </div>
          </div>
          <FacetSelect
            id="f-place"
            title="Sted"
            all="Hele Norge"
            value={f.place}
            options={facet(listings, f, "place")}
            onChange={(place) => update({ place })}
          />
          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-800">
            <input type="checkbox" checked={f.photo} onChange={(e) => update({ photo: e.target.checked })} className="h-4 w-4 accent-[hsl(var(--primary))]" />
            Bare annonser med bilde
          </label>
        </div>
        <div className="flex gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={reset}
            disabled={activeCount(f) === 0}
            className="h-12 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 disabled:opacity-40"
          >
            Nullstill
          </button>
          <button type="button" onClick={onClose} className="h-12 flex-1 rounded-full bg-primary text-sm font-semibold text-white transition hover:bg-black">
            Vis {resultCount} {resultCount === 1 ? "annonse" : "annonser"}
          </button>
        </div>
      </div>
    </>
  );
}
