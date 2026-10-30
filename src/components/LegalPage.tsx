import Link from "next/link";
import { PageHeader } from "./ui";
import { slugify } from "@/lib/format";
import { COMPANY } from "@/lib/company";

/** id: fast anker (f.eks. /vilkar#slik-sorteres-annonsene). Uten id lages den av tittelen. */
export type LegalSection = { title: string; body: React.ReactNode; id?: string };

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <div className="min-h-screen">
      <PageHeader eyebrow="Juridisk" title={title} lead={`Sist oppdatert: ${updated}`} />
      <div className="container-custom max-w-3xl pb-16 pt-10">
        <div className="space-y-8 text-base leading-relaxed text-slate-700">
          {sections.map((s) => (
            <section key={s.title} id={s.id ?? slugify(s.title)} className="scroll-mt-24">
              <h2 className="mb-3 font-heading text-h4 font-semibold text-foreground">{s.title}</h2>
              {s.body}
            </section>
          ))}
          <section>
            <h2 className="mb-3 font-heading text-h4 font-semibold text-foreground">Kontakt</h2>
            <p>
              Du kan kontakte oss via{" "}
              <Link href="/kontakt" className="text-foreground underline underline-offset-2">
                kontaktskjemaet
              </Link>{" "}
              eller på <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-inside list-disc space-y-1">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}
