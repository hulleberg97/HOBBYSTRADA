import type { Metadata } from "next";
import { LegalPage, List } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Personvern" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Personvern"
      updated="oktober 2026"
      sections={[
        {
          title: "Hvem som er ansvarlig",
          body: <p>HOBBYSTRADA er behandlingsansvarlig for personopplysningene som samles inn på denne nettsiden.</p>,
        },
        {
          title: "Hva vi samler inn",
          body: (
            <>
              <p>Vi samler bare inn det som trengs for å drive markedsplassen:</p>
              <List
                items={[
                  "Konto: e-post, brukernavn og passord (lagres kryptert).",
                  "Vipps (hvis du logger inn eller bekrefter deg med Vipps): navn, telefonnummer og e-post. Navnet brukes til merket «Verifisert med Vipps»; telefonnummeret vises aldri.",
                  "Annonser: kortdata, pris, sted, bilder og kontaktinformasjonen du oppgir.",
                  "Meldinger: navn, e-post og innholdet i meldinger sendt til selgere eller til oss.",
                  "Teknisk: informasjonskapsler som holder deg innlogget og husker språkvalg.",
                ]}
              />
            </>
          ),
        },
        {
          title: "Hva opplysningene brukes til",
          body: (
            <List
              items={[
                "Vise annonsene dine i markedet.",
                "Formidle meldinger mellom kjøper og selger.",
                "Behandle betaling for annonseløft.",
                "Stoppe svindel og annonser som bryter vilkårene.",
              ]}
            />
          ),
        },
        {
          title: "Hva som vises offentlig",
          body: <p>I annonsen vises brukernavn, sted og annonseinnholdet. E-post og telefonnummer vises aldri. Kjøpere når deg gjennom meldingsskjemaet.</p>,
        },
        {
          title: "Hvem vi deler med",
          body: (
            <p>
              Vi selger aldri opplysninger. Vi bruker leverandører som lagrer data og sender e-post på våre vegne (Supabase, Vercel og e-posttjeneste), og
              betalingsleverandør for annonseløft. De får bare det de trenger for å levere tjenesten.
            </p>
          ),
        },
        {
          title: "Lagringstid",
          body: (
            <List
              items={[
                "Annonser og bilder: til du sletter dem eller kontoen din. Avviste annonser slettes etter 30 dager.",
                "Meldinger og henvendelser: slettes automatisk etter 12 måneder.",
                "Rapporter om annonser: slettes 12 måneder etter at de er behandlet.",
                "Betalinger for annonseløft: så lenge bokføringsloven krever (5 år).",
              ]}
            />
          ),
        },
        {
          title: "Hvor dataene lagres",
          body: (
            <p>
              Databasen og serverne som behandler opplysningene dine, ligger i EU (Frankfurt). Leverandørene våre har databehandleravtaler med oss og behandler
              bare opplysningene på våre vegne.
            </p>
          ),
        },
        {
          title: "Dine rettigheter",
          body: (
            <p>
              Du kan be om innsyn, retting og sletting av opplysningene dine, og du kan klage til Datatilsynet. Kontoen og annonsene dine kan du slette selv fra
              Min side.
            </p>
          ),
        },
      ]}
    />
  );
}
