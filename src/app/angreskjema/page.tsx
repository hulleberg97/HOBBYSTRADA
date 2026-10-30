import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { PageHeader } from "@/components/ui";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = { title: "Angreskjema", alternates: { canonical: "/angreskjema" } };

/** Standard angreskjema (angrerettloven § 8 og forskriftens vedlegg). Kan sendes som e-post eller skrives ut. */
export default function Page() {
  const row = "grid gap-1 border-b border-dashed border-slate-300 py-3 sm:grid-cols-[220px_1fr]";
  return (
    <div className="min-h-screen">
      <PageHeader eyebrow="Juridisk" title="Angreskjema" lead="Fyll ut og send dette skjemaet hvis du vil gå fra avtalen om annonseløft. Du kan også trykke «Angre avtalen» på kvitteringen under Min side, eller sende en e-post. En tydelig melding om at du angrer, er nok." />
      <div className="container-custom max-w-3xl pb-16 pt-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p className="text-sm text-slate-600">
            Fyll ut og send til <a href={`mailto:${COMPANY.email}?subject=Angrerett%20annonseløft`}>{COMPANY.email}</a>, eller skriv ut og send i posten.
          </p>
          <PrintButton />
        </div>
        <div className="rounded-3xl bg-white p-6 text-base leading-relaxed text-slate-700 ring-1 ring-slate-200 print:p-0 print:ring-0 sm:p-8">
          <p>
            Til: {COMPANY.name}, org.nr. {COMPANY.orgnr}, {COMPANY.street}, {COMPANY.postal}, e-post {COMPANY.email}
          </p>
          <p className="mt-4">Jeg underretter herved om at jeg ønsker å gå fra min avtale om kjøp av følgende tjeneste:</p>
          <dl className="mt-4 text-sm">
            <div className={row}>
              <dt className="text-slate-500">Tjeneste</dt>
              <dd>Annonseløft (pakke og annonse): ______________________________</dd>
            </div>
            <div className={row}>
              <dt className="text-slate-500">Bestilt den</dt>
              <dd>__________</dd>
            </div>
            <div className={row}>
              <dt className="text-slate-500">Forbrukerens navn</dt>
              <dd>______________________________</dd>
            </div>
            <div className={row}>
              <dt className="text-slate-500">Forbrukerens adresse</dt>
              <dd>______________________________</dd>
            </div>
            <div className={row}>
              <dt className="text-slate-500">Kvitteringsnummer</dt>
              <dd>__________ (valgfritt, står på kvitteringen under Min side)</dd>
            </div>
            <div className={row}>
              <dt className="text-slate-500">Forbrukerens underskrift</dt>
              <dd>______________________________ (kun hvis skjemaet sendes på papir)</dd>
            </div>
            <div className={row}>
              <dt className="text-slate-500">Dato</dt>
              <dd>__________</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-slate-600">
            Hva som skjer når du angrer, står i <Link href="/salgsvilkar#angrerett">salgsvilkårene under «Angrerett»</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
