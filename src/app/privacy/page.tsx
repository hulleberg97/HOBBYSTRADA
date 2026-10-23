import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = { title: "Personvern" };

/** Ett formål: hva vi gjør, hvilke opplysninger, grunnlaget og hvor lenge. Oppsett etter Datatilsynets krav (art. 13). */
function Purpose({ title, what, data, basis, kept }: { title: string; what: string; data: string; basis: string; kept: string }) {
  return (
    <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
      <p className="font-semibold text-slate-950">{title}</p>
      <p className="mt-1">{what}</p>
      <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[150px_1fr]">
        <dt className="text-slate-500">Opplysninger</dt>
        <dd>{data}</dd>
        <dt className="text-slate-500">Grunnlag</dt>
        <dd>{basis}</dd>
        <dt className="text-slate-500">Lagringstid</dt>
        <dd>{kept}</dd>
      </dl>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Personvern"
      updated="oktober 2026"
      sections={[
        {
          title: "1. Om denne erklæringen",
          body: (
            <p>
              Her forklarer vi hvilke personopplysninger HOBBYSTRADA behandler når du bruker nettsiden, hvorfor vi gjør det, hvor lenge vi tar vare på dem og
              hvilke rettigheter du har. Erklæringen gjelder hobbystrada.no. Ved vesentlige endringer gir vi beskjed på nettsiden.
            </p>
          ),
        },
        {
          title: "2. Hvem som er ansvarlig",
          body: (
            <p>
              {COMPANY.name} (org.nr. {COMPANY.orgnr}), {COMPANY.street}, {COMPANY.postal}, er behandlingsansvarlig. Har du spørsmål om personvern eller vil
              bruke rettighetene dine, skriv til <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> eller bruk{" "}
              <Link href="/contact">kontaktskjemaet</Link>. Vi har ikke personvernombud.
            </p>
          ),
        },
        {
          title: "3. Hvilke opplysninger vi behandler, og hvor de kommer fra",
          body: (
            <>
              <p>Fra Vipps, når du logger inn:</p>
              <List
                items={[
                  "Navn, e-post og adresse. Vi lagrer navnet, e-posten og poststedet. Gateadressen lagres ikke, og vi henter ikke telefonnummeret ditt.",
                  "En fast ID fra Vipps, så vi kjenner deg igjen neste gang du logger inn.",
                ]}
              />
              <p className="mt-4">Fra deg:</p>
              <List
                items={[
                  "Annonser: kortdata, pris, tilstand, beskrivelse, bilder og sted.",
                  "Meldinger: det du skriver og bildene du sender i chatten med andre brukere.",
                  "Varsler om nye kort: søkene du har lagret.",
                  "Henvendelser: navn, e-post og meldingen når du kontakter oss eller rapporterer en annonse.",
                  "Annonseløft: hvilken pakke du kjøper, for hvilken annonse. Selve betalingen skjer i Vipps, og vi ser aldri bank- eller kortopplysningene dine.",
                ]}
              />
              <p className="mt-4">Automatisk, når du bruker nettsiden:</p>
              <List
                items={[
                  "Informasjonskapsler som holder deg innlogget (se punkt 10).",
                  "IP-adresse når du sender kontaktskjema eller rapporterer en annonse, for å stoppe spam.",
                  "Tekniske logger hos driftsleverandøren vår (IP-adresse, tidspunkt og hvilken side som ble åpnet), for å holde nettsiden trygg og i drift.",
                ]}
              />
            </>
          ),
        },
        {
          title: "4. Hva vi bruker opplysningene til, og grunnlaget",
          body: (
            <>
              <p>Vi bruker bare opplysningene til formålene under. Grunnlaget er hentet fra personvernforordningen artikkel 6.</p>
              <Purpose
                title="Konto og innlogging"
                what="Gi deg en konto, logge deg inn med Vipps og vise merket «Verifisert med Vipps»."
                data="Navn, e-post, poststed og Vipps-ID."
                basis="Avtale med deg (art. 6 nr. 1 b)."
                kept="Til du sletter kontoen. Da slettes også koblingen til Vipps."
              />
              <Purpose
                title="Annonser"
                what="Vise annonsene dine i markedet. Andre ser brukernavnet ditt, stedet og innholdet i annonsen, aldri e-postadressen din."
                data="Annonseinnhold, bilder, brukernavn og sted."
                basis="Avtale med deg (art. 6 nr. 1 b)."
                kept="Til du sletter annonsen eller kontoen. Avviste annonser slettes etter 30 dager."
              />
              <Purpose
                title="Meldinger mellom brukere"
                what="Formidle meldinger mellom kjøper og selger, og gi deg beskjed på e-post når noen skriver til deg. Den andre parten ser brukernavnet ditt, ikke e-postadressen."
                data="Meldinger, bilder i chatten, brukernavn og e-post (bare til varslingen)."
                basis="Avtale med deg (art. 6 nr. 1 b)."
                kept="12 måneder etter siste melding i samtalen. Bilder slettes sammen med samtalen."
              />
              <Purpose
                title="Annonseløft og betaling"
                what="Ta betalt for annonseløft gjennom Vipps og aktivere løftet."
                data="Pakke, beløp, tidspunkt, annonsens tittel og e-postadressen din."
                basis="Avtale med deg (art. 6 nr. 1 b) og bokføringsloven (art. 6 nr. 1 c)."
                kept="5 år etter utløpet av regnskapsåret, som bokføringsloven krever, også om annonsen eller kontoen slettes. Sletter du kontoen, fjernes e-postadressen fra betalingen."
              />
              <Purpose
                title="Varsler om nye kort"
                what="Sende deg e-post når et nytt kort passer et søk du har lagret."
                data="Søket og e-postadressen din."
                basis="Samtykke (art. 6 nr. 1 a). Du slår varslene av når som helst på Min side."
                kept="Til du sletter søket eller kontoen."
              />
              <Purpose
                title="Henvendelser og rapporter"
                what="Svare deg når du kontakter oss, og behandle rapporter om annonser."
                data="Navn, e-post og innholdet i henvendelsen."
                basis="Berettiget interesse (art. 6 nr. 1 f): å kunne svare deg og holde markedet trygt."
                kept="Henvendelser: 12 måneder. Rapporter: 12 måneder etter at de er behandlet."
              />
              <Purpose
                title="Sikkerhet, svindel og spam"
                what="Stoppe svindel, spam og misbruk av nettsiden."
                data="IP-adresse og tekniske logger."
                basis="Berettiget interesse (art. 6 nr. 1 f): å beskytte brukerne og nettsiden."
                kept="IP-adresse ved kontaktskjema og rapporter: ett døgn. Tekniske logger: kort tid hos driftsleverandøren."
              />
              <p className="mt-4">
                Der grunnlaget er berettiget interesse, har vi vurdert at interessen vår ikke veier tyngre enn personvernet ditt. Du kan be om å få se vurderingen.
              </p>
            </>
          ),
        },
        {
          title: "5. Hvem vi deler opplysningene med",
          body: (
            <>
              <p>Vi selger aldri personopplysninger. Disse får opplysninger, og bare det de trenger:</p>
              <List
                items={[
                  "Andre brukere: brukernavn, sted og annonser, og det du skriver i chatten med dem.",
                  "Vipps MobilePay AS: innlogging og betaling. Vipps er selv ansvarlig for opplysningene de behandler om deg.",
                  "Supabase: database og lagring av bilder (databehandler).",
                  "Vercel: drift av nettsiden (databehandler).",
                  "E-postleverandøren vår: sending av e-post fra nettsiden (databehandler).",
                  "Myndigheter, hvis loven krever det, for eksempel ved etterforskning av svindel.",
                ]}
              />
            </>
          ),
        },
        {
          title: "6. Overføring ut av EU/EØS",
          body: (
            <p>
              Databasen ligger i EU (Stockholm), og serverne som behandler opplysningene dine ligger i EU (Frankfurt). Supabase og Vercel er amerikanske
              selskaper. Hvis de får tilgang til opplysninger fra USA, skjer det med grunnlag i EUs standardavtaler (standard contractual clauses) eller
              EU–US Data Privacy Framework.
            </p>
          ),
        },
        {
          title: "7. Må du gi oss opplysningene?",
          body: (
            <p>
              Du kan se på annonsene uten å logge inn. For å legge ut kort, chatte eller kjøpe annonseløft må du logge inn med Vipps, fordi vi trenger å vite
              hvem du er for å holde markedet trygt. Uten innlogging kan du ikke bruke disse delene av nettsiden.
            </p>
          ),
        },
        {
          title: "8. Dine rettigheter",
          body: (
            <>
              <List
                items={[
                  "Innsyn: du kan få vite hvilke opplysninger vi har om deg, og få en kopi.",
                  "Retting: du kan be oss rette opplysninger som er feil.",
                  "Sletting: du kan slette kontoen selv på Min side. Da slettes kontoen, annonsene, bildene, varslene og meldingene til deg. Betalinger beholder vi så lenge bokføringsloven krever.",
                  "Dataportabilitet: du kan få opplysningene du har gitt oss i et maskinlesbart format.",
                  "Protestere: der grunnlaget er berettiget interesse, kan du protestere mot behandlingen.",
                  "Trekke samtykke: varsler om nye kort slår du av på Min side.",
                  "Klage: du kan klage til Datatilsynet (datatilsynet.no).",
                ]}
              />
              <p className="mt-3">
                Skriv til <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> for å bruke rettighetene dine. Vi svarer senest innen én måned.
              </p>
            </>
          ),
        },
        {
          title: "9. Automatiserte avgjørelser",
          body: <p>Vi tar ingen avgjørelser om deg automatisk, og vi lager ikke profiler av deg. Annonser godkjennes av et menneske.</p>,
        },
        {
          title: "10. Informasjonskapsler og lagring i nettleseren",
          body: (
            <>
              <p>Vi bruker bare det som er nødvendig for at nettsiden skal virke. Vi bruker ikke informasjonskapsler til reklame eller sporing.</p>
              <List
                items={[
                  "Innlogging: holder deg innlogget til du logger ut.",
                  "Vipps-innlogging: en kortvarig kapsel som sikrer innloggingen, og som slettes når du er logget inn.",
                  "Favoritter og lukkede varsler: lagres bare i nettleseren din, ikke hos oss.",
                ]}
              />
            </>
          ),
        },
        {
          title: "11. Sikkerhet",
          body: (
            <p>
              All trafikk er kryptert. Bare de som drifter nettsiden har tilgang til opplysningene, og bilder i chatten vises bare for de to i samtalen.
              Leverandørene våre har databehandleravtaler med oss og behandler bare opplysningene på våre vegne.
            </p>
          ),
        },
      ]}
    />
  );
}
