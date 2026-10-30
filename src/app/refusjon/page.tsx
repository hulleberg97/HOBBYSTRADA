import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Refusjon av annonseløft", alternates: { canonical: "/refusjon" } };

export default function RefundPage() {
  return (
    <LegalPage
      title="Refusjon av annonseløft"
      updated="28. oktober 2026"
      sections={[
        {
          title: "Gjelder bare annonseløft",
          body: (
            <p>
              Denne siden gjelder annonseløft, som er den eneste tjenesten HOBBYSTRADA selger. Kort kjøpes direkte fra andre brukere. HOBBYSTRADA er ikke
              part i den handelen, og retur og reklamasjon av kort avtales med selgeren. Se <Link href="/vilkar">vilkårene</Link>.
            </p>
          ),
        },
        {
          title: "Annonseløft",
          body: (
            <p>
              Annonseløft starter med en gang betalingen er gjennomført, fordi du ber om det når du bestiller. Du har likevel 14 dagers angrerett: angrer du
              før perioden er over, betaler du for dagene som er brukt og får resten tilbake innen 14 dager. Når perioden er over, er løftet levert fullt
              ut, og angreretten har gått tapt. Hvis noe gikk galt med betalingen eller løftet ikke ble aktivert, refunderer vi hele beløpet. Fjernet vi
              annonsen ved en feil, refunderer vi løftet eller gir deg et nytt. Sletter du annonsen selv, eller merker den som solgt, refunderes ikke resten
              av perioden. Dette gjelder ikke hvis du bruker angreretten innen 14 dager. Da får du tilbake den delen av perioden som ikke er brukt.
            </p>
          ),
        },
        {
          title: "Slik ber du om refusjon",
          body: <p>Send <Link href="/angreskjema">angreskjemaet</Link> eller en e-post til post@hobbystrada.no, og oppgi gjerne kvitteringsnummeret. Du kan også trykke «Angre avtalen» på kvitteringen under Min side. Pengene kommer tilbake til samme betalingsmåte innen 14 dager.</p>,
        },
      ]}
    />
  );
}
