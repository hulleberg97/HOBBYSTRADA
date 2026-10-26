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
                  "Innlogging (sb-…-auth-token): holder deg innlogget. Fornyes ved hvert besøk, slettes når du logger ut, og senest 90 dager etter siste besøk.",
                  "Vipps-innlogging (vipps_oidc): sikrer innloggingen og slettes etter 10 minutter.",
                  "Favoritter og lukkede varsler: lagres bare i nettleseren din, ikke hos oss, til du fjerner dem eller tømmer nettleseren.",
                ]}
              />
            </>
          ),
        },
        {
          title: "Hva vi ikke bruker",
          body: <p>Vi bruker ikke informasjonskapsler for sporing, analyse eller annonser. Derfor har vi ingen samtykkeverktøy. Knappen «Administrer informasjonskapsler» nederst på siden viser bare denne informasjonen.</p>,
        },
        {
          title: "Slik sletter du dem",
          body: <p>Du kan slette informasjonskapsler i innstillingene i nettleseren din. Da blir du logget ut.</p>,
        },
      ]}
    />
  );
}
