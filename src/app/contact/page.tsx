import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { Suspense } from "react";
import { ChevronRightIcon } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = { title: "Kontakt" };

export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // Adressen leses på serveren, så skjemaet står der fra første bilde i stedet for at siden hopper
  await searchParams;
  return (
    <div>
      <PageHeader eyebrow="Kontakt" title="Ta kontakt med oss" lead="Spørsmål om en annonse, annonseløft eller noe annet? Send oss en melding."></PageHeader>
      <div className="mx-auto grid max-w-[1320px] gap-8 px-4 pb-24 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:px-8">
        <Suspense>
          <ContactForm />
        </Suspense>
        <aside className="space-y-4">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
            <h2 className="font-heading text-lg font-bold tracking-tight text-slate-950">Firmaopplysninger</h2>
            <address className="mt-3 space-y-1 text-[15px] not-italic leading-relaxed text-slate-700">
              <p className="font-medium text-slate-900">{COMPANY.name}</p>
              <p>Org.nr. {COMPANY.orgnr}</p>
              <p>{COMPANY.street}</p>
              <p>{COMPANY.postal}</p>
              <p>
                <a className="text-primary hover:underline" href={`mailto:${COMPANY.email}`}>
                  {COMPANY.email}
                </a>
              </p>
            </address>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
            <h2 className="font-heading text-lg font-bold tracking-tight text-slate-950">Finn svar raskt</h2>
            <ul className="mt-3 divide-y divide-slate-100">
              {[
                ["/faq", "Spørsmål og svar"],
                ["/annonseloft", "Om annonseløft"],
                ["/sell", "Slik legger du ut kort"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link className="flex items-center justify-between py-3.5 text-[15px] font-medium text-slate-800 transition hover:text-primary" href={href}>
                    {label}
                    <ChevronRightIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
