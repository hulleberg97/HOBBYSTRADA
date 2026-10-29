/**
 * Lenke som åpner Vipps-appen med mottakeren ferdig valgt (Vipps' personlige QR-format).
 * Pengene går direkte fra kjøper til selger. HOBBYSTRADA er ikke involvert i betalingen.
 */
export function vippsPayLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const full = digits.length === 8 ? `47${digits}` : digits;
  return `https://qr.vipps.no/28/2/01/031/${full}?v=1`;
}
