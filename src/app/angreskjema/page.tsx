import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { PageHeader } from "@/components/ui";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = { title: "Angreskjema" };

/** Standard angreskjema (angrerettloven § 8 og forskriftens vedlegg). Kan sendes som e-post eller skrives ut. */
export default function Page() {
  const row = "grid gap-1 border-b border-dashed border-slate-300 py-3 sm:grid-cols-[220px_1fr]";
  return (
    <div className="min-h-screen">
      <PageHeader eyebrow="Juridisk" title="Angreskjema" lead="Bruk dette skjemaet hvis du vil gå fra avtalen om annonseløft. Du kan også trykke «Angre kjøpet» på kvitteringen under Min side, eller sende en vanlig e-post. Enhver tydelig melding om at du angrer, er nok." />
      <div className="container-custom max-w-3xl pb-16 pt-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p className="text-sm text-slate-600">
            Fyll ut og send til <a href={`mailto:${COMPANY.email}?subject=Angrerett%20annonseløft`}>{COMPANY.email}</a>, eller skriv ut og send i posten.
          </p>
          <PrintButton />
        </div>
        <div className="rounded-3xl bg-white p-6 text-base leading-relaxed text-slate-700 ring-1 ring-slate-200 print:p-0 print:ring-0 sm:p-8">
          <p>
            Til {COMPANY.name}, org.nr. {COMPANY.orgnr}, {COMPANY.street}, {COMPANY.postal}, e-post {COMPANY.email}.
          </p>
          <p className="mt-4">Jeg melder med dette at jeg ønsker å gå fra min avtale om kjøp av følgende tjeneste:</p>
          <dl className="mt-4 text-sm">
            <div className={row}>
              <dt className="text-slate-500">Tjeneste</dt>
              <dd>Annonseløft (pakke og annonse): ______________________________</dd>
            </div>
            <div className={row}>
              <dt className="text-slate-500">Kvitteringsnummer</dt>
              <dd>Salgsdokument nr.: __________ (hvis du har det, står på kvitteringen under Min side)</dd>
            </div>
            <div className={row}>
              <dt className="text-slate-500">Bestilt den</dt>
              <dd>__________</dd>
            </div>
            <div className={row}>
              <dt className="text-slate-500">Navn</dt>
              <dd>______________________________</dd>
            </div>
            <div className={row}>
              <dt className="text-slate-500">E-post</dt>
              <dd>______________________________</dd>
            </div>
            <div className={row}>
              <dt className="text-slate-500">Dato</dt>
              <dd>__________</dd>
            </div>
            <div className={row}>
              <dt className="text-slate-500">Underskrift</dt>
              <dd>______________________________ (bare hvis skjemaet sendes på papir)</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-slate-600">
            Angrefristen er 14 dager fra avtalen ble inngått. Har du bedt om at løftet starter med en gang, betaler du for den delen av perioden som er brukt
            når vi mottar meldingen, og får resten tilbake til samme betalingsmåte innen 14 dager. Er perioden over, er løftet levert fullt ut, og angreretten
            har gått tapt. Se <Link href="/salgsvilkar">salgsvilkårene</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
