/**
 * Angrerett for annonseløft (angrerettloven §§ 21 og 26), slik Låvli har definert det:
 * - angredato: det tidligste av slutten av løfteperioden og betalingstidspunktet + 14 døgn.
 * - refusjon regnes i hele timer: pris × (totale timer − brukte timer) / totale timer, rundet opp til hele kroner.
 *   Brukte timer er fulle timer fra løftet startet (betalingen) til meldingen ble mottatt; en påbegynt time telles ikke.
 */
export function angreDato(paidAt: string | Date, days: number) {
  const paid = new Date(paidAt).getTime();
  return new Date(Math.min(paid + days * 864e5, paid + 14 * 864e5));
}

export function refusjon(amount: number, days: number, paidAt: string | Date, at: number | Date = Date.now()) {
  const paid = new Date(paidAt).getTime();
  const now = typeof at === "number" ? at : at.getTime();
  const totalHours = days * 24;
  const usedHours = Math.max(0, Math.min(totalHours, Math.floor((now - paid) / 3600e3)));
  const refund = Math.ceil((amount * (totalHours - usedHours)) / totalHours);
  return { totalHours, usedHours, refund };
}

/** «6. november 2026» */
export function angreDatoTekst(d: Date) {
  return d.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Oslo" });
}
