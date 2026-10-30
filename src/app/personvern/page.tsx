import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = { title: "Personvern", alternates: { canonical: "/personvern" } };

/**
 * Personvernerklæring. Teksten er Låvlis reviderte utkast (andre versjon, 30. oktober 2026), lagt inn ordrett, med én tilføyelse
 * som følger av hvordan nettsiden virker: nettleseren husker hvilke annonser du har åpnet (visningsteller). Meldt til Låvli.
 */
function Purpose({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
      <p className="font-semibold text-slate-950">{title}</p>
      {lines.map((l) => (
        <p key={l} className="mt-1.5 text-sm">
          {l}
        </p>
      ))}
    </div>
  );
}

export default function PrivacyPage() {
  const email = <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>;
  return (
    <LegalPage
      title="Personvernerklæring for hobbystrada.no"
      updated="30. oktober 2026"
      sections={[
        {
          title: "1. Hvem er ansvarlig",
          body: (
            <>
              <p>
                {COMPANY.name}, org.nr. {COMPANY.orgnr}, {COMPANY.street}, {COMPANY.postal}, er ansvarlig for behandlingen av personopplysningene dine på
                hobbystrada.no. Du kan kontakte oss på {email} eller via <Link href="/kontakt">kontaktskjemaet</Link>. Vi har ikke personvernombud.
              </p>
            </>
          ),
        },
        {
          title: "2. Hvilke opplysninger vi behandler, og hvor de kommer fra",
          body: (
            <>
              <p className="font-semibold text-slate-950">2.1 Fra Vipps ved innlogging</p>
              <List items={["navn", "e-post", "telefonnummer", "en fast Vipps-ID"]} />
              <p className="mt-3">
                Telefonnummeret brukes bare i Vipps-lenken kjøperen får etter at selgeren har godtatt et bud. Vi henter ikke adressen. Poststed oppgir du selv
                i annonsen. Fornavnet vises på annonsene, og hele navnet vises for dem du chatter med. Navnet kan ikke endres på nettsiden.
              </p>
              <p className="mt-4 font-semibold text-slate-950">2.2 Fra deg</p>
              <List
                items={[
                  "annonser: kortdata, pris, tilstand, beskrivelse, bilder og sted",
                  "meldinger: tekst og bilder i chatten, inkludert postadressen du sender til selgeren og sendingsnummeret selgeren sender deg",
                  "lagrede søk",
                  "henvendelser: navn, e-post og melding ved kontakt eller rapport",
                  "annonseløft: pakke og annonse. Betalingen skjer i Vipps, og vi ser aldri bank- eller kortopplysninger.",
                ]}
              />
              <p className="mt-4 font-semibold text-slate-950">2.3 Fra andre brukere</p>
              <List items={["rapporter om annonser du har lagt ut"]} />
              <p className="mt-4 font-semibold text-slate-950">2.4 Automatisk</p>
              <List
                items={[
                  "informasjonskapsler som holder deg innlogget",
                  "IP-adresse når du sender kontaktskjema eller rapport, for å stoppe spam",
                  "tekniske logger hos driftsleverandørene Supabase og Vercel: IP-adresse, tidspunkt, og hva som ble åpnet eller hentet",
                ]}
              />
            </>
          ),
        },
        {
          title: "3. Hva vi bruker opplysningene til, grunnlag og lagringstid",
          body: (
            <>
              <p>Grunnlaget er hentet fra personvernforordningen artikkel 6.</p>
              <Purpose
                title="3.1 Konto og innlogging"
                lines={[
                  "Opplysninger: navn, e-post, telefonnummer, Vipps-ID og tidspunktet du bekreftet at du er minst 18 år.",
                  "Grunnlag: avtale (art. 6 nr. 1 b).",
                  "Lagringstid: til kontoen slettes. Kontoer uten innlogging i 24 måneder slettes.",
                ]}
              />
              <Purpose
                title="3.2 Annonser"
                lines={[
                  "Opplysninger: annonseinnhold, bilder, fornavn og sted. Andre ser fornavn, sted og innhold, aldri e-post.",
                  "Annonser kan bli gjennomgått før eller etter at de publiseres.",
                  "Grunnlag: avtale.",
                  "Lagringstid: til du sletter annonsen eller kontoen. Avviste annonser slettes etter 35 dager.",
                ]}
              />
              <Purpose
                title="3.3 Prisarkivet «Solgte kort»"
                lines={[
                  "Opplysninger: kortdata, pris, salgsdato og bilder, uten navn og sted.",
                  "Grunnlag: berettiget interesse (art. 6 nr. 1 f), for å gi samlere et prisbilde. Du kan protestere, og da fjerner vi annonsen fra arkivet.",
                  "Lagringstid: 12 måneder etter salget. Opplysningene forsvinner straks hvis du sletter annonsen eller kontoen.",
                ]}
              />
              <Purpose
                title="3.4 Meldinger mellom brukere"
                lines={[
                  "Opplysninger og formål: vi formidler meldinger og bud, og sender e-postvarsel når noen skriver eller svarer på bud. Motparten ser navnet fra Vipps, ikke e-posten din.",
                  "Godtar selgeren et bud, får kjøperen en Vipps-lenke med selgerens telefonnummer. Betalingen går ikke gjennom HOBBYSTRADA.",
                  "Grunnlag: avtale. Når samtalen beholdes etter at du har slettet kontoen: berettiget interesse, fordi motparten har behov for dokumentasjon på hva dere avtalte.",
                  "Lagringstid: 12 måneder etter siste melding. Bilder slettes med samtalen. Sletter du kontoen, blir meldingene stående hos motparten merket «Slettet bruker» til samtalen slettes.",
                ]}
              />
              <Purpose
                title="3.5 Gjennomgang av meldinger"
                lines={[
                  "Vi leser meldinger bare når en annonse eller bruker er rapportert, ved mistanke om svindel eller misbruk, når du selv ber oss hjelpe deg med en bestemt samtale, eller når loven krever det.",
                  "Grunnlag: berettiget interesse, for å beskytte brukerne mot svindel og holde markedet trygt. Når du ber om hjelp: avtale. Når loven krever det: rettslig forpliktelse (art. 6 nr. 1 c).",
                  "Lagringstid: som for meldinger mellom brukere.",
                ]}
              />
              <Purpose
                title="3.6 Annonseløft og betaling"
                lines={[
                  "Opplysninger: pakke, beløp, tidspunkt, annonsens tittel, navn, e-post og tidspunktene du krysset av for at løftet skal starte straks og at angreretten går tapt.",
                  "Grunnlag: avtale og bokføringsloven (art. 6 nr. 1 c).",
                  "Lagringstid: 5 år etter utløpet av regnskapsåret, som bokføringsloven krever. Dette gjelder også om annonsen eller kontoen slettes. Kvitteringen er et salgsdokument som skal oppbevares uendret, så navn og e-post på den beholdes.",
                ]}
              />
              <Purpose title="3.7 Lagrede søk" lines={["Opplysninger: søket og e-postadressen.", "Grunnlag: avtale.", "Lagringstid: til du sletter søket eller kontoen."]} />
              <Purpose
                title="3.8 Varsler på nettsiden"
                lines={["Opplysninger: hva som skjedde, annonsens tittel og tidspunkt.", "Grunnlag: avtale.", "Lagringstid: 90 dager, eller til kontoen slettes."]}
              />
              <Purpose
                title="3.9 Henvendelser og rapporter"
                lines={[
                  "Opplysninger: navn, e-post og innhold. For rapporter også hvilken annonse det gjelder, og hva rapporten sier om selgeren.",
                  "Selgeren får ikke vite hvem som har rapportert, med mindre loven pålegger oss å oppgi det.",
                  "Grunnlag: berettiget interesse, for å svare deg og holde markedet trygt.",
                  "Lagringstid: henvendelser 12 måneder. Rapporter 12 måneder etter at de er behandlet.",
                ]}
              />
              <Purpose
                title="3.10 Utestengelse"
                lines={[
                  "Opplysninger: Vipps-ID, konto-ID, tidspunkt, hvilket vilkår som er brutt, og hvilke annonser som ble skjult.",
                  "Kontoen sperres og annonsene skjules. Kontoen og annonsene slettes 30 dager etter utestengelsen, eller når klagen er avgjort hvis du har klaget innen fristen.",
                  `Avgjørelsen tas ikke bare automatisk. Du får begrunnelse og kan klage til ${COMPANY.email} innen 30 dager.`,
                  "Grunnlag: berettiget interesse, for å håndheve vilkårene og beskytte brukerne og markedet.",
                  "Lagringstid: Vipps-ID står på sperreliste i to år.",
                ]}
              />
              <Purpose
                title="3.11 Sikkerhet, svindel og spam"
                lines={[
                  "Opplysninger: IP-adresse og tekniske logger.",
                  "Grunnlag: berettiget interesse.",
                  "Lagringstid: IP-adresse ved kontaktskjema og rapporter inntil ett døgn. Tekniske logger hos Supabase og Vercel inntil 7 dager.",
                ]}
              />
              <p className="mt-4">Der grunnlaget er berettiget interesse, har vi vurdert at interessen vår ikke veier tyngre enn personvernet ditt.</p>
            </>
          ),
        },
        {
          title: "4. Hvem vi deler opplysningene med",
          body: (
            <>
              <p>Opplysningene deles med:</p>
              <List
                items={[
                  "andre brukere: fornavn, sted og annonser. I chatten deles hele navnet og det du skriver og sender.",
                  "Vipps MobilePay AS (org.nr. 918 713 867), for innlogging og betaling. Vipps er selvstendig behandlingsansvarlig for sine opplysninger.",
                  "Supabase, for database og bildelagring (databehandler).",
                  "Vercel, for drift av nettsiden (databehandler).",
                  `Domene AS (org.nr. 880 478 982), norsk leverandør, for sending av e-post fra ${COMPANY.email} (databehandler).`,
                  "myndigheter, når loven krever det, for eksempel ved etterforskning av svindel.",
                ]}
              />
              <p className="mt-3">Supabase, Vercel og Domene AS har databehandleravtaler med oss og behandler opplysningene bare på våre vegne.</p>
            </>
          ),
        },
        {
          title: "5. Overføring ut av EU/EØS",
          body: (
            <>
              <p>
                Opplysningene lagres og behandles hovedsakelig i EU. Database og bilder ligger i Stockholm (Supabase), og nettsiden driftes fra Frankfurt
                (Vercel). E-post går via en norsk leverandør.
              </p>
              <p className="mt-3">
                Supabase og Vercel er amerikanske selskaper og kan få tilgang fra USA, for eksempel ved feilsøking og brukerstøtte. Vercels nettverk er globalt,
                så noe trafikk og logging kan skje utenfor EU.
              </p>
              <p className="mt-3">Grunnlaget for overføringen er følgende:</p>
              <List
                items={[
                  "Vercel er sertifisert under EU–US Data Privacy Framework, som EU-kommisjonen har godkjent som et tilstrekkelig beskyttelsesnivå. Sertifiseringen er offentlig på dataprivacyframework.gov.",
                  "Supabase bruker EUs standardpersonvernbestemmelser (kommisjonsbeslutning 2021/914) i databehandleravtalen. Avtalen finner du på supabase.com/legal/dpa, eller du kan få en kopi ved å skrive til oss.",
                ]}
              />
            </>
          ),
        },
        {
          title: "6. Må du gi oss opplysningene?",
          body: (
            <>
              <p>
                Du kan se annonser uten å logge inn. For å legge ut kort, chatte eller kjøpe annonseløft må du logge inn med Vipps. Vi må vite hvem du er for å
                holde markedet trygt. Uten innlogging kan du ikke bruke disse delene.
              </p>
              <p className="mt-3">
                Du må være minst 18 år. Se <Link href="/vilkar">vilkårene</Link>.
              </p>
            </>
          ),
        },
        {
          title: "7. Dine rettigheter",
          body: (
            <>
              <p>Du har rett til:</p>
              <List
                items={[
                  "innsyn og kopi av opplysningene om deg",
                  "retting av uriktige opplysninger",
                  "sletting. Du kan slette kontoen selv på Min side. Da slettes kontoen, annonsene, varslene, de lagrede søkene og koblingen til Vipps. Meldinger blir stående hos motparten som «Slettet bruker» til samtalen slettes. Betalinger beholdes uendret så lenge bokføringsloven krever det. Ved utestengelse beholdes Vipps-ID på sperreliste i to år.",
                  "begrensning av behandlingen",
                  "dataportabilitet",
                  "protest der grunnlaget er berettiget interesse",
                  "klage til Datatilsynet (datatilsynet.no)",
                ]}
              />
              <p className="mt-3">
                Skriv til {email} for å bruke rettighetene dine. Vi svarer uten ugrunnet opphold og senest innen én måned. Ved omfattende henvendelser kan
                fristen forlenges med inntil to måneder. Da får du beskjed innen én måned, med begrunnelse. Vi kan be deg bekrefte hvem du er, for eksempel
                ved å logge inn.
              </p>
            </>
          ),
        },
        {
          title: "8. Automatiserte avgjørelser",
          body: (
            <>
              <p>Vi tar ikke avgjørelser som har rettslig virkning for deg, eller som på tilsvarende måte påvirker deg i betydelig grad, bare automatisk.</p>
            </>
          ),
        },
        {
          title: "9. Informasjonskapsler og lagring i nettleseren",
          id: "informasjonskapsler",
          body: (
            <>
              <p>
                Vi bruker bare det som trengs for at nettsiden skal virke, eller det du selv ber om. Vi bruker ingen informasjonskapsler for reklame, analyse
                eller sporing.
              </p>
              <List
                items={[
                  "Innlogging: holder deg innlogget. Slettes når du logger ut, og senest 90 dager etter siste besøk.",
                  "Vipps-innlogging: en kortvarig informasjonskapsel som sikrer innloggingen. Slettes når du er logget inn, og senest etter 10 minutter.",
                  "Favoritter, lukkede varsler og hvilke annonser du har åpnet (så en annonse teller én visning per person): lagres bare i nettleseren din, ikke hos oss, til du fjerner dem eller tømmer nettleseren.",
                ]}
              />
              <p className="mt-3">
                Vi bruker ikke informasjonskapsler som krever samtykke, og har derfor ikke noe samtykkeverktøy. Knappen «Om informasjonskapsler» nederst på
                siden viser denne informasjonen.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
