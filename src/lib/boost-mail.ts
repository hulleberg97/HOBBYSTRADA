import "server-only";
import { BOOSTS, type BoostKey } from "./boosts";
import { COMPANY } from "./company";
import { angreDato, angreDatoTekst } from "./angrerett";
import { brandedEmail, type Attachment } from "./email";
import { textPdf, type PdfBlock } from "./pdf";
import { angreskjemaBlocks, plainText, SALGSVILKAR, SALGSVILKAR_UPDATED } from "./salgsvilkar";

const site = () => process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no";
const day = (d: string) => new Date(d).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Oslo" });
const stamp = (d: string) => new Date(d).toLocaleString("nb-NO", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Oslo" });

const toBlocks = (blocks: (string | string[])[]): PdfBlock[] => blocks.map((b) => (Array.isArray(b) ? { items: b.map((i) => plainText(i, site())) } : { text: plainText(b, site()) }));

/** Vedlegg 1: angreskjemaet. Vedlegg 2: salgsvilkårene slik de var da kunden kjøpte. */
export async function receiptAttachments(): Promise<Attachment[]> {
  const angreskjema = await textPdf("Angreskjema", `${COMPANY.name} · annonseløft på hobbystrada.no`, toBlocks(angreskjemaBlocks()));
  const vilkar = await textPdf(
    "Salgsvilkår for annonseløft",
    `${COMPANY.name} · sist oppdatert ${SALGSVILKAR_UPDATED}`,
    SALGSVILKAR.flatMap((s) => [{ heading: s.title }, ...toBlocks(s.blocks)]),
  );
  return [
    { filename: "angreskjema.pdf", content: angreskjema, contentType: "application/pdf" },
    { filename: "salgsvilkar.pdf", content: vilkar, contentType: "application/pdf" },
  ];
}

/**
 * Kvitteringen kunden får på e-post når betalingen er gjennomført, før løftet aktiveres (angrerettloven § 18, ehandelsloven § 12).
 * Alt står i selve e-posten. Angreskjemaet og salgsvilkårene ligger ved som PDF.
 */
export async function boostReceipt({
  plan,
  title,
  amount,
  orderId,
  invoiceNo,
  paidAt,
  until,
}: {
  plan: BoostKey;
  title: string;
  amount: number;
  orderId: string;
  invoiceNo: number | null;
  paidAt: string;
  until: string;
}) {
  const p = BOOSTS[plan];
  const head = `Salgsdokument nr. ${invoiceNo ?? "–"} · ${stamp(paidAt)}\nSelger: ${COMPANY.name}, org.nr. ${COMPANY.orgnr}, ${COMPANY.street}, ${COMPANY.postal}, ${COMPANY.email}, telefon ${COMPANY.phone}`;
  const body = `Pakke: ${p.name}, ${p.days} dager, for annonsen «${title}»\nPeriode: ${day(paidAt)} til ${day(until)}\nPris: ${amount} kr, uten merverdiavgift fordi foretaket ikke er merverdiavgiftsregistrert. Betalt med Vipps.`;
  const withdrawal = `Angrerett: Du har 14 dagers angrerett fra i dag. Du ba om at løftet skulle starte med en gang, og bekreftet at angreretten går tapt når perioden er over. Du kan derfor angre til og med ${angreDatoTekst(angreDato(paidAt, p.days))}. Angrer du før det, betaler du for den delen av perioden som er brukt, og du får resten tilbake innen 14 dager. Du angrer med knappen «Angre avtalen» på kvitteringen under Min side, med angreskjemaet, som ligger vedlagt, eller med en e-post til ${COMPANY.email}.`;
  const closing = "Vilkårene som gjaldt da du kjøpte, ligger vedlagt.";
  return {
    subject: `Kvittering for annonseløft – ${p.name}`,
    text: `Kvittering for annonseløft\n${head}\n\n${body}\n\n${withdrawal}\n\n${closing}\n\nKvittering under Min side: ${site()}/kvittering/${orderId}`,
    html: brandedEmail({
      title: "Kvittering for annonseløft",
      intro: head,
      quote: `${body}\n\n${withdrawal}`,
      button: "Se kvitteringen under Min side",
      url: `${site()}/kvittering/${orderId}`,
      outro: `${closing} Ta vare på denne e-posten, den er bekreftelsen på avtalen.`,
    }),
    attachments: await receiptAttachments(),
  };
}
