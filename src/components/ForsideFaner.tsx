"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { ArrowRightIcon } from "lucide-react";

export type Fane = { key: string; label: string; href: string; alle: string; ikon?: React.ReactNode };

/**
 * Fanene over annonsene på forsiden (telefon): Alle, Autograf, Patch osv. Annonsekortene er tegnet ferdig på serveren;
 * her velges bare hvilke som vises. «faner» på hvert kort sier hvilke faner kortet hører til.
 */
/**
 * «forst» og «midt»: etter de første «forst» annonsene vises seksjonen «midt» (karusellen «Utvalgte kort»), og resten av annonsene kommer under.
 * «tett»: mindre luft over fanene og rutenettet, når de står rett under søkefeltet.
 */
export function ForsideFaner({
  faner,
  kort,
  midt,
  forst = 4,
  tett = false,
}: {
  faner: Fane[];
  kort: { id: string; faner: string[]; node: React.ReactNode }[];
  midt?: React.ReactNode;
  forst?: number;
  tett?: boolean;
}) {
  const [aktiv, setAktiv] = useState(faner[0].key);
  const fane = faner.find((f) => f.key === aktiv) ?? faner[0];
  const synlige = kort.filter((k) => k.faner.includes(aktiv));
  const deler = midt ? [synlige.slice(0, forst), synlige.slice(forst)] : [synlige, []];
  const rutenett = "grid grid-cols-2 gap-x-3 gap-y-7 px-4 sm:grid-cols-3 sm:gap-x-4 sm:px-6";
  return (
    <>
      <div role="group" aria-label="Korttype" className={`${tett ? "mt-3" : "mt-4"} flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden`}>
        {faner.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={f.key === aktiv}
            onClick={() => setAktiv(f.key)}
            className="flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#fff] px-4 text-sm font-semibold text-slate-900 shadow-[inset_0_0_0_1px_#e2e8f0] transition aria-pressed:bg-primary aria-pressed:text-white aria-pressed:shadow-none"
          >
            {f.ikon}
            {f.label}
          </button>
        ))}
      </div>
      <div className={`${tett ? "mt-3.5" : "mt-5"} ${rutenett}`}>
        {deler[0].map((k) => (
          <Fragment key={k.id}>{k.node}</Fragment>
        ))}
      </div>
      {midt}
      {deler[1].length > 0 && (
        <div className={`mt-8 ${rutenett}`}>
          {deler[1].map((k) => (
            <Fragment key={k.id}>{k.node}</Fragment>
          ))}
        </div>
      )}
      <div className="mt-7 px-4 sm:px-6">
        <Link href={fane.href} className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#fff] text-sm font-semibold text-slate-950 shadow-[inset_0_0_0_1px_#cbd5e1]">
          {fane.alle}
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}
