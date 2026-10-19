import type { Metadata } from "next";
import { LegalPage, List } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Informasjonskapsler" };

export default function CookiePage() {
  return (
    <LegalPage
      title="Informasjonskapsler"
      updated="oktober 2026"
      sections={[
        {
          title: "Hva vi bruker",
          body: (
            <>
              <p>Vi bruker bare informasjonskapsler og lokal lagring som trengs for at siden skal virke:</p>
              <List
                items={[
                  "Innlogging: holder deg innlogget mens du bruker siden.",
                  "Favoritter: husker kortene du har lagret, i nettleseren din.",
                  "Samtykke: husker at du har lest denne meldingen.",
                ]}
              />
            </>
          ),
        },
        {
          title: "Hva vi ikke bruker",
          body: <p>Vi bruker ikke informasjonskapsler for sporing, analyse eller annonser.</p>,
        },
        {
          title: "Slik sletter du dem",
          body: <p>Du kan slette informasjonskapsler i innstillingene i nettleseren din. Da blir du logget ut.</p>,
        },
      ]}
    />
  );
}
