import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = { title: "Vilkår" };

/** Brukervilkår. Gjennomgått juridisk oktober 2026. Avsnittet «Slik sorteres annonsene» lenkes til fra markedet (markedsføringsloven § 8). */
export default function TermsPage() {
  return (
    <LegalPage
      title="Vilkår for bruk"
      updated="29. oktober 2026"
      sections={[
        {
          title: "Om tjenesten",
          body: (
            <>
              <p>
                HOBBYSTRADA drives av {COMPANY.name}, et enkeltpersonforetak registrert i Enhetsregisteret med org.nr. {COMPANY.orgnr}, {COMPANY.street},{" "}
                {COMPANY.postal}, e-post <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>, telefon {COMPANY.phone}. Foretaket er ikke registrert i Merverdiavgiftsregisteret.
              </p>
              <p className="mt-3">
                HOBBYSTRADA er en annonseplass der samlere kjøper og selger fotballkort av hverandre. Vi formidler bare kontakt mellom kjøper og selger.
                Avtalen om kjøp inngås direkte mellom kjøper og selger. HOBBYSTRADA er ikke part i avtalen, opptrer ikke på vegne av selgeren og er ikke
                ansvarlig for selgerens forpliktelser.
              </p>
              <p className="mt-3">
                Ved å opprette konto godtar du disse vilkårene. Hvordan vi behandler personopplysninger, står i{" "}
                <Link href="/personvern">personvernerklæringen</Link>.
              </p>
            </>
          ),
        },
        {
          title: "Konto",
          body: (
            <>
              <p>
                Du må ha en konto for å legge ut annonser, sende meldinger og kjøpe annonseløft. Du logger inn med Vipps. Navnet fra Vipps kan ikke endres
                på nettsiden. Fornavnet ditt vises på annonsene, og hele navnet vises for dem du chatter med, så kjøper og selger vet hvem de handler med.
              </p>
              <p className="mt-3">
                Du må være minst 18 år for å ha konto. Når du lager konto, bekrefter du at du er minst 18 år. Gir du uriktige opplysninger om alder,
                kan kontoen stenges.
              </p>
              <p className="mt-3">
                HOBBYSTRADA er for private samlere. Selger du kort som ledd i næringsvirksomhet, kan du ikke bruke tjenesten.
              </p>
              <p className="mt-3">
                Du skal ikke la andre bruke kontoen din. Du er ansvarlig for det som gjøres fra kontoen din, med mindre du ikke kunne forhindre det.
              </p>
              <p className="mt-3">
                Meldinger skal handle om handel med kort. Trakassering, spam og forsøk på svindel er forbudt og kan føre til at annonser fjernes og kontoen
                stenges (se «Fjerning av annonser og utestengelse»).
              </p>
              <p className="mt-3">
                Merket «Verifisert med Vipps» betyr bare at brukeren har logget inn med Vipps.
              </p>
              <p className="mt-3">
                <strong>Bud.</strong> Et bud i chatten er et tilbud fra kjøperen til selgeren. Godtar selgeren budet, er det inngått en avtale mellom dem.
                Kjøperen får da en lenke som åpner Vipps med selgeren valgt. Betalingen skjer direkte mellom kjøper og
                selger. HOBBYSTRADA er ikke part i avtalen eller betalingen, og holder ikke penger på vegne av noen. Blir avtalen ikke fulgt opp, kan den
                andre parten rapportere det (se «Rapportere annonser og brukere»).
              </p>
            </>
          ),
        },
        {
          title: "Regler for annonser",
          body: (
            <>
              <List
                items={[
                  "Du må eie kortet du selger, eller ha rett til å selge det, og kortet må være tilgjengelig.",
                  "Bilder og beskrivelse skal vise kortet slik det faktisk er, med skader og tilstand. Bruk egne bilder, eller bilder du har rett til å bruke.",
                  "Forfalskninger, kopier (reprints) uten tydelig merking og stjålne kort er forbudt.",
                  "Lotterier, trekninger, «breaks» og lignende, der kjøperen betaler for en sjanse til å få bestemte kort, er forbudt.",
                  "Annonsen skal gjelde fotballkort.",
                  "Én annonse per kort. Ikke legg ut samme kort flere ganger. Du kan selge flere kort samlet i én annonse (lot). Da må beskrivelsen si hvor mange kort som er med og hva slags kort det er, og de mest verdifulle kortene skal vises på bilde.",
                  "Merk annonsen som solgt, eller slett den, når kortet er solgt. Solgte annonser vises i prisarkivet «Solgte kort» i 12 måneder og slettes deretter.",
                ]}
              />
              <p className="mt-3">
                Vi går gjennom annonser før de vises. Da sjekker vi at annonsen følger disse reglene. Vi sjekker ikke at kortet er ekte, i oppgitt tilstand
                eller tilgjengelig.
              </p>
              <p className="mt-3">
                Du beholder rettighetene til bildene og teksten du legger ut. Du gir HOBBYSTRADA rett til å vise og lagre dem, og til å tilpasse dem teknisk,
                for eksempel endre størrelsen, så lenge det trengs for å drive tjenesten.
              </p>
            </>
          ),
        },
        {
          title: "Rapportere annonser og brukere",
          body: (
            <p>
              Mener du at en annonse eller en bruker bryter vilkårene eller loven, kan du rapportere det med knappen «Rapporter» på annonsen eller på e-post
              til {COMPANY.email}. Vi behandler rapporter så snart vi kan. Selgeren får ikke vite hvem som har rapportert.
            </p>
          ),
        },
        {
          title: "Fjerning av annonser og utestengelse",
          body: (
            <>
              <p>Vi kan avvise eller fjerne annonser og stenge kontoer som bryter vilkårene eller loven.</p>
              <List
                items={[
                  "Ved alvorlige brudd kan vi stenge kontoen straks, uten forvarsel. Alvorlige brudd er for eksempel svindel eller forsøk på svindel, trakassering, eller salg av forfalskninger eller stjålne kort.",
                  "Ved mindre alvorlige brudd fjerner vi normalt annonsen og gir deg en advarsel først.",
                ]}
              />
              <p className="mt-3">
                Når vi avviser eller fjerner en annonse eller stenger en konto, får du beskjed på e-post om hva vi har gjort, hvilket vilkår det gjelder, og
                hvorfor. Avgjørelsen tas av et menneske.
              </p>
              <p className="mt-3">
                Når kontoen stenges, skjules annonsene dine, og du kan ikke logge inn. Kontoen og annonsene slettes 30 dager etter utestengelsen. Klager du
                innen fristen, slettes de først når klagen er avgjort. Du kan ikke lage ny konto før det har gått to år.
              </p>
              <p className="mt-3">
                Mener du at avgjørelsen er feil, kan du klage til {COMPANY.email} innen 30 dager. Vi svarer innen én måned. Får du medhold, legger vi ut
                annonsen igjen eller åpner kontoen igjen.
              </p>
              <p className="mt-3">
                Fjernes en annonse med aktivt annonseløft fordi den bryter vilkårene, får du ikke refundert løftet ved alvorlige eller gjentatte brudd. Ellers
                refunderer vi den delen av perioden som ikke er brukt. Dette gjelder ikke hvis du bruker angreretten innen 14 dager. Da får du tilbake den
                delen av perioden som ikke er brukt. Fjernet vi annonsen ved en feil, refunderer vi løftet eller gir deg et nytt.
              </p>
            </>
          ),
        },
        {
          title: "Annonseløft",
          body: (
            <>
              <p>
                <strong>Hva du kjøper.</strong> Annonseløft er en betalt tjeneste som HOBBYSTRADA selger. Et løft gir annonsen bedre synlighet i en bestemt
                periode, og annonsen merkes «Annonseløft». Hva hver pakke inneholder og koster, står i <Link href="/salgsvilkar">salgsvilkårene</Link>.
              </p>
              <p className="mt-3">
                <strong>Betaling.</strong> Du betaler med Vipps. Vilkårene til Vipps gjelder selve betalingen. Avtalen om annonseløft inngås med HOBBYSTRADA og
                følger disse vilkårene og <Link href="/salgsvilkar">salgsvilkårene</Link>. Du får bekreftelse på e-post, og kvitteringen ligger under Min side.
              </p>
              <p className="mt-3">
                <strong>Angrerett.</strong> Du har 14 dagers angrerett etter angrerettloven. Når du bestiller, kan du be om at løftet starter med en gang
                betalingen er gjennomført. Da bekrefter du samtidig at angreretten går tapt når løftet er levert fullt ut, altså når perioden er over. Angrer
                du før perioden er over, betaler du for den delen av perioden som er brukt, og får resten tilbake. Du angrer med knappen «Angre avtalen» på kvitteringen under Min side, ved å sende{" "}
                <Link href="/angreskjema">angreskjemaet</Link>, eller med en e-post til {COMPANY.email}.
              </p>
              <p className="mt-3">
                <strong>Hvis løftet ikke virker.</strong> Blir løftet ikke levert som avtalt, gi beskjed til {COMPANY.email}. Vi retter feilen eller
                forlenger løftet. Lykkes ikke det, får du et forholdsmessig prisavslag eller pengene tilbake. Rettighetene dine etter digitalytelsesloven
                gjelder uansett.
              </p>
              <p className="mt-3">
                <strong>Hvis du avslutter annonsen selv.</strong> Sletter du annonsen eller merker den som solgt mens løftet er aktivt, får du ikke refundert
                resten av perioden. Dette gjelder ikke hvis du bruker angreretten innen 14 dager. Da får du tilbake den delen av perioden som ikke er brukt.
              </p>
            </>
          ),
        },
        {
          title: "Slik sorteres annonsene",
          id: "slik-sorteres-annonsene",
          body: (
            <p id="sortering">
              Annonser med aktivt annonseløft vises øverst i markedet og i søkeresultatene, i rekkefølgen Toppannonse, Fremhevet og Topp av listen, og er
              merket «Annonseløft». Deretter kommer de andre annonsene, nyeste først. Velger du selv å sortere etter pris eller navn, sorteres alle annonser
              likt, uavhengig av løft. Forsiden viser toppannonser først, deretter fremhevede annonser, og til slutt de nyeste annonsene når det er plass. Annonsene på forsiden glir sakte bortover, så alle kortene passerer midten etter tur. Er det få annonser, kan vi selv feste annonser fra andre brukere på forsiden. Festede annonser er merket «Valgt av HOBBYSTRADA», ikke «Annonseløft»,
              og selgeren betaler ikke for plasseringen. Prisarkivet «Solgte kort» sorteres etter salgsdato. Bortsett fra annonseløft påvirker betaling ikke rekkefølgen.
            </p>
          ),
        },
        {
          title: "Ansvar mellom kjøper og selger",
          id: "ansvar-mellom-kjoper-og-selger",
          body: (
            <>
              <p>
                Avtalen om kjøp er mellom kjøper og selger. De er selv ansvarlige for avtalen, betalingen, frakten og at kortet er som beskrevet. HOBBYSTRADA
                er ikke part i handelen og er derfor blant annet ikke ansvarlig for:
              </p>
              <List
                items={[
                  "at kortet er ekte, i oppgitt tilstand eller blir levert",
                  "betaling som ikke kommer frem, eller tap ved svindel",
                  "skade, tap eller forsinkelse i frakt",
                  "uenighet om pris, retur eller reklamasjon",
                ]}
              />
              <p className="mt-3">
                Selgerne på HOBBYSTRADA er privatpersoner. Kjøper du fra en privatperson, gjelder ikke forbrukerrettighetene, for eksempel etter
                forbrukerkjøpsloven og angrerettloven. Handelen reguleres da av kjøpsloven, og kjøper og selger kan avtale andre vilkår. Uenighet løses mellom
                kjøper og selger.
              </p>
              <p className="mt-3">
                <strong>Beskytt deg mot svindel:</strong> Avtal pris, betaling og levering skriftlig i chatten. Be om flere bilder av kortet hvis du er
                usikker. Vær forsiktig med å betale på forskudd til noen du ikke kjenner.
              </p>
              <p className="mt-3">
                Mistenker du svindel, rapporter annonsen eller brukeren og kontakt politiet. Vi fjerner annonser og stenger kontoer som bryter vilkårene, og
                gir opplysninger til politiet når loven krever det.
              </p>
            </>
          ),
        },
        {
          title: "Ansvar for tjenesten",
          body: (
            <>
              <p>
                Vi gjør vårt beste for at nettsiden er tilgjengelig og sikker, men vi kan ikke love at den alltid virker uten feil eller avbrudd. Brukerne er
                ansvarlige for innholdet i annonser og meldinger. Vi fjerner ulovlig innhold uten ugrunnet opphold når vi blir klar over det.
              </p>
              <p className="mt-3">
                Vi er ikke ansvarlige for indirekte tap, som tapt fortjeneste eller tapt handel. Vårt samlede ansvar overfor deg er begrenset til det du har
                betalt for annonseløft de siste 12 månedene, men minst 1 000 kr. Begrensningene gjelder ikke hvis vi har opptrådt forsettlig eller grovt
                uaktsomt. De begrenser heller ikke rettighetene du har etter ufravikelig lov, blant annet digitalytelsesloven, angrerettloven og
                personvernreglene.
              </p>
            </>
          ),
        },
        {
          title: "Sletting av konto",
          body: (
            <p>
              Du kan slette kontoen din når som helst på Min side. Har du ikke logget inn på 24 måneder, sletter vi kontoen. Du får varsel på e-post 30 dager
              før. Hva som slettes, og hva vi må beholde, står i <Link href="/personvern">personvernerklæringen</Link>.
            </p>
          ),
        },
        {
          title: "Endringer i vilkårene",
          body: (
            <p>
              Vi kan endre vilkårene. Vesentlige endringer varsler vi på e-post og på nettsiden minst 30 dager før de gjelder. Bruker du tjenesten etter det,
              gjelder de nye vilkårene. Godtar du dem ikke, kan du slette kontoen. Endringer gjelder ikke annonseløft du allerede har kjøpt.
            </p>
          ),
        },
        {
          title: "Lovvalg og klage",
          body: (
            <p>
              Vilkårene reguleres av norsk rett. Har du en klage på HOBBYSTRADA eller et annonseløft, kontakt {COMPANY.email}. Kommer vi ikke til enighet, kan
              du som forbruker få hjelp av Forbrukerrådet (forbrukerradet.no). Tvister kan også bringes inn for de alminnelige domstolene.
            </p>
          ),
        },
      ]}
    />
  );
}
