import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon, ShoppingBagIcon } from "lucide-react";

export const metadata: Metadata = { title: "Handlekurven er tom" };

export default function CartPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <Link
          className="inline-flex items-center gap-1.5 font-mono-data text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
          href="/products"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden="true" /> Tilbake til markedet
        </Link>
        <div className="mt-4 flex items-baseline gap-3">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Handlekurven er tom</h1>
        </div>
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border bg-white px-6 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <ShoppingBagIcon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </span>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Du har ikke lagt til noen kort ennå. Finn autografkort, relic-kort og rookies i markedet.
          </p>
          <Link className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90" href="/products">
            Utforsk markedet
          </Link>
        </div>
      </div>
    </div>
  );
}
