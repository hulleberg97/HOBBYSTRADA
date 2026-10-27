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
      updated="26. oktober 2026"
      sections={[
        {
          title: "1. Om denne erklæringen",
          body: (
            <p>
              Her forklarer vi hvilke personopplysninger HOBBYSTRADA behandler når du bruker nettsiden, hvorfor vi gjør det, hvor lenge vi tar vare på dem og
              hvilke rettigheter du har. Erklæringen gjelder hobbystrada.no. Ved vesentlige endringer gir vi beskjed på nettsiden og på e-post til deg som har
              konto.
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
                  "Navn og e-post.",
                  "Adresse. Vipps sender oss hele adressen din, men vi lagrer bare poststedet. Resten av adressen lagres ikke. Vi henter ikke telefonnummeret ditt.",
                  "En fast ID fra Vipps, så vi kjenner deg igjen neste gang du logger inn.",
                ]}
              />
              <p className="mt-3">Brukernavnet ditt er fornavnet fra Vipps til du velger et annet på Min side. Navnet fra Vipps kan ikke endres.</p>
              <p className="mt-4">Fra deg:</p>
              <List
                items={[
                  "Annonser: kortdata, pris, tilstand, beskrivelse, bilder og sted.",
                  "Meldinger: det du skriver og bildene du sender i chatten med andre brukere.",
                  "Lagrede søk: søkene du vil ha varsel om.",
                  "Henvendelser: navn, e-post og meldingen når du kontakter oss eller rapporterer en annonse.",
                  "Annonseløft: hvilken pakke du kjøper, for hvilken annonse. Selve betalingen skjer i Vipps, og vi ser aldri bank- eller kortopplysningene dine.",
                ]}
              />
              <p className="mt-4">Fra andre brukere:</p>
              <List items={["Rapporter: hvis en annen bruker rapporterer en annonse du har lagt ut, behandler vi rapporten og det den sier om deg og annonsen."]} />
              <p className="mt-4">Automatisk, når du bruker nettsiden:</p>
              <List
                items={[
                  "Informasjonskapsler som holder deg innlogget (se punkt 10).",
                  "IP-adresse når du sender kontaktskjema eller rapporterer en annonse, for å stoppe spam.",
                  "Tekniske logger hos driftsleverandørene våre, Supabase og Vercel (IP-adresse, tidspunkt og hva som ble åpnet eller hentet), for å holde nettsiden trygg og i drift.",
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
                what="Gi deg en konto, logge deg inn med Vipps og vise merket «Verifisert med Vipps». Når du lager konto, bekrefter du at du er minst 18 år."
                data="Navn, e-post, poststed, Vipps-ID, brukernavn og tidspunktet du bekreftet at du er minst 18 år."
                basis="Avtale med deg (art. 6 nr. 1 b)."
                kept="Til du sletter kontoen. Da slettes også koblingen til Vipps og bekreftelsen av alder. Har du ikke logget inn på 23 måneder, får du en e-post om at kontoen slettes om 30 dager. Logger du inn før det, beholder du kontoen. Ellers slettes den etter 24 måneder uten innlogging, på samme måte som når du sletter den selv (se punkt 8)."
              />
              <Purpose
                title="Annonser"
                what="Vise annonsene dine i markedet. Før en annonse vises, går vi gjennom den manuelt. Andre ser brukernavnet ditt, stedet og innholdet i annonsen, aldri navnet eller e-postadressen din."
                data="Annonseinnhold, bilder, brukernavn og sted."
                basis="Avtale med deg (art. 6 nr. 1 b)."
                kept="Til du sletter annonsen eller kontoen. Avviste annonser slettes etter 30 dager."
              />
              <Purpose
                title="Prisarkivet «Solgte kort»"
                what="Vise hva kort har blitt solgt for, så samlere kan vurdere priser. Solgte annonser vises i arkivet med kort, pris, salgsdato og bilder, uten brukernavnet, navnet og stedet ditt."
                data="Kortdata, pris, salgsdato og bilder."
                basis="Berettiget interesse (art. 6 nr. 1 f): å gi samlere et pålitelig prisbilde. Du kan protestere, så fjerner vi annonsen fra arkivet."
                kept="12 måneder etter salget, deretter slettes annonsen automatisk. Sletter du annonsen eller kontoen, forsvinner den fra arkivet med en gang."
              />
              <Purpose
                title="Meldinger mellom brukere"
                what="Formidle meldinger mellom kjøper og selger, og gi deg beskjed på e-post når noen skriver til deg. Den andre parten ser navnet ditt fra Vipps, ikke e-postadressen."
                data="Meldinger, bilder i chatten, navn og e-post (bare til varslingen)."
                basis="Avtale med deg (art. 6 nr. 1 b). Når vi beholder en samtale etter at du har slettet kontoen, er grunnlaget berettiget interesse (art. 6 nr. 1 f): den andre parten har behov for å beholde samtalen, for eksempel som dokumentasjon på hva dere avtalte."
                kept="12 måneder etter siste melding i samtalen. Bilder slettes sammen med samtalen. Sletter du kontoen, blir meldingene og bildene du har sendt stående hos den du har skrevet med, merket «Slettet bruker» i stedet for navnet ditt, til samtalen slettes."
              />
              <Purpose
                title="Gjennomgang av meldinger ved rapport eller mistanke om svindel"
                what="Undersøke rapporter om annonser og mistanke om svindel. Vi leser ikke meldingene deres i andre tilfeller."
                data="Meldinger og bilder i samtaler som gjelder den rapporterte annonsen eller den mistenkte svindelen."
                basis="Berettiget interesse (art. 6 nr. 1 f): å beskytte brukerne mot svindel og holde markedet trygt."
                kept="Vi lager ikke egne kopier. Meldingene slettes etter de vanlige reglene for meldinger."
              />
              <Purpose
                title="Annonseløft og betaling"
                what="Ta betalt for annonseløft gjennom Vipps og aktivere løftet."
                data="Pakke, beløp, tidspunkt, annonsens tittel, navnet ditt og e-postadressen din."
                basis="Avtale med deg (art. 6 nr. 1 b) og bokføringsloven (art. 6 nr. 1 c)."
                kept="5 år etter utløpet av regnskapsåret, som bokføringsloven krever, også om annonsen eller kontoen slettes. Kvitteringen er et salgsdokument som loven krever at oppbevares uendret, så navnet og e-postadressen på den beholdes også etter at du har slettet kontoen."
              />
              <Purpose
                title="Lagrede søk"
                what="Gi deg beskjed på e-post og under Varsler når et nytt kort passer et søk du har lagret."
                data="Søket og e-postadressen din."
                basis="Avtale med deg (art. 6 nr. 1 b). Du kan slette søket når som helst på Min side."
                kept="Til du sletter søket eller kontoen."
              />
              <Purpose
                title="Varsler på nettsiden"
                what="Gi deg beskjed under Varsler når annonsen din blir godkjent eller avvist, når et løft er aktivert eller snart går ut, og når nye kort passer søkene dine."
                data="Hva som skjedde, annonsens tittel og tidspunkt."
                basis="Avtale med deg (art. 6 nr. 1 b)."
                kept="90 dager, eller til du sletter kontoen."
              />
              <Purpose
                title="Henvendelser og rapporter"
                what="Svare deg når du kontakter oss, og behandle rapporter om annonser. Selgeren får ikke vite hvem som har rapportert annonsen, med mindre loven pålegger oss å oppgi det."
                data="Navn, e-post og innholdet i henvendelsen eller rapporten. For rapporter også hvilken annonse det gjelder, og det rapporten sier om selgeren."
                basis="Berettiget interesse (art. 6 nr. 1 f): å kunne svare deg og holde markedet trygt."
                kept="Henvendelser: 12 måneder. Rapporter: 12 måneder etter at de er behandlet."
              />
              <Purpose
                title="Utestengelse"
                what="Stenge ute brukere som bryter brukervilkårene, og hindre at de lager ny konto. Når en bruker stenges ute, sperres kontoen og annonsene skjules. Kontoen og annonsene slettes 30 dager etter utestengelsen. Klager du innen fristen, slettes de først når klagen er avgjort. Slettingen skjer på samme måte som når du sletter kontoen selv. Avgjørelsen tas av et menneske. Du får beskjed på e-post med begrunnelse, og kan klage til post@hobbystrada.no innen 30 dager."
                data="Vipps-ID, konto-ID, tidspunktet for utestengelsen, hvilket vilkår som er brutt, og hvilke annonser som ble skjult (til kontoen er slettet)."
                basis="Berettiget interesse (art. 6 nr. 1 f): å håndheve vilkårene og beskytte brukerne og markedet."
                kept="Vipps-ID-en står på en sperreliste i to år fra utestengelsen og slettes deretter."
              />
              <Purpose
                title="Sikkerhet, svindel og spam"
                what="Stoppe svindel, spam og misbruk av nettsiden."
                data="IP-adresse og tekniske logger."
                basis="Berettiget interesse (art. 6 nr. 1 f): å beskytte brukerne og nettsiden."
                kept="IP-adresse ved kontaktskjema og rapporter: ett døgn. Tekniske logger hos Supabase og Vercel: inntil 7 dager."
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
                  "Andre brukere: brukernavnet ditt, stedet og annonsene dine. I chatten ser den andre parten navnet ditt og det du skriver og sender.",
                  "Vipps MobilePay AS (org.nr. 918 713 867): innlogging og betaling. Vipps er selv ansvarlig for opplysningene de behandler om deg.",
                  "Supabase: database og lagring av bilder (databehandler).",
                  "Vercel: drift av nettsiden (databehandler).",
                  "Domene AS (org.nr. 880 478 982), en norsk leverandør: sending av e-post fra post@hobbystrada.no (databehandler).",
                  "Myndigheter, hvis loven krever det, for eksempel ved etterforskning av svindel.",
                ]}
              />
            </>
          ),
        },
        {
          title: "6. Overføring ut av EU/EØS",
          body: (
            <>
              <p>
                Opplysningene dine lagres og behandles hovedsakelig i EU. Databasen og bildene ligger i Stockholm (Supabase), og nettsiden driftes fra
                Frankfurt (Vercel). E-post sendes via en norsk leverandør.
              </p>
              <p className="mt-3">
                Supabase og Vercel er amerikanske selskaper og kan få tilgang til opplysninger fra USA, for eksempel ved feilsøking og brukerstøtte. Vercels
                nettverk er globalt, så noe trafikk og logging kan skje utenfor EU. Slike overføringer har dette grunnlaget:
              </p>
              <List
                items={[
                  "Vercel er sertifisert under EU–US Data Privacy Framework, som EU-kommisjonen har godkjent som et tilstrekkelig beskyttelsesnivå. Sertifiseringen er offentlig på dataprivacyframework.gov.",
                  "Supabase bruker EUs standardpersonvernbestemmelser (kommisjonsbeslutning 2021/914) i databehandleravtalen med oss. Avtalen finner du på supabase.com/legal/dpa, eller du kan få en kopi ved å skrive til oss.",
                ]}
              />
            </>
          ),
        },
        {
          title: "7. Må du gi oss opplysningene?",
          body: (
            <p>
              Du kan se på annonsene uten å logge inn. For å legge ut kort, chatte eller kjøpe annonseløft må du logge inn med Vipps, fordi vi trenger å vite
              hvem du er for å holde markedet trygt. Uten innlogging kan du ikke bruke disse delene av nettsiden. Du må være minst 18 år for å ha konto, se{" "}
              <Link href="/terms">brukervilkårene</Link>.
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
                  "Sletting: du kan slette kontoen selv på Min side. Da slettes kontoen, annonsene, varslene, de lagrede søkene og koblingen til Vipps. Meldinger og bilder du har sendt i chatten, blir stående hos den du har skrevet med, merket «Slettet bruker», til samtalen slettes (se punkt 4). Betalinger beholder vi uendret så lenge bokføringsloven krever (se punkt 4). Er du stengt ute, beholder vi Vipps-ID-en på sperrelisten i to år.",
                  "Begrensning: du kan be oss begrense bruken av opplysningene, for eksempel mens vi sjekker om de er riktige, eller mens vi vurderer en protest.",
                  "Dataportabilitet: du kan få opplysningene du har gitt oss, i et maskinlesbart format.",
                  "Protestere: der grunnlaget er berettiget interesse, kan du protestere mot behandlingen.",
                  "Klage: du kan klage til Datatilsynet (datatilsynet.no).",
                ]}
              />
              <p className="mt-3">
                Skriv til <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> for å bruke rettighetene dine. Vi svarer uten ugrunnet opphold og senest innen
                én måned. Er henvendelsen omfattende, kan vi forlenge fristen med inntil to måneder. Da får du beskjed innen én måned, med begrunnelse. Vi kan be
                deg bekrefte hvem du er, for eksempel ved å logge inn.
              </p>
            </>
          ),
        },
        {
          title: "9. Automatiserte avgjørelser",
          body: (
            <p>
              Vi tar ingen avgjørelser om deg automatisk, og vi lager ikke profiler av deg. Annonser godkjennes og brukere stenges ute bare etter vurdering av
              et menneske.
            </p>
          ),
        },
        {
          title: "10. Informasjonskapsler og lagring i nettleseren",
          body: (
            <>
              <p>
                Vi bruker bare det som er nødvendig for at nettsiden skal virke, eller som du selv ber om. Vi bruker ikke informasjonskapsler til reklame,
                analyse eller sporing.
              </p>
              <List
                items={[
                  "Innlogging (sb-…-auth-token): holder deg innlogget. Fornyes ved hvert besøk, slettes når du logger ut, og senest 90 dager etter siste besøk.",
                  "Vipps-innlogging (vipps_oidc): en kortvarig kapsel som sikrer innloggingen. Slettes når du er logget inn, og senest etter 10 minutter.",
                  "Favoritter og lukkede varsler: lagres bare i nettleseren din, ikke hos oss. De ligger der til du fjerner dem eller tømmer nettleseren.",
                ]}
              />
              <p className="mt-3">
                Siden vi ikke bruker informasjonskapsler som krever samtykke, har vi ikke noe samtykkeverktøy. Knappen «Om informasjonskapsler»
                nederst på siden viser bare denne informasjonen.
              </p>
            </>
          ),
        },
        {
          title: "11. Sikkerhet",
          body: (
            <p>
              All trafikk er kryptert. Bare driftsansvarlig hos HOBBYSTRADA har tilgang til opplysningene. Meldinger leses bare ved rapport om en annonse eller
              mistanke om svindel (se punkt 4). Bilder i chatten ligger i privat lagring og vises bare for de to i samtalen, via lenker som slutter å virke etter
              ett døgn. Leverandørene våre har databehandleravtaler med oss og behandler bare opplysningene på våre vegne.
            </p>
          ),
        },
      ]}
    />
  );
}
