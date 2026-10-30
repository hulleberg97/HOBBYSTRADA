import { BOOSTS } from "./boosts";
import { COMPANY } from "./company";

/**
 * Salgsvilkårene for annonseløft som data, så nettsiden og PDF-vedlegget i kvitteringen alltid har samme tekst.
 * Lenker skrives [tekst](/sti), uthevet tekst **slik**. Et avsnitt er en streng, en punktliste er en liste av strenger.
 */
export const SALGSVILKAR_UPDATED = "30. oktober 2026";

export type SalesSection = { title: string; blocks: (string | string[])[]; id?: string };

/** Teksten er Låvlis reviderte utkast av 30. oktober 2026. Refusjonssiden er slått sammen med avsnittet «Angrerett». */
export const SALGSVILKAR: SalesSection[] = [
  {
    title: "1. Hvem du kjøper av",
    blocks: [
      `Selger er ${COMPANY.name}, enkeltpersonforetak, org.nr. ${COMPANY.orgnr}, ${COMPANY.street}, ${COMPANY.postal}. Du når oss på e-post ${COMPANY.email} eller telefon ${COMPANY.phone}. Foretaket er ikke registrert i Merverdiavgiftsregisteret.`,
      "Disse vilkårene gjelder kjøp av annonseløft. Kort i markedet kjøper du direkte fra andre brukere. Den handelen er HOBBYSTRADA ikke part i. Se [vilkårene](/vilkar).",
    ],
  },
  {
    title: "2. Hva du kjøper",
    blocks: [
      "Annonseløft er en digital tjeneste som gir annonsen bedre synlighet i en bestemt periode. Perioden starter når løftet aktiveres. Det er et engangskjøp, og det fornyes ikke automatisk. Annonser med løft er merket «Annonseløft».",
      "Du kan velge mellom disse pakkene:",
      [
        `**${BOOSTS.top.name}, ${BOOSTS.top.days} dager, ${BOOSTS.top.price} kr:** Annonsen vises foran vanlige annonser i markedet og i søkeresultatene.`,
        `**${BOOSTS.featured.name}, ${BOOSTS.featured.days} dager, ${BOOSTS.featured.price} kr:** Annonsen får gullmerke og gullramme. Den vises foran annonser med Topp av listen og vanlige annonser, og vises på forsiden i perioden etter toppannonsene.`,
        `**${BOOSTS.frontpage.name}, ${BOOSTS.frontpage.days} dager, ${BOOSTS.frontpage.price} kr:** Annonsen får gullmerke og gullramme. Den vises først i markedet og i søkeresultatene, og først på forsiden i perioden.`,
      ],
      "Sorterer du selv etter pris eller navn, sorteres alle annonser likt, uten hensyn til løft.",
      "Prisene er totalpriser i norske kroner. Foretaket er ikke merverdiavgiftsregistrert, så det kommer ingen merverdiavgift eller andre gebyrer i tillegg.",
      "Du må være minst 18 år for å kjøpe annonseløft.",
      "Vi er etter loven forpliktet til å levere et annonseløft som er i samsvar med avtalen.",
    ],
  },
  {
    title: "3. Slik bestiller du",
    blocks: [
      "Velg annonse og pakke på siden [Annonseløft](/annonseloft). Før du betaler, ser du pakke, pris og varighet. Du kan gå tilbake og endre valget.",
      "Du må gjøre dette før du betaler:",
      ["Krysse av for at du godtar salgsvilkårene.", "Be om oppstart med en gang.", "Krysse av for at du forstår når angreretten går tapt."],
      "Du bestiller ved å trykke på knappen «Bestill og betal med Vipps», der beløpet for valgt pakke vises. Deretter godkjenner du betalingen i Vipps.",
      "Avtalen inngås på norsk. Bestillingen og kvitteringen lagres hos oss og er tilgjengelig under Min side.",
    ],
  },
  {
    title: "4. Betaling",
    blocks: ["Du betaler med Vipps. Beløpet trekkes når betalingen er godkjent i Vipps. Vipps’ vilkår gjelder selve betalingen."],
  },
  {
    title: "5. Levering",
    blocks: [
      "Løftet aktiveres på annonsen med en gang betalingen er gjennomført. Det varer i perioden du har valgt. Du får bekreftelse på e-post og kvittering under Min side.",
      "Sletter du annonsen eller merker den som solgt før perioden er over, stopper løftet. Resten av perioden refunderes ikke, med mindre du bruker angreretten innen 14 dager.",
    ],
  },
  {
    title: "6. Angrerett",
    id: "angrerett",
    blocks: [
      "Du har 14 dagers angrerett fra avtalen inngås.",
      "Når du bestiller, ber du uttrykkelig om at løftet starter med en gang betalingen er gjennomført. Du bekrefter også at angreretten går tapt når løftet er levert fullt ut, altså når perioden er over.",
      "Angreretten går altså tapt når perioden er over eller når angrefristen på 14 dager er ute, det som kommer først.",
      "Angrer du før perioden er over og innen angrefristen, betaler du for den delen av perioden som er brukt, regnet i hele timer. Resten får du tilbake.",
      `Slik ber du om refusjon: Trykk «Angre avtalen» på kvitteringen under Min side. Du kan også sende [angreskjemaet](/angreskjema) eller en e-post til ${COMPANY.email}. Det er nok med en tydelig melding om at du angrer. Når vi mottar meldingen elektronisk, får du bekreftelse på e-post med en gang. Pengene betales tilbake til samme betalingsmåte, uten gebyr, senest 14 dager etter at vi fikk meldingen.`,
    ],
  },
  {
    title: "7. Hvis løftet ikke blir levert eller ikke virker",
    blocks: [
      `Gi beskjed til ${COMPANY.email}.`,
      "Ble løftet ikke aktivert, eller gikk noe galt med betalingen, får du hele beløpet tilbake.",
      "Har løftet en feil, kan vi rette den eller forlenge løftet. Lykkes ikke det, kan du kreve forholdsmessig prisavslag eller heve avtalen og få pengene tilbake.",
      "Du har uansett rettighetene dine etter digitalytelsesloven.",
      "Fjernes en annonse med aktivt løft fordi den bryter vilkårene, gjelder reglene om refusjon i [vilkårene](/vilkar#fjerning-av-annonser-og-utestengelse).",
    ],
  },
  {
    title: "8. Klager",
    blocks: [
      `Er du ikke fornøyd, kan du kontakte oss via [kontaktskjemaet](/kontakt) med emnet «Annonseløft og betaling». Du kan også skrive til ${COMPANY.email}.`,
      "Kommer vi ikke til enighet, kan du som forbruker klage til Forbrukertilsynet (forbrukertilsynet.no). Forbrukertilsynet kan mekle i saken. Fører ikke meklingen fram, kan saken bringes inn for Forbrukerklageutvalget.",
      "Tvister kan også bringes inn for de alminnelige domstolene. Norsk rett gjelder.",
    ],
  },
  {
    title: "9. Personopplysninger",
    blocks: ["Se [personvernerklæringen](/personvern)."],
  },
];

