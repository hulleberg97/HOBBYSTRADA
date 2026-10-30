import type { Metadata } from "next";
import { LegalPage, List } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Informasjonskapsler", alternates: { canonical: "/informasjonskapsler" } };

export default function CookiePage() {
  return (
    <LegalPage
      title="Informasjonskapsler"
      updated="26. oktober 2026"
      sections={[
        {
          title: "Hva vi bruker",
          body: (
            <>
              <p>Vi bruker bare informasjonskapsler og lokal lagring som trengs for at siden skal virke:</p>
              <List
                items={[
                  "Innlogging (sb-…-auth-token): holder deg innlogget. Fornyes ved hvert besøk, slettes når du logger ut, og senest 90 dager etter siste besøk.",
                  "Vipps-innlogging (vipps_oidc): sikrer innloggingen og slettes etter 10 minutter.",
                  "Favoritter, lukkede varsler og hvilke annonser du har åpnet (så en annonse teller én visning per person): lagres bare i nettleseren din, ikke hos oss, til du fjerner dem eller tømmer nettleseren.",
                ]}
              />
            </>
          ),
        },
        {
          title: "Hva vi ikke bruker",
          body: <p>Vi bruker ikke informasjonskapsler for sporing, analyse eller annonser. Derfor har vi ingen samtykkeverktøy. Knappen «Om informasjonskapsler» nederst på siden viser bare denne informasjonen.</p>,
        },
        {
          title: "Slik sletter du dem",
          body: <p>Du kan slette informasjonskapsler i innstillingene i nettleseren din. Da blir du logget ut.</p>,
        },
      ]}
    />
  );
}
