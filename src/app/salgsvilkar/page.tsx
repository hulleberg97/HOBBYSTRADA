import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, List } from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";
import { BOOSTS } from "@/lib/boosts";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Salgsvilkår" };

/** Salgsvilkår for det HOBBYSTRADA selger selv: annonseløft. Kort selges mellom brukerne og er ikke omfattet. */
export default function SalesTermsPage() {
  return (
    <LegalPage
      title="Salgsvilkår"
      updated="oktober 2026"
      sections={[
        {
          title: "Selger",
          body: (
            <p>
              {COMPANY.name}, org.nr. {COMPANY.orgnr}, {COMPANY.street}, {COMPANY.postal}. E-post: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
              Vilkårene gjelder kjøp av annonseløft på HOBBYSTRADA. Kort i markedet kjøpes direkte fra andre brukere, og den handelen er HOBBYSTRADA ikke part
              i.
            </p>
          ),
        },
        {
          title: "Hva du kjøper",
          body: (
            <>
              <p>Annonseløft gir annonsen din bedre synlighet i en bestemt periode:</p>
              <List
                items={[
                  `${BOOSTS.top.name} (${BOOSTS.top.days} dager): annonsen legges øverst i markedet. Pris: ${formatPrice(BOOSTS.top.price)}.`,
                  `${BOOSTS.featured.name} (${BOOSTS.featured.days} dager): annonsen legges øverst i markedet og får et fremhevet merke. Pris: ${formatPrice(BOOSTS.featured.price)}.`,
                  `${BOOSTS.frontpage.name} (${BOOSTS.frontpage.days} dager): som Fremhevet, og annonsen vises også i kortraden på forsiden. Pris: ${formatPrice(BOOSTS.frontpage.price)}.`,
                ]}
              />
              <p>Alle priser er oppgitt i norske kroner, uten merverdiavgift fordi foretaket ikke er merverdiavgiftsregistrert. Det kommer ingen andre gebyrer i tillegg. Du må være 18 år for å kjøpe annonseløft.</p>
            </>
          ),
        },
        {
          title: "Betaling",
          body: (
            <p>
              Du betaler med Vipps i kassen på siden for annonseløft. Beløpet trekkes når betalingen er godkjent i Vipps. Kvitteringen finner du under Min side, og du kan skrive den ut eller lagre den som PDF.
            </p>
          ),
        },
        {
          title: "Slik bestiller du",
          body: (
            <p>
              Velg annonse og pakke på siden <Link href="/annonseloft">Annonseløft</Link>, kryss av for oppstart, og betal i Vipps. Før du betaler, ser du
              valgt pakke og pris, og kan gå tilbake og endre valget. Avtalen inngås på norsk. Bestillingen og kvitteringen lagres hos oss og er tilgjengelig
              under Min side.
            </p>
          ),
        },
        {
          title: "Levering",
          body: (
            <p>
              Annonseløft er en digital tjeneste. Løftet aktiveres på annonsen med en gang betalingen er gjennomført, og varer i perioden du har valgt. Du får
              bekreftelse på e-post. Sletter du annonsen eller merker den som solgt før perioden er over, stopper løftet, og resten av perioden refunderes
              ikke. Dette gjelder ikke hvis du bruker angreretten innen 14 dager. Da får du tilbake den delen av perioden som ikke er brukt.
            </p>
          ),
        },
        {
          title: "Angrerett",
          body: (
            <>
              <p>
                Du har 14 dagers angrerett fra avtalen inngås (angrerettloven § 21). Annonseløft er en tjeneste. Når du bestiller, ber du uttrykkelig om at
                løftet starter med en gang betalingen er gjennomført, og bekrefter at angreretten går tapt når løftet er levert fullt ut, altså når perioden
                er over (angrerettloven §§ 19 og 22 bokstav c).
              </p>
              <p className="mt-3">
                Angrer du før perioden er over, betaler du for den delen av perioden som er brukt, regnet i dager (angrerettloven § 26). Resten får du
                tilbake til samme betalingsmåte, uten gebyr, senest 14 dager etter at vi har fått beskjed (angrerettloven § 24). Du angrer med knappen «Angre
                kjøpet» på kvitteringen under Min side, ved å sende <Link href="/angreskjema">angreskjemaet</Link>, eller med en e-post til {COMPANY.email}.
                Du får bekreftelse på e-post med en gang vi har mottatt meldingen.
              </p>
            </>
          ),
        },
        {
          title: "Hvis løftet ikke virker",
          body: (
            <p>
              Blir løftet ikke levert som avtalt, gi beskjed til {COMPANY.email}. Vi retter feilen eller forlenger løftet. Lykkes ikke det, får du et
              forholdsmessig prisavslag eller pengene tilbake. Rettighetene dine etter digitalytelsesloven gjelder uansett. Se også{" "}
              <Link href="/refund-policy">Refusjon av annonseløft</Link>.
            </p>
          ),
        },
        {
          title: "Klager",
          body: (
            <p>
              Er du ikke fornøyd, send oss en melding via <Link href="/contact">kontaktskjemaet</Link> med emnet «Annonseløft og betaling», eller på e-post til{" "}
              {COMPANY.email}. Vi svarer så snart vi kan. Kommer vi ikke til enighet, kan du klage til Forbrukerrådet.
            </p>
          ),
        },
        {
          title: "Personopplysninger",
          body: (
            <p>
              Vi behandler bare opplysningene som trengs for å gjennomføre kjøpet. Se <Link href="/privacy">personvernerklæringen</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
