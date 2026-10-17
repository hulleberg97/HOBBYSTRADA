import type { Metadata } from "next";
import { SellForm } from "@/components/SellForm";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Legg ut kort" };

const STEPS = [
  ["Lag annonsen", "Spiller, sett, tilstand, pris, sted og bilder."],
  ["Ute i markedet", "Vises med kortdata for samlere i hele Norge."],
  ["Kjøpere tar kontakt", "Meldinger eller anrop direkte til deg."],
  ["Løft om du vil", "Fremhev annonsen for å selge raskere."],
];

export default async function SellPage() {
  const user = await getUser();
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1320px] px-4 pb-10 pt-12 sm:px-6 lg:px-8 lg:pb-12 lg:pt-16">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
            <div>
              <p className="font-mono-data text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Ny annonse</p>
              <h1 className="mt-4 font-heading text-4xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-5xl lg:text-6xl">Legg ut kortet ditt</h1>
            </div>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Lag annonsen på et par minutter. Kjøperne kontakter deg direkte, og dere avtaler handelen selv.
            </p>
          </div>
          <ol className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-foreground pt-6 lg:grid-cols-4">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[2rem_1fr]">
                <span className="font-mono-data text-xs text-muted-foreground">0{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold">{t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SellForm user={user ? { name: user.name, email: user.email } : null} />
      </section>
    </>
  );
}
