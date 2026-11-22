"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { ArrowRightIcon } from "lucide-react";

export type Fane = { key: string; label: string; href: string; alle: string; ikon?: React.ReactNode };

/**
 * Fanene over annonsene på forsiden (telefon): Alle, Autograf, Patch osv. Annonsekortene er tegnet ferdig på serveren;
 * her velges bare hvilke som vises. «faner» på hvert kort sier hvilke faner kortet hører til.
 */
export function ForsideFaner({ faner, kort }: { faner: Fane[]; kort: { id: string; faner: string[]; node: React.ReactNode }[] }) {
  const [aktiv, setAktiv] = useState(faner[0].key);
  const fane = faner.find((f) => f.key === aktiv) ?? faner[0];
  return (
    <>
      <div role="group" aria-label="Korttype" className="mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
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
      <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-7 px-4 sm:grid-cols-3 sm:gap-x-4 sm:px-6">
        {kort
          .filter((k) => k.faner.includes(aktiv))
          .map((k) => (
            <Fragment key={k.id}>{k.node}</Fragment>
          ))}
      </div>
      <div className="mt-7 px-4 sm:px-6">
        <Link href={fane.href} className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#fff] text-sm font-semibold text-slate-950 shadow-[inset_0_0_0_1px_#cbd5e1]">
          {fane.alle}
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}
