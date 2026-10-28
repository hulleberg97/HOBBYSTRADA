import { BOOSTS } from "./boosts";
import { COMPANY } from "./company";

/**
 * Salgsvilkårene for annonseløft som data, så nettsiden og PDF-vedlegget i kvitteringen alltid har samme tekst.
 * Lenker skrives [tekst](/sti), uthevet tekst **slik**. Et avsnitt er en streng, en punktliste er en liste av strenger.
 */
export const SALGSVILKAR_UPDATED = "28. oktober 2026";

export type SalesSection = { title: string; blocks: (string | string[])[] };

export const SALGSVILKAR: SalesSection[] = [
  {
    title: "Selger",
    blocks: [
      `${COMPANY.name}, org.nr. ${COMPANY.orgnr}, ${COMPANY.street}, ${COMPANY.postal}. E-post: ${COMPANY.email}. Telefon: ${COMPANY.phone}. Vilkårene gjelder kjøp av annonseløft på HOBBYSTRADA. Kort i markedet kjøpes direkte fra andre brukere, og den handelen er HOBBYSTRADA ikke part i.`,
    ],
  },
  {
    title: "Hva du kjøper",
    blocks: [
      "Annonseløft gir annonsen bedre synlighet i en bestemt periode. Perioden starter når løftet aktiveres. Løftet er et engangskjøp og fornyes ikke automatisk. Annonser med løft er merket «Annonseløft».",
      [
        `**${BOOSTS.top.name}, ${BOOSTS.top.days} dager, ${BOOSTS.top.price} kr:** Annonsen vises foran vanlige annonser i markedet og i søkeresultatene. Den kan også vises i kortraden på forsiden når det er ledig plass etter toppannonser og fremhevede annonser.`,
        `**${BOOSTS.featured.name}, ${BOOSTS.featured.days} dager, ${BOOSTS.featured.price} kr:** Annonsen får gullmerke og gullramme og vises foran annonser med Topp av listen og vanlige annonser. Den kan også vises i kortraden på forsiden når det er ledig plass etter toppannonser.`,
        `**${BOOSTS.frontpage.name}, ${BOOSTS.frontpage.days} dager, ${BOOSTS.frontpage.price} kr:** Annonsen får gullmerke og gullramme, vises først i markedet og i søkeresultatene, og har fast plass i kortraden på forsiden hele perioden.`,
      ],
      "Sorterer kjøperen selv etter pris eller navn, sorteres alle annonser likt, uten hensyn til løft.",
      "Alle priser er i norske kroner og uten merverdiavgift, fordi foretaket ikke er merverdiavgiftsregistrert. Det kommer ingen andre gebyrer i tillegg. Du må være 18 år for å kjøpe annonseløft.",
    ],
  },
  {
    title: "Betaling",
    blocks: [
      "Du betaler med Vipps i kassen på siden for annonseløft. Beløpet trekkes når betalingen er godkjent i Vipps. Kvitteringen finner du under Min side, og du kan skrive den ut eller lagre den som PDF.",
    ],
  },
  {
    title: "Slik bestiller du",
    blocks: [
      "Velg annonse og pakke på siden [Annonseløft](/annonseloft), kryss av for oppstart, og betal i Vipps. Før du betaler, ser du valgt pakke og pris, og kan gå tilbake og endre valget. Avtalen inngås på norsk. Bestillingen og kvitteringen lagres hos oss og er tilgjengelig under Min side.",
    ],
  },
  {
    title: "Levering",
    blocks: [
      "Annonseløft er en digital tjeneste. Løftet aktiveres på annonsen med en gang betalingen er gjennomført, og varer i perioden du har valgt. Du får bekreftelse på e-post. Sletter du annonsen eller merker den som solgt før perioden er over, stopper løftet, og resten av perioden refunderes ikke. Dette gjelder ikke hvis du bruker angreretten innen 14 dager. Da får du tilbake den delen av perioden som ikke er brukt.",
    ],
  },
  {
    title: "Angrerett",
    blocks: [
      "Du har 14 dagers angrerett fra avtalen inngås (angrerettloven § 21). Annonseløft er en tjeneste. Når du bestiller, ber du uttrykkelig om at løftet starter med en gang betalingen er gjennomført, og bekrefter at angreretten går tapt når løftet er levert fullt ut, altså når perioden er over (angrerettloven §§ 19 og 22 bokstav c).",
      `Angrer du før perioden er over, betaler du for den delen av perioden som er brukt, regnet i dager (angrerettloven § 26). Resten får du tilbake til samme betalingsmåte, uten gebyr, senest 14 dager etter at vi har fått beskjed (angrerettloven § 24). Du angrer med knappen «Angre avtalen» på kvitteringen under Min side, ved å sende [angreskjemaet](/angreskjema), eller med en e-post til ${COMPANY.email}. Du får bekreftelse på e-post med en gang vi har mottatt meldingen.`,
    ],
  },
  {
    title: "Hvis løftet ikke virker",
    blocks: [
      `Blir løftet ikke levert som avtalt, gi beskjed til ${COMPANY.email}. Vi retter feilen eller forlenger løftet. Lykkes ikke det, får du et forholdsmessig prisavslag eller pengene tilbake. Rettighetene dine etter digitalytelsesloven gjelder uansett. Se også [Refusjon av annonseløft](/refusjon).`,
    ],
  },
  {
    title: "Klager",
    blocks: [
      `Er du ikke fornøyd, send oss en melding via [kontaktskjemaet](/kontakt) med emnet «Annonseløft og betaling», eller på e-post til ${COMPANY.email}. Vi svarer så snart vi kan. Kommer vi ikke til enighet, kan du klage til Forbrukerrådet.`,
    ],
  },
  {
    title: "Personopplysninger",
    blocks: ["Vi behandler bare opplysningene som trengs for å gjennomføre kjøpet. Se [personvernerklæringen](/personvern)."],
  },
];

