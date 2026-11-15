import Link from "next/link";
import { Eyebrow } from "@/components/ui";
import { BOOSTS } from "@/lib/boosts";

/**
 * Veiledning under innloggingen på «Legg ut kort»: forklarer hvordan man selger fotballkort her.
 * Vises bare før man er klar til å legge ut (ikke over skjemaet). Opplysningene følger spørsmål og svar og vilkårene.
 */
const STEG: [string, string][] = [
  ["Logg inn med Vipps", "Alle som legger ut kort, logger inn med Vipps, så kjøper og selger vet hvem de handler med. Fornavnet ditt vises på annonsen."],
  ["Lag annonsen", "Fyll inn spiller, sett, tilstand og pris, og last opp bilder av kortet. Det tar et par minutter."],
  ["Kjøperne tar kontakt", "Du får meldinger og bud i chatten. Et bud er et uforpliktende prisforslag, og du velger selv om du godtar det."],
  ["Få betalt direkte", "Godtar du et bud, får kjøperen en lenke som åpner Vipps med deg valgt. Pengene går rett til deg, og dere avtaler frakt eller henting i chatten."],
];

export function SellGuide() {
  const b = BOOSTS;
  return (
    <section className="mx-auto max-w-[1320px] px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24" aria-labelledby="selg-guide">
      <div className="mx-auto max-w-3xl">
        <Eyebrow>Slik fungerer det</Eyebrow>
        <h2 id="selg-guide" className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[32px]">
          Slik selger du fotballkort på HOBBYSTRADA
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-700">
          HOBBYSTRADA er en norsk markedsplass bare for fotballkort. Private samlere legger ut kortene sine, og kjøper og selger avtaler handelen direkte.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2">
          {STEG.map(([tittel, tekst], i) => (
            <li key={tittel} className="flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-slate-300/70 sm:p-6">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{i + 1}</span>
              <div>
                <p className="font-semibold text-slate-950">{tittel}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-700">{tekst}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 space-y-8">
          <div>
            <h3 className="font-heading text-lg font-semibold tracking-tight text-slate-950">Hva koster det å selge fotballkort?</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-slate-700">
              Det er gratis å legge ut kort. Vil du at annonsen skal synes bedre, kan du kjøpe et{" "}
              <Link href="/annonseloft" className="font-medium text-slate-950 underline underline-offset-2">
                annonseløft
              </Link>
              : {b.top.name} {b.top.price} kr ({b.top.days} dager), {b.featured.name} {b.featured.price} kr ({b.featured.days} dager) eller {b.frontpage.name}{" "}
              {b.frontpage.price} kr ({b.frontpage.days} dager). Løftet er valgfritt og fornyes ikke automatisk.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold tracking-tight text-slate-950">Hva er fotballkortet mitt verdt?</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-slate-700">
              Se hva lignende kort ligger ute for i{" "}
              <Link href="/marked" className="font-medium text-slate-950 underline underline-offset-2">
                markedet
              </Link>
              , og sjekk{" "}
              <Link href="/solgt" className="font-medium text-slate-950 underline underline-offset-2">
                prisarkivet
              </Link>{" "}
              for å se hva solgte kort var lagt ut for. Spiller, sett, opplag, autograf og tilstand betyr mest for prisen.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold tracking-tight text-slate-950">Hvilke kort kan jeg legge ut?</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-slate-700">
              Siden er bare for fotballkort: autografkort, patch og relic, rookies, nummererte kort og vanlige kort, graderte og ugraderte. Du selger som
              privatperson. Flere svar finner du under{" "}
              <Link href="/sporsmal" className="font-medium text-slate-950 underline underline-offset-2">
                spørsmål og svar
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
