import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Fant ikke siden", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="container-custom py-24 text-center">
      <p className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-muted-foreground">404</p>
      <h1 className="mt-3 font-heading text-4xl font-bold tracking-[-0.03em] text-slate-950">Fant ikke siden</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600">Adressen kan være feil, eller annonsen er solgt eller slettet.</p>
      <Link
        href="/marked"
        className="mt-8 inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-black"
      >
        Gå til markedet
      </Link>
      <Link href="/" className="mt-3 block text-sm font-semibold text-slate-600 underline-offset-4 hover:underline">
        Til forsiden
      </Link>
    </div>
  );
}