/** Ren tekst til PDF og e-post: lenker blir «tekst (adresse)», uthevelse fjernes. */
export function plainText(text: string, site = "https://www.hobbystrada.no") {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, href) => `${t} (${href.startsWith("/") ? site + href : href})`).replace(/\*\*(.+?)\*\*/g, "$1");
}

/** Angreskjemaet (angrerettloven § 8, standardskjemaet i forskriften), samme innhold som /angreskjema. */
export function angreskjemaBlocks(): (string | string[])[] {
  return [
    `Til ${COMPANY.name}, org.nr. ${COMPANY.orgnr}, ${COMPANY.street}, ${COMPANY.postal}, e-post ${COMPANY.email}, telefon ${COMPANY.phone}.`,
    "Jeg melder med dette at jeg ønsker å gå fra min avtale om kjøp av følgende tjeneste:",
    [
      "Tjeneste: Annonseløft (pakke og annonse): ______________________________",
      "Kvitteringsnummer: Salgsdokument nr. __________ (står på kvitteringen under Min side)",
      "Bestilt den: __________",
      "Navn: ______________________________",
      "Adresse: ______________________________",
      "E-post (valgfritt): ______________________________",
      "Dato: __________",
      "Underskrift: ______________________________ (bare hvis skjemaet sendes på papir)",
    ],
    `Fyll ut og send til ${COMPANY.email}, eller skriv ut og send i posten. Du kan også trykke «Angre avtalen» på kvitteringen under Min side, eller sende en vanlig e-post. Enhver tydelig melding om at du angrer, er nok.`,
    "Angrefristen er 14 dager fra avtalen ble inngått. Har du bedt om at løftet starter med en gang, betaler du for den delen av perioden som er brukt når vi mottar meldingen, og får resten tilbake til samme betalingsmåte innen 14 dager. Er perioden over, er løftet levert fullt ut, og angreretten har gått tapt.",
  ];
}
