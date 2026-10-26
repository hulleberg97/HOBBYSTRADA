import "server-only";
import { BOOSTS, boostDate, type BoostKey } from "./boosts";
import { COMPANY } from "./company";
import { brandedEmail } from "./email";

/** Bekreftelsen kunden får før løftet aktiveres: tjeneste, pris, hva kunden krysset av for, og angreretten (angrerettloven § 18). */
export function boostConfirmation({ plan, title, amount, orderId, until }: { plan: BoostKey; title: string; amount: number; orderId: string; until: string }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no";
  const p = BOOSTS[plan];
  const intro = `Takk for kjøpet. ${p.name} på «${title}» aktiveres nå og varer til ${boostDate(until)}.`;
  const details = `Dette kjøpte du: ${p.name}, ${p.days} dager, ${amount} kr uten merverdiavgift (${COMPANY.name} er ikke mva-registrert). Betalt med Vipps. Levering startet ${boostDate(new Date().toISOString())}.`;
  const consent = "Ved bestillingen ba du om at løftet skulle starte med en gang, og bekreftet at angreretten går tapt når løftet er levert fullt ut, altså når perioden er over.";
  const withdrawal = `Angrerett: du har 14 dager fra kjøpet. Angrer du før perioden er over, betaler du for dagene som er brukt og får resten tilbake til samme betalingsmåte senest 14 dager etter at vi har fått beskjed. Du angrer med knappen «Angre kjøpet» på kvitteringen, med angreskjemaet (${site}/angreskjema) eller ved å skrive til ${COMPANY.email}.`;
  return {
    subject: `Bekreftelse: ${p.name}`,
    text: `${intro}\n\n${details}\n\n${consent}\n\n${withdrawal}\n\nKvittering: ${site}/kvittering/${orderId}\nSalgsvilkår: ${site}/salgsvilkar`,
    html: brandedEmail({
      title: "Bekreftelse på annonseløft",
      intro,
      quote: `${details}\n\n${consent}\n\n${withdrawal}`,
      button: "Se kvitteringen",
      url: `${site}/kvittering/${orderId}`,
      outro: `Salgsvilkårene finner du på ${site}/salgsvilkar. Ta vare på denne e-posten, den er bekreftelsen på avtalen.`,
    }),
  };
}
