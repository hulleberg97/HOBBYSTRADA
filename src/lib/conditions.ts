/** Tilstand på kortet: lagres med den engelske samlerbetegnelsen, vises på norsk med forklaring. */
export const CONDITIONS = [
  { value: "Gem Mint", no: "Feilfri", en: "Gem Mint", hint: "Helt perfekt i alle detaljer: sentrering, hjørner, kanter og overflate. Sjeldent." },
  { value: "Mint", no: "Som ny", en: "Mint", hint: "Perfekt, rett fra pakken. Skarpe hjørner og kanter, ingen riper." },
  { value: "Near Mint / Mint", no: "Nesten som ny", en: "Near Mint", hint: "Knapt synlige merker. Ser ny ut ved første øyekast." },
  { value: "Excellent", no: "Svært god", en: "Excellent", hint: "Litt slitasje på hjørner eller kanter, eller små riper i overflaten." },
  { value: "Very Good", no: "God", en: "Very Good", hint: "Synlig slitasje, runde hjørner eller riper, men ingen bretter." },
  { value: "Brukt", no: "Brukt", en: "Played", hint: "Tydelige skader, som bretter, flekker eller skrift." },
];

/** «Near Mint / Mint» → «Nesten som ny (Near Mint)». Ukjente verdier vises som de er. */
export function conditionLabel(value: string | null | undefined) {
  if (!value) return null;
  const c = CONDITIONS.find((x) => x.value === value || x.en === value);
  return c ? (c.no === c.en ? c.no : `${c.no} (${c.en})`) : value;
}