/** Ren tekst til PDF og e-post: lenker blir «tekst (adresse)», uthevelse fjernes. */
export function plainText(text: string, site = "https://www.hobbystrada.no") {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, href) => `${t} (${href.startsWith("/") ? site + href : href})`).replace(/\*\*(.+?)\*\*/g, "$1");
}

/** Angreskjemaet (angrerettloven § 8, standardskjemaet i forskriften), samme innhold som /angreskjema. */
export function angreskjemaBlocks(): (string | string[])[] {
  return [
    "Fyll ut og send dette skjemaet hvis du vil gå fra avtalen om annonseløft. Du kan også trykke «Angre avtalen» på kvitteringen under Min side, eller sende en e-post. En tydelig melding om at du angrer, er nok.",
    `Til: ${COMPANY.name}, org.nr. ${COMPANY.orgnr}, ${COMPANY.street}, ${COMPANY.postal}, e-post ${COMPANY.email}`,
    "Jeg underretter herved om at jeg ønsker å gå fra min avtale om kjøp av følgende tjeneste:",
    [
      "Tjeneste: Annonseløft (pakke og annonse): ______________________________",
      "Bestilt den: __________",
      "Forbrukerens navn: ______________________________",
      "Forbrukerens adresse: ______________________________",
      "Kvitteringsnummer (valgfritt, står på kvitteringen under Min side): __________",
      "Forbrukerens underskrift (kun hvis skjemaet sendes på papir): ______________________________",
      "Dato: __________",
    ],
    "Hva som skjer når du angrer, står i salgsvilkårene under «Angrerett» (https://www.hobbystrada.no/salgsvilkar#angrerett).",
  ];
}
