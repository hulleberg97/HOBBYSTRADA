import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Retur og refusjon" };

export default function RefundPage() {
  return (
    <LegalPage
      title="Retur og refusjon"
      updated="oktober 2026"
      sections={[
        {
          title: "Kjøp av kort",
          body: (
            <p>
              Kort kjøpes direkte fra selgeren. Retur og reklamasjon avtales med selgeren. Handel mellom privatpersoner reguleres av kjøpsloven, ikke
              forbrukerkjøpsloven. Spør selgeren om tilstand og be om bilder før du betaler.
            </p>
          ),
        },
        {
          title: "Annonseløft",
          body: (
            <p>
              Annonseløft starter med en gang betalingen er gjennomført, fordi du ber om det når du bestiller, og regnes som levert i det løftet er aktivert
              på annonsen. Du frasier deg angreretten ved bestilling, så etter aktivering kan kjøpet ikke angres. Hvis noe gikk galt med betalingen eller
              løftet ikke ble aktivert, refunderer vi hele beløpet. Fjernet vi annonsen ved en feil, refunderer vi løftet eller gir deg et nytt.
            </p>
          ),
        },
        {
          title: "Slik ber du om refusjon",
          body: <p>Send oss en melding via kontaktskjemaet med emnet «Annonseløft og betaling», og oppgi hvilken annonse det gjelder.</p>,
        },
      ]}
    />
  );
}
