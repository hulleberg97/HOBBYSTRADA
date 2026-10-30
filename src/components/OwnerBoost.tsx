"use client";

import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { useUser } from "./useUser";

/** Tilbud om annonseløft, vist bare for selgeren når de ser sin egen annonse. */
export function OwnerBoost({ slug, ownerId }: { slug: string; ownerId?: string | null }) {
  const user = useUser();
  if (!user || !ownerId || user.id !== ownerId) return null;
  return (
    <Link
      className="mt-4 flex items-center justify-between gap-3 rounded-3xl bg-amber-50 px-5 py-4 ring-1 ring-inset ring-accent/40 transition hover:ring-accent"
      href={`/annonseloft?annonse=${slug}`}
    >
      <span>
        <span className="block text-sm font-semibold text-slate-900">Vil du selge raskere?</span>
        <span className="block text-xs text-slate-600">Løft annonsen til toppen av markedet, eller gi den gullmerke og plass på forsiden.</span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-3.5 py-2 text-xs font-semibold text-accent-foreground">
        Løft annonsen
        <ArrowUpRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
