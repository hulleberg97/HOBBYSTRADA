import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = { title: "Vilkår", alternates: { canonical: "/vilkar" } };

/**
 * Brukervilkår. Teksten er Låvlis reviderte utkast av 30. oktober 2026, lagt inn ordrett.
 * Avsnittet «Slik sorteres annonsene» lenkes til fra markedet (markedsføringsloven § 8).
 */
export default function TermsPage() {
  const email = <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>;
  return (
    <LegalPage
      title="Brukervilkår for HOBBYSTRADA"
      updated="30. oktober 2026"
      sections={[
        {
          title: "1. Om tjenesten",
          body: (
            <>
              <p>Disse vilkårene gjelder når du bruker HOBBYSTRADA på hobbystrada.no. Les dem før du lager konto, legger ut annonser eller kjøper annonseløft.</p>
              <p className="mt-3">
                HOBBYSTRADA er en annonseplass der private samlere kjøper og selger fotballkort av hverandre. Tjenesteyter er {COMPANY.name}, et
                enkeltpersonforetak registrert i Enhetsregisteret, org.nr. {COMPANY.orgnr}, {COMPANY.street}, {COMPANY.postal}. E-post: {email}. Telefon:{" "}
                {COMPANY.phone}. Foretaket er ikke registrert i Merverdiavgiftsregisteret.
              </p>
              <p className="mt-3">
                HOBBYSTRADA formidler bare kontakt mellom kjøper og selger. Avtalen om kjøp inngås direkte mellom kjøper og selger. HOBBYSTRADA er ikke part i
                handelen, opptrer ikke på vegne av selgeren og er ikke ansvarlig for selgerens forpliktelser. Vi tar ingen provisjon og holder ingen penger.
              </p>
              <p className="mt-3">
                Hvordan vi behandler personopplysninger, står i <Link href="/personvern">personvernerklæringen</Link>.
              </p>
            </>
          ),
        },
        {
          title: "2. Konto",
          body: (
            <>
              <p>
                Du må ha konto for å legge ut annonser, sende meldinger og kjøpe annonseløft. Du logger inn med Vipps. Navnet fra Vipps kan ikke endres på
                nettsiden. Fornavnet ditt vises på annonsene. Hele navnet ditt vises for dem du chatter med.
              </p>
              <p className="mt-3">
                Når du lager konto, krysser du av for at du er minst 18 år, at du godtar disse vilkårene og at du har lest personvernerklæringen. Gir du
                uriktige opplysninger om alder, kan kontoen stenges.
              </p>
              <p className="mt-3">
                Tjenesten er for private samlere. Selger du kort som ledd i næringsvirksomhet, kan du ikke bruke tjenesten. Du må bekrefte at du selger privat
                hver gang du legger ut en annonse.
              </p>
              <p className="mt-3">Ikke la andre bruke kontoen din. Du er ansvarlig for det som gjøres fra kontoen din, med mindre du ikke kunne forhindre det.</p>
              <p className="mt-3">Meldingene skal handle om handel med kort. Trakassering, spam og forsøk på svindel er forbudt.</p>
              <p className="mt-3">«Verifisert med Vipps» betyr bare at brukeren har logget inn med Vipps.</p>
            </>
          ),
        },
        {
          title: "3. Bud og betaling",
          id: "bud-og-betaling",
          body: (
            <>
              <p>Et bud i chatten er et uforpliktende prisforslag. Godtar selgeren budet, får kjøperen en lenke som åpner Vipps med selgeren valgt.</p>
              <p className="mt-3">Kjøper og selger er først bundet av handelen når kjøperen har betalt. Når kjøperen har betalt, kan selgeren ikke selge kortet til andre.</p>
              <p className="mt-3">
                Betalingen skjer direkte mellom kjøper og selger i Vipps, som en privat betaling. HOBBYSTRADA er ikke part i handelen eller betalingen og holder
                ikke penger på vegne av noen. Vipps’ kjøpsbeskyttelse gjelder ikke betalinger mellom privatpersoner.
              </p>
              <p className="mt-3">Blir handelen ikke fulgt opp, kan den andre parten rapportere det.</p>
            </>
          ),
        },
        {
          title: "4. Regler for annonser",
          id: "regler-for-annonser",
          body: (
            <>
              <p>Annonsene dine må følge disse reglene:</p>
              <List
                items={[
                  "Du må eie kortet eller ha rett til å selge det, og kortet må være tilgjengelig.",
                  "Bilder og beskrivelse skal vise kortet slik det faktisk er.",
                  "Bruk egne bilder eller bilder du har rett til å bruke.",
                  "Forfalskninger, reprints uten tydelig merking og stjålne kort er forbudt.",
                  "Lotterier, trekninger, «breaks» o.l. er forbudt.",
                  "Annonsen skal gjelde fotballkort.",
                  "Du kan bare ha én annonse per kort. Lot er tillatt, men du må beskrive antall og type og vise bilde av de mest verdifulle kortene.",
                  "Merk annonsen som solgt eller slett den når kortet er solgt.",
                  "Solgte annonser vises i prisarkivet «Solgte kort» i 12 måneder og slettes deretter.",
                ]}
              />
              <p className="mt-3">
                Vi kan gå gjennom annonser før eller etter at de publiseres. Da sjekker vi om annonsen følger disse reglene. Vi sjekker ikke at kortet er ekte,
                i oppgitt tilstand eller tilgjengelig.
              </p>
            </>
          ),
        },
        {
          title: "5. Rettigheter til innhold",
          body: (
            <p>
              Du beholder rettighetene til bilder og tekst du legger ut. Du gir HOBBYSTRADA rett til å vise, lagre og teknisk tilpasse dem så lenge det trengs
              for å drive tjenesten.
            </p>
          ),
        },
        {
          title: "6. Rapportere annonser og brukere",
          body: (
            <p>
              Du kan rapportere annonser og brukere med knappen «Rapporter» eller på e-post til {email}. Vi behandler rapporter så snart vi kan.
            </p>
          ),
        },
        {
          title: "7. Fjerning av annonser og utestengelse",
          id: "fjerning-av-annonser-og-utestengelse",
          body: (
            <>
              <p>Vi kan avvise eller fjerne annonser og stenge kontoer når vi har grunn til å tro at de bryter vilkårene eller loven.</p>
              <p className="mt-3">
                Ved alvorlige brudd, som svindel eller forsøk på det, trakassering, forfalskninger og stjålne kort, kan kontoen stenges med en gang, uten
                forvarsel. Ved mindre alvorlige brudd fjerner vi normalt annonsen og gir deg en advarsel først.
              </p>
              <p className="mt-3">Du får beskjed om avgjørelsen og begrunnelsen for den.</p>
              <p className="mt-3">
                Ved stenging skjules annonsene dine, og du kan ikke logge inn. Konto og annonser slettes 30 dager etter utestengelsen. Klager du innen fristen,
                slettes de først når klagen er avgjort. Ny konto kan du først opprette etter to år.
              </p>
              <p className="mt-3">
                Mener du at avgjørelsen er feil, kan du klage til {email} innen 30 dager. Får du medhold, legger vi ut annonsen igjen eller åpner kontoen igjen.
              </p>
              <p className="mt-3">Refusjon av annonseløft ved fjerning:</p>
              <List
                items={[
                  "Ved alvorlige eller gjentatte brudd refunderes ikke løftet.",
                  "Ellers refunderes den ubrukte delen av perioden.",
                  "Angreretten innen 14 dager gjelder uansett. Da refunderes ubrukt del.",
                  "Fjerner vi annonsen ved en feil, refunderer vi løftet eller gir deg et nytt.",
                ]}
              />
            </>
          ),
        },
        {
          title: "8. Annonseløft",
          id: "annonseloft",
          body: (
            <>
              <p>
                Annonseløft er en betalt tjeneste fra HOBBYSTRADA. Det gir bedre synlighet i en periode og er merket «Annonseløft». Pakker og priser finner du
                i <Link href="/salgsvilkar">salgsvilkårene</Link>.
              </p>
              <p className="mt-3">
                Du betaler med Vipps, og Vipps’ vilkår gjelder for betalingen. Avtalen om annonseløft inngås med HOBBYSTRADA og følger disse vilkårene og
                salgsvilkårene. Du får bekreftelse på e-post og kvittering under Min side.
              </p>
              <p className="mt-3">
                Du har 14 dagers angrerett etter angrerettloven. Når du bestiller, ber du om at løftet starter straks. Du bekrefter at angreretten går tapt når
                løftet er levert fullt ut. Angrer du før perioden er over, betaler du for den brukte delen og får resten tilbake.
              </p>
              <p className="mt-3">
                Du angrer via «Angre avtalen» på kvitteringen under Min side, via <Link href="/angreskjema">angreskjemaet</Link> eller på e-post. Les mer i{" "}
                <Link href="/salgsvilkar#angrerett">salgsvilkårene under «Angrerett»</Link>.
              </p>
              <p className="mt-3">
                Virker ikke løftet, gi oss beskjed. Vi retter feilen eller forlenger løftet. Hvis ikke, får du et forholdsmessig prisavslag eller pengene
                tilbake. Rettighetene dine etter digitalytelsesloven gjelder uansett.
              </p>
              <p className="mt-3">Avslutter du annonsen selv mens løftet er aktivt, refunderes ikke resten. Unntaket er angrerett innen 14 dager.</p>
            </>
          ),
        },
        {
          title: "9. Slik sorteres annonsene",
          id: "slik-sorteres-annonsene",
          body: (
            <>
              <p id="sortering">
                Annonser med aktivt annonseløft vises først i markedet og i søkeresultatene. Rekkefølgen er Toppannonse, Fremhevet og Topp av listen. Disse er
                merket «Annonseløft». Deretter kommer andre annonser, nyeste først.
              </p>
              <p className="mt-3">Velger du selv å sortere, for eksempel etter pris eller navn, sorteres alle annonser likt, uavhengig av løft.</p>
              <p className="mt-3">
                Forsiden viser annonser med Toppannonse og Fremhevet. I tillegg viser vi annonser vi selv har valgt ut, og de nyeste annonsene. Annonser vi
                selv velger, er ikke betalt for og er ikke merket «Annonseløft».
              </p>
              <p className="mt-3">Prisarkivet «Solgte kort» sorteres etter salgsdato.</p>
              <p className="mt-3">Utenom annonseløft påvirker betaling ikke rekkefølgen.</p>
            </>
          ),
        },
        {
          title: "10. Ansvar mellom kjøper og selger",
          id: "ansvar-mellom-kjoper-og-selger",
          body: (
            <>
              <p>Avtalen er mellom kjøper og selger. De er selv ansvarlige for avtalen, betalingen, frakten og at kortet er som beskrevet.</p>
              <p className="mt-3">
                HOBBYSTRADA er ikke ansvarlig for blant annet at kortet er ekte, i oppgitt tilstand eller at det blir levert. HOBBYSTRADA er heller ikke
                ansvarlig for betaling som ikke kommer frem, tap ved svindel, skade, tap eller forsinkelse i frakt, eller uenighet om pris, retur eller
                reklamasjon.
              </p>
              <p className="mt-3">
                Selgerne er privatpersoner. Forbrukerkjøpsloven og angrerettloven gjelder ikke ved kjøp fra privatperson. Handelen reguleres av kjøpsloven, og
                partene kan avtale andre vilkår.
              </p>
              <p className="mt-3">Svindelråd:</p>
              <List
                items={[
                  "Avtal pris, betaling og levering skriftlig i chatten.",
                  "Be om flere bilder av kortet.",
                  "Vær forsiktig med forskuddsbetaling til ukjente.",
                ]}
              />
              <p className="mt-3">
                Ved mistanke om svindel bør du rapportere og kontakte politiet. Vi fjerner annonser, stenger kontoer og gir opplysninger til politiet når loven
                krever det.
              </p>
            </>
          ),
        },
        {
          title: "11. Ansvar for tjenesten",
          id: "ansvar",
          body: (
            <>
              <p>
                Vi gjør vårt beste for at nettsiden er tilgjengelig og sikker, men vi kan ikke love at den alltid virker uten feil eller avbrudd. Brukerne er
                ansvarlige for innholdet i annonser og meldinger. Vi fjerner ulovlig innhold uten ugrunnet opphold når vi blir klar over det.
              </p>
              <p className="mt-3">Vi er ikke ansvarlige for indirekte tap, som tapt fortjeneste eller tapt handel.</p>
              <p className="mt-3">Vårt samlede ansvar er begrenset til det du har betalt for annonseløft de siste 12 månedene, men minst 1 000 kr.</p>
              <p className="mt-3">
                Begrensningene gjelder ikke ved forsett eller grov uaktsomhet. De begrenser heller ikke rettigheter etter ufravikelig lov, blant annet
                digitalytelsesloven, angrerettloven og personvernreglene.
              </p>
            </>
          ),
        },
        {
          title: "12. Endring, stans og nedleggelse av tjenesten",
          body: (
            <>
              <p>Vi kan endre, legge til eller fjerne funksjoner. Vi kan stanse tjenesten midlertidig, for eksempel ved vedlikehold, feil eller sikkerhetshendelser.</p>
              <p className="mt-3">
                Vi kan legge ned tjenesten. Da varsler vi i rimelig tid før. Legges tjenesten ned mens et annonseløft er aktivt, får du tilbake den delen av
                perioden som ikke er brukt.
              </p>
              <p className="mt-3">Rettighetene dine hvis et kjøpt løft ikke leveres som avtalt, står under «Annonseløft».</p>
            </>
          ),
        },
        {
          title: "13. Sletting av konto",
          body: (
            <p>
              Du kan slette kontoen din når som helst på Min side. Har du ikke logget inn på 24 måneder, sletter vi kontoen. Hva som slettes og hva som
              beholdes, står i <Link href="/personvern">personvernerklæringen</Link>.
            </p>
          ),
        },
        {
          title: "14. Endringer i vilkårene",
          body: (
            <>
              <p>
                Vi varsler vesentlige endringer på e-post og på nettsiden minst 30 dager før de gjelder. Bruker du tjenesten etter det, gjelder de nye
                vilkårene. Godtar du dem ikke, kan du slette kontoen.
              </p>
              <p className="mt-3">Endringene gjelder ikke annonseløft du allerede har kjøpt.</p>
            </>
          ),
        },
        {
          title: "15. Lovvalg og klage",
          body: (
            <p>
              Norsk rett gjelder. Har du en klage, send den til {email}. Kommer vi ikke til enighet, kan du som forbruker klage til Forbrukertilsynet
              (forbrukertilsynet.no), som kan mekle i saken. Fører ikke meklingen fram, kan saken bringes inn for Forbrukerklageutvalget. Tvister kan også
              bringes inn for de alminnelige domstolene.
            </p>
          ),
        },
      ]}
    />
  );
}
