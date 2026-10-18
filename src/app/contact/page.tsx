import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRightIcon } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = { title: "Kontakt" };

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50/70">
        <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-medium text-slate-500">Kontakt</p>
          <h1 className="mt-1 font-heading text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-[44px]">Ta kontakt med oss</h1>
          <p className="mt-3 max-w-xl text-base text-slate-600 sm:text-lg">Spørsmål om en annonse, annonseløft eller noe annet? Send oss en melding.</p>
        </div>
      </section>
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
