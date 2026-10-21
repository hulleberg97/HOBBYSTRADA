import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { OPPSETT } from "./oppsett";

export const metadata: Metadata = { title: "Test av forside", robots: { index: false, follow: false } };

export default function TestOversikt() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="font-heading text-3xl font-bold tracking-[-0.03em] text-slate-950">10 oppsett av forsiden</h1>
      <p className="mt-2 text-sm text-slate-600">Bare for test. Forsiden på hobbystrada.no er ikke endret.</p>
      <ol className="mt-8 space-y-3">
        {OPPSETT.map((o, i) => (
          <li key={o.navn}>
            <Link href={`/test/forside/${i + 1}`} className="group flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-slate-400">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-950">
                  {o.navn} <span className="font-normal text-slate-500">· {o.inspirasjon}</span>
                </span>
                <span className="block text-sm text-slate-600">{o.regel}</span>
              </span>
              <ArrowRightIcon className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
