import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { LegalPage } from "@/components/LegalPage";
import { SALGSVILKAR, SALGSVILKAR_UPDATED } from "@/lib/salgsvilkar";

export const metadata: Metadata = { title: "Salgsvilkår", alternates: { canonical: "/salgsvilkar" } };

/** Gjør [tekst](/sti) til lenker og **tekst** til uthevet tekst. */
function rich(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <Link key={i} href={link[2]}>
          {link[1]}
        </Link>
      );
    }
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Salgsvilkår for det HOBBYSTRADA selger selv: annonseløft. Teksten ligger i src/lib/salgsvilkar.ts og brukes også i PDF-vedlegget til kvitteringen. */
export default function SalesTermsPage() {
  return (
    <LegalPage
      title="Salgsvilkår"
      updated={SALGSVILKAR_UPDATED}
      sections={SALGSVILKAR.map((s) => ({
        title: s.title,
        id: s.id,
        body: (
          <>
            {s.blocks.map((b, i) =>
              Array.isArray(b) ? (
                <ul key={i} className="mt-2 list-inside list-disc space-y-1">
                  {b.map((item) => (
                    <li key={item}>{rich(item)}</li>
                  ))}
                </ul>
              ) : (
                <p key={i} className={i ? "mt-3" : undefined}>
                  {rich(b)}
                </p>
              ),
            )}
          </>
        ),
      }))}
    />
  );
}
