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
              <List items={Object.values(BOOSTS).map((b) => `${b.name}: ${formatPrice(b.price)} for ${b.days} dager`)} />
              <p>Alle priser er oppgitt i norske kroner, uten merverdiavgift fordi foretaket ikke er merverdiavgiftsregistrert. Det kommer ingen andre gebyrer i tillegg. Du må være 18 år for å kjøpe annonseløft.</p>
            </>
          ),
        },
        {
          title: "Betaling",
          body: (
            <p>
              Du betaler med Vipps i kassen på siden for annonseløft. Beløpet trekkes når betalingen er godkjent i Vipps. Kvitteringen finner du under Min side, og du kan skrive den ut eller lagre den som PDF. Prisene er uten merverdiavgift, fordi HOBBYSTRADA ikke er registrert i Merverdiavgiftsregisteret.
            </p>
          ),
        },
        {
          title: "Levering",
          body: (
            <p>
              Annonseløft er en digital tjeneste. Løftet aktiveres på annonsen med en gang betalingen er gjennomført, og varer i perioden du har valgt. Du får
              bekreftelse på e-post. Sletter du annonsen eller merker den som solgt før perioden er over, stopper løftet, og resten av perioden refunderes
              ikke.
            </p>
          ),
        },
        {
          title: "Angrerett",
          body: (
            <>
              <p>
                Du har 14 dagers angrerett fra avtalen inngås (angrerettloven § 20). Annonseløft er en tjeneste. Når du bestiller, ber du uttrykkelig om at
                løftet starter med en gang betalingen er gjennomført, og bekrefter at angreretten går tapt når løftet er levert fullt ut, altså når perioden
                er over (angrerettloven §§ 19 og 22 bokstav c).
              </p>
              <p className="mt-3">
                Angrer du før perioden er over, betaler du for den delen av perioden som er brukt, regnet i dager, og får resten tilbake til samme
                betalingsmåte innen 14 dager (angrerettloven § 26). Du angrer ved å sende <Link href="/angreskjema">angreskjemaet</Link> eller en e-post til{" "}
                {COMPANY.email}.
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
              <Link href="/refund-policy">Retur og refusjon</Link>.
            </p>
          ),
        },
        {
          title: "Klager",
          body: (
            <p>
              Er du ikke fornøyd, send oss en melding via <Link href="/contact">kontaktskjemaet</Link> med emnet «Annonseløft og betaling», eller på e-post til{" "}
              {COMPANY.email}. Vi svarer vanligvis innen ett døgn. Kommer vi ikke til enighet, kan du klage til Forbrukerrådet.
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
