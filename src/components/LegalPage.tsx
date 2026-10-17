import Link from "next/link";

export type LegalSection = { title: string; body: React.ReactNode };

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="container-custom py-12 text-center">
          <h1 className="text-h1 font-heading font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sist oppdatert: {updated}</p>
        </div>
      </div>
      <div className="container-custom max-w-3xl py-24">
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="mb-3 font-heading text-h4 font-semibold text-foreground">{s.title}</h2>
              {s.body}
            </section>
          ))}
          <section>
            <h2 className="mb-3 font-heading text-h4 font-semibold text-foreground">Kontakt</h2>
            <p>
              Spørsmål kan sendes via{" "}
              <Link href="/contact" className="text-foreground underline underline-offset-2">
                kontaktskjemaet
              </Link>
              .
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
