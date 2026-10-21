"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellIcon } from "lucide-react";

export function SavedSearches({ items }: { items: { id: string; label: string; query: string }[] }) {
  const router = useRouter();
  const remove = async (id: string) => {
    await fetch(`/api/saved-searches?id=${id}`, { method: "DELETE" });
    router.refresh();
  };
  if (!items.length) {
    return (
      <div className="mt-4 rounded-3xl bg-white p-6 text-sm text-slate-600 ring-1 ring-inset ring-slate-300/70">
        <p>Søk eller filtrer i markedet og trykk «Varsle meg om nye kort», så får du e-post når et nytt kort passer.</p>
        <Link
          href="/products"
          className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-black"
        >
          Gå til markedet
        </Link>
      </div>
    );
  }
  return (
    <ul className="mt-4 space-y-2">
      {items.map((s) => (
        <li key={s.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <Link href={`/products?${s.query}`} className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-900 hover:underline">
            <BellIcon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span className="truncate">{s.label}</span>
          </Link>
          <button type="button" onClick={() => remove(s.id)} className="shrink-0 text-xs font-semibold text-slate-500 hover:text-destructive">
            Slett
          </button>
        </li>
      ))}
    </ul>
  );
}
