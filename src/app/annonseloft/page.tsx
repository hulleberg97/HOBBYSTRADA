import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BoostPicker } from "@/components/BoostPicker";
import { PageHeader } from "@/components/ui";
import { FRONTPAGE_SLOTS } from "@/lib/boosts";
import { frontpageAvailability } from "@/lib/frontpage";
import { adminClient } from "@/lib/supabase-admin";

export const metadata: Metadata = { title: "Annonseløft", alternates: { canonical: "/annonseloft" } };

export default async function BoostPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // Adressen leses på serveren, så skjemaet står der fra første bilde i stedet for at siden hopper
  await searchParams;
  // Toppannonse selges bare når det er en ledig plass på forsiden
  const db = adminClient();
  const frontpage = db ? await frontpageAvailability(db) : { soldOut: false, nextFreeText: "", slots: FRONTPAGE_SLOTS };
  return (
    <>
      <PageHeader center eyebrow="Annonseløft" title="Få kortet ditt sett først" lead="Gi annonsen mer synlighet, og selg raskere til andre samlere." />
      <section className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Suspense>
          <BoostPicker frontpage={{ soldOut: frontpage.soldOut, nextFreeText: frontpage.nextFreeText, slots: frontpage.slots }} />
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
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Løftet stopper når du merker annonsen som solgt eller sletter den. Resten av perioden refunderes ikke, med mindre du angrer kjøpet innen 14
                dager.
              </dd>
            </div>
          </dl>
          <p className="mt-8 text-sm text-muted-foreground">
            Har du ikke lagt ut kortet ennå?{" "}
            <Link className="font-semibold text-foreground underline underline-offset-4" href="/selg">
              Legg ut kort
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
