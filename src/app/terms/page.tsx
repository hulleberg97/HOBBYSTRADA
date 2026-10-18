import type { Metadata } from "next";
import { LegalPage, List } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Vilkår" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Vilkår for bruk"
      updated="oktober 2026"
      sections={[
        {
          title: "Om tjenesten",
          body: (
            <p>
              HOBBYSTRADA er en annonseplass for fotballkort. Vi formidler bare kontakt mellom kjøper og selger. Avtalen om kjøp inngås direkte mellom kjøper og
              selger, og HOBBYSTRADA er ikke part i den.
            </p>
          ),
        },
        {
          title: "Konto",
          body: <p>Du må være minst 18 år, eller ha samtykke fra foresatte, for å legge ut annonser. Du er ansvarlig for det som skjer på kontoen din.</p>,
        },
        {
          title: "Regler for annonser",
          body: (
            <List
              items={[
                "Du må eie kortet du selger, og det må være tilgjengelig.",
                "Bilder og beskrivelse skal vise kortet slik det faktisk er, med skader og tilstand.",
                "Forfalskninger, kopier (reprints) uten tydelig merking og stjålne kort er forbudt.",
                "Én annonse per kort. Ikke legg ut samme kort flere ganger.",
                "Merk annonsen som solgt eller slett den når kortet er solgt.",
              ]}
            />
          ),
        },
        {
          title: "Fjerning av annonser",
          body: (
            <p>
              Vi kan fjerne annonser og stenge kontoer som bryter vilkårene, uten forvarsel. Annonseløft refunderes ikke for annonser som fjernes for
              regelbrudd.
            </p>
          ),
        },
        {
          title: "Annonseløft",
          body: (
            <p>
              Annonseløft er en betalt tjeneste som gir annonsen bedre synlighet i en bestemt periode. Prisen og perioden står på siden Annonseløft. Løftet
              starter når betalingen er gjennomført.
            </p>
          ),
        },
        {
          title: "Ansvar mellom kjøper og selger",
          body: (
            <>
              <p>
                HOBBYSTRADA har ikke juridisk ansvar for handel mellom brukerne. Kjøper og selger er selv ansvarlige for avtalen, betalingen, frakten og at
                kortet er som beskrevet. Vi er blant annet ikke ansvarlige for:
              </p>
              <List
                items={[
                  "at kortet er ekte, i tilstanden som er oppgitt, eller blir levert",
                  "betaling som ikke kommer frem, eller tap ved svindel",
                  "skade, tap eller forsinkelse i frakt",
                  "uenighet om pris, retur eller reklamasjon",
                ]}
              />
              <p className="mt-2">
                Uenighet løses mellom kjøper og selger. Handel mellom privatpersoner reguleres av kjøpsloven. Ved mistanke om svindel bør du kontakte politiet.
                Vi hjelper gjerne til ved å fjerne annonser og stenge kontoer som bryter vilkårene.
              </p>
            </>
          ),
        },
        {
          title: "Ansvar for tjenesten",
          body: (
            <p>
              Vi gjør vårt beste for at siden er tilgjengelig og sikker, men vi garanterer ikke for annonsenes innhold. Så langt loven tillater, er vi ikke
              ansvarlige for tap som oppstår ved bruk av siden.
            </p>
          ),
        },
      ]}
    />
  );
}
