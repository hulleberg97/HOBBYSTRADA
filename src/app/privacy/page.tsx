import type { Metadata } from "next";
import { LegalPage, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = { title: "Personvern" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Personvern"
      updated="oktober 2026"
      sections={[
        {
          title: "Hvem som er ansvarlig",
          body: (
            <p>
              {COMPANY.name} (org.nr. {COMPANY.orgnr}), {COMPANY.street}, {COMPANY.postal}, er behandlingsansvarlig for personopplysningene som samles inn på
              denne nettsiden. Du når oss på <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> eller via kontaktskjemaet.
            </p>
          ),
        },
        {
          title: "Hva vi samler inn",
          body: (
            <>
              <p>Vi samler bare inn det som trengs for å drive markedsplassen:</p>
              <List
                items={[
                  "Konto: navn, e-post og sted. Har du en eldre konto med e-post og passord, lagres passordet kryptert.",
                  "Vipps: når du logger inn med Vipps, får vi navnet, e-posten og adressen din fra Vipps. Navnet brukes til merket «Verifisert med Vipps», og poststedet fylles inn som sted i annonsene dine. Vi lagrer bare poststedet, ikke gateadressen. Vi henter ikke telefonnummeret ditt.",
                  "Annonseløft: hvilken pakke du kjøpte, beløp, tidspunkt og hvilken annonse det gjaldt. Selve betalingen skjer i Vipps, og vi ser aldri kortopplysningene dine.",
                  "Annonser: kortdata, pris, sted og bilder.",
                  "Meldinger: innholdet i samtaler mellom kjøpere og selgere, bilder dere sender i chatten, og meldinger til oss. Den andre parten ser brukernavnet ditt, men aldri e-postadressen din. Bilder i chatten lagres privat og vises bare for dere to.",
                  "Teknisk: informasjonskapsler som holder deg innlogget. For å stoppe spam lagrer vi IP-adressen din kortvarig når du sender kontaktskjema eller rapporterer en annonse. Den slettes etter ett døgn.",
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
          title: "Grunnlaget for behandlingen",
          body: (
            <List
              items={[
                "Avtale: konto, annonser, meldinger og annonseløft er nødvendig for å levere tjenesten du har bedt om (personvernforordningen art. 6 nr. 1 b).",
                "Rettslig plikt: betalinger for annonseløft lagres fordi bokføringsloven krever det (art. 6 nr. 1 c).",
                "Berettiget interesse: å stoppe svindel, spam og misbruk, for eksempel ved å lagre IP-adressen kortvarig og behandle rapporter om annonser (art. 6 nr. 1 f).",
                "Samtykke: varsler på e-post om nye kort sendes bare når du har slått dem på, og du kan slå dem av når som helst på Min side (art. 6 nr. 1 a).",
              ]}
            />
          ),
        },
        {
          title: "Hva som vises offentlig",
          body: (
            <p>
              I annonsen vises brukernavn, sted og annonseinnholdet. E-postadressen din vises aldri. Kjøpere når deg gjennom meldinger på nettsiden. Du får
              beskjed på e-post når noen skriver til deg.
            </p>
          ),
        },
        {
          title: "Hvem vi deler med",
          body: (
            <p>
              Vi selger aldri opplysninger. Vi bruker leverandører som lagrer data og sender e-post på våre vegne (Supabase, Vercel og e-posttjeneste), og
              Vipps MobilePay for innlogging og betaling. De får bare det de trenger for å levere tjenesten.
            </p>
          ),
        },
        {
          title: "Lagringstid",
          body: (
            <List
              items={[
                "Konto: til du sletter den. Da slettes også koblingen til Vipps.",
                "Annonser og bilder: til du sletter dem eller kontoen din. Avviste annonser slettes etter 30 dager.",
                "Samtaler og henvendelser: slettes automatisk 12 måneder etter siste melding.",
                "Rapporter om annonser: slettes 12 måneder etter at de er behandlet.",
                "Betalinger for annonseløft: så lenge bokføringsloven krever (5 år), også om annonsen eller kontoen slettes. E-postadressen din fjernes fra betalingen når du sletter kontoen.",
              ]}
            />
          ),
        },
        {
          title: "Hvor dataene lagres",
          body: (
            <p>
              Databasen ligger i EU (Stockholm), og serverne som behandler opplysningene dine, ligger i EU (Frankfurt). Leverandørene våre har
              databehandleravtaler med oss og behandler bare opplysningene på våre vegne.
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
