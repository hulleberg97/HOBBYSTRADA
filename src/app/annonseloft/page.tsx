import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BoostPicker } from "@/components/BoostPicker";

export const metadata: Metadata = { title: "Annonseløft" };

export default function BoostPage() {
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="bg-grid-navy">
          <div className="mx-auto max-w-[1320px] px-4 pb-14 pt-14 text-center sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
            <p className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-accent">Annonseløft</p>
            <h1 className="mx-auto mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Få kortet ditt sett først
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Gi annonsen mer synlighet, og selg raskere til samlere i hele Norge.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Suspense>
          <BoostPicker />
        </Suspense>
        <div className="mx-auto mt-16 max-w-2xl">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Vanlige spørsmål</h2>
          <dl className="mt-6 divide-y divide-border border-y border-border">
            <div className="py-5">
              <dt className="font-semibold">Når starter løftet?</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Løftet aktiveres på annonsen etter at betalingen er gjennomført.</dd>
            </div>
            <div className="py-5">
              <dt className="font-semibold">Hva om kortet selges før perioden er over?</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Da er jobben gjort. Løftet stopper når annonsen markeres som solgt.</dd>
            </div>
          </dl>
          <p className="mt-8 text-sm text-muted-foreground">
            Har du ikke lagt ut kortet ennå?{" "}
            <Link className="font-semibold text-foreground underline underline-offset-4" href="/sell">
              Legg ut kort
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
